import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const name = 'dsh-swanlab';
export const inject = ['webServer', 'connection'];
export const defaults = Object.freeze({ pythonPath: process.env.DSH_SWANLAB_PYTHON || 'python3', envFile: process.env.DSH_SWANLAB_ENV_FILE || join(homedir(), '.config/dsh-swanlab/swanlab.env'), apiHost: process.env.DSH_SWANLAB_API_HOST || 'http://127.0.0.1:8000', timeoutMs: 20000, cacheTtlMs: 15000 });
const prefix = '/swanlab-panel/api/';
const actions = new Set(['projects', 'runs', 'run', 'columns', 'series', 'logs', 'media', 'asset']);
export const assetCsp = "sandbox allow-scripts allow-downloads; default-src 'none'; script-src 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com; style-src 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; img-src data: blob:; font-src data:; connect-src 'none'; media-src data: blob:; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'";
const fail = (code, message, status) => ({ ok: false, error: { code, message }, status });

export function createQuery(config = {}) {
  const options = { ...defaults, ...config };
  const cache = new Map(), pending = new Map(), children = new Set();
  let closed = false;
  const timeout = Math.min(60000, Math.max(1000, Number(options.timeoutMs) || defaults.timeoutMs));
  const ttl = Math.min(60000, Math.max(0, Number(options.cacheTtlMs) || 0));
  function query(args) {
    if (closed) return Promise.resolve(fail('UNAVAILABLE', 'Plugin stopped', 503));
    if (!args || !actions.has(args.action) || Object.keys(args).some(k => !['action', 'project', 'run', 'key', 'limit', 'page', 'offset', 'step', 'cursor', 'metricType', 'item'].includes(k))) return Promise.resolve(fail('INVALID_ARGUMENT', 'Unknown action or parameter', 400));
    const id = JSON.stringify(Object.fromEntries(Object.entries(args).sort(([a], [b]) => a.localeCompare(b))));
    const hit = cache.get(id);
    if (hit && hit.expires > Date.now()) return Promise.resolve({ ...hit.value, meta: { ...hit.value.meta, cached: true } });
    cache.delete(id);
    if (pending.has(id)) return pending.get(id);
    if (pending.size >= 4) return Promise.resolve(fail('BUSY', 'SwanLab query capacity reached', 429));
    const promise = new Promise(resolve => {
      let result = '', size = 0, settled = false, timer;
      const child = spawn(options.pythonPath, ['-B', fileURLToPath(new URL('./query.py', import.meta.url))], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', DSH_SWANLAB_ENV_FILE: options.envFile, DSH_SWANLAB_API_HOST: options.apiHost },
      });
      children.add(child);
      const finish = value => {
        if (settled) return;
        settled = true; clearTimeout(timer); children.delete(child);
        if (value.ok) {
          value.meta = { ...value.meta, cached: false, fetchedAt: new Date().toISOString(), cacheTtlMs: args.action === 'asset' ? 0 : ttl };
          if (cache.size >= 128) cache.delete(cache.keys().next().value);
          if (args.action !== 'asset') cache.set(id, { value, expires: Date.now() + ttl });
        }
        resolve(value);
      };
      child.on('error', () => finish(fail('BRIDGE_ERROR', 'SwanLab bridge unavailable', 503)));
      child.stdin.on('error', () => {});
      child.stderr.on('data', () => {}); // Never surface SDK diagnostic text or credentials.
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', chunk => {
        size += Buffer.byteLength(chunk, 'utf8');
        if (size > 4 * 1024 * 1024) { child.kill('SIGKILL'); finish(fail('RESPONSE_TOO_LARGE', 'Query response exceeds limit', 502)); }
        else result += chunk.toString('utf8');
      });
      child.on('close', code => {
        if (code !== 0) return finish(fail('BRIDGE_ERROR', 'SwanLab bridge failed', 502));
        try {
          const value = JSON.parse(result);
          if (typeof value.ok !== 'boolean') throw new Error();
          finish(value);
        } catch { finish(fail('BRIDGE_ERROR', 'Invalid bridge response', 502)); }
      });
      timer = setTimeout(() => { child.kill('SIGKILL'); finish(fail('TIMEOUT', 'SwanLab query timed out', 504)); }, timeout);
      child.stdin.end(JSON.stringify(args));
    }).finally(() => pending.delete(id));
    pending.set(id, promise);
    return promise;
  }
  query.close = () => { closed = true; for (const child of children) child.kill('SIGKILL'); cache.clear(); };
  return query;
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(body));
}

export async function apply(ctx, config = {}) {
  const query = createQuery(config);
  ctx.effect(() => () => query.close());
  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: prefix.slice(0, -1), async handler(req, res) {
    try {
      const admission = ctx.connection.admit(req);
      if ('rejection' in admission) return json(res, admission.rejection, fail('UNAUTHENTICATED', 'DSH authentication required', admission.rejection));
      if (admission.peer.principal.kind !== 'owner') return json(res, 403, fail('FORBIDDEN', 'Owner access required', 403));
      if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return json(res, 405, fail('METHOD_NOT_ALLOWED', 'Only GET is supported', 405)); }
      const url = new URL(req.url, 'http://localhost');
      const action = url.pathname.slice(prefix.length);
      if (!actions.has(action)) return json(res, 404, fail('NOT_FOUND', 'Unknown endpoint', 404));
      const args = { action };
      for (const [key, value] of url.searchParams) {
        if (key === 'action' || key in args) return json(res, 400, fail('INVALID_ARGUMENT', 'Duplicate or reserved parameter', 400));
        args[key] = value;
      }
      const value = await query(args);
      if (action === 'asset' && value.ok) {
        const data = value.data;
        const allowed = new Set(['text/html; charset=utf-8', 'text/plain; charset=utf-8', 'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/wav', 'video/mp4']);
        if (!allowed.has(data?.contentType) || typeof data.bodyBase64 !== 'string' || data.bodyBase64.length > 2800000) return json(res, 502, fail('BRIDGE_ERROR', 'Invalid media response', 502));
        const body = Buffer.from(data.bodyBase64, 'base64');
        if (body.length > 2 * 1024 * 1024 || body.length !== data.bytes) return json(res, 502, fail('BRIDGE_ERROR', 'Invalid media response', 502));
        res.writeHead(200, { 'Content-Type': data.contentType, 'Content-Length': body.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': assetCsp, 'Referrer-Policy': 'no-referrer', 'Cross-Origin-Resource-Policy': 'same-origin', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()' });
        return res.end(body);
      }
      return json(res, value.ok ? 200 : (value.status || 502), value);
    } catch { return json(res, 500, fail('INTERNAL_ERROR', 'SwanLab request failed', 500)); }
  } }));
}

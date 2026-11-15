import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createRequire } from 'node:module'
import { createServer, request, type IncomingMessage } from 'node:http'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { makeRoutes } from '../src/routes.ts'
import { ownerRejection } from '../src/access.ts'
import type { SshEngine } from '../src/engine.ts'
import type { HostStore } from '../src/store.ts'

// Exercise the running installed official API, with an isolated in-memory credential provider.
const requireHost = createRequire(join(process.env.DSH_INSTALL_DIR ?? '/usr/lib/node_modules/@deepseek-ai/dsh', 'package.json'))
const official = await import(/* @vite-ignore */ pathToFileURL(requireHost.resolve('@deepseek-ai/dsh-client-connection')).href)
const { Context } = await import(/* @vite-ignore */ pathToFileURL(requireHost.resolve('@deepseek-ai/cordis')).href)

function httpCall(url: string, options: { method?: string; headers: Record<string, string> }) {
  return new Promise<{ status: number; json: () => unknown }>((resolve, reject) => {
    const req = request(url, options, res => {
      const chunks: Buffer[] = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve({ status: res.statusCode!, json: () => JSON.parse(Buffer.concat(chunks).toString()) }))
    })
    req.on('error', reject)
    req.end()
  })
}

describe('official owner admission on every SSH surface', () => {
  let ctx: any
  let cookie: string
  let base: string
  let server: ReturnType<typeof createServer>
  let family: ReturnType<typeof makeRoutes>
  const staging = mkdtempSync(join(tmpdir(), 'ssh-backend-auth-'))
  const list = vi.fn(() => [])
  beforeAll(async () => {
    ctx = new Context()
    ctx.provide('credentials', { modifyRecord: async (_key: unknown, update: any) => update(undefined) })
    await official.apply(ctx, { trustedHosts: ['harness.example'] })
    ctx.connection.authorizeIndex({ method: 'GET', headers: { host: 'harness.example' }, url: ctx.connection.authenticatedUrl('http://harness.example/') }, {
      writeHead: (_status: number, headers: Record<string, string>) => { cookie = headers['set-cookie'].split(';')[0] }, end: () => {},
    })
    const pool = new Map()
    for (const [alias, bytes, size] of [['bad-magic', Buffer.from('<svg/>'), 6], ['too-large', Buffer.alloc(0), 2 * 1024 * 1024 + 1]] as const) {
      pool.set(alias, { broken: false, inFlight: 0, idleAt: 0, client: { sftp: (cb: any) => cb(undefined, {
        open: (_path: unknown, _mode: unknown, done: any) => done(undefined, Buffer.from('handle')),
        fstat: (_handle: unknown, done: any) => done(undefined, { size, isFile: () => true }),
        read: (_handle: unknown, buffer: Buffer, offset: number, length: number, position: number, done: any) => {
          const count = Math.min(length, bytes.length - position)
          bytes.copy(buffer, offset, position, position + count)
          done(undefined, count)
        },
        close: (_handle: unknown, done: any) => done(), end: () => {},
      }) } })
    }
    family = makeRoutes({ store: {} as HostStore, engine: { list, pool } as unknown as SshEngine, stagingDir: staging, getConnection: () => ctx.connection })
    server = createServer((req, res) => {
      const route = family.routes.find(route => route.path === new URL(req.url!, 'http://local').pathname)
      if (!route) { res.writeHead(404).end(); return }
      void route.handler(req, res)
    })
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
    base = `http://127.0.0.1:${(server.address() as { port: number }).port}`
  })
  afterAll(async () => {
    family.terminalSessions.dispose()
    await new Promise<void>(resolve => server.close(() => resolve()))
    await ctx.fiber.dispose()
    rmSync(staging, { recursive: true, force: true })
  })
  it('accepts an existing cookie and no Origin on a trusted remote authority', async () => {
    const res = await httpCall(base + '/api/dsh-ssh/hosts', { headers: { host: 'harness.example', cookie } })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ hosts: [] })
  })
  it('accepts same-origin Node fetch with the existing signed cookie', async () => {
    let localCookie = ''
    ctx.connection.authorizeIndex({ method: 'GET', headers: { host: new URL(base).host }, url: ctx.connection.authenticatedUrl(base + '/') }, {
      writeHead: (_status: number, headers: Record<string, string>) => { localCookie = headers['set-cookie'].split(';')[0] }, end: () => {},
    })
    const res = await fetch(base + '/api/dsh-ssh/hosts', { headers: { cookie: localCookie } })
    expect(res.status).toBe(200)
  })
  it('rejects missing and tampered cookies for all HTTP routes including hosts and preview', async () => {
    for (const route of family.routes) {
      for (const credentials of ['', cookie + 'tampered']) {
        const res = await httpCall(base + route.path, { method: 'POST', headers: { host: 'harness.example', cookie: credentials } })
        expect(res.status, route.path).toBe(401)
      }
    }
  })
  it('rejects forged Host, cross-site Origin and cross-site fetch metadata despite valid cookie', async () => {
    for (const headers of [{ host: 'evil.example' }, { origin: 'http://evil.example' }, { 'sec-fetch-site': 'cross-site' }]) {
      const res = await httpCall(base + '/api/dsh-ssh/hosts', { headers: { host: 'harness.example', cookie, ...headers } })
      expect(res.status).toBe(403)
    }
  })
  it('returns explicit HTTP errors for oversize, unsupported types, bad magic and relative paths', async () => {
    for (const [alias, path, status, message] of [
      ['too-large', '/a.txt', 413, '2 MiB'],
      ['unused', '/a.svg', 415, 'unsupported'],
      ['unused', '/a.html', 415, 'unsupported'],
      ['bad-magic', '/a.png', 415, 'magic'],
      ['unused', 'a.txt', 400, 'absolute'],
    ] as const) {
      const res = await httpCall(base + '/api/dsh-ssh/preview?' + new URLSearchParams({ alias, path }), { headers: { host: 'harness.example', cookie } })
      expect(res.status).toBe(status)
      expect((res.json() as { error: string }).error).toContain(message)
    }
  })
  it('fails closed without service and rejects non-owner peers', () => {
    const req = { headers: {} } as IncomingMessage
    expect(ownerRejection(() => undefined, req)).toBe(503)
    expect(ownerRejection(() => { throw new Error('service gone') }, req)).toBe(503)
    expect(ownerRejection(() => ({ admit: () => ({ peer: { principal: { kind: 'guest' } } }) }), req)).toBe(403)
  })
  it('guards every HTTP handler even when the service is missing', async () => {
    const closed = makeRoutes({ store: {} as HostStore, engine: {} as SshEngine, stagingDir: staging })
    for (const route of closed.routes) {
      const res = { writeHead: vi.fn(), end: vi.fn() }
      await route.handler({ method: 'GET', headers: {} } as IncomingMessage, res as any)
      expect(res.writeHead.mock.calls[0][0], route.path).toBe(503)
    }
    closed.terminalSessions.dispose()
  })
  it('refuses unauthenticated and cross-site WS upgrades before creating a terminal', async () => {
    for (const headers of [{ host: 'harness.example' }, { host: 'harness.example', cookie, origin: 'http://evil.example' }]) {
      const socket = { write: vi.fn(), destroy: vi.fn() }
      await family.upgrade.handler({ headers, url: '/api/dsh-ssh/terminal?alias=test' } as IncomingMessage, socket as any, Buffer.alloc(0))
      expect(socket.write.mock.calls[0][0]).toMatch(/^HTTP\/1.1 (401|403)/)
      expect(socket.destroy).toHaveBeenCalledOnce()
    }
  })
})

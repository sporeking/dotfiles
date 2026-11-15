"""Bounded read-only SwanLab SDK bridge. One stdin JSON request, one stdout JSON reply."""
import contextlib
import io
import json
import math
import os
import re
import sys
import base64
from urllib.parse import urlsplit, urljoin
from urllib.request import Request, build_opener, HTTPRedirectHandler

MAX_ASSET_BYTES = 2 * 1024 * 1024
MEDIA_TYPES = {'.html': ('html', 'text/html; charset=utf-8'), '.htm': ('html', 'text/html; charset=utf-8'), '.png': ('image', 'image/png'), '.jpg': ('image', 'image/jpeg'), '.jpeg': ('image', 'image/jpeg'), '.gif': ('image', 'image/gif'), '.webp': ('image', 'image/webp'), '.txt': ('text', 'text/plain; charset=utf-8'), '.json': ('text', 'text/plain; charset=utf-8'), '.mp3': ('audio', 'audio/mpeg'), '.wav': ('audio', 'audio/wav'), '.mp4': ('video', 'video/mp4')}


def media_metadata(item, index):
    url = item.get('url', '')
    suffix = os.path.splitext(urlsplit(url).path)[1].lower() if isinstance(url, str) else ''
    kind, content_type = MEDIA_TYPES.get(suffix, ('unsupported', 'application/octet-stream'))
    result = {'item': index, 'type': kind, 'contentType': content_type, 'available': bool(url) and kind != 'unsupported'}
    if isinstance(item.get('caption'), str):
        result['caption'] = item['caption']
    return result


def trusted_asset_url(url, host):
    try:
        target, origin = urlsplit(url), urlsplit(host)
        if (target.scheme not in {'http', 'https'} or target.username or target.password or target.fragment
                or (target.scheme, target.hostname, target.port or (443 if target.scheme == 'https' else 80))
                != (origin.scheme, origin.hostname, origin.port or (443 if origin.scheme == 'https' else 80))):
            raise ValueError()
    except (ValueError, TypeError):
        raise QueryError('UPSTREAM_ERROR', 'Media origin unavailable', 502)
    return url


def fetch_asset(item, host):
    metadata = media_metadata(item, 0)
    if not metadata['available']:
        raise QueryError('UNSUPPORTED_MEDIA', 'Media type unavailable', 415)
    url = trusted_asset_url(item['url'], host)
    class Redirects(HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            trusted_asset_url(urljoin(req.full_url, newurl), host)
            return super().redirect_request(req, fp, code, msg, headers, newurl)
    # No browser cookies, SDK credentials, proxy environment or arbitrary URL input.
    from urllib.request import ProxyHandler
    opener = build_opener(ProxyHandler({}), Redirects())
    with opener.open(Request(url, headers={'Accept-Encoding': 'identity'}), timeout=12) as response:
        trusted_asset_url(response.url, host)
        if response.headers.get('Content-Encoding', 'identity') != 'identity':
            raise QueryError('UPSTREAM_ERROR', 'Media encoding unavailable', 502)
        body = response.read(MAX_ASSET_BYTES + 1)
    if len(body) > MAX_ASSET_BYTES:
        raise QueryError('RESPONSE_TOO_LARGE', 'Media exceeds size limit', 502)
    return {'contentType': metadata['contentType'], 'type': metadata['type'], 'bodyBase64': base64.b64encode(body).decode('ascii'), 'bytes': len(body)}


DEFAULT_ENV = os.path.expanduser('~/.config/dsh-swanlab/swanlab.env')
DEFAULT_HOST = 'http://127.0.0.1:8000'
ACTIONS = {'projects', 'runs', 'run', 'columns', 'series', 'logs', 'media', 'asset'}

class QueryError(Exception):
    def __init__(self, code, message, status=400):
        self.code, self.message, self.status = code, message, status


def integer(value, default, maximum, minimum=1):
    if value is None:
        return default
    if isinstance(value, bool) or not re.fullmatch(r'\d+', str(value)):
        raise QueryError('INVALID_ARGUMENT', 'Invalid numeric parameter')
    result = int(value)
    if not minimum <= result <= maximum:
        raise QueryError('INVALID_ARGUMENT', 'Numeric parameter out of range')
    return result


def segment(value):
    if not isinstance(value, str) or not re.fullmatch(r'[A-Za-z0-9_.+\-]{1,128}', value) or value in {'.', '..'}:
        raise QueryError('INVALID_ARGUMENT', 'Invalid project or run identifier')
    return value


def validate(request):
    if not isinstance(request, dict) or request.get('action') not in ACTIONS:
        raise QueryError('INVALID_ARGUMENT', 'Unknown read action')
    if request['action'] == 'asset' and (set(request) - {'action', 'project', 'run', 'key', 'step', 'item'} or request.get('step') is None):
        raise QueryError('INVALID_ARGUMENT', 'Asset requires an explicit step and media identifiers')
    if 'item' in request and request['action'] != 'asset':
        raise QueryError('INVALID_ARGUMENT', 'Unknown parameter')
    if set(request) - {'action', 'project', 'run', 'key', 'page', 'limit', 'offset', 'step', 'cursor', 'metricType', 'item'}:
        raise QueryError('INVALID_ARGUMENT', 'Unknown parameter')
    r = dict(request)
    r['limit'] = integer(r.get('limit'), 50 if r['action'] != 'series' else 1000, 1500 if r['action'] == 'series' else 100)
    if r['action'] in {'projects', 'runs', 'columns'} and r['limit'] not in (10, 12, 15, 20, 24, 27, 50, 100):
        raise QueryError('INVALID_ARGUMENT', 'List limit must be 10,12,15,20,24,27,50,100')
    r['page'] = integer(r.get('page'), 1, 100000)
    r['offset'] = integer(r.get('offset'), 0, 100000, 0)
    if r['action'] != 'projects':
        p = r.get('project', '')
        if not isinstance(p, str) or len(p.split('/')) != 2:
            raise QueryError('INVALID_ARGUMENT', 'Project must be workspace/project')
        r['project'] = '/'.join(segment(s) for s in p.split('/'))
    if r['action'] not in {'projects', 'runs'}:
        r['run'] = segment(r.get('run'))
    if r['action'] == 'asset':
        r['item'] = integer(r.get('item'), 0, 1999, 0)
    if r['action'] in {'series', 'media', 'asset'}:
        key = r.get('key')
        if not isinstance(key, str) or not key or len(key) > 512 or any(ord(c) < 32 for c in key):
            raise QueryError('INVALID_ARGUMENT', 'Metric key required')
    if r.get('step') is not None:
        r['step'] = integer(r['step'], 0, 2**53 - 1, 0)
    return r


def credentials(env_file, host):
    # Parse data, never source a shell file or export arbitrary variables.
    values = {}
    with open(env_file, encoding='utf-8') as source:
        for line in source:
            line = line.strip()
            if line.startswith('export '):
                line = line[7:]
            if '=' in line and not line.startswith('#'):
                k, v = line.split('=', 1)
                values[k.strip()] = v.strip().strip('\"\'')
    key = values.get('SWANLAB_API_KEY')
    if not key:
        raise QueryError('CONFIGURATION_ERROR', 'SwanLab credentials unavailable', 503)
    parsed = urlsplit(host)
    if parsed.scheme not in {'http', 'https'} or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise QueryError('CONFIGURATION_ERROR', 'Invalid configured API host', 503)
    return key, host


def clean(value, secret='', depth=0):
    if depth > 15:
        return '[truncated]'
    if isinstance(value, dict):
        return {str(k): '[redacted]' if re.search(r'api.?key|token|password|secret|authorization|credential', str(k), re.I) else clean(v, secret, depth+1) for k, v in value.items()}
    if isinstance(value, list):
        return [clean(v, secret, depth+1) for v in value[:2000]]
    if isinstance(value, str):
        value = value.replace(secret, '[redacted]') if secret else value
        value = re.sub(r'(?i)(bearer\s+)[\w.\-]+', r'\1[redacted]', value)
        value = re.sub(r'(?i)((?:api[_-]?key|token|password|secret)\s*[=:]\s*)[^\s,;]+', r'\1[redacted]', value)
        return value[:24000]
    if isinstance(value, float) and not math.isfinite(value):
        return None
    return value


def checked(entity):
    if getattr(entity, '_errors', None):
        raise QueryError('UPSTREAM_ERROR', 'SwanLab read failed', 502)


def page_result(collection, serialize, r):
    items = [serialize(x) for x in collection]
    checked(collection)
    info = collection._page_info  # SDK 0.10.4 pagination metadata, no second fetch.
    more = r['page'] < info.get('pages', 0)
    return {'items': items}, {'page': r['page'], 'limit': r['limit'], 'total': info.get('total'), 'hasMore': more, 'nextPage': r['page']+1 if more else None, 'truncated': more}


def run_summary(run):
    value = {k: getattr(run, k) for k in ('run_id', 'name', 'description', 'state', 'created_at', 'finished_at', 'labels', 'group', 'job_type', 'url')}
    checked(run)
    if not value['run_id']:
        raise QueryError('NOT_FOUND', 'Run unavailable', 404)
    value['id'] = value['run_id']
    return value


def query(api, request):
    r = validate(request)
    action = r['action']
    if action == 'projects':
        return page_result(api.projects(api.username, page=r['page'], size=r['limit'], all=False), lambda x: x.json(), r)
    if action == 'runs':
        return page_result(api.runs_get(r['project'], page=r['page'], size=r['limit'], all=False), run_summary, r)
    run = api.run(r['project'] + '/' + r['run'])
    summary = run_summary(run)
    if action == 'run':
        summary['config'] = run.profile.get('config', {})
        checked(run)
        return summary, {'fullHistory': False}
    if action == 'columns':
        metric_type = r.get('metricType', 'SCALAR')
        cursor = r.get('cursor', '')
        if metric_type not in {'SCALAR', 'MEDIA'} or not isinstance(cursor, str) or len(cursor) > 2048:
            raise QueryError('INVALID_ARGUMENT', 'Invalid key cursor or metric type')
        series = run.series(metric_type=metric_type)
        # Public Series.json() drains all cursors. Use its SDK transport for exactly one read page.
        response = series._post('/house/metrics/' + metric_type.lower() + '/keys', data={'experiments': series._experiments, 'limit': r['limit'], 'cursor': cursor})
        if not response.ok:
            raise QueryError('UPSTREAM_ERROR', 'SwanLab key listing failed', 502)
        raw = response.data or {}
        keys = raw.get('keys', [])
        more = bool(raw.get('hasMore'))
        return {'items': [{'key': k, 'name': k, 'type': 'FLOAT' if metric_type == 'SCALAR' else 'MEDIA', 'metricType': metric_type} for k in keys[:r['limit']]]}, {'limit': r['limit'], 'hasMore': more, 'nextCursor': raw.get('nextCursor') if more else None, 'total': None, 'truncated': more, 'metricType': metric_type}
    if action == 'logs':
        raw = run.logs(offset=r['offset'])
        checked(run)
        entries = raw.get('logs', [])
        return {'items': entries[:r['limit']]}, {'offset': r['offset'], 'nextOffset': r['offset']+1 if entries else None, 'limit': r['limit'], 'chunkCount': raw.get('count'), 'truncated': len(entries) > r['limit'], 'fullHistory': False, 'note': 'Offset is SDK chunk epoch; limit truncates this chunk, not a line cursor.'}
    # Construct exact Key directly: Series iteration scans every key; column() uses fuzzy matching.
    from swanlab.api.series import Key
    key = Key(run._ctx, project_id=run.project_id, run_id=run.run_id, key=r['key'], metric_type='MEDIA' if action in {'media', 'asset'} else 'SCALAR', root_pro_id=run.root_pro_id, root_exp_id=run.root_exp_id, created_at=run.created_at_ts)
    raw = key.metric(sample=r['limit'], all=False, media_step=r.get('step'))
    # Metric creates child entities; strict request checking is installed by main().
    if action in {'media', 'asset'}:
        items = [item for group in raw.get('metrics', []) for item in group.get('items', [])]
        if action == 'asset':
            if raw.get('step') != r['step'] or r['item'] >= len(items):
                raise QueryError('NOT_FOUND', 'Media item unavailable', 404)
            return fetch_asset(items[r['item']], api._ctx.api_host), {'fullHistory': False}
        return {'key': r['key'], 'step': raw.get('step'), 'steps': raw.get('steps', [])[:2000], 'items': [media_metadata(item, index) for index, item in enumerate(items[:r['limit']])]}, {'limit': r['limit'], 'truncated': len(items) > r['limit'] or len(raw.get('steps', [])) > 2000, 'fullHistory': False}
    points = [{'step': p.get('index', p.get('step')), 'value': p.get('data', p.get('value')), 'timestamp': p.get('timestamp')} for p in raw.get('metrics', [])]
    return {'key': r['key'], 'points': points[:r['limit']]}, {'limit': r['limit'], 'returned': min(len(points), r['limit']), 'sampled': True, 'truncated': True, 'fullHistory': False, 'note': 'Server-side sampled history; original point count unknown.'}


def main():
    secret = ''
    try:
        request = json.loads(sys.stdin.read(65537))
        validate(request)
        # Only process-level configuration controls local file/host, never request JSON.
        secret, host = credentials(os.environ.get('DSH_SWANLAB_ENV_FILE', DEFAULT_ENV), os.environ.get('DSH_SWANLAB_API_HOST', DEFAULT_HOST))
        # Suppress SDK console/tracebacks including authentication diagnostics.
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            import swanlab
            from swanlab.api.base import BaseEntity
            original = BaseEntity._safe_request
            def strict(self, *args, **kwargs):
                response = original(self, *args, **kwargs)
                if not response.ok:
                    raise QueryError('UPSTREAM_ERROR', 'SwanLab read failed', 502)
                return response
            BaseEntity._safe_request = strict
            api = swanlab.Api(api_key=secret, host=host)
            data, meta = query(api, request)
        # Asset bytes are base64, bounded before encoding, and must bypass display truncation.
        reply = {'ok': True, 'data': data if request['action'] == 'asset' else clean(data, secret), 'meta': meta}
    except QueryError as error:
        reply = {'ok': False, 'error': {'code': error.code, 'message': error.message}, 'status': error.status}
    except Exception:
        reply = {'ok': False, 'error': {'code': 'UPSTREAM_ERROR', 'message': 'SwanLab query unavailable'}, 'status': 502}
    print(json.dumps(reply, ensure_ascii=False, allow_nan=False))

if __name__ == '__main__':
    main()

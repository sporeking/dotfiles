# SwanLab panel backend API v1

All endpoints are **GET** under `/swanlab-panel/api/`. Use the existing DSH origin and its authenticated fetch mechanism. `connection.admit(req)` must admit an **owner** principal; unauthenticated requests receive 401/DSH rejection, other principals 403. GET is the only HTTP method; writes return 405. No CORS bypass or public endpoint is installed.

Success envelope:

```json
{"ok":true,"data":{},"meta":{"cached":false,"fetchedAt":"2026-11-12T12:00:00.000Z","cacheTtlMs":15000}}
```

Error envelope (HTTP status is also set):

```json
{"ok":false,"error":{"code":"INVALID_ARGUMENT","message":"Invalid numeric parameter"},"status":400}
```

Use error.code/message; never depend on upstream diagnostic text. Codes include INVALID_ARGUMENT (400), UNAUTHENTICATED (DSH rejection), FORBIDDEN (403), NOT_FOUND (404), METHOD_NOT_ALLOWED (405), BUSY (429), UPSTREAM_ERROR/BRIDGE_ERROR/RESPONSE_TOO_LARGE (502), CONFIGURATION_ERROR (503), TIMEOUT (504). Some upstream missing entities map to UPSTREAM_ERROR rather than NOT_FOUND. Asset-specific errors also include UNSUPPORTED_MEDIA (415).

## Endpoints

`projects?page=1&limit=50`

Returns `data.items`: project objects with `project_id,name,path,url,description,visibility,created_at,updated_at,labels,count`. Workspace is the authenticated SDK username. `path` such as `demo/example` is the project parameter for subsequent calls. `count` follows the installed SDK/service count fields.

`runs?project=demo%2Fexample&page=1&limit=50`

Returns `data.items`: summaries with `id,run_id,name,description,state,created_at,finished_at,labels,group,job_type,url`. Use `id` for the run parameter. States preserve service values. Lists do not fetch individual run profiles, avoiding N+1 requests.

Projects and runs have `meta.page,limit,total,hasMore,nextPage,truncated`. A page is one bounded SDK request with `all=False`. `truncated` means more pages remain; it does not imply data loss. Valid list page sizes are **10,12,15,20,24,27,50,100** (SDK constraint); default 50. `page` is 1-based and capped at 100000. Do not claim all runs loaded until hasMore is false.

`run?project=...&run=...`

Returns summary fields directly in `data`, plus `config` from SDK profile.config (preserves SDK structure). Profile metadata/requirements and local files are not fetched. `meta.fullHistory=false`.

`columns?project=...&run=...&limit=50&metricType=SCALAR&cursor=...`

Returns `data.items=[{"key":"train/loss","name":"train/loss","type":"FLOAT","metricType":"SCALAR"}]`. `metricType` is SCALAR (default) or MEDIA; MEDIA items have `type:"MEDIA"` because a concrete image/audio subtype is not available in the key listing. Includes system keys; their names begin with `__swanlab__`. Group or filter these in the frontend. `meta={limit,hasMore,nextCursor,total:null,truncated,metricType,...cacheFields}`. Follow nextCursor verbatim, URL encoded; there is no numeric page for this endpoint. Keys are returned in service order. Cursor length max 2048. Valid limit values match list page sizes above.

Implementation deliberately uses one read request through SDK Series transport and its experiment reference to `/house/metrics/{scalar|media}/keys`. SDK 0.10.4 Series.json()/iteration drains all cursor pages; the legacy columns endpoint returned empty for these real projects. This narrowly scoped internal SDK dependency needs rechecking on SDK upgrades.

`series?project=...&run=...&key=train%2Floss&limit=1000`

Returns `data={key,points:[{step,value,timestamp}]}`. SDK `index` is normalized to step and `data` to value, using the default step axis. Timestamps preserve SDK Unix milliseconds; absent values are null. Nonfinite numbers become null. The query constructs an exact SDK Key; no fuzzy matching or key scans occur. limit is 1–1500, default 1000. `meta={limit,returned,sampled:true,truncated:true,fullHistory:false,note,...cacheFields}`. The service samples across history; this is **not the most recent N points and not full resolution**. Original point count is unknown, so truncated is conservatively true even for a short returned sequence. No full CSV export or unbounded history is exposed.

`logs?project=...&run=...&offset=0&limit=50`

Returns `data.items` containing original SDK log entries (service field shape preserved). `offset` is a **chunk epoch**, not a line offset; it is 0-based, max 100000. SDK fetches at most one 1000-entry chunk at INFO level. Return limit is 1–100 (default 50). `meta={offset,nextOffset,limit,chunkCount,truncated,fullHistory:false,note,...cacheFields}`. nextOffset is offset+1 when a chunk is nonempty, otherwise null; it is a continuation hint, not proof another chunk exists. chunkCount preserves SDK count; do not interpret it as a guaranteed complete line count. truncated indicates this chunk was cut to limit. Omitted lines within that chunk cannot be resumed with a line cursor; frontend must visibly disclose this limitation. No log export endpoint exists.

`media?project=...&run=...&key=...&step=100&limit=50`

Returns `data={key,step,steps,items}`. `step` optional (nonnegative integer); omitted means the SDK-selected current/default step. Only **one step** is fetched (`all=False`); never all media history. Items are safe metadata: `{item:0,type:"html",contentType:"text/html; charset=utf-8",available:true,caption?:string}`. `item` is the zero-based index for the asset endpoint, and type is `html|image|text|audio|video|unsupported`, inferred from the SDK-resolved file suffix. URLs and paths are never included. `meta={limit,truncated,fullHistory:false,...cacheFields}`. limit is 1–100, default 50; step enumeration caps at 2000. Empty media keys/steps are legitimate.

`asset?project=...&run=...&key=...&step=1000&item=0`

Owner-authenticated read-only response containing actual media bytes, **not** a JSON success envelope. Project, run, key and explicit nonnegative step are required; item defaults to 0 and ranges 0–1999. Only these identifiers are accepted: URL, path, host, file and all other parameters are rejected, including duplicates. An unavailable step/item returns 404, unsupported suffix 415; all errors use the ordinary generic JSON error envelope. HTML, PNG/JPEG/GIF/WebP images, text/JSON (served as plain text), MP3/WAV audio and MP4 video are supported. Maximum content size is 2 MiB; larger files return RESPONSE_TOO_LARGE (502). No partial or range responses are provided.

The bridge resolves the exact MEDIA Key through the installed SDK on every asset request. It fetches only the selected SDK URL, without SDK credentials or browser cookies in the download request, and accepts only the configured API origin (same scheme, hostname and effective port). Every redirect is checked against that same origin; other origins, credential URLs, file URLs and fragments are rejected. Environment proxy routing is disabled for asset downloads. The 12-second download timeout is additionally bounded by the overall bridge timeout. Signed URLs remain private inside the Python process. Bridge bytes use a bounded base64 envelope and bypass display `clean()` truncation, preserving complete HTML over 24000 characters. Node decodes and validates the envelope before responding.

Responses use Content-Type, Content-Length, no-store, nosniff, no-referrer, same-origin resource policy and a restrictive permissions policy. The asset CSP enforces `sandbox allow-scripts allow-downloads` without allow-same-origin, prohibits parent-origin access, popups, top navigation, frames, object embedding, forms and network connections. Inline scripts/styles can render logged interactive reports; external scripts are limited to HTTPS jsdelivr, cdnjs and unpkg, styles to jsdelivr/cdnjs. Images/media/fonts may use data/blob as configured. The client must additionally use iframe `sandbox="allow-scripts allow-downloads"`; never add allow-same-origin. Prefer a direct authenticated iframe URL to preserve response CSP. A fetch-to-Blob implementation must preserve an equivalent CSP in the generated document because HTTP response headers do not follow blob URLs.


## Configuration and operational limits

Backend plugin exports `name='dsh-swanlab'`, `inject=['webServer','connection']`, and async apply. Trusted plugin config overrides:

```js
{
  pythonPath: '/path/to/venv/bin/python',
  envFile: '/path/to/swanlab.env',
  apiHost: 'http://127.0.0.1:8000',
  timeoutMs: 20000,
  cacheTtlMs: 15000
}
```

Only trusted plugin configuration controls these paths/host. Request JSON and HTTP params cannot override them. The bridge parses only SWANLAB_API_KEY from the env file without shell execution, and passes credentials directly to swanlab.Api. API host is fixed by trusted configuration, never a request parameter. No key is returned, placed in URLs, or passed on the process command line. SDK stdout/stderr and exception details are suppressed. Known credential values and credential-shaped fields are redacted recursively in outputs, including configs/logs. Strings cap at 24000 characters, arrays at 2000 elements, nested structures at depth 15; config values with sensitive names become `[redacted]`. These are display bounds, so config should not be advertised as a byte-exact export.

Node spawns Python with stdin JSON and `-B` (no pycache writes). At most four distinct subprocesses run concurrently; duplicate in-flight queries share a promise. Cache is in memory only, max 128 entries, success responses only, keyed by exact request; TTL default 15s and capped at 60s. Asset content is not cached; its bridge meta.cacheTtlMs is 0. `cached` is true on completed cache hits, fetchedAt identifies source fetch time. Child timeout defaults 20s, clamped 1–60s; child is killed at timeout. Output cap is 4 MiB. Plugin disposal terminates children and clears cache. No training/SwanLab modification or service-side data writes are used; SDK login and metric query POSTs are authentication/read operations.

This is a visualization-only plugin. It never registers Agent tools, adds prompt instructions, or changes Agent modes. Only the authenticated Web API and browser sidebar are exposed.

## Validation performed

SDK source inspected: Api, Experiment/Experiments, Project/Projects, Series/Key, Metric, BaseEntity and PaginatedQuery in installed SwanLab 0.10.4. Node test suite validates owner admission, method/route/parameter rejection, safe subprocess errors, real project/run reads, config metadata, key cursor continuation, nonempty numeric metric samples, logs, media key listings, and cache reuse. Python tests validate argument restrictions, nested redaction, and one-page metadata.

Run without writing service data:

```sh
node --test tests/backend.test.mjs
python3 -B tests/backend_python.py
# Live tests are optional; choose your own project/run and fixture assets.
SWANLAB_LIVE_TEST=1 SWANLAB_LIVE_PROJECT=demo/example SWANLAB_LIVE_RUN=example-run node --test tests/backend.test.mjs
```

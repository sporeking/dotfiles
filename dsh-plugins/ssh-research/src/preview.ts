import { posix } from 'node:path'
import { TextDecoder } from 'node:util'
import type { SFTPWrapper, Stats } from 'ssh2'
import type { SshEngine } from './engine.ts'
import { withClient } from './engine/connection-pool.ts'

export const MAX_PREVIEW_BYTES = 2 * 1024 * 1024
export type Preview = { kind: 'text' | 'csv' | 'image'; name: string; mime: string; content?: string; dataUrl?: string }
export class PreviewError extends Error {
  constructor(message: string, readonly status = 415) { super(message) }
}
const raster: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' }
const textExtensions = new Set(['.txt', '.md', '.markdown', '.log', '.json', '.jsonl', '.ndjson', '.yaml', '.yml', '.toml', '.ini', '.conf', '.cfg', '.csv', '.tsv', '.py', '.js', '.ts', '.tsx', '.jsx', '.sh', '.sql', '.xml', '.css', '.r', '.rs', '.go', '.java', '.c', '.h', '.cpp'])

export function validatePreviewPath(path: string): void {
  if (!posix.isAbsolute(path) || path.includes('\0')) throw new PreviewError('path must be absolute and contain no NUL', 400)
  const ext = posix.extname(path).toLowerCase()
  if (!(ext in raster) && !textExtensions.has(ext)) throw new PreviewError('unsupported preview file type')
}

/** Every response is JSON; text and CSV stay inert strings for the client. */
export function decodePreview(path: string, bytes: Buffer): Preview {
  validatePreviewPath(path)
  if (bytes.length > MAX_PREVIEW_BYTES) throw new PreviewError('preview exceeds 2 MiB limit', 413)
  const name = posix.basename(path)
  const ext = posix.extname(path).toLowerCase()
  const mime = raster[ext]
  if (mime !== undefined) {
    const valid = mime === 'image/png' ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : mime === 'image/jpeg' ? bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : mime === 'image/gif' ? ['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString('ascii'))
          : bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP'
    if (!valid) throw new PreviewError('image magic does not match file type')
    return { kind: 'image', name, mime, dataUrl: `data:${mime};base64,${bytes.toString('base64')}` }
  }
  let content: string
  try { content = new TextDecoder('utf-8', { fatal: true }).decode(bytes) } catch { throw new PreviewError('preview requires UTF-8 text') }
  if (/[\x00-\x08\x0b\x0e-\x1f]/.test(content)) throw new PreviewError('binary content is unsupported')
  if (/<\s*(?:!doctype\s+html|html|svg)\b/i.test(content.slice(0, 1024))) throw new PreviewError('HTML and SVG preview is unsupported')
  return { kind: ext === '.csv' ? 'csv' : 'text', name, mime: ext === '.csv' ? 'text/csv' : 'text/plain', content }
}

/** Read at most cap+1 bytes, even when the file grows or the server lies about size. */
export async function readBoundedSftp(sftp: SFTPWrapper, path: string): Promise<Buffer> {
  const handle = await new Promise<Buffer>((resolve, reject) => sftp.open(path, 'r', (error, value) => error ? reject(error) : resolve(value)))
  try {
    const stat = await new Promise<Stats>((resolve, reject) => sftp.fstat(handle, (error, value) => error ? reject(error) : resolve(value)))
    if (!stat.isFile()) throw new PreviewError('preview requires a regular file', 400)
    if (stat.size > MAX_PREVIEW_BYTES) throw new PreviewError('preview exceeds 2 MiB limit', 413)
    const chunks: Buffer[] = []
    let total = 0
    while (total <= MAX_PREVIEW_BYTES) {
      const buffer = Buffer.alloc(Math.min(64 * 1024, MAX_PREVIEW_BYTES + 1 - total))
      const count = await new Promise<number>((resolve, reject) => sftp.read(handle, buffer, 0, buffer.length, total, (error, read) => error ? reject(error) : resolve(read)))
      if (count === 0) break
      if (!Number.isInteger(count) || count < 0 || count > buffer.length) throw new Error('invalid SFTP read length')
      total += count
      if (total > MAX_PREVIEW_BYTES) throw new PreviewError('preview exceeds 2 MiB limit', 413)
      chunks.push(buffer.subarray(0, count))
    }
    return Buffer.concat(chunks, total)
  } finally {
    await new Promise<void>(resolve => { sftp.close(handle, () => resolve()) })
  }
}

export async function remotePreview(engine: SshEngine, alias: string, path: string): Promise<Preview> {
  validatePreviewPath(path)
  return withClient(engine, alias, async client => {
    const sftp = await new Promise<SFTPWrapper>((resolve, reject) => client.sftp((error, value) => error ? reject(error) : resolve(value)))
    try { return decodePreview(path, await readBoundedSftp(sftp, path)) } finally { sftp.end() }
  }, 1)
}

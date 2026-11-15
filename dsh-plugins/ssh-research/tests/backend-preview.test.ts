import { describe, expect, it, vi } from 'vitest'
import type { SFTPWrapper } from 'ssh2'
import { decodePreview, MAX_PREVIEW_BYTES, readBoundedSftp } from '../src/preview.ts'

function sftpFile(bytes: Buffer, declared = bytes.length) {
  const close = vi.fn((_handle, cb) => cb())
  const read = vi.fn((_handle, buffer, offset, length, position, cb) => {
    const count = Math.min(length, bytes.length - position)
    bytes.copy(buffer, offset, position, position + count)
    cb(undefined, count)
  })
  const sftp = { open: (_p, _flags, cb) => cb(undefined, Buffer.from('h')), fstat: (_h, cb) => cb(undefined, { size: declared, isFile: () => true }), close, read } as unknown as SFTPWrapper
  return { sftp, close, read }
}

describe('bounded remote preview', () => {
  it('returns text and CSV unchanged as strings', () => {
    expect(decodePreview('/a.md', Buffer.from('# hello <b>world</b>'))).toEqual({ kind: 'text', name: 'a.md', mime: 'text/plain', content: '# hello <b>world</b>' })
    expect(decodePreview('/a.csv', Buffer.from('a,b\n"x,y",2'))).toEqual({ kind: 'csv', name: 'a.csv', mime: 'text/csv', content: 'a,b\n"x,y",2' })
  })
  it.each(['a.txt', '/a.svg', '/a.html', '/a.pdf', '/a.bin'])('rejects unsupported or relative paths %s', path => {
    expect(() => decodePreview(path, Buffer.from('data'))).toThrow()
  })
  it('rejects binary, invalid UTF-8, disguised SVG and HTML', () => {
    for (const bytes of [Buffer.from([0, 1]), Buffer.from([0xff]), Buffer.from('<svg xmlns="x"/>'), Buffer.from('<!DOCTYPE html><html>')]) expect(() => decodePreview('/a.txt', bytes)).toThrow()
  })
  it.each([
    ['png', Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), 'image/png'],
    ['jpeg', Buffer.from([255, 216, 255, 224]), 'image/jpeg'],
    ['gif', Buffer.from('GIF89a'), 'image/gif'],
    ['webp', Buffer.from('RIFFxxxxWEBP'), 'image/webp'],
  ])('checks raster magic for %s', (ext, bytes, mime) => {
    expect(decodePreview(`/a.${ext}`, bytes as Buffer)).toMatchObject({ kind: 'image', mime, dataUrl: `data:${mime};base64,${(bytes as Buffer).toString('base64')}` })
    expect(() => decodePreview(`/a.${ext}`, Buffer.from('<svg/>'))).toThrow('magic')
  })
  it('rejects a raster with another raster signature', () => expect(() => decodePreview('/a.png', Buffer.from('GIF89a'))).toThrow('magic'))
  it('reads an exact-limit file fully and closes its handle', async () => {
    const file = sftpFile(Buffer.alloc(MAX_PREVIEW_BYTES, 97))
    expect((await readBoundedSftp(file.sftp, '/a.txt')).length).toBe(MAX_PREVIEW_BYTES)
    expect(file.close).toHaveBeenCalledOnce()
  })
  it('refuses declared oversize before reading', async () => {
    const file = sftpFile(Buffer.alloc(0), MAX_PREVIEW_BYTES + 1)
    await expect(readBoundedSftp(file.sftp, '/a.txt')).rejects.toMatchObject({ status: 413 })
    expect(file.read).not.toHaveBeenCalled()
    expect(file.close).toHaveBeenCalledOnce()
  })
  it('refuses growth past cap rather than silently truncating', async () => {
    const file = sftpFile(Buffer.alloc(MAX_PREVIEW_BYTES + 20), 1)
    await expect(readBoundedSftp(file.sftp, '/a.txt')).rejects.toMatchObject({ status: 413 })
    const requested = file.read.mock.calls.reduce((sum, args) => sum + args[3], 0)
    expect(requested).toBe(MAX_PREVIEW_BYTES + 1)
    expect(file.close).toHaveBeenCalledOnce()
  })
})

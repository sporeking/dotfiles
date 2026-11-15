// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResultPreview, parsePreviewCsv, validRasterDataUrl } from '../src/client/panel/ResultPreview.tsx'
import { TransferTab } from '../src/client/panel/TransferTab.tsx'
import type { SshApi } from '../src/client/api.ts'

describe('CSV preview parser', () => {
  it('preserves quoted delimiters, CRLF/newlines and escaped quotes', () => {
    expect(parsePreviewCsv('\uFEFFname,notes,empty\r\n"a,b","line 1\r\nline ""2""",\r\n').rows)
      .toEqual([['name', 'notes', 'empty'], ['a,b', 'line 1\r\nline "2"', '']])
  })
  it('handles empty inputs, blank rows and trailing fields without phantom records', () => {
    expect(parsePreviewCsv('').rows).toEqual([])
    expect(parsePreviewCsv('\n').rows).toEqual([['']])
    expect(parsePreviewCsv('a,\n"",').rows).toEqual([['a', ''], ['', '']])
    expect(parsePreviewCsv('""').rows).toEqual([['']])
  })
  it('rejects malformed quotes rather than misrepresenting the table', () => {
    for (const text of ['"open', 'a"b,c', '"a"x,b', '"a""']) {
      expect(() => parsePreviewCsv(text)).toThrow()
    }
  })
  it('limits rendered rows, columns and cells while counting all records', () => {
    const result = parsePreviewCsv(Array.from({ length: 250 }, () => Array(120).fill('x').join(',')).join('\n'))
    expect(result.totalRows).toBe(250)
    expect(result.rows.length).toBeLessThanOrEqual(200)
    expect(result.rows.every(row => row.length <= 100)).toBe(true)
    expect(result.rows.reduce((sum, row) => sum + row.length, 0)).toBe(10_000)
    expect(result.truncated).toBe(true)
  })
  it('validates even rows outside the render budget', () => {
    expect(() => parsePreviewCsv('a\n'.repeat(201) + '"bad')).toThrow()
  })
})

describe('raster data URL guard', () => {
  it('accepts only matching allowlisted base64 raster media', () => {
    expect(validRasterDataUrl('image/png', 'data:image/png;base64,iVBORw0KGgo=')).toBe(true)
    for (const [mime, url] of [
      ['image/svg+xml', 'data:image/svg+xml;base64,PHN2Zz4='],
      ['image/png', 'https://example.org/image.png'],
      ['image/png', 'data:image/jpeg;base64,aGVsbG8='],
      ['image/png', 'data:image/png,<svg onload=alert(1)>'],
      ['image/png', 'data:image/png;base64,aGVs bG8='],
    ]) expect(validRasterDataUrl(mime!, url!)).toBe(false)
  })
})

let container: HTMLDivElement
let root: Root
beforeEach(() => {
  document.documentElement.lang = 'zh'
  ;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})
afterEach(async () => {
  await act(async () => { root.unmount() })
  container.remove()
  vi.unstubAllGlobals()
})
const reply = (body: unknown, ok = true) => ({ ok, status: ok ? 200 : 400, json: async () => body })
const textReply = (content: string) => reply({ kind: 'text', name: 'run.log', mime: 'text/plain', content })
const renderPreview = async (path: string, extra = {}) => {
  await act(async () => { root.render(<ResultPreview alias="remote" path={path} downloading={false} onClose={vi.fn()} onDownload={vi.fn()} {...extra} />) })
}
const click = async (text: string) => {
  const button = [...container.querySelectorAll('button')].find(node => node.textContent === text)
  expect(button).toBeDefined()
  await act(async () => { button!.click() })
}

const renderTransfer = async (ls: ReturnType<typeof vi.fn>) => {
  const api = {
    listHosts: vi.fn().mockResolvedValue([{ alias: 'remote', host: 'host' }]),
    ls,
  } as unknown as SshApi
  await act(async () => { root.render(<TransferTab api={api} />) })
  const select = container.querySelector('select')!
  await act(async () => { select.value = 'remote'; select.dispatchEvent(new Event('change', { bubbles: true })) })
}
const setRemotePath = async (path: string) => {
  const input = container.querySelector('input:not([type="file"])') as HTMLInputElement
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, path)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

describe('directory browsing feedback and selected file navigation', () => {
  it.each(['zh', 'en'])('shows loading then an empty directory in %s', async language => {
    document.documentElement.lang = language
    let resolveList!: (value: unknown[]) => void
    const ls = vi.fn().mockImplementation(() => new Promise(resolve => { resolveList = resolve }))
    await renderTransfer(ls)
    await click(language === 'zh' ? '浏览远程目录' : 'Browse remote')
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull()
    expect(container.querySelector('[role="status"]')?.textContent).toBe(language === 'zh' ? '加载中…' : 'Loading…')
    expect(container.textContent).not.toContain(language === 'zh' ? '此目录为空' : 'This directory is empty')
    await act(async () => { resolveList([]) })
    expect(container.querySelector('[aria-busy="true"]')).toBeNull()
    expect(container.querySelector('[role="status"]')?.textContent).toBe(language === 'zh' ? '此目录为空。' : 'This directory is empty.')
  })
  it('shows directory errors without a misleading empty state', async () => {
    await renderTransfer(vi.fn().mockRejectedValue(new Error('permission denied')))
    await click('浏览远程目录')
    expect(container.textContent).toContain('permission denied')
    expect(container.textContent).not.toContain('此目录为空')
    expect(container.querySelector('[aria-busy="true"]')).toBeNull()
  })
  it('hides old entries during directory navigation, then shows empty state', async () => {
    let resolveList!: (value: unknown[]) => void
    const ls = vi.fn().mockResolvedValueOnce([{ name: 'empty-dir', type: 'dir', size: 0 }])
      .mockImplementationOnce(() => new Promise(resolve => { resolveList = resolve }))
    await renderTransfer(ls)
    await click('浏览远程目录')
    const directory = container.querySelector('button[data-type="dir"]') as HTMLButtonElement
    await act(async () => { directory.click() })
    expect(container.querySelector('button[data-type="dir"]')).toBeNull()
    expect(container.querySelector('[role="status"]')?.textContent).toBe('加载中…')
    await act(async () => { resolveList([]) })
    expect(container.textContent).toContain('此目录为空。')
    expect(container.textContent).toContain('上级目录')
  })
  it.each(['/run.log', '/tmp/results/run.log'])('reopens the parent of selected %s after closing preview', async path => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(textReply('log output')))
    const parent = path.slice(0, path.lastIndexOf('/')) || '/'
    const ls = vi.fn().mockResolvedValue([{ name: 'run.log', type: 'file', size: 10 }])
    await renderTransfer(ls)
    await setRemotePath(parent)
    await click('浏览远程目录')
    const file = container.querySelector('button[data-type="file"]') as HTMLButtonElement
    await act(async () => { file.click() })
    expect((container.querySelector('input:not([type="file"])') as HTMLInputElement).value).toBe(path)
    await click('关闭预览')
    expect(container.querySelector('pre')).toBeNull()
    await click('浏览远程目录')
    expect(ls).toHaveBeenLastCalledWith('remote', parent)
    expect(ls).not.toHaveBeenCalledWith('remote', path)
    // A manually entered directory continues to be used directly.
    await setRemotePath('/different/directory')
    await click('浏览远程目录')
    expect(ls).toHaveBeenLastCalledWith('remote', '/different/directory')
  })
})

describe('result preview UI', () => {
  it('renders logs as plain text and preserves download, refresh and close controls', async () => {
    const fetcher = vi.fn().mockResolvedValue(textReply('<script>alert(1)</script>'))
    vi.stubGlobal('fetch', fetcher)
    const onDownload = vi.fn()
    const onClose = vi.fn()
    await renderPreview('/a & b.log', { onDownload, onClose })
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('pre')?.textContent).toBe('<script>alert(1)</script>')
    expect(String(fetcher.mock.calls[0]![0])).toContain('path=%2Fa+%26+b.log')
    await click('下载')
    expect(onDownload).toHaveBeenCalledOnce()
    await click('刷新')
    expect(fetcher).toHaveBeenCalledTimes(2)
    await click('关闭预览')
    expect(onClose).toHaveBeenCalledOnce()
  })
  it('ignores stale responses after file switch and aborts on close', async () => {
    let resolveOld!: (value: unknown) => void
    const fetcher = vi.fn().mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve }))
      .mockResolvedValueOnce(textReply('new file'))
    vi.stubGlobal('fetch', fetcher)
    await renderPreview('/old.log')
    expect(container.textContent).toContain('正在加载预览')
    const oldSignal = fetcher.mock.calls[0]![1].signal as AbortSignal
    await renderPreview('/new.log')
    expect(oldSignal.aborted).toBe(true)
    await act(async () => { resolveOld(textReply('stale file')) })
    expect(container.textContent).toContain('new file')
    expect(container.textContent).not.toContain('stale file')
    await act(async () => { root.render(null) })
    expect((fetcher.mock.calls[1]![1].signal as AbortSignal).aborted).toBe(true)
  })
  it('ignores stale responses after refresh', async () => {
    let resolveOld!: (value: unknown) => void
    vi.stubGlobal('fetch', vi.fn().mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve }))
      .mockResolvedValueOnce(textReply('refreshed')))
    await renderPreview('/run.log')
    await click('刷新')
    await act(async () => { resolveOld(textReply('old version')) })
    expect(container.textContent).toContain('refreshed')
    expect(container.textContent).not.toContain('old version')
  })
  it('shows server errors and permits retry; follows English locale', async () => {
    document.documentElement.lang = 'en'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(reply({ error: 'File too large' }, false)).mockResolvedValueOnce(textReply('retry ok')))
    await renderPreview('/run.log')
    expect(container.querySelector('[role="alert"]')?.textContent).toBe('File too large')
    expect(container.textContent).toContain('Close preview')
    await click('Refresh')
    expect(container.querySelector('pre')?.textContent).toBe('retry ok')
  })
  it('renders quoted CSV as inert cells and states display limits', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ kind: 'csv', name: 'table.csv', mime: 'text/csv', content: '"a,b","<img src=x onerror=alert(1)>"\n"two\nlines",x' })))
    await renderPreview('/table.csv')
    expect([...container.querySelectorAll('td')].map(cell => cell.textContent)).toEqual(['a,b', '<img src=x onerror=alert(1)>', 'two\nlines', 'x'])
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toContain('最多显示 200 行')
  })
  it('rejects SVG and remote image URLs without adding an image', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ kind: 'image', name: 'unsafe.svg', mime: 'image/svg+xml', dataUrl: 'data:image/svg+xml;base64,PHN2Zz4=' })))
    await renderPreview('/unsafe.svg')
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('[role="alert"]')).not.toBeNull()
  })
  it('renders allowed images and handles decoder failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ kind: 'image', name: 'plot.png', mime: 'image/png', dataUrl: 'data:image/png;base64,iVBORw0KGgo=' })))
    await renderPreview('/plot.png')
    const image = container.querySelector('img')!
    expect(image.alt).toBe('plot.png')
    await act(async () => { image.dispatchEvent(new Event('error')) })
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('图片无法解码')
  })
  it('opens preview from directory files and clears it when switching hosts', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(textReply('log output')))
    const api = {
      listHosts: vi.fn().mockResolvedValue([{ alias: 'remote', host: 'host' }, { alias: 'other', host: 'host2' }]),
      ls: vi.fn().mockResolvedValue([{ name: 'run.log', type: 'file', size: 10 }]),
    } as unknown as SshApi
    await act(async () => { root.render(<TransferTab api={api} />) })
    const select = container.querySelector('select')!
    await act(async () => { select.value = 'remote'; select.dispatchEvent(new Event('change', { bubbles: true })) })
    const browse = [...container.querySelectorAll('button')].find(button => button.textContent?.includes('浏览'))!
    await act(async () => { browse.click() })
    const file = [...container.querySelectorAll('button')].find(button => button.textContent?.includes('run.log'))!
    await act(async () => { file.click() })
    expect(container.querySelector('pre')?.textContent).toBe('log output')
    await act(async () => { select.value = 'other'; select.dispatchEvent(new Event('change', { bubbles: true })) })
    expect(container.querySelector('pre')).toBeNull()
    expect(container.textContent).not.toContain('run.log')
  })
})

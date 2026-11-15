import { useEffect, useMemo, useState } from 'react'
import { errorMessage, tt } from './helpers.ts'
import css from './panel.module.css'

export const PREVIEW_ROWS = 200
export const PREVIEW_COLUMNS = 100
const PREVIEW_CELLS = 10_000
const MAX_BYTES = 2 * 1024 * 1024

// Follow the existing translator, including its runtime locale seat, without
// adding keys to the shared dictionaries in this isolated feature.
export function previewCopy(zh: string, en: string): string {
  return tt('transfer.download') === 'Download' ? en : zh
}

export interface CsvPreview {
  rows: string[][]
  totalRows: number
  truncated: boolean
}

/** RFC 4180 fields, doubled quotes, CRLF/LF, and embedded quoted newlines.
 * Keep parsing after the display budget to validate and count records, without
 * allocating a potentially million-cell DOM (or million-element row arrays).
 */
export function parsePreviewCsv(source: string): CsvPreview {
  const text = source.replace(/^\uFEFF/, '')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  let closed = false
  let atStart = true
  let columns = 0
  let cells = 0
  let totalRows = 0
  let truncated = false
  const fieldEnd = (): void => {
    columns++
    if (totalRows < PREVIEW_ROWS && columns <= PREVIEW_COLUMNS && cells < PREVIEW_CELLS) {
      row.push(field)
      cells++
    } else truncated = true
    field = ''
    atStart = true
    closed = false
  }
  const rowEnd = (): void => {
    fieldEnd()
    if (totalRows < PREVIEW_ROWS && row.length > 0) rows.push(row)
    totalRows++
    row = []
    columns = 0
  }
  for (let i = 0; i < text.length; i++) {
    const char = text[i]!
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else { quoted = false; closed = true }
      } else field += char
    } else if (char === ',') fieldEnd()
    else if (char === '\r' || char === '\n') {
      rowEnd()
      if (char === '\r' && text[i + 1] === '\n') i++
    } else if (char === '"' && atStart && !closed) {
      quoted = true
      atStart = false
    } else {
      if (closed || char === '"') throw new Error(previewCopy('CSV 引号格式无效。', 'Invalid CSV quoting.'))
      atStart = false
      field += char
    }
  }
  if (quoted) throw new Error(previewCopy('CSV 引号未闭合。', 'Unclosed CSV quote.'))
  if (text.length > 0 && (field !== '' || !atStart || columns > 0 || closed)) rowEnd()
  return { rows, totalRows, truncated }
}

type Preview = { kind: 'text' | 'csv'; name: string; mime: string; content: string }
  | { kind: 'image'; name: string; mime: string; dataUrl: string }

/** Only explicit raster MIME/base64 data URLs reach img; never URLs or SVG. */
export function validRasterDataUrl(mime: string, dataUrl: string): boolean {
  return ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp'].includes(mime)
    && dataUrl.startsWith(`data:${mime};base64,`)
    && /^[A-Za-z0-9+/]+={0,2}$/.test(dataUrl.slice(dataUrl.indexOf(',') + 1))
    && dataUrl.length <= Math.ceil(MAX_BYTES / 3) * 4 + 64
}

function decodePreview(body: unknown): Preview {
  const invalid = (): never => { throw new Error(previewCopy('预览响应无效或超过 2 MiB。', 'Invalid preview response or file exceeds 2 MiB.')) }
  if (typeof body !== 'object' || body === null) return invalid()
  const value = body as Record<string, unknown>
  if (typeof value.error === 'string') throw new Error(value.error)
  if (typeof value.name !== 'string' || typeof value.mime !== 'string') return invalid()
  if (value.kind === 'image' && typeof value.dataUrl === 'string' && validRasterDataUrl(value.mime, value.dataUrl)) {
    return { kind: 'image', name: value.name, mime: value.mime, dataUrl: value.dataUrl }
  }
  if ((value.kind === 'text' || value.kind === 'csv') && typeof value.content === 'string'
    && new TextEncoder().encode(value.content).length <= MAX_BYTES) {
    return { kind: value.kind, name: value.name, mime: value.mime, content: value.content }
  }
  return invalid()
}

export interface ResultPreviewProps {
  alias: string
  path: string
  onClose(): void
  onDownload(): void
  downloading: boolean
}

export function ResultPreview({ alias, path, onClose, onDownload, downloading }: ResultPreviewProps) {
  const [refresh, setRefresh] = useState(0)
  const [state, setState] = useState<{ key: string; value?: Preview; error?: string }>({ key: '' })
  const key = JSON.stringify([alias, path, refresh])
  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setState({ key })
    void (async () => {
      try {
        const query = new URLSearchParams({ alias, path })
        const response = await fetch(`/api/dsh-ssh/preview?${query}`, { signal: controller.signal, cache: 'no-store' })
        const body: unknown = await response.json()
        const value = decodePreview(body)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        if (active) setState({ key, value })
      } catch (cause) {
        if (active) setState({ key, error: errorMessage(cause) })
      }
    })()
    return () => { active = false; controller.abort() }
  }, [alias, path, key])

  const value = state.key === key ? state.value : undefined
  const error = state.key === key ? state.error : undefined
  const csv = useMemo(() => {
    if (value?.kind !== 'csv') return undefined
    try { return parsePreviewCsv(value.content) }
    catch (cause) { return errorMessage(cause) }
  }, [value])
  const loading = value === undefined && error === undefined
  return (
    <section className={css.previewPanel} aria-label={previewCopy('文件预览', 'File preview')} aria-busy={loading}>
      <div className={css.previewHeader}>
        <strong className={css.previewTitle}>{previewCopy('文件预览', 'File preview')}: {value?.name ?? path}</strong>
        <button type="button" className={css.ghostButton} onClick={() => { setRefresh(n => n + 1) }}>{tt('transfer.refresh')}</button>
        <button type="button" className={css.ghostButton} disabled={downloading} onClick={onDownload}>{tt('transfer.download')}</button>
        <button type="button" className={css.ghostButton} onClick={onClose}>{previewCopy('关闭预览', 'Close preview')}</button>
      </div>
      <div className={css.hint}>{alias}: {path} · {previewCopy('预览上限 2 MiB；下载可获取完整文件。', 'Preview limit: 2 MiB. Download for the complete file.')}</div>
      {loading && <div className={css.loading} role="status">{previewCopy('正在加载预览…', 'Loading preview…')}</div>}
      {error !== undefined && <div className={css.banner} data-kind="error" role="alert">{error}</div>}
      {value?.kind === 'text' && <pre className={css.previewText}>{value.content}</pre>}
      {value?.kind === 'image' && <img className={css.previewImage} src={value.dataUrl} alt={value.name} onError={() => { setState(previous => previous.key === key ? { key, error: previewCopy('图片无法解码。', 'Unable to decode image.') } : previous) }} />}
      {typeof csv === 'string' && <div className={css.banner} data-kind="error" role="alert">{csv}</div>}
      {csv !== undefined && typeof csv !== 'string' && <>
        <div className={css.hint}>{previewCopy(`共 ${csv.totalRows} 行；最多显示 ${PREVIEW_ROWS} 行、${PREVIEW_COLUMNS} 列、${PREVIEW_CELLS} 个单元格（首行按原样显示）。`, `${csv.totalRows} rows; showing up to ${PREVIEW_ROWS} rows, ${PREVIEW_COLUMNS} columns and ${PREVIEW_CELLS} cells (first row shown as data).`)} {csv.truncated && previewCopy('表格已截断，请下载查看完整数据。', 'Table truncated. Download for complete data.')}</div>
        <div className={css.previewTableWrap}><table className={`${css.table} ${css.previewTable}`} aria-label={value?.name}><tbody>
          {csv.rows.map((row, index) => <tr key={index}>{row.map((cell, col) => <td key={col}>{cell}</td>)}</tr>)}
        </tbody></table></div>
      </>}
    </section>
  )
}

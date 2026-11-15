// Modified for the sporeking/dsh-ssh-research fork; see README.md.
/**
 * Transfer tab: upload/download one file with progress, plus a toggleable
 * remote directory browser (api.ls) whose file rows fill the remote path
 * input and open a result preview, and whose directory rows navigate.
 */
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { SshApi } from '../api.ts'
import type { RemoteDirEntry, SshHostSummary, TransferProgress } from '../../protocol.ts'
import { errorMessage, tt } from './helpers.ts'
import css from './panel.module.css'
import { previewCopy, ResultPreview } from './ResultPreview.tsx'

/** Transfer tab props. */
export interface TransferTabProps {
  api: SshApi
}

/** One in-flight transfer (drives the progress bar). */
interface TransferState {
  kind: 'upload' | 'download'
  phase: TransferProgress['phase']
  percent: number
  speedBps?: number
  file: string
}

/** The last transfer's outcome line. */
type TransferStatus = { kind: 'ok'; bytes: number } | { kind: 'error'; error: string }

/** Join a directory path with a child entry name. */
function joinRemotePath(dir: string, name: string): string {
  const base = dir.endsWith('/') ? dir : dir + '/'
  return base + name
}

/** Parent path of a remote directory ('/' stays '/'). */
function parentOf(dir: string): string {
  const trimmed = dir.replace(/\/+$/, '')
  const index = trimmed.lastIndexOf('/')
  if (index <= 0) return '/'
  return trimmed.slice(0, index)
}

/** Human byte sizes through the transfer.* locale templates. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return tt('transfer.bytes', { value: bytes })
  if (bytes < 1024 * 1024) return tt('transfer.kib', { value: (bytes / 1024).toFixed(1) })
  if (bytes < 1024 * 1024 * 1024) return tt('transfer.mib', { value: (bytes / (1024 * 1024)).toFixed(1) })
  return tt('transfer.gib', { value: (bytes / (1024 * 1024 * 1024)).toFixed(1) })
}

/** The upload/download tab. */
export function TransferTab({ api }: TransferTabProps) {
  const [hosts, setHosts] = useState<SshHostSummary[]>([])
  const [listError, setListError] = useState<string | null>(null)
  const [alias, setAlias] = useState('')
  const [remotePath, setRemotePath] = useState('')
  const [browseOpen, setBrowseOpen] = useState(false)
  const [previewPath, setPreviewPath] = useState<string | null>(null)
  const [browseDir, setBrowseDir] = useState('/')
  const [entries, setEntries] = useState<RemoteDirEntry[]>([])
  const [browsing, setBrowsing] = useState(false)
  const [transfer, setTransfer] = useState<TransferState | null>(null)
  const [status, setStatus] = useState<TransferStatus | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  // Survives closing the preview: the transfer input can still name a file.
  const selectedFilePath = useRef<string | null>(null)
  const seqRef = useRef(0)

  useEffect(() => {
    let disposed = false
    void (async () => {
      try {
        const list = await api.listHosts()
        if (!disposed) setHosts(list)
      } catch (cause) {
        if (!disposed) setListError(errorMessage(cause))
      }
    })()
    return () => { disposed = true }
  }, [api])

  const loadDir = async (path: string): Promise<void> => {
    if (alias === '') return
    const seq = ++seqRef.current
    setBrowsing(true)
    setListError(null)
    try {
      const list = await api.ls(alias, path)
      if (seq !== seqRef.current) return
      const sorted = [...list].sort((a, b) => {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
        return a.name.localeCompare(b.name)
      })
      setEntries(sorted)
      setBrowseDir(path)
      setListError(null)
    } catch (cause) {
      if (seq === seqRef.current) setListError(errorMessage(cause))
    } finally {
      if (seq === seqRef.current) setBrowsing(false)
    }
  }

  const openBrowse = (): void => {
    if (alias === '') return
    setBrowseOpen(true)
    const path = remotePath.trim() === '' ? '/' : remotePath.trim()
    void loadDir(path === selectedFilePath.current ? parentOf(path) : path)
  }

  const handleFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file === undefined || alias === '' || remotePath.trim() === '' || transfer !== null) return
    setStatus(null)
    setTransfer({ kind: 'upload', phase: 'connecting', percent: 0, file: file.name })
    try {
      const outcome = await api.uploadFile(file, alias, remotePath.trim(), progress => {
        setTransfer(prev => prev === null ? prev : {
          kind: 'upload',
          phase: progress.phase,
          percent: progress.percent,
          speedBps: progress.speedBps,
          file: progress.file,
        })
      })
      setStatus({ kind: 'ok', bytes: outcome.transferredBytes })
    } catch (cause) {
      setStatus({ kind: 'error', error: errorMessage(cause) })
    } finally {
      setTransfer(null)
    }
  }

  const handleDownload = async (path = remotePath.trim()): Promise<void> => {
    if (alias === '' || path === '' || transfer !== null) return
    setStatus(null)
    setTransfer({ kind: 'download', phase: 'connecting', percent: 0, file: path })
    try {
      const result = await api.downloadFile(alias, path, progress => {
        setTransfer(prev => prev === null ? prev : {
          kind: 'download',
          phase: progress.phase,
          percent: progress.percent,
          speedBps: progress.speedBps,
          file: progress.file,
        })
      })
      // Streamed downloads (File System Access API) were already saved; the
      // Blob fallback triggers a browser save here.
      if (!result.streamed && result.blob !== undefined) {
        const url = URL.createObjectURL(result.blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = result.filename
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        // Defer the revoke: some engines need the URL alive past the click.
        setTimeout(() => { URL.revokeObjectURL(url) }, 10_000)
      }
      setStatus({ kind: 'ok', bytes: result.bytes })
    } catch (cause) {
      setStatus({ kind: 'error', error: errorMessage(cause) })
    } finally {
      setTransfer(null)
    }
  }

  const ready = alias !== '' && remotePath.trim() !== '' && transfer === null

  return (
    <div className={css.tabBody}>
      <div className={css.controls}>
        <select className={css.input} value={alias} onChange={event => {
          ++seqRef.current
          selectedFilePath.current = null
          setAlias(event.target.value)
          setPreviewPath(null)
          setEntries([])
          setBrowseOpen(false)
          setBrowseDir('/')
          setBrowsing(false)
          setListError(null)
        }}>
          <option value="">{tt('transfer.selectHost')}</option>
          {hosts.map(host => <option key={host.alias} value={host.alias}>{host.alias} ({host.host})</option>)}
        </select>
        <input className={css.input} placeholder={tt('transfer.remotePathHint')} value={remotePath} onChange={event => { setRemotePath(event.target.value) }} />
        <button type="button" className={css.ghostButton} disabled={alias === ''} onClick={openBrowse}>{tt('transfer.browseRemote')}</button>
        <div className={css.toolbarSpacer} />
        <button type="button" className={css.primaryButton} disabled={!ready} onClick={() => { fileRef.current?.click() }}>{tt('transfer.upload')}</button>
        <button type="button" className={css.ghostButton} disabled={!ready} onClick={() => { void handleDownload() }}>{tt('transfer.download')}</button>
        <input ref={fileRef} type="file" className={css.hiddenFile} onChange={event => { void handleFile(event) }} />
      </div>
      {listError !== null && <div className={css.banner} data-kind="error">{tt('common.error', { error: listError })}</div>}
      {browseOpen && (
        <div className={css.browsePanel}>
          <div className={css.browseHeader}>
            <span className={css.browsePath}>{browseDir}</span>
            <button type="button" className={css.linkButton} disabled={browsing} onClick={() => { void loadDir(browseDir) }}>{tt('transfer.refresh')}</button>
          </div>
          <div className={css.browseList} aria-busy={browsing}>
            {browsing && <div className={css.loading} role="status">{tt('common.loading')}</div>}
            {!browsing && listError === null && entries.length === 0 && <div className={css.empty} role="status">{previewCopy('此目录为空。', 'This directory is empty.')}</div>}
            {!browsing && browseDir !== '/' && (
              <button type="button" className={css.dirRow} data-up onClick={() => { void loadDir(parentOf(browseDir)) }}>
                <span className={css.dirName}>{tt('transfer.upLevel')}</span>
                <span className={css.dirType} />
                <span className={css.dirSize} />
              </button>
            )}
            {!browsing && entries.map(entry => (
              <button key={entry.name} type="button" className={css.dirRow} data-type={entry.type} onClick={() => {
                if (entry.type === 'dir') {
                  void loadDir(joinRemotePath(browseDir, entry.name))
                } else {
                  const path = joinRemotePath(browseDir, entry.name)
                  selectedFilePath.current = path
                  setRemotePath(path)
                  setPreviewPath(path)
                }
              }}>
                <span className={css.dirName}>{entry.name}</span>
                <span className={css.dirType}>{entry.type === 'dir' ? '[' + tt('transfer.dir') + ']' : entry.type === 'file' ? '[' + tt('transfer.file') + ']' : ''}</span>
                <span className={css.dirSize}>{formatBytes(entry.size)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {previewPath !== null && alias !== '' && <ResultPreview
        alias={alias}
        path={previewPath}
        onClose={() => { setPreviewPath(null) }}
        onDownload={() => { void handleDownload(previewPath) }}
        downloading={transfer !== null}
      />}
      {transfer !== null && (
        <div className={css.transferBlock}>
          <div className={css.progressMeta}>
            <span>{transfer.kind === 'upload' ? tt('transfer.uploading', { file: transfer.file }) : tt('transfer.downloading')}</span>
            <span>{tt('transfer.percent', { value: Math.round(transfer.percent) })}</span>
            {transfer.speedBps !== undefined && transfer.phase === 'transferring' && <span>{tt('transfer.speed', { value: formatBytes(transfer.speedBps) })}</span>}
          </div>
          <div className={css.progressTrack}>
            <div className={css.progressBar} style={{ width: Math.min(100, Math.max(0, transfer.percent)) + '%' }} />
          </div>
        </div>
      )}
      {status !== null && (
        <div className={css.banner} data-kind={status.kind}>
          {status.kind === 'ok' ? tt('transfer.done', { bytes: status.bytes }) : tt('transfer.failed', { error: status.error })}
        </div>
      )}
    </div>
  )
}

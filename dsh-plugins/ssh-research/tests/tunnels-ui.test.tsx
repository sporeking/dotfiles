// @vitest-environment jsdom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { TunnelsTab } from '../src/client/panel/TunnelsTab.tsx'

it('keeps a failed stop visible after a successful background refresh', async () => {
  vi.useFakeTimers()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
  const holder = document.createElement('div')
  document.body.append(holder)
  const root = createRoot(holder)
  const tunnel = { id: 't1', alias: 'lab', state: 'running', localPort: 6006, remoteHost: '127.0.0.1', remotePort: 6006, startedAt: 1 }
  const api = { listHosts: vi.fn(async () => []), listTunnels: vi.fn(async () => [tunnel]), stopTunnel: vi.fn(async () => { throw new Error('stop failed synthetic') }) }
  try {
    await act(async () => root.render(<TunnelsTab api={api as never} />))
    const stop = [...holder.querySelectorAll('button')].find(button => button.textContent === 'Stop' || button.textContent === '停止')!
    expect(stop).toBeTruthy()
    await act(async () => stop.click())
    expect(holder.textContent).toContain('stop failed synthetic')
    await act(async () => { await vi.advanceTimersByTimeAsync(5000) })
    expect(api.listTunnels.mock.calls.length).toBeGreaterThan(1)
    expect(holder.textContent).toContain('stop failed synthetic')
  } finally {
    await act(async () => root.unmount())
    holder.remove()
    vi.useRealTimers()
  }
})

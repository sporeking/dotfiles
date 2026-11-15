import { EventEmitter } from 'node:events'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Client, ClientChannel } from 'ssh2'
import type { HostStore } from '../src/store.ts'
import { cluster } from '../src/engine/cluster.ts'
import { DEFAULTS, execCommand, withClient, type PoolEngine, type PoolRecord } from '../src/engine/connection-pool.ts'

const mock = vi.hoisted(() => ({ clients: [] as any[], connectFailures: 0 }))
vi.mock('ssh2', async () => {
  const { EventEmitter } = await import('node:events')
  return { Client: class extends EventEmitter {
    exec = vi.fn((_command: string, callback: any) => {
      const channel = new EventEmitter() as any
      channel.stderr = new EventEmitter()
      channel.signal = vi.fn()
      channel.close = vi.fn()
      callback(undefined, channel)
      queueMicrotask(() => channel.emit('close', 0))
    })
    constructor() { super(); mock.clients.push(this) }
    connect() { queueMicrotask(() => mock.connectFailures-- > 0 ? this.emit('error', new Error('connect failed')) : this.emit('ready')) }
    end = vi.fn()
    destroy = vi.fn()
  } }
})

class FakeClient extends EventEmitter {
  exec = vi.fn<(command: string, callback: (error: Error | undefined, channel: ClientChannel) => void) => void>()
  end = vi.fn()
}
function channel(): ClientChannel {
  return Object.assign(new EventEmitter(), { stderr: new EventEmitter(), signal: vi.fn(), close: vi.fn() }) as unknown as ClientChannel
}
function fixture(aliases = ['host']) {
  const entries = aliases.map(alias => ({ alias, host: 'mock.invalid', user: 'mock', port: 22, auth: { kind: 'password', password: 'mock' }, proxyJump: [], tags: [] }))
  const engine: PoolEngine = { opts: { ...DEFAULTS }, store: { find: (alias: string) => entries.find(entry => entry.alias === alias), list: () => entries } as unknown as HostStore,
    pool: new Map(), acquireQueue: new Map() }
  const client = new FakeClient()
  const record: PoolRecord = { client: client as unknown as Client, hops: [], broken: false, pinned: false, idleAt: 0, inFlight: 0 }
  client.on('error', () => { record.broken = true })
  client.on('close', () => { record.broken = true })
  engine.pool.set(aliases[0], record)
  return { engine, client, record }
}
afterEach(() => { mock.clients.length = 0; mock.connectFailures = 0; vi.useRealTimers() })

describe('exec dispatch never replays', () => {
  it.each(['callback', 'throw', 'stream', 'no-status', 'client-error', 'client-close', 'client-end', 'hop'])('%s failure reports unknown with exactly one dispatch', async kind => {
    const { engine, client, record } = fixture()
    const hop = new FakeClient()
    hop.on('error', () => {})
    if (kind === 'hop') record.hops.push(hop as unknown as Client)
    const stream = channel()
    client.exec.mockImplementation((_command, callback) => {
      if (kind === 'throw') throw new Error('write failed')
      if (kind === 'callback') { record.broken = true; callback(new Error('request failed'), undefined as any); return }
      if (kind.startsWith('client-')) { client.emit(kind.slice(7), ...(kind === 'client-error' ? [new Error('lost')] : [])); return }
      if (kind === 'hop') { hop.emit('error', new Error('jump lost')); return }
      callback(undefined, stream)
      if (kind === 'stream') { record.broken = true; stream.emit('error', new Error('stream failed')) }
      else { record.broken = true; stream.emit('close', null) }
    })
    await expect(execCommand(engine, 'host', 'mutate')).rejects.toThrow('execution status unknown')
    expect(client.exec).toHaveBeenCalledTimes(1)
    expect(mock.clients).toHaveLength(0)
    expect(record.inFlight).toBe(0)
    expect(client.listenerCount('end')).toBe(0)
    expect(hop.listenerCount('close')).toBe(0)
  })

  it('fails every concurrent exec on the shared connection without replay, then reconnects for a later call', async () => {
    const { engine, client, record } = fixture()
    const calls = [execCommand(engine, 'host', 'mutate-a'), execCommand(engine, 'host', 'mutate-b')]
    client.emit('error', new Error('socket lost'))
    const outcomes = await Promise.allSettled(calls)
    expect(outcomes.every(outcome => outcome.status === 'rejected' && outcome.reason.message.includes('execution status unknown'))).toBe(true)
    expect(client.exec).toHaveBeenCalledTimes(2)
    expect(record.inFlight).toBe(0)
    expect(mock.clients).toHaveLength(0)
    expect((await execCommand(engine, 'host', 'next')).success).toBe(true)
    expect(mock.clients).toHaveLength(1)
    expect(mock.clients[0].exec).toHaveBeenCalledExactlyOnceWith('next', expect.any(Function))
  })

  it('rebuilds a connection already broken before dispatch', async () => {
    const { engine, client, record } = fixture()
    record.broken = true
    expect((await execCommand(engine, 'host', 'mutate')).success).toBe(true)
    expect(client.exec).not.toHaveBeenCalled()
    expect(client.end).toHaveBeenCalledTimes(1)
    expect(mock.clients[0].exec).toHaveBeenCalledTimes(1)
  })

  it('connect failure dispatches nothing and a subsequent call may reconnect', async () => {
    const { engine, client } = fixture()
    engine.pool.clear()
    mock.connectFailures = 1
    await expect(execCommand(engine, 'host', 'mutate')).rejects.toThrow('connect failed')
    expect(mock.clients[0].exec).not.toHaveBeenCalled()
    expect(client.exec).not.toHaveBeenCalled()
    expect((await execCommand(engine, 'host', 'mutate')).success).toBe(true)
    expect(mock.clients[1].exec).toHaveBeenCalledTimes(1)
  })

  it('preserves read-only withClient connection recovery', async () => {
    const { engine, record } = fixture()
    const read = vi.fn(async () => {
      if (read.mock.calls.length === 1) { record.broken = true; throw new Error('lost') }
      return ['directory']
    })
    expect(await withClient(engine, 'host', read)).toEqual(['directory'])
    expect(read).toHaveBeenCalledTimes(2)
    expect(mock.clients).toHaveLength(1)
  })

  it('cluster returns unknown for each failed host without a second dispatch', async () => {
    const { engine, client } = fixture(['one', 'two'])
    const other = new FakeClient()
    engine.pool.set('two', { ...engine.pool.get('one')!, client: other as unknown as Client })
    for (const target of [client, other]) target.exec.mockImplementation((_command, callback) => callback(new Error('dispatch failed'), undefined as any))
    const results = await cluster(engine, { aliases: ['one', 'two'], command: 'mutate' })
    expect(results).toHaveLength(2)
    for (const result of results) expect(result.error).toContain('execution status unknown')
    expect(client.exec).toHaveBeenCalledTimes(1)
    expect(other.exec).toHaveBeenCalledTimes(1)
    expect(mock.clients).toHaveLength(0)
  })

  it('preserves stdout, stderr and nonzero exit status without treating them as connection failure', async () => {
    const { engine, client } = fixture()
    client.exec.mockImplementation((_command, callback) => {
      const stream = channel()
      callback(undefined, stream)
      stream.emit('data', Buffer.from('output'))
      stream.stderr.emit('data', Buffer.from('failure detail'))
      stream.emit('close', 7)
    })
    expect(await execCommand(engine, 'host', 'command')).toMatchObject({ success: false, exitCode: 7, stdout: 'output', stderr: 'failure detail' })
    expect(client.exec).toHaveBeenCalledTimes(1)
  })

  it('does not dispatch an already cancelled call', async () => {
    const { engine, client } = fixture()
    const abort = new AbortController()
    abort.abort()
    expect(await execCommand(engine, 'host', 'mutate', undefined, abort.signal)).toMatchObject({ error: 'command cancelled by the caller' })
    expect(client.exec).not.toHaveBeenCalled()
  })

  it('closes a late channel after cancellation without replaying', async () => {
    const { engine, client } = fixture()
    let callback: any
    client.exec.mockImplementation((_command, cb) => { callback = cb })
    const abort = new AbortController()
    const pending = execCommand(engine, 'host', 'mutate', undefined, abort.signal)
    abort.abort()
    expect(await pending).toMatchObject({ error: 'command cancelled by the caller' })
    const stream = channel()
    callback(undefined, stream)
    expect(stream.close).toHaveBeenCalledTimes(1)
    expect(client.exec).toHaveBeenCalledTimes(1)
    expect(() => stream.emit('error', new Error('late error'))).not.toThrow()
  })

  it('deadline covers a missing exec callback and preserves the error in cluster', async () => {
    vi.useFakeTimers()
    const { engine, client } = fixture()
    const pending = cluster(engine, { aliases: ['host'], command: 'mutate', timeoutMs: 50 })
    await vi.advanceTimersByTimeAsync(50)
    expect((await pending)[0]).toMatchObject({ ok: false, timedOut: true, error: expect.stringContaining('execution status unknown') })
    expect(client.exec).toHaveBeenCalledTimes(1)
  })
})

// @vitest-environment jsdom
import React from 'react'
import { readFileSync } from 'node:fs'
import { afterEach, expect, it, vi } from 'vitest'
import { ClientModuleSystem } from '/usr/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-client-modules/src/client/system.ts'

const id = '@sporeking/dsh-ssh-research'
const script = readFileSync(`${process.cwd()}/lib/client.js`, 'utf8')
afterEach(() => { vi.restoreAllMocks(); document.head.querySelectorAll('style[data-plugin]').forEach(node => node.remove()); delete (window as any).__ModuleLoader__ })

it('arrives as a classic script and only registers its lazy factory', () => {
  const load = vi.fn()
  ;(window as any).__ModuleLoader__ = { load }
  new Function('window', script)(window)
  expect(load).toHaveBeenCalledTimes(1)
  expect(load.mock.calls[0][0].id).toBe(id)
  expect(typeof load.mock.calls[0][0].factory).toBe('function')
  expect(document.querySelector('style[data-plugin]')).toBeNull()
})

it('materializes with the actual DSH module system, registers both seats, and cleans styles on unload', async () => {
  const registrationTarget: any = { mode: 'queue', pendingQueue: [] }
  ;(window as any).__ModuleLoader__ = registrationTarget
  const loader = new ClientModuleSystem({
    manifest: { rev: 'test', modules: [{ id, rev: 'test', url: '/client.js?rev=test', initialUrl: '/client.js?rev=test', inject: [], external: [] }], plugins: [] },
    staticModules: { react: React }, registrationTarget,
    bootstrapModule: { id: '@deepseek-ai/dsh-client-modules', exports: {} },
    loadBundle: async () => { new Function('window', script)(window) },
  })
  // jsdom has no Canvas backend; xterm accepts a missing 2D context.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  const plugin = await loader.import(id) as any
  expect(plugin.inject).toEqual(['slots', 'locale', 'configForms', 'layout'])
  expect(document.querySelector('style[data-plugin]')).toBeNull()
  const disposers: (() => void)[] = []
  const rows: any[] = []
  const context = {
    effect: (fn: () => unknown) => { const dispose = fn(); if (typeof dispose === 'function') disposers.push(dispose as () => void) },
    locale: { register: vi.fn(() => () => {}), bind: () => (key: string) => key },
    configForms: { describe: () => ({ subscribe: () => () => {}, getSnapshot: () => ({ view: { namespaces: [] } }) }) },
    get: () => undefined,
    slots: {
      inject: (_key: string, fn: () => () => void) => fn(),
      register: (options: any, component: any) => { const row = { options, component }; rows.push(row); return () => rows.splice(rows.indexOf(row), 1) },
    },
  }
  plugin.apply(context)
  expect(rows.map(row => row.options.name)).toEqual(['sidebar.panellist', 'main'])
  expect(rows[0].options.id).toBe(rows[1].options.key)
  expect(React.isValidElement(rows[0].component({ size: 16, active: false }))).toBe(true)
  expect(document.querySelector(`style[data-plugin="${id}"]`)?.textContent).toContain('background')
  for (const dispose of disposers.reverse()) dispose()
  expect(rows).toHaveLength(0)
  expect(document.querySelector('style[data-plugin]')).toBeNull()
})

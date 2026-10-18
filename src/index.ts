/**
 * dsh-close-all-tabs — host half.
 *
 * Client-only plugin: all behavior lives in `src/client/index.tsx` (the
 * right-Sidebar tab actions-menu item "关闭全部标签"). This host entry
 * exists so the package is a valid bundle-layer plugin — the loader needs a
 * loadable host entry for client-modules to serve the client bundle at
 * `/plugins/dsh-close-all-tabs/client.js`.
 *
 * @module dsh-close-all-tabs
 */

import type { Context } from '@deepseek-ai/cordis'

/** Plugin config: a single master switch for the menu item. */
export interface Config {
  /** Master switch for the "关闭全部标签" menu item. */
  enabled?: boolean
}

/** The host half needs no services; the client half declares its own injects. */
export const inject = [] as const

/** Host loader entry — nothing to do in the host process. */
export function apply(_ctx: Context, config?: Config): void {
  const enabled = config?.enabled ?? true
  if (!enabled) return
  // Client-only: all logic lives in lib/client.js. This entry only makes the
  // package a valid bundle-layer plugin so client-modules serves its bundle.
}

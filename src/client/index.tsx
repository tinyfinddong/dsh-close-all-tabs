/**
 * dsh-close-all-tabs — client entry.
 *
 * Adds a "关闭全部标签" item to every right-Sidebar tab's actions menu
 * (the `sidebar.right.tab.menu.item` list slot). Clicking it closes ALL
 * content tabs of the on-screen Session in one step, then dismisses the
 * menu. The kit keeps the sole docked guide open (its own close semantics).
 *
 * @module dsh-close-all-tabs/client
 */

import React from 'react'
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { SidebarRightTabMenuOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import { CSS_TAG, injectMenuItemStyles, styles } from './styles.ts'

/** One open right-Sidebar tab occurrence (inventory shape, structural). */
interface SidebarRightOpenTab {
  readonly sessionId: string
  readonly tabId: string
  readonly kind: string
  readonly contentId: string
}

interface CloseAllClientContext {
  sidebarRight: {
    openTabs: {
      getSnapshot(): readonly SidebarRightOpenTab[]
    }
    close(tabId: string): void
    mounted: {
      getSnapshot(): string | undefined
    }
  }
  slots: {
    register(
      options: { name: string; id: string; order?: number; label?: string | (() => string) },
      component: (owner: SidebarRightTabMenuOwnerProps) => React.ReactNode,
    ): () => void
  }
  effect(callback: () => unknown, label?: string): void
}

export const inject = ['sidebarRight', 'slots']

export function apply(input: ClientContext): void {
  const ctx = input as unknown as CloseAllClientContext

  // Inject the menu-item stylesheet once (idempotent; removed on dispose).
  ctx.effect(() => {
    injectMenuItemStyles()
    return () => {
      if (typeof document === 'undefined') return
      document.querySelector(`style[data-plugin-css="${CSS_TAG}"]`)?.remove()
    }
  }, 'dsh-close-all-tabs: menu item styles')

  ctx.effect(() => {
    const dispose = ctx.slots.register(
      {
        name: 'sidebar.right.tab.menu.item',
        id: 'close-all-tabs',
        order: 1000,
        label: () => '关闭全部标签',
      },
      (owner) => <CloseAllItem {...owner} sidebarRight={ctx.sidebarRight} />,
    )
    return dispose
  }, 'dsh-close-all-tabs: menu item')
}

/** One "close all tabs" menu item; closes every content tab of the session. */
function CloseAllItem(props: SidebarRightTabMenuOwnerProps & { sidebarRight: CloseAllClientContext['sidebarRight'] }): React.ReactElement {
  const { sidebarRight, dismiss } = props

  const onClick = (): void => {
    // Close every open content tab of the on-screen Session. The inventory
    // pairs sessionId+tabId; `close(tabId)` acts on the on-screen Session,
    // so filter to the mounted one to avoid cross-session no-ops.
    const sessionId = sidebarRight.mounted.getSnapshot()
    const tabs = sidebarRight.openTabs.getSnapshot()
    for (const tab of tabs) {
      if (sessionId === undefined || tab.sessionId === sessionId) {
        sidebarRight.close(tab.tabId)
      }
    }
    dismiss()
  }

  return (
    <button
      type="button"
      role="menuitem"
      className={styles.item}
      onClick={onClick}
    >
      关闭全部标签
    </button>
  )
}

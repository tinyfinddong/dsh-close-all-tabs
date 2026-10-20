/**
 * dsh-close-all-tabs — client entry.
 *
 * Adds a "关闭其他标签" item to every right-Sidebar tab's actions menu
 * (the `sidebar.right.tab.menu.item` list slot). Clicking it closes EVERY
 * content tab of the on-screen Session EXCEPT the tab whose menu is open,
 * then dismisses the menu. The kit keeps the sole docked guide open (its own
 * close semantics), so the guide survives regardless.
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
    inject(name: string, factory: () => () => void): () => void
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

  // Standard DSH slot-inject wrapper: binds the registration to the session
  // scope and disposes it when this plugin's scope leaves.
  ctx.effect(() => {
    const dispose = ctx.slots.inject('sidebar.right.tab.menu.item', () =>
      ctx.slots.register(
        {
          name: 'sidebar.right.tab.menu.item',
          id: 'close-all-tabs',
          order: 1000,
          label: () => '关闭其他标签',
        },
        (owner) => <CloseOtherItem {...owner} sidebarRight={ctx.sidebarRight} />,
      ),
    )
    return dispose
  }, 'dsh-close-all-tabs: menu item')
}

/** The guide tab's kind; the kit's own guide survives "close others". */
const GUIDE_KIND = '@deepseek-ai/dsh-client-ui-sidebar-right/guide'

/**
 * One "close other tabs" menu item; closes every content tab of the Session
 * except the tab this menu belongs to (the guide survives by the kit's own
 * close semantics, so it is skipped explicitly too).
 */
function CloseOtherItem(props: SidebarRightTabMenuOwnerProps & { sidebarRight: CloseAllClientContext['sidebarRight'] }): React.ReactElement {
  const { tab, sidebarRight, dismiss } = props

  const onClick = (): void => {
    // The menu's own tab is the one to KEEP: it is the tab the user opened
    // this menu on. Everything else in the on-screen Session closes.
    const sessionId = sidebarRight.mounted.getSnapshot()
    const currentTabId = tab.id
    const tabs = sidebarRight.openTabs.getSnapshot()
    for (const open of tabs) {
      if (sessionId !== undefined && open.sessionId !== sessionId) continue
      if (open.tabId === currentTabId) continue
      if (open.kind === GUIDE_KIND) continue
      sidebarRight.close(open.tabId)
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
      关闭其他标签
    </button>
  )
}

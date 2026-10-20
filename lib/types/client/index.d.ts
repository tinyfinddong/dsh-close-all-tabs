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
import type { Context as ClientContext } from '@deepseek-ai/cordis';
export declare const inject: string[];
export declare function apply(input: ClientContext): void;
//# sourceMappingURL=index.d.ts.map
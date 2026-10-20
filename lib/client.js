window.__ModuleLoader__.load({
	id: "dsh-close-all-tabs",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#endregion
require("react");
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/client/styles.ts
/**
* CloseOtherItem styles: self-injecting CSS for the "关闭其他标签" menu item.
*
* Matches the DSH menu-item look: full-width row, theme text token, and an
* interactive hover background that follows the host theme. The class is
* prefixed (`cat-*`) and the stylesheet is idempotently injected once, per
* the DSH client plugin convention (see dsh-browser-use/src/client/styles.ts).
*
* @module dsh-close-all-tabs/client/styles
*/
/** Stable tag identity; re-application is a no-op. */
const CSS_TAG = "dsh-close-all-tabs/menu-item.css";
/** Class-name map. */
const styles = { item: "cat-menu-item" };
/** The stylesheet text. */
const CSS = `
.cat-menu-item{display:flex;align-items:center;gap:8px;width:100%;box-sizing:border-box;padding:3px 6px;border:0;border-radius:10px;background:transparent;color:var(--dsw-alias-label-primary,inherit);font:inherit;font-size:13px;line-height:1.4;text-align:left;cursor:pointer}
.cat-menu-item:hover{background:rgba(128,128,128,.12)}
.cat-menu-item:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:-2px}
.cat-menu-item:active{background:rgba(128,128,128,.2)}
`;
/** Inject the stylesheet once; safe to call from any module. */
function injectMenuItemStyles() {
	if (typeof document === "undefined") return;
	if (document.querySelector(`style[data-plugin-css="dsh-close-all-tabs/menu-item.css"]`) !== null) return;
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-close-all-tabs";
	tag.dataset.pluginCss = CSS_TAG;
	tag.textContent = CSS;
	document.head?.appendChild(tag);
}
//#endregion
//#region src/client/index.tsx
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
const inject = ["sidebarRight", "slots"];
function apply(input) {
	const ctx = input;
	ctx.effect(() => {
		injectMenuItemStyles();
		return () => {
			if (typeof document === "undefined") return;
			document.querySelector(`style[data-plugin-css="${CSS_TAG}"]`)?.remove();
		};
	}, "dsh-close-all-tabs: menu item styles");
	ctx.effect(() => {
		return ctx.slots.inject("sidebar.right.tab.menu.item", () => ctx.slots.register({
			name: "sidebar.right.tab.menu.item",
			id: "close-all-tabs",
			order: 1e3,
			label: () => "关闭其他标签"
		}, (owner) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CloseOtherItem, {
			...owner,
			sidebarRight: ctx.sidebarRight
		})));
	}, "dsh-close-all-tabs: menu item");
}
/** The guide tab's kind; the kit's own guide survives "close others". */
const GUIDE_KIND = "@deepseek-ai/dsh-client-ui-sidebar-right/guide";
/**
* One "close other tabs" menu item; closes every content tab of the Session
* except the tab this menu belongs to (the guide survives by the kit's own
* close semantics, so it is skipped explicitly too).
*/
function CloseOtherItem(props) {
	const { tab, sidebarRight, dismiss } = props;
	const onClick = () => {
		const sessionId = sidebarRight.mounted.getSnapshot();
		const currentTabId = tab.id;
		const tabs = sidebarRight.openTabs.getSnapshot();
		for (const open of tabs) {
			if (sessionId !== void 0 && open.sessionId !== sessionId) continue;
			if (open.tabId === currentTabId) continue;
			if (open.kind === GUIDE_KIND) continue;
			sidebarRight.close(open.tabId);
		}
		dismiss();
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
		type: "button",
		role: "menuitem",
		className: styles.item,
		onClick,
		children: "关闭其他标签"
	});
}
//#endregion
exports.apply = apply;
exports.inject = inject;

	return module.exports;
	}
});
//# sourceMappingURL=client.js.map
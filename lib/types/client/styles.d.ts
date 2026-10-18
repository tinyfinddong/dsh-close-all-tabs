/**
 * CloseAllItem styles: self-injecting CSS for the "关闭全部标签" menu item.
 *
 * Matches the DSH menu-item look: full-width row, theme text token, and an
 * interactive hover background that follows the host theme. The class is
 * prefixed (`cat-*`) and the stylesheet is idempotently injected once, per
 * the DSH client plugin convention (see dsh-browser-use/src/client/styles.ts).
 *
 * @module dsh-close-all-tabs/client/styles
 */
/** Stable tag identity; re-application is a no-op. */
export declare const CSS_TAG = "dsh-close-all-tabs/menu-item.css";
/** Class-name map. */
export declare const styles: {
    readonly item: "cat-menu-item";
};
/** The stylesheet text. */
export declare const CSS = "\n.cat-menu-item{display:flex;align-items:center;gap:8px;width:100%;box-sizing:border-box;padding:3px 6px;border:0;border-radius:10px;background:transparent;color:var(--dsw-alias-label-primary,inherit);font:inherit;font-size:13px;line-height:1.4;text-align:left;cursor:pointer}\n.cat-menu-item:hover{background:rgba(128,128,128,.12)}\n.cat-menu-item:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,currentColor);outline-offset:-2px}\n.cat-menu-item:active{background:rgba(128,128,128,.2)}\n";
/** Inject the stylesheet once; safe to call from any module. */
export declare function injectMenuItemStyles(): void;
//# sourceMappingURL=styles.d.ts.map
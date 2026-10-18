//#region src/index.ts
/** The host half needs no services; the client half declares its own injects. */
const inject = [];
/** Host loader entry — nothing to do in the host process. */
function apply(_ctx, config) {
	if (!(config?.enabled ?? true)) return;
}
//#endregion
export { apply, inject };

//# sourceMappingURL=index.js.map
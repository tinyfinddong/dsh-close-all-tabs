import { defineConfig } from 'tsdown'

/**
 * Client-half build: CJS + the DSH ModuleLoader wrapper.
 *
 * The web boot loads client bundles as classic scripts and expects the
 * `window.__ModuleLoader__.load({ id, factory: (require) => {...} })` shape
 * (the exact format every shipped DSH client bundle uses). rolldown's CJS
 * output provides the `factory(require)` body; the banner and footer wrap it
 * in the ModuleLoader call.
 */
const MODULE_LOADER_ID = 'dsh-close-all-tabs'

export default defineConfig({
  entry: {
    client: 'src/client/index.tsx',
  },
  format: ['cjs'],
  target: 'node22',
  outDir: 'lib',
  clean: false,
  sourcemap: true,
  fixedExtension: true,
  banner: `window.__ModuleLoader__.load({\n\tid: ${JSON.stringify(MODULE_LOADER_ID)},\n\tfactory: (require) => {\n\t\tvar module = { exports: {} };\n\t\tvar exports = module.exports;`,
  footer: `\treturn module.exports;\n\t}\n});`,
  deps: {
    neverBundle: [/^@deepseek-ai\//, /^react($|\/)/, /^react-dom($|\/)/],
  },
})

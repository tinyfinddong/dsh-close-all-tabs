import { defineConfig } from 'tsdown'

/**
 * dsh-close-all-tabs host build (`lib/index.js`, ESM).
 *
 * The client half (`lib/client.js`, CJS wrapped in the DSH ModuleLoader
 * factory format) is built separately by tsdown.client.config.ts.
 *
 * Framework packages (`@deepseek-ai/*`, `react`, `react-dom`) stay external:
 * the Host resolves them from its own runtime and the web client resolves them
 * through the ModuleLoader at boot.
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['es'],
  target: 'node22',
  outDir: 'lib',
  clean: false,
  sourcemap: true,
  // This package is `type: module`, so ESM output keeps the `.js` extension.
  fixedExtension: false,
  // tsdown emits the JS; tsc -b tsconfig.build.json emits the declaration tree
  // into lib/types. Keep dts off here to avoid a second, diverging dts pass.
  dts: false,
  deps: {
    neverBundle: [/^@deepseek-ai\//, /^react($|\/)/, /^react-dom($|\/)/],
  },
})

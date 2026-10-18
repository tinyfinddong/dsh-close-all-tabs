/**
 * Finalize the client build: `lib/client.cjs` -> `lib/client.js`.
 *
 * The web boot serves the client bundle at `/plugins/dsh-browser-use/client.js`
 * as a classic script; the file's content is the ModuleLoader factory (CJS
 * body), so the `.js` extension matches the exports map in package.json while
 * the content stays script-loadable. Source maps are updated to point at the
 * renamed file; the tsdown-emitted `.d.cts` stub is removed (declarations come
 * from `lib/types`).
 *
 * @module scripts/finalize-client
 */

import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const lib = join(root, 'lib')
const source = join(lib, 'client.cjs')
const target = join(lib, 'client.js')
const mapSource = source + '.map'
const mapTarget = target + '.map'
const dtsStub = join(lib, 'client.d.cts')

if (!existsSync(source)) {
  console.error('[finalize-client] missing lib/client.cjs — did the client build run?')
  process.exit(1)
}

// Rewrite the sourcemap's sources/names to the new file name.
if (existsSync(mapSource)) {
  const map = JSON.parse(readFileSync(mapSource, 'utf8'))
  for (const file of map.sources ?? []) {
    if (file.endsWith('.cjs')) map.sources[map.sources.indexOf(file)] = file.slice(0, -4) + '.js'
  }
  writeFileSync(mapSource, JSON.stringify(map))
}

// Fix the in-file sourceMappingURL comment to point at the renamed map.
{
  const js = readFileSync(source, 'utf8')
  const fixed = js.replace(/sourceMappingURL=client\.cjs\.map$/, 'sourceMappingURL=client.js.map')
  if (fixed !== js) writeFileSync(source, fixed)
}

renameSync(source, target)
if (existsSync(mapSource)) renameSync(mapSource, mapTarget)
if (existsSync(dtsStub)) rmSync(dtsStub)

console.log('[finalize-client] lib/client.cjs -> lib/client.js')

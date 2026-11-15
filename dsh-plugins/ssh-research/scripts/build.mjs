import { build } from 'esbuild';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
await mkdir('lib', { recursive: true });
const host = await build({ metafile: true, entryPoints: ['src/index.ts'], outfile: 'lib/index.js', bundle: true, platform: 'node', format: 'esm', external: ['cpu-features', '*.node'], banner: { js: "/* Modified for sporeking/dsh-ssh-research; see README.md and LICENSE. */\nimport { createRequire as _createRequire } from 'node:module'; import { fileURLToPath as _fileURLToPath } from 'node:url'; import { dirname as _dirname } from 'node:path'; const require = _createRequire(import.meta.url); const __filename = _fileURLToPath(import.meta.url); const __dirname = _dirname(__filename);" }, target: 'node24', sourcemap: true });
const result = await build({ metafile: true, entryPoints: ['src/client/index.ts'], outfile: 'lib/client.js', bundle: true, platform: 'browser', format: 'cjs', target: 'es2022', jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment', external: ['react', 'react/*', 'react-dom', 'react-dom/*', '@deepseek-ai/*'], loader: { '.css': 'local-css' }, write: false, sourcemap: true });
const css = result.outputFiles.find(file => file.path.endsWith('.css'))?.text ?? '';
const client = result.outputFiles.find(file => file.path.endsWith('/client.js')).text;
const packageId = JSON.parse(await readFile('package.json', 'utf8')).name;
// DSH loads classic scripts, then materializes their lazy CommonJS factories.
// React is the shell singleton; source modules must not import a second runtime.
const registeredClient = `/* Modified for sporeking/dsh-ssh-research; see README.md and LICENSE. */
window.__ModuleLoader__.load({
  id: ${JSON.stringify(packageId)},
  factory(require) {
    const module = { exports: {} };
    const exports = module.exports;
    const React = require('react');
${client}
    const plugin = module.exports;
    return { ...plugin, apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement('style');
        style.setAttribute('data-plugin', ${JSON.stringify(packageId)});
        style.textContent = ${JSON.stringify(css)};
        document.head.append(style);
        return () => style.remove();
      }, 'ssh-research: styles');
      return plugin.apply(ctx);
    } };
  }
});\n`;
await writeFile('lib/client.js', registeredClient);
for (const file of result.outputFiles) if (file.path.endsWith('/client.js.map')) await writeFile(file.path, file.contents);
const roots = new Set();
for (const input of [...Object.keys(host.metafile.inputs), ...Object.keys(result.metafile.inputs)]) {
  const found = input.match(/^(.*node_modules\/(?:@[^/]+\/)?[^/]+)\//);
  if (found) roots.add(found[1]);
}
let notices = '# Bundled third-party licenses\n\nGenerated from the exact build inputs. Optional native accelerators are not bundled.\n';
for (const root of [...roots].sort()) {
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  notices += `\n## ${manifest.name} ${manifest.version} (${manifest.license ?? 'see license'})\n\n`;
  for (const name of await readdir(root)) if (/^(licen[sc]e|copying|notice)(\.|$)/i.test(name)) {
    try { notices += await readFile(join(root, name), 'utf8') + '\n'; } catch {}
  }
}
await writeFile('THIRD-PARTY-LICENSES.txt', notices.trimEnd() + '\n');
console.log('Built SSH host and client bundles.');

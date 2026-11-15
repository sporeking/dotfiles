// Development only: reuse the SDK of the installed DSH without modifying it.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, symlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const globalRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
const candidates = process.env.DSH_PLUGIN_SDK_ROOT
  ? [process.env.DSH_PLUGIN_SDK_ROOT]
  : [join(globalRoot, '@deepseek-ai/dsh'), '/usr/lib/node_modules/@deepseek-ai/dsh', '/usr/local/lib/node_modules/@deepseek-ai/dsh'];
const sdkRoot = candidates.find(candidate => existsSync(join(candidate, 'node_modules/@deepseek-ai')));
if (!sdkRoot) throw new Error('Installed DSH SDK not found; set DSH_PLUGIN_SDK_ROOT to the DSH package directory.');
const sdkScope = join(sdkRoot, 'node_modules/@deepseek-ai');
const localScope = join(packageRoot, 'node_modules/@deepseek-ai');
mkdirSync(localScope, { recursive: true });
let count = 0;
for (const name of readdirSync(sdkScope)) {
  const destination = join(localScope, name);
  if (existsSync(destination)) continue;
  symlinkSync(join(sdkScope, name), destination, 'dir');
  count += 1;
}
console.log(`Linked ${count} installed DSH SDK packages for local development.`);

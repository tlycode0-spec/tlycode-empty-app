#!/usr/bin/env node
// Vite lib mode does not emit manifest.json. The hosting deploy script
// expects dist/.vite/manifest.json with an isEntry record.
// This script lists dist/ after `vite build` and writes a minimal manifest.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
    console.error('postbuild: dist/ not found — run vite build first');
    process.exit(1);
}

const files = fs.readdirSync(dist).filter(f => fs.statSync(path.join(dist, f)).isFile());
const jsFiles = files.filter(f => f.endsWith('.js'));
const cssFiles = files.filter(f => f.endsWith('.css'));

if (jsFiles.length === 0) {
    console.error('postbuild: no .js bundle found in dist/');
    process.exit(1);
}

const entry = jsFiles.sort((a, b) => a.length - b.length)[0];

const manifest = {
    'src/main.tsx': {
        file: entry,
        isEntry: true,
        css: cssFiles,
    },
};

const viteDir = path.join(dist, '.vite');
fs.mkdirSync(viteDir, { recursive: true });
fs.writeFileSync(path.join(viteDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(`postbuild: manifest.json written (entry=${entry}, css=[${cssFiles.join(', ')}])`);

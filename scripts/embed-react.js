#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = process.argv[2] || path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'react-app', 'dist');
const outFile = path.join(projectRoot, 'src', 'react-bundle-content.ts');

const files = fs.readdirSync(distDir);
const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

if (!jsFile) {
    console.error('No .js file found in react-app/dist/');
    process.exit(1);
}

const js = fs.readFileSync(path.join(distDir, jsFile), 'utf8');
const css = cssFile ? fs.readFileSync(path.join(distDir, cssFile), 'utf8') : '';

function escapeTemplateLiteral(str) {
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

const out = `export const REACT_JS = \`${escapeTemplateLiteral(js)}\`;\nexport const REACT_CSS = \`${escapeTemplateLiteral(css)}\`;\n`;
fs.writeFileSync(outFile, out);
console.log(`Embedded React bundle into ${outFile}`);

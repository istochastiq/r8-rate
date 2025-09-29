import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const out = resolve(process.cwd(), 'dist/whitepaper.pdf');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, 'PDF STUB - replace with LaTeX build');
console.log('whitepaper built to', out);



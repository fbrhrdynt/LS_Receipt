#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const pages = [
  {
    url: '/',
    title: 'Receipt Generator',
    description: 'Create, preview, export, and print receipts directly from your browser.',
  },
  {
    url: '/generator',
    title: 'Receipt Generator',
    description: 'Enter transaction data, choose a React or Classic template, and export or print the receipt.',
  },
  {
    url: '/history',
    title: 'Receipt History',
    description: 'Search, open, duplicate, print, and delete receipts stored in this browser.',
  },
];

const content = [
  '## Pages',
  ...pages.map((page) => `- [${page.title}](${page.url}): ${page.description}`),
  '',
].join('\n');

const outputPath = path.join(process.cwd(), 'public', 'llms.txt');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content, 'utf8');

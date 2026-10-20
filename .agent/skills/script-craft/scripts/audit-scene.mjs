#!/usr/bin/env node

import fs from 'node:fs';

const args = process.argv.slice(2);
const strictTemplate = args.includes('--strict-template');
const files = args.filter((arg) => arg !== '--strict-template');
if (files.length === 0) {
  console.error('Usage: node audit-scene.mjs <scene.md> [...]');
  process.exit(2);
}

const required = [
  ['## 1. Ý định', /## 1\. Ý định/],
  ['## 2. Open loop', /## 2\. Open loop/],
  ['## 3. Nhịp', /## 3\. Nhịp/],
  ['## 4. Lời dẫn bản TTS', /## 4\. Lời dẫn bản TTS/],
  ['## 5. Nguồn', /## 5\. (?:Nguồn|Bảng nguồn)/],
  ['## 6. Asset', /## 6\. Asset/],
  ['## 7. Tự phản biện', /## 7\. Tự phản biện/],
];
if (strictTemplate) required.push(['## 8. Cổng duyệt', /## 8\. Cổng duyệt/]);
const redFlags = [
  'hoàn toàn',
  'duy nhất',
  'không bao giờ',
  'lần đầu tiên',
  'nhất lịch sử',
  'toàn bộ',
];

let failed = false;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const section = text.match(/## 4\. Lời dẫn bản TTS[^\n]*\n([\s\S]*?)(?=\n## 5\.)/);
  const narration = (section?.[1] ?? '')
    .split('\n')
    .filter((line) => line.trimStart().startsWith('>'))
    .map((line) => line.replace(/^\s*>\s?/, ''))
    .join(' ')
    .replace(/\[F[^\]]+\]/g, ' ')
    .replace(/[“”"'`*_()[\]{}.,!?;:—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const units = narration ? narration.split(' ').length : 0;
  const claimed = text.match(/\*\*(?:Đơn vị đọc|Tổng số âm tiết):\*\*\s*([0-9]+)/)?.[1];
  const missing = required
    .filter(([, pattern]) => !pattern.test(text))
    .map(([heading]) => heading);
  const flags = redFlags.filter((flag) => text.toLowerCase().includes(flag));
  const refs = [...text.matchAll(/\[F\d+(?:\s*,\s*F\d+)*\]/g)].length;
  const mismatch = claimed !== undefined && Number(claimed) !== units;
  if (missing.length || units === 0 || mismatch) failed = true;
  console.log(JSON.stringify({
    file,
    units,
    claimed: claimed === undefined ? null : Number(claimed),
    countMatches: claimed === undefined ? null : !mismatch,
    fxxReferences: refs,
    missingHeadings: missing,
    redFlagPhrases: flags,
  }));
}

process.exit(failed ? 1 : 0);

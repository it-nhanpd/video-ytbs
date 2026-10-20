// Đổi tên ảnh từ thư mục Task_* (G-labs, đánh số theo thứ tự prompt) sang tên chuẩn trong inbox/.
// Dùng: node tools/rename-batch.mjs <project> <file-prompt> <thư-mục-task> [--move]
//   vd: node tools/rename-batch.mjs german-army-uniforms 3-sheets-walk.txt Task_024155_10172026
// Tên chuẩn lấy từ prompts/g-labs/index-12pose.csv (cột "lưu ảnh với tên"); số đầu tên file = số thứ tự prompt.
import fs from 'node:fs';
import path from 'node:path';

const [proj, promptFile, taskArg, flag] = process.argv.slice(2);
if (!proj || !promptFile || !taskArg) {
  console.error('Dùng: node tools/rename-batch.mjs <project> <file-prompt.txt> <thư-mục-task> [--move]');
  process.exit(1);
}
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const pdir = path.join(root, 'content', 'projects', fs.readdirSync(path.join(root, 'content', 'projects')).find((d) => d === proj || d.endsWith(`-${proj}`)));
const inbox = path.join(pdir, 'inbox');
const taskDir = fs.existsSync(taskArg) ? taskArg : path.join(inbox, taskArg);

const csv = fs.readFileSync(path.join(pdir, 'prompts', 'g-labs', 'index-12pose.csv'), 'utf8').replace(/^﻿/, '').split(/\r?\n/).slice(1).filter(Boolean);
const rows = csv.map((l) => [...l.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"'))).filter((r) => r[0] === promptFile);
const stemOf = new Map(rows.map((r) => [Number(r[1]), r[2]]));
if (!stemOf.size) {
  console.error(`index-12pose.csv không có dòng nào cho ${promptFile}`);
  process.exit(1);
}

const files = fs.readdirSync(taskDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const used = new Set();
let n = 0;
for (const f of files) {
  const num = Number(f.match(/^(\d+)_/)?.[1]);
  const stem = stemOf.get(num);
  if (!stem) {
    console.log(`? bỏ qua ${f} (số ${num} không có trong ${promptFile})`);
    continue;
  }
  const ext = path.extname(f).toLowerCase();
  const dest = path.join(inbox, stem + ext);
  for (const e of ['.png', '.jpg', '.jpeg', '.webp']) if (e !== ext && fs.existsSync(path.join(inbox, stem + e))) fs.rmSync(path.join(inbox, stem + e)); // tránh bản cũ khác đuôi thắng vì "mới nhất"
  if (flag === '--move') fs.renameSync(path.join(taskDir, f), dest);
  else fs.copyFileSync(path.join(taskDir, f), dest);
  used.add(num);
  n++;
}
const missing = [...stemOf.keys()].filter((k) => !used.has(k)).map((k) => `${k}:${stemOf.get(k)}`);
console.log(`✓ ${n} ảnh → inbox/ (${flag === '--move' ? 'di chuyển' : 'sao chép'}).`);
if (missing.length) console.log(`⚠ thiếu ${missing.length}: ${missing.join(', ')}`);

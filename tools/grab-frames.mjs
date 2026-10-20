// Trích khung hình từ video tham chiếu để phân tích style (skill style-capture).
// Dùng: node tools/grab-frames.mjs --video <file.mp4> --out <thư-mục> [--every 20] [--from 0] [--to <giây>] [--width 640] [--sheet 4x4]
//       node tools/grab-frames.mjs --video f.mp4 --out dir --at 62,63,64.5 [--width 640]
// Ghi dir/f_<giây>.png và dir/sheet_NN.png (ảnh ghép có đánh số giây ở tên file). Chỉ ghi vào --out.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const video = opt('video');
const out = opt('out');
if (!video || !out || !fs.existsSync(video)) {
  console.error('Dùng: node tools/grab-frames.mjs --video <file.mp4> --out <thư-mục> [--every 20 | --at 62,63] [--from 0] [--to s] [--width 640] [--sheet 4x4]');
  process.exit(1);
}
const width = Number(opt('width', '640'));
const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString());
fs.mkdirSync(out, {recursive: true});
const at = opt('at')
  ? opt('at').split(',').map(Number)
  : (() => {
      const every = Number(opt('every', '20'));
      const from = Number(opt('from', '0'));
      const to = Number(opt('to', String(dur)));
      const list = [];
      for (let t = from; t < Math.min(to, dur); t += every) list.push(t);
      return list;
    })();

const files = [];
for (const t of at) {
  const f = path.join(out, `f_${String(Math.round(t * 10) / 10).padStart(6, '0')}.png`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', video, '-frames:v', '1', '-vf', `scale=${width}:-1`, f]);
  files.push(f);
}
console.log(`✓ ${files.length} khung → ${out} (video ${dur.toFixed(1)} s)`);

const [cols, rows] = opt('sheet', '4x4').split('x').map(Number);
const per = cols * rows;
for (let i = 0; i * per < files.length; i++) {
  const chunk = files.slice(i * per, (i + 1) * per);
  const list = path.join(out, `.list_${i}.txt`);
  fs.writeFileSync(list, chunk.map((f) => `file '${path.resolve(f).replace(/\\/g, '/')}'\nduration 1`).join('\n') + '\n');
  const sheet = path.join(out, `sheet_${String(i + 1).padStart(2, '0')}.png`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-vf', `fps=1,scale=${Math.round(width / 2)}:-1,tile=${cols}x${rows}`, '-frames:v', '1', sheet]);
  fs.rmSync(list);
  console.log(`  ${sheet}: ${chunk.map((f) => path.basename(f, '.png').slice(2)).join(' ')}`);
}

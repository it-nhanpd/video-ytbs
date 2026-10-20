// Tool tạo các file mẫu so sánh giọng đọc: Raw vs Tra Án (Crime) vs CDTeam (History) vs Dòng Máu Việt (Heroic)
// Dùng: node tools/synth-voice-demo.mjs ["Văn bản mẫu tùy chọn"] [--out dir]
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const outDir = args.find((a, i) => args[i - 1] === '--out') ?? path.join(root, 'content/library/audio-demos');
fs.mkdirSync(outDir, {recursive: true});

const defaultText = args.find((a) => !a.startsWith('--')) ?? 
  'Khi nhắc đến những vụ án bí ẩn nổi tiếng nhất lịch sử nước Mỹ, chắc chắn có hai cái tên mà chúng ta không thể nào không nhắc tới. Đó chính là vụ án Hoa Thược Dược Đen và vụ án sát nhân Zodiac.';

const DEMOS = [
  {
    name: '01_raw_edge_tts.mp3',
    title: 'Gốc (Edge-TTS Mộc - Chưa xử lý âm thanh)',
    pitch: '+0Hz',
    rate: '+0%',
    filter: null,
  },
  {
    name: '02_tra_an_crime_style.mp3',
    title: 'Phong cách Tra Án (Crime: Trầm sâu, nén chặt, lạnh lùng)',
    pitch: '-2Hz',
    rate: '-4%',
    filter: 'highpass=f=70,equalizer=f=120:width_type=o:width=1.2:g=4.0,equalizer=f=900:width_type=o:width=1.0:g=-2.5,equalizer=f=3200:width_type=o:width=1.0:g=2.5,acompressor=threshold=-18dB:ratio=3.5:attack=15:release=200:makeup=2.5dB,loudnorm=I=-16:TP=-1.5:LRA=10',
  },
  {
    name: '03_cdteam_history_style.mp3',
    title: 'Phong cách CDTeam Sử Ký (Cinematic Baritone: Siêu trầm, ấm áp, điện ảnh)',
    pitch: '-3Hz',
    rate: '-2%',
    filter: 'highpass=f=60,equalizer=f=110:width_type=o:width=1.0:g=4.5,equalizer=f=800:width_type=o:width=1.0:g=-2.0,equalizer=f=3500:width_type=o:width=1.0:g=2.0,equalizer=f=10000:width_type=o:width=1.2:g=2.0,acompressor=threshold=-20dB:ratio=3:attack=25:release=300:makeup=2dB,loudnorm=I=-16:TP=-1.5:LRA=11',
  },
  {
    name: '04_dong_mau_viet_heroic_style.mp3',
    title: 'Phong cách Dòng Máu Việt (Heroic / Fast: Nhanh, đanh thép, dồn dập)',
    pitch: '+0Hz',
    rate: '+10%',
    filter: 'highpass=f=80,equalizer=f=150:width_type=o:width=1.0:g=2.0,equalizer=f=1000:width_type=o:width=1.0:g=-1.5,equalizer=f=3000:width_type=o:width=1.0:g=3.5,equalizer=f=5000:width_type=o:width=1.0:g=2.0,acompressor=threshold=-16dB:ratio=4:attack=10:release=150:makeup=3dB,loudnorm=I=-15:TP=-1.5:LRA=9',
  },
];

console.log('=== KHỞI TẠO BỘ DEMO GIỌNG ĐỌC AI MIỄN PHÍ ===');
console.log(`Văn bản: "${defaultText}"\nThư mục đích: ${outDir}\n`);

for (const demo of DEMOS) {
  const finalPath = path.join(outDir, demo.name);
  const rawTmp = `${finalPath}.raw.tmp.mp3`;

  process.stdout.write(`Đang sinh: ${demo.title}... `);
  execFileSync('python', [
    '-m', 'edge_tts',
    '--voice', 'vi-VN-NamMinhNeural',
    `--rate=${demo.rate}`,
    `--pitch=${demo.pitch}`,
    '--text', defaultText,
    '--write-media', rawTmp,
  ], {stdio: 'ignore'});

  if (demo.filter) {
    execFileSync('ffmpeg', ['-y', '-i', rawTmp, '-af', demo.filter, finalPath], {stdio: 'ignore'});
    if (fs.existsSync(rawTmp)) fs.unlinkSync(rawTmp);
  } else {
    fs.renameSync(rawTmp, finalPath);
  }

  const dur = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', finalPath]).toString().trim();
  const size = fs.statSync(finalPath).size;
  console.log(`XONG! (${dur}s, ${(size / 1024).toFixed(1)} KB)`);
}

console.log('\nHoàn tất 100%! Toàn bộ 4 file đã sẵn sàng trong:');
console.log(outDir);


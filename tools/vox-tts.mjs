// Dùng: node tools/vox-tts.mjs <project> [--vox vox.json] [--locale vi] [--voice vi-VN-NamMinhNeural] [--rate -4%] [--pitch -2Hz] [--preset crime|history|heroic|none] [--only s01,s02] [--force]
//        [--provider vbee --voice <voiceCode> --speed 1.0]  (xem khối Vbee bên dưới)
//        [--provider f5 --url <gradio_url> --voice mc_vantung --speed 1.0] (xem khối F5-TTS bên dưới)
//   - Tên nước ngoài đọc theo bảng phiên âm `tts` trong content/projects/<p>/vox.json (chữ trên màn hình giữ nguyên).
//   - Ghi assets/audio/<id>.mp3 và assets/audio/timing.json (giây, đo bằng ffprobe).
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {Client, handle_file} from '@gradio/client';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const project = args[0];
if (!project) {
  console.error('Dùng: node tools/vox-tts.mjs <project> [--locale vi] [--voice ...] [--rate -4%] [--pitch -2Hz] [--preset crime|history|heroic] [--only s01,s02] [--force]');
  process.exit(1);
}
const dir = path.join(root, 'content/projects', project);
const locale = JSON.parse(fs.readFileSync(path.join(dir, 'locales', `${opt('locale', 'vi')}.json`), 'utf8'));
const vox = JSON.parse(fs.readFileSync(path.join(dir, opt('vox', 'vox.json')), 'utf8'));

// Presets audio mastering (xử lý EQ, nén compressor, chuẩn hóa âm lượng YouTube -16 LUFS bằng ffmpeg)
const PRESETS = {
  crime: {
    pitch: '-2Hz',
    rate: '-4%',
    filter: 'highpass=f=70,equalizer=f=120:width_type=o:width=1.2:g=4.0,equalizer=f=900:width_type=o:width=1.0:g=-2.5,equalizer=f=3200:width_type=o:width=1.0:g=2.5,acompressor=threshold=-18dB:ratio=3.5:attack=15:release=200:makeup=2.5dB,loudnorm=I=-16:TP=-1.5:LRA=10',
  },
  history: {
    pitch: '-3Hz',
    rate: '-2%',
    filter: 'highpass=f=60,equalizer=f=110:width_type=o:width=1.0:g=4.5,equalizer=f=800:width_type=o:width=1.0:g=-2.0,equalizer=f=3500:width_type=o:width=1.0:g=2.0,equalizer=f=10000:width_type=o:width=1.2:g=2.0,acompressor=threshold=-20dB:ratio=3:attack=25:release=300:makeup=2dB,loudnorm=I=-16:TP=-1.5:LRA=11',
  },
  heroic: {
    pitch: '+0Hz',
    rate: '+10%',
    filter: 'highpass=f=80,equalizer=f=150:width_type=o:width=1.0:g=2.0,equalizer=f=1000:width_type=o:width=1.0:g=-1.5,equalizer=f=3000:width_type=o:width=1.0:g=3.5,equalizer=f=5000:width_type=o:width=1.0:g=2.0,acompressor=threshold=-16dB:ratio=4:attack=10:release=150:makeup=3dB,loudnorm=I=-15:TP=-1.5:LRA=9',
  },
  fast: {
    pitch: '+0Hz',
    rate: '+8%',
    filter: 'highpass=f=80,equalizer=f=150:width_type=o:width=1.0:g=2.0,equalizer=f=1000:width_type=o:width=1.0:g=-1.5,equalizer=f=3000:width_type=o:width=1.0:g=3.5,acompressor=threshold=-16dB:ratio=3.5:attack=10:release=150:makeup=2.5dB,loudnorm=I=-15:TP=-1.5:LRA=9',
  },
};

const presetName = opt('preset', vox.preset ?? 'none');
const preset = PRESETS[presetName];

const voice = opt('voice', vox.voice ?? 'vi-VN-NamMinhNeural');
const rate = opt('rate', vox.rate ?? preset?.rate ?? '+0%');
const pitch = opt('pitch', vox.pitch ?? preset?.pitch ?? '+0Hz');
const only = opt('only')?.split(',');
const force = args.includes('--force');

// Nhà cung cấp giọng: edge (mặc định, miễn phí) hoặc vbee (Realtime API, mỗi câu ≤ 300 ký tự, tốn credit Vbee).
//   --provider vbee --voice <voiceCode> [--speed 1.0]   hoặc đặt "provider", "vbeeVoice", "vbeeSpeed" trong vox.json.
//   Khóa đọc từ biến môi trường hoặc .env ở gốc repo: VBEE_APP_ID, VBEE_TOKEN (không in ra, không ghi vào repo).
const provider = opt('provider', vox.provider ?? 'edge');
const vbeeVoice = opt('voice', vox.vbeeVoice);
const vbeeSpeed = Number(opt('speed', vox.vbeeSpeed ?? 1));
const envVal = (name) => {
  if (process.env[name]) return process.env[name];
  const f = path.join(root, '.env');
  if (!fs.existsSync(f)) return undefined;
  return fs.readFileSync(f, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '');
};
async function vbeeSynth(text, out) {
  const appId = envVal('VBEE_APP_ID');
  const token = envVal('VBEE_TOKEN');
  if (!appId || !token) throw new Error('Thiếu VBEE_APP_ID / VBEE_TOKEN (biến môi trường hoặc .env ở gốc repo).');
  if (!vbeeVoice) throw new Error('Thiếu --voice <voiceCode> (hoặc "vbeeVoice" trong vox.json) cho Vbee.');
  if (text.length > 300) throw new Error(`Câu dài ${text.length} ký tự, Vbee Realtime chỉ nhận tối đa 300: tách câu.`);
  const res = await fetch('https://api.vbee.vn/v1/tts', {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'App-Id': appId, 'Content-Type': 'application/json'},
    body: JSON.stringify({text, mode: 'sync', voiceCode: vbeeVoice, outputFormat: 'mp3', bitrate: 128, speed: vbeeSpeed}),
  });
  const buf = Buffer.from(await res.arrayBuffer());
  if (!res.ok || (buf[0] === 0x7b && buf.toString('utf8', 0, 200).includes('"error"'))) {
    throw new Error(`Vbee lỗi (HTTP ${res.status}): ${buf.toString('utf8', 0, 300)}`);
  }
  fs.writeFileSync(out, buf);
}

// Khối F5-TTS Cloud GPU Server (Chạy trực tiếp qua public link Gradio/FastAPI của Google Colab)
//   --provider f5 --url https://xxxx.gradio.live [--voice mc_vantung] [--speed 1.0]
const f5Url = opt('url', vox.f5Url ?? envVal('F5_COLAB_URL'))?.replace(/\/+$/, '');
const f5Speed = Number(opt('speed', vox.f5Speed ?? 1.0));
let gradioApp = null;
let gradioRefFile = null;
let gradioRefText = '';

async function f5Synth(text, out) {
  if (!f5Url) throw new Error('Thiếu --url <link_colab_gradio> (hoặc "f5Url" trong vox.json / F5_COLAB_URL trong .env).');
  const voiceName = opt('voice', vox.voice ?? 'mc_vantung');
  const voiceDir = path.join(root, 'content/library/voice-clones', voiceName);

  if (!gradioApp) {
    process.stdout.write(`Đang kết nối tới Colab GPU (${f5Url})... `);
    gradioApp = await Client.connect(f5Url);
    console.log('✅ Đã kết nối!');

    const refWav = path.join(voiceDir, 'reference.wav');
    const refTxt = path.join(voiceDir, 'reference.txt');
    if (!fs.existsSync(refWav)) throw new Error(`Không tìm thấy file mẫu: ${refWav}`);
    
    const refBytes = fs.readFileSync(refWav);
    const refBlob = new Blob([refBytes], {type: 'audio/wav'});
    gradioRefFile = handle_file(refBlob);
    if (fs.existsSync(refTxt)) gradioRefText = fs.readFileSync(refTxt, 'utf8').trim();
  }

  const result = await gradioApp.predict('/infer_tts', [
    gradioRefFile,
    text,
    gradioRefText,
    f5Speed,
  ]);

  const audioData = result.data[0];
  const audioFetch = await fetch(audioData.url);
  const audioBuf = Buffer.from(await audioFetch.arrayBuffer());

  const rawWav = `${out}.raw.wav`;
  fs.writeFileSync(rawWav, audioBuf);

  const ffmpegCmd = fs.existsSync(path.join(root, '.venv/bin/ffmpeg'))
    ? path.join(root, '.venv/bin/ffmpeg')
    : 'ffmpeg';

  try {
    execFileSync(ffmpegCmd, ['-y', '-i', rawWav, '-vn', '-c:a', 'libmp3lame', '-q:a', '2', out], {stdio: 'ignore'});
    if (fs.existsSync(rawWav)) fs.unlinkSync(rawWav);
  } catch {
    fs.renameSync(rawWav, out);
  }
}

const outDir = path.join(dir, 'assets/audio');
fs.mkdirSync(outDir, {recursive: true});

const spoken = (text) =>
  Object.entries(vox.tts ?? {}).reduce((t, [from, to]) => t.split(from).join(to), text);

const timingPath = path.join(outDir, 'timing.json');
const timing = fs.existsSync(timingPath) ? JSON.parse(fs.readFileSync(timingPath, 'utf8')) : {};
for (const shot of vox.shots) {
  if (!shot.say || (only && !only.includes(shot.id))) continue;
  const text = locale[shot.say];
  if (!text) throw new Error(`Thiếu key ${shot.say} trong locale`);
  const out = path.join(outDir, `${shot.id}.mp3`);
  if (force || !fs.existsSync(out) || fs.statSync(out).size === 0) {
    // Ghi ra file tạm rồi mới thay file thật khi thành công: lỗi giữa chừng không làm mất file cũ.
    // edge-tts đôi khi lỗi mạng: thử lại tối đa 3 lần.
    const tmp = `${out}.tmp.mp3`;
    let shotDuration = null;
    for (let k = 1; ; k++) {
      try {
        if (provider === 'vbee') await vbeeSynth(spoken(text), tmp);
        else if (provider === 'f5') shotDuration = await f5Synth(spoken(text), tmp);
        else execFileSync('python', ['-m', 'edge_tts', '--voice', voice, `--rate=${rate}`, `--pitch=${pitch}`, '--text', spoken(text), '--write-media', tmp], {stdio: 'inherit'});
        if (!fs.existsSync(tmp) || fs.statSync(tmp).size === 0) throw new Error('file rỗng');
        if (preset?.filter) {
          const mastered = `${out}.mastered.mp3`;
          try {
            const ffmpegCmd = fs.existsSync(path.join(root, '.venv/bin/ffmpeg'))
              ? path.join(root, '.venv/bin/ffmpeg')
              : 'ffmpeg';
            execFileSync(ffmpegCmd, ['-y', '-i', tmp, '-af', preset.filter, mastered], {stdio: 'ignore'});
            if (fs.existsSync(mastered) && fs.statSync(mastered).size > 0) {
              fs.unlinkSync(tmp);
              fs.renameSync(mastered, out);
            } else {
              fs.renameSync(tmp, out);
            }
          } catch {
            fs.renameSync(tmp, out);
          }
        } else {
          fs.renameSync(tmp, out);
        }
        break;
      } catch (e) {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        if (k >= 3 || /Thiếu|UNAUTHORIZED|credit|Câu dài/.test(String(e.message))) throw e; // lỗi cấu hình/credit: không thử lại
        console.log(`${shot.id}: lỗi, thử lại lần ${k + 1}`);
      }
    }
  }
  const ffprobeCmd = fs.existsSync(path.join(root, '.venv/bin/ffprobe'))
    ? path.join(root, '.venv/bin/ffprobe')
    : 'ffprobe';

  const dur = Number(
    execFileSync(ffprobeCmd, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]).toString().trim(),
  );
  timing[shot.id] = Math.round(dur * 1000) / 1000;
  console.log(shot.id, timing[shot.id]);
  fs.writeFileSync(timingPath, JSON.stringify(timing, null, 1)); // ghi sau mỗi câu để lỗi giữa chừng không mất số đo
}

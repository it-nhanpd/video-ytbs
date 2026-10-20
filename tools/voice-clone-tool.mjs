// Tool hỗ trợ xuất/nhập kịch bản và dữ liệu âm thanh phục vụ Voice Cloning tự động trên Google Colab / Drive
//
// 1. Xuất kịch bản & giọng mẫu để tải lên Google Drive:
//    node tools/voice-clone-tool.mjs export <project> [--voice tra_an] [--locale vi]
//
// 2. Nhập kết quả tải về từ Google Drive vào assets/audio của dự án:
//    node tools/voice-clone-tool.mjs import <project> --from <path_to_drive_output>
//
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const command = args[0];

const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};

if (!command || !['export', 'import'].includes(command)) {
  console.log(`
📖 HƯỚNG DẪN SỬ DỤNG TOOL ĐỒNG BỘ VOICE CLONING (F5-TTS & DRIVE):

1. Xuất kịch bản dự án để tải lên Google Drive:
   node tools/voice-clone-tool.mjs export <project> [--voice tra_an] [--locale vi]

2. Nhập kết quả tải về từ Google Drive vào dự án:
   node tools/voice-clone-tool.mjs import <project> --from <path_to_folder>
`);
  process.exit(0);
}

const project = args[1];
if (!project || project.startsWith('--')) {
  console.error('❌ Lỗi: Bạn cần cung cấp tên dự án. Ví dụ: node tools/voice-clone-tool.mjs export 2026-truecrime-my-lai');
  process.exit(1);
}

const projectDir = path.join(root, 'content/projects', project);
if (!fs.existsSync(projectDir)) {
  console.error(`❌ Không tìm thấy thư mục dự án tại: ${projectDir}`);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// LỆNH EXPORT: Chuẩn bị kịch bản & giọng mẫu để copy lên Google Drive
// -----------------------------------------------------------------------------
if (command === 'export') {
  const localeName = opt('locale', 'vi');
  const voiceName = opt('voice', 'tra_an');
  const localePath = path.join(projectDir, 'locales', `${localeName}.json`);
  const voxPath = path.join(projectDir, 'vox.json');
  const scenesPath = path.join(projectDir, 'scenes.json');

  if (!fs.existsSync(localePath)) {
    console.error(`❌ Không tìm thấy file locale: ${localePath}`);
    process.exit(1);
  }

  const locale = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  const shotsDict = {};

  if (fs.existsSync(voxPath)) {
    // Dự án định dạng Vox
    const vox = JSON.parse(fs.readFileSync(voxPath, 'utf8'));
    const spoken = (text) =>
      Object.entries(vox.tts ?? {}).reduce((t, [from, to]) => t.split(from).join(to), text);

    for (const shot of vox.shots) {
      if (!shot.say) continue;
      const text = locale[shot.say] ?? shot.say;
      shotsDict[shot.id] = spoken(text);
    }
  } else if (fs.existsSync(scenesPath)) {
    // Dự án định dạng Scenes tiêu chuẩn
    const scenesData = JSON.parse(fs.readFileSync(scenesPath, 'utf8'));
    const scenes = scenesData.scenes ?? [];
    for (const scene of scenes) {
      const textKeys = (scene.text ?? []).map((t) => t.key).filter(Boolean);
      for (const k of textKeys) {
        if (locale[k]) shotsDict[`${scene.id}_${k}`] = locale[k];
      }
    }
  } else {
    console.error(`❌ Không tìm thấy vox.json hoặc scenes.json trong ${projectDir}`);
    process.exit(1);
  }

  const exportDir = path.join(projectDir, 'f5-workspace');
  const inputsDir = path.join(exportDir, 'inputs');
  const voicesDir = path.join(exportDir, 'voices', voiceName);
  fs.mkdirSync(inputsDir, {recursive: true});
  fs.mkdirSync(voicesDir, {recursive: true});

  // 1. Ghi file JSON cho Colab
  const jsonPath = path.join(inputsDir, `${project}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(shotsDict, null, 2), 'utf8');

  // 2. Ghi file TXT phụ trợ
  const txtPath = path.join(inputsDir, `${project}.txt`);
  const txtContent = Object.entries(shotsDict)
    .map(([id, text]) => `${id} | ${text}`)
    .join('\n');
  fs.writeFileSync(txtPath, txtContent, 'utf8');

  // 3. Sao chép mẫu giọng nếu có trong content/library/voice-clones/<voiceName>
  const libVoiceDir = path.join(root, 'content/library/voice-clones', voiceName);
  if (fs.existsSync(libVoiceDir)) {
    const srcWav = path.join(libVoiceDir, 'reference.wav');
    const srcTxt = path.join(libVoiceDir, 'reference.txt');
    if (fs.existsSync(srcWav)) fs.copyFileSync(srcWav, path.join(voicesDir, 'reference.wav'));
    if (fs.existsSync(srcTxt)) fs.copyFileSync(srcTxt, path.join(voicesDir, 'reference.txt'));
  }

  console.log(`\n=== XUẤT KỊCH BẢN THÀNH CÔNG ===`);
  console.log(`📦 Dự án: ${project}`);
  console.log(`📝 Tổng số shot: ${Object.keys(shotsDict).length}`);
  console.log(`📂 Thư mục chuẩn bị: ${exportDir}`);
  console.log(`\n👉 CÁCH ĐƯA LÊN GOOGLE DRIVE:`);
  console.log(`1. Mở Google Drive của bạn, vào thư mục: 'F5_TTS_Workspace'`);
  console.log(`2. Kéo thả file kịch bản vào 'inputs/':`);
  console.log(`   -> ${jsonPath}`);
  console.log(`3. Kéo thả thư mục giọng vào 'voices/':`);
  console.log(`   -> ${voicesDir}`);
  console.log(`4. Mở Colab (tools/F5_TTS_VN_1Click.ipynb), đặt PROJECT_NAME = "${project}" và bấm Play Bước 3!`);
}

// -----------------------------------------------------------------------------
// LỆNH IMPORT: Nhập audio & timing.json từ Google Drive vào dự án Remotion
// -----------------------------------------------------------------------------
if (command === 'import') {
  const fromDir = opt('from');
  if (!fromDir) {
    console.error('❌ Lỗi: Bạn cần chỉ định thư mục tải về từ Google Drive bằng --from <đường_dẫn>');
    process.exit(1);
  }

  const resolvedFrom = path.resolve(fromDir);
  if (!fs.existsSync(resolvedFrom)) {
    console.error(`❌ Không tìm thấy thư mục nguồn: ${resolvedFrom}`);
    process.exit(1);
  }

  const targetAudioDir = path.join(projectDir, 'assets/audio');
  fs.mkdirSync(targetAudioDir, {recursive: true});

  const files = fs.readdirSync(resolvedFrom);
  let audioCount = 0;
  let hasTiming = false;

  for (const f of files) {
    if (f.endsWith('.mp3') || f.endsWith('.wav')) {
      fs.copyFileSync(path.join(resolvedFrom, f), path.join(targetAudioDir, f));
      audioCount++;
    } else if (f === 'timing.json') {
      fs.copyFileSync(path.join(resolvedFrom, f), path.join(targetAudioDir, f));
      hasTiming = true;
    }
  }

  console.log(`\n=== NHẬP DỮ LIỆU THÀNH CÔNG ===`);
  console.log(`📦 Dự án: ${project}`);
  console.log(`🎵 Số file âm thanh đã nhập: ${audioCount}`);
  console.log(`⏱️ File timing.json: ${hasTiming ? '✅ Đã cập nhật' : '⚠️ Không tìm thấy file timing.json'}`);
  console.log(`📂 Đích đến: ${targetAudioDir}`);
  console.log(`\n🚀 Bây giờ bạn có thể mở Remotion Studio ('npm run studio') để kiểm tra video!`);
}

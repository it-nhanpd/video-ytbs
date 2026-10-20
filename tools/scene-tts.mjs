// Generate one narration MP3 per scene from the Text-to-Speech quote block.
// Usage: node tools/scene-tts.mjs <project> [--voice ...] [--rate=-4%] [--pitch=-2Hz] [--force]
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const project = args[0];
if (!project) {
  console.error('Usage: node tools/scene-tts.mjs <project> [--voice ...] [--rate=-4%] [--pitch=-2Hz] [--force]');
  process.exit(1);
}

const opt = (name, fallback) => {
  const direct = args.find((a) => a.startsWith('--' + name + '='));
  if (direct) return direct.slice(name.length + 3);
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const voice = opt('voice', 'vi-VN-NamMinhNeural');
const rate = opt('rate', '-4%');
const pitch = opt('pitch', '-2Hz');
const force = args.includes('--force');
const projectDir = path.join(root, 'content', 'projects', project);
const scenes = JSON.parse(fs.readFileSync(path.join(projectDir, 'scenes.json'), 'utf8')).scenes;
const outDir = path.join(projectDir, 'assets', 'audio');
fs.mkdirSync(outDir, {recursive: true});

const narrationFrom = (markdown, id) => {
  const marker = 'Text-to-Speech)';
  const at = markdown.indexOf(marker);
  if (at < 0) throw new Error(id + ': missing Text-to-Speech section');
  const lines = markdown.slice(at + marker.length).split(/\r?\n/);
  const quoted = [];
  let started = false;
  for (const line of lines) {
    if (/^>\s?/.test(line)) {
      started = true;
      quoted.push(line.replace(/^>\s?/, '').trim());
      continue;
    }
    if (started && line.trim() !== '') break;
  }
  const text = quoted
    .join(' ')
    .replace(/^[\"“]|[\"”]$/g, '')
    .replace(/\s*\[F\d+\]\s*/g, ' ')
    .replace(new RegExp(String.fromCharCode(96), 'g'), '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) throw new Error(id + ': empty narration');
  return text;
};

const timing = {};
for (const scene of scenes) {
  const out = path.join(outDir, scene.id + '.mp3');
  const mdPath = path.join(projectDir, 'script', 'scenes', scene.id + '.md');
  const text = narrationFrom(fs.readFileSync(mdPath, 'utf8'), scene.id);
  if (!fs.existsSync(out) || force) {
    console.log('→ ' + scene.id + ': ' + text.length + ' chars');
    execFileSync('python', ['-m', 'edge_tts', '--voice', voice, '--rate=' + rate, '--pitch=' + pitch, '--text', text, '--write-media', out], {stdio: 'inherit'});
  } else {
    console.log('↷ ' + scene.id + ': exists');
  }
  const duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', out], {encoding: 'utf8'}).trim());
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(scene.id + ': invalid audio duration');
  if (duration > scene.durationSec) throw new Error(scene.id + ': narration ' + duration.toFixed(2) + 's exceeds scene ' + scene.durationSec + 's');
  timing[scene.id] = Number(duration.toFixed(3));
}

fs.writeFileSync(path.join(outDir, 'timing.json'), JSON.stringify(timing, null, 2) + '\n');
console.log('✓ ' + scenes.length + ' narration files → ' + path.relative(root, outDir));

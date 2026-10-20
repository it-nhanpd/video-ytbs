import fs from 'node:fs';
import path from 'node:path';

const infoPath = 'C:/Users/admin/.gemini/antigravity-cli/brain/5482fa01-5785-4a1c-9c6c-eb40f91215a0/scratch/info.json';
const raw = fs.readFileSync(infoPath, 'utf16le').replace(/^\uFEFF/, '');
const info = JSON.parse(raw);

const projDir = 'D:/videos-system/content/projects/2026-truecrime-zodiac-dahlia/research';
fs.mkdirSync(projDir, {recursive: true});

fs.writeFileSync(
  path.join(projDir, '00-ref-meta.json'),
  JSON.stringify(
    {
      id: info.id,
      title: info.title,
      uploader: info.uploader,
      channel_id: info.channel_id,
      upload_date: info.upload_date,
      duration: info.duration,
      view_count: info.view_count,
      description: info.description,
    },
    null,
    2,
  ),
  'utf8',
);

const auto = info.automatic_captions || {};
const viOrig = auto['vi-orig'] || auto['vi'] || [];
const json3 = viOrig.find((x) => x.ext === 'json3') || viOrig[0];
console.log('Fetching subtitle:', json3?.ext);

if (json3?.url) {
  const res = await fetch(json3.url);
  const subText = await res.text();
  const subData = JSON.parse(subText);
  const events = subData.events || [];
  const lines = [];
  let bucket = -1;
  let cur = [];
  const flush = (b) => {
    if (cur.length > 0) {
      const mm = String(Math.floor((b * 30) / 60)).padStart(2, '0');
      const ss = String((b * 30) % 60).padStart(2, '0');
      lines.push(`[${mm}:${ss}] ${cur.join(' ').replace(/\s+/g, ' ').trim()}`);
      cur = [];
    }
  };
  for (const ev of events) {
    if (!ev.segs) continue;
    const tSec = Math.floor((ev.tStartMs || 0) / 1000);
    const b = Math.floor(tSec / 30);
    if (b !== bucket) {
      if (bucket >= 0) flush(bucket);
      bucket = b;
    }
    const txt = ev.segs.map((s) => s.utf8 || '').join('').replace(/\n/g, ' ').trim();
    if (txt) cur.push(txt);
  }
  if (bucket >= 0) flush(bucket);
  const outPath = path.join(projDir, '00-ref-transcript.txt');
  fs.writeFileSync(outPath, lines.join('\n\n'), 'utf8');
  console.log(`Saved ${lines.length} blocks to ${outPath}`);
}

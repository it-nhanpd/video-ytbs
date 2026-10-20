import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {voxTheme as T} from '../theme';
import {voxFonts as F} from './fonts';
import {Atmos} from './atmos';
import {camAt, camStyle} from './camera';
import {SELF_CAM} from './cine';
import {GrainTop, PaperBG, VoxDefs, clamp} from './paper';
import {DARK_KINDS, SHOTS} from './shots';
import {LEAD_SEC, type VoxShotT, type VoxT, shotFrames, voxDuration} from './types';

type Props = {vox: VoxT; locale: Record<string, string>; timing: Record<string, number>; subtitles?: boolean};

// Cắt câu dài thành các đoạn ≤ ~70 ký tự, chia thời gian theo số ký tự.
const chunks = (text: string, max = 70) => {
  const parts = text.split(/(?<=[.,:;!?…])\s+/);
  const out: string[] = [];
  for (const p of parts) {
    const last = out[out.length - 1];
    if (last && (last + ' ' + p).length <= max) out[out.length - 1] = last + ' ' + p;
    else out.push(p);
  }
  return out;
};

const Subtitle: React.FC<{text: string; startF: number; durF: number; dark: boolean}> = ({text, startF, durF, dark}) => {
  const frame = useCurrentFrame();
  const cs = chunks(text);
  const total = cs.reduce((a, c) => a + c.length, 0);
  let acc = 0;
  const idx = cs.findIndex((c) => {
    acc += c.length;
    return frame < startF + (acc / total) * durF;
  });
  const cur = cs[idx < 0 ? cs.length - 1 : idx];
  if (frame < startF - 2) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 46}}>
      <div
        style={{
          maxWidth: '78%',
          textAlign: 'center',
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1.3,
          color: T.subtitleText,
          background: dark ? 'rgba(0,0,0,0.0)' : T.subtitlePlate,
          padding: '8px 22px',
          borderRadius: 6,
        }}
      >
        {cur}
      </div>
    </AbsoluteFill>
  );
};

const Shot: React.FC<{shot: VoxShotT; project: string; t: (k?: string) => string; D: number; subtitles: boolean; audioSec: number}> = ({
  shot,
  project,
  t,
  D,
  subtitles,
  audioSec,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const Kind = SHOTS[shot.v.kind];
  const dark = DARK_KINDS.has(shot.v.kind) || !!(shot.v as Record<string, unknown>).dark;
  const v = shot.v as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  // Camera: kind điện ảnh tự lo (SELF_CAM); kind khác theo v.cam, mặc định đẩy chậm + rung giấy 12 fps như cũ.
  const self = SELF_CAM.has(shot.v.kind);
  const {width: W, height: H} = useVideoConfig();
  const cam = camAt(v.cam, frame, D, fps, shot.id, v.fx, v.fy, v.amt ?? 1);
  const fadeIn = interpolate(frame, [0, 4], [0, 1], clamp);
  const lead = Math.round(LEAD_SEC * fps);
  // SFX theo shot: v.sfx = [{src (tương đối assets/), at? (giây từ đầu shot), vol?}].
  const sfx: {src: string; at?: number; vol?: number}[] = v.sfx ?? [];
  return (
    <AbsoluteFill>
      <PaperBG dark={dark} />
      <AbsoluteFill style={{...(self ? {} : camStyle(cam, W, H)), opacity: fadeIn}}>
        {Kind ? <Kind v={shot.v} t={t} project={project} D={D} /> : <div style={{fontSize: 60, color: T.red}}>Thiếu kind: {shot.v.kind}</div>}
      </AbsoluteFill>
      {!self && v.atmos && <Atmos list={v.atmos} seed={shot.id} />}
      {sfx.map((x, i) => (
        <Sequence key={i} from={Math.round((x.at ?? 0) * fps)} layout="none">
          <Audio src={staticFile(`projects/${project}/assets/${x.src}`)} volume={x.vol ?? 0.8} />
        </Sequence>
      ))}
      {shot.say && (
        <Sequence from={lead} layout="none">
          <Audio src={staticFile(`projects/${project}/assets/audio/${shot.id}.mp3`)} />
        </Sequence>
      )}
      {subtitles && shot.say && <Subtitle text={t(shot.say)} startF={lead} durF={Math.round(audioSec * fps)} dark={dark} />}
    </AbsoluteFill>
  );
};

// Nhạc nền: một bài (`music`) hoặc nhiều cue theo đoạn (`cues`), đan chéo 1,5 s; tự hạ khi có lời (`duck`).
type Span = {from: number; to: number};
const duckAt = (f: number, speech: Span[], duck: number, ramp: number) => {
  let g = 1;
  for (const s of speech) {
    if (f < s.from - ramp || f > s.to + ramp) continue;
    const k = f < s.from ? (s.from - f) / ramp : f > s.to ? (f - s.to) / ramp : 0;
    g = Math.min(g, duck + (1 - duck) * k);
  }
  return g;
};

const Music: React.FC<{src: string; total: number; speech: Span[]; duck: number; offset: number; base: number; fin?: number; fout?: number}> = ({
  src,
  total,
  speech,
  duck,
  offset,
  base,
  fin: finIn,
  fout: foutIn,
}) => {
  const {fps} = useVideoConfig();
  // Shot lẻ ngắn (< 5 s) cũng phải có dải tăng dần: co fade vào/ra theo độ dài.
  const fin = finIn ?? Math.min(fps * 2, Math.floor(total / 3));
  const fout = Math.max(fin + 1, total - (foutIn ?? Math.min(fps * 3, Math.floor(total / 3))));
  return (
    <Audio
      src={src}
      loop
      volume={(f) => interpolate(f, [0, fin, fout, total], [0, base, base, 0], clamp) * duckAt(f + offset, speech, duck, Math.round(fps * 0.3))}
    />
  );
};

export const voxTotal = voxDuration;

export const VoxVideo: React.FC<Props> = ({vox, locale, timing, subtitles = true}) => {
  const t = (k?: string) => (k ? (locale[k] ?? k) : '');
  let from = 0;
  const total = voxDuration(vox, timing);
  const lead = Math.round(LEAD_SEC * vox.fps);
  const starts: Record<string, number> = {};
  const speech: Span[] = [];
  {
    let f = 0;
    for (const s of vox.shots) {
      starts[s.id] = f;
      if (s.say) speech.push({from: f + lead, to: f + lead + Math.round((timing[s.id] ?? 0) * vox.fps)});
      f += shotFrames(s, timing, vox.fps);
    }
  }
  const duck = vox.duck ?? 1;
  const xf = Math.round(vox.fps * 1.5);
  // Cue có shot `at` không nằm trong bản đang dựng (vd. composition một shot) thì bỏ; cue chứa shot đầu vẫn chạy.
  const cues = (vox.cues ?? [])
    .map((c) => ({...c, from: starts[c.at]}))
    .filter((c) => c.from !== undefined)
    .sort((a, b) => a.from - b.from);
  return (
    <AbsoluteFill style={{background: T.paper}}>
      <VoxDefs />
      {vox.shots.map((s) => {
        const D = shotFrames(s, timing, vox.fps);
        const el = (
          <Sequence key={s.id} from={from} durationInFrames={D} name={s.id}>
            <Shot shot={s} project={vox.project} t={t} D={D} subtitles={subtitles} audioSec={timing[s.id] ?? 0} />
          </Sequence>
        );
        from += D;
        return el;
      })}
      {cues.length > 0
        ? cues.map((c, i) => {
            const end = i + 1 < cues.length ? cues[i + 1].from + xf : total;
            const len = end - c.from;
            return c.src ? (
              <Sequence key={`cue${i}`} from={c.from} durationInFrames={len} name={`cue ${c.at}`}>
                <Music
                  src={staticFile(`projects/${vox.project}/${c.src}`)}
                  total={len}
                  speech={speech}
                  duck={duck}
                  offset={c.from}
                  base={c.vol ?? 0.5}
                  fin={i === 0 ? undefined : xf}
                  fout={i + 1 < cues.length ? xf : undefined}
                />
              </Sequence>
            ) : null;
          })
        : vox.music && <Music src={staticFile(`projects/${vox.project}/${vox.music}`)} total={total} speech={speech} duck={duck} offset={0} base={0.5} />}
      <GrainTop />
    </AbsoluteFill>
  );
};

// Một shot riêng (để xem/still nhanh): composition <project>-vox-<id>.
export const VoxSingle: React.FC<Props & {shotId: string}> = ({vox, shotId, ...rest}) => (
  <VoxVideo {...rest} vox={{...vox, shots: vox.shots.filter((s) => s.id === shotId)}} />
);

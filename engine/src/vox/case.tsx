import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {voxTheme as T} from '../theme';
import {voxFonts as F} from './fonts';
import {MarkerCircle, StampText, Tape, asset, clamp, useEnter} from './paper';
import type {ShotCtx} from './shots';
import type {V} from './types';

// Các kind cho phim tài liệu dựa trên hồ sơ tòa án (dự án 2026-truecrime-ursula-herrmann). Đăng ký qua CASE_SHOTS trong shots.tsx.
// Mọi chữ trên hình là key locale; số đo lấy từ bản án, ghi trong research/.
type K = React.FC<ShotCtx>;
const sec = (fps: number, s: number) => Math.round(fps * s);

const Fade: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({at, children, style, dy = 16}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return <div style={{opacity: o, transform: `translateY(${(1 - o) * dy}px)`, ...style}}>{children}</div>;
};

// ---------------------------------------------------------------------------------------------
// Thư tống tiền phỏng dựng: từng chữ là mẩu báo cắt (font, nền, độ nghiêng ngẫu nhiên theo seed), dán theo dòng dưới băng keo trong.
// Chữ lấy nguyên văn bản án chép lại (kể cả lỗi ngữ pháp). Bên phải: bản dịch.
// v: {lines: [key], vi?: key, tape?: key, hot?: number[] (dòng nhấn đỏ), seed?}
const LETTER_FONTS = [F.display, F.serif, F.body, F.mono];
const LETTER_BG = ['#f8f4ea', '#ffffff', '#e6dcc4', '#1b1b1b', '#efe3a8', '#d9d2c4'];

const LetterTile: React.FC<{ch: string; seed: string; at: number; hot: boolean}> = ({ch, seed, at, hot}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 5], [0, 1], clamp);
  if (ch === ' ') return <div style={{width: 18}} />;
  const r = (k: string) => random(`${seed}${k}`);
  const bg = hot && r('h') < 0.5 ? T.red : LETTER_BG[Math.floor(r('b') * LETTER_BG.length)];
  const dark = bg === '#1b1b1b' || bg === T.red;
  const font = LETTER_FONTS[Math.floor(r('f') * LETTER_FONTS.length)];
  const size = 40 + r('s') * 22;
  const upper = r('u') < 0.35;
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: font === F.serif ? 900 : 700,
        fontStyle: r('i') < 0.2 ? 'italic' : 'normal',
        fontSize: size,
        lineHeight: 1,
        padding: `${3 + r('p') * 5}px ${2 + r('q') * 4}px`,
        background: bg,
        color: dark ? T.paperEdge : T.ink,
        transform: `rotate(${(r('r') - 0.5) * 9}deg) translateY(${(r('y') - 0.5) * 8}px) scale(${1.25 - 0.25 * o})`,
        opacity: o,
        boxShadow: `1px 2px 2px ${T.shadow}`,
        margin: '0 1px',
      }}
    >
      {upper ? ch.toUpperCase() : ch}
    </div>
  );
};

const Letter: K = ({v, t, D}) => {
  const {width: W, height: H, fps} = useVideoConfig();
  const lines: string[] = (v.lines ?? []).map((k: string) => t(k));
  const hot: number[] = v.hot ?? [];
  const e = useEnter(0, 120, 16);
  const total = lines.reduce((a, l) => a + l.length, 0);
  const span = D * 0.62;
  let acc = 0;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: W * 0.05,
          top: H * 0.09,
          width: W * (v.vi ? 0.58 : 0.86),
          minHeight: H * 0.6,
          background: T.paperEdge,
          boxShadow: `0 16px 26px ${T.shadow}`,
          padding: '54px 46px',
          transform: `translateY(${(1 - e) * 60}px) rotate(-1.2deg)`,
          opacity: Math.min(1, e * 2),
        }}
      >
        {lines.map((l, i) => {
          const start = sec(fps, 0.3) + (acc / Math.max(1, total)) * span;
          acc += l.length;
          const per = (l.length / Math.max(1, total)) * span;
          return (
            <div key={i} style={{position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', rowGap: 10, marginBottom: 26}}>
              {/* Băng keo trong phủ cả dòng. */}
              <div style={{position: 'absolute', inset: '-8px -16px', background: 'rgba(235,240,232,0.35)', border: '1px solid rgba(255,255,255,0.5)', transform: `rotate(${(random(`tp${i}`) - 0.5) * 1.6}deg)`}} />
              {/* Gom chữ cái theo từ: chỉ xuống dòng giữa các từ. */}
              {l.split(' ').map((word, wi, words) => {
                const j0 = words.slice(0, wi).reduce((a, w) => a + w.length + 1, 0);
                return (
                  <div key={wi} style={{display: 'flex', alignItems: 'center', marginRight: 18}}>
                    {Array.from(word).map((ch, k) => (
                      <LetterTile key={k} ch={ch} seed={`${v.seed ?? 'L'}${i}-${j0 + k}`} at={Math.round(start + ((j0 + k) / Math.max(1, l.length)) * per)} hot={hot.includes(i)} />
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
        {v.tape && (
          <div style={{position: 'absolute', left: -12, top: -22}}>
            <Tape text={t(v.tape)} rot={-3} size={20} />
          </div>
        )}
      </div>
      {v.vi && (
        <Fade at={Math.round(D * 0.3)} style={{position: 'absolute', left: W * 0.67, top: H * 0.16, width: W * 0.28}}>
          <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: 4, color: T.red, marginBottom: 18}}>{t('u.trans')}</div>
          <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 38, lineHeight: 1.4, color: T.ink, whiteSpace: 'pre-line'}}>{t(v.vi)}</div>
        </Fade>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Sơ đồ chiếc hộp theo mô tả bản án (mặt đứng + chiều sâu xiên). Không có người.
// v: {stage: 1..4} 1 khung + kích thước, 2 nắp/chốt/ống nói, 3 bên trong + đèn/ắc quy, 4 ống thông khí + đất phủ + cây non.
// Nhãn: key cố định b.* trong locale.
const BoxPlan: K = ({v, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const stage: number = v.stage ?? 1;
  const p = (at: number, dur = 14) => interpolate(frame, [at, at + dur], [0, 1], clamp);
  // Phần mới của stage hiện chạy; phần cũ hiện sẵn.
  const now = (s: number, k = 0) => (s < stage ? 1 : s === stage ? p(sec(fps, 0.3) + k * Math.round(D * 0.12)) : 0);
  const k = (H * 0.48) / 138.5; // px trên cm
  const bw = 72 * k;
  const bh = 138.5 * k;
  const dd = 60 * k * 0.45; // chiều sâu xiên
  const x0 = W * 0.36 - bw / 2;
  const ground = H * 0.15;
  const y0 = ground + dd + 26; // nắp hộp: cả mặt trên nằm dưới mặt đất; nhãn 72 cm vẫn trên dải phụ đề
  const ink = T.ink;
  const draw = now(1);
  const L = 2 * (bw + bh);
  const label = (x: number, y: number, key: string, o: number, anchor: 'start' | 'end' = 'start', color = ink) => (
    <text x={x} y={y} fontFamily={F.body} fontWeight={700} fontSize={28} fill={color} textAnchor={anchor} opacity={o}>
      {t(key)}
    </text>
  );
  const dims = stage === 1 ? p(Math.round(D * 0.35), 18) : 1;
  const bolts = now(2);
  const inner = now(3);
  const pipes = now(4);
  const soil = now(4, 2);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="soilHatch" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="22" height="22" fill="#b9a585" />
            <line x1="0" y1="0" x2="0" y2="22" stroke="#9a8667" strokeWidth="6" />
          </pattern>
        </defs>
        {/* Đất: hiện từ stage 4 (che phủ), các stage trước chỉ có vạch mặt đất. */}
        <line x1={W * 0.04} y1={ground} x2={W * 0.62} y2={ground} stroke={T.landStroke} strokeWidth={4} strokeDasharray="14 10" />
        {soil > 0 && <rect x={W * 0.04} y={ground} width={W * 0.58} height={H * 0.8 - ground} fill="url(#soilHatch)" opacity={0.55 * soil} />}
        {/* Khối hộp: mặt bên xiên + mặt trước. */}
        <g opacity={Math.min(1, draw * 1.5)}>
          <path d={`M ${x0 + bw} ${y0} L ${x0 + bw + dd} ${y0 - dd} L ${x0 + bw + dd} ${y0 + bh - dd} L ${x0 + bw} ${y0 + bh} Z`} fill="#c9b38d" stroke={ink} strokeWidth={4} />
          <path d={`M ${x0} ${y0} L ${x0 + dd} ${y0 - dd} L ${x0 + bw + dd} ${y0 - dd} L ${x0 + bw} ${y0} Z`} fill="#d9c49d" stroke={ink} strokeWidth={4} />
          <rect x={x0} y={y0} width={bw} height={bh} fill={inner > 0 ? '#efe2c4' : '#e1cfa8'} stroke={ink} strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
        </g>
        {/* Kích thước (cm, theo bản án). */}
        <g opacity={dims}>
          <line x1={x0 - 40} y1={y0} x2={x0 - 40} y2={y0 + bh} stroke={T.red} strokeWidth={4} />
          <line x1={x0 - 54} y1={y0} x2={x0 - 26} y2={y0} stroke={T.red} strokeWidth={4} />
          <line x1={x0 - 54} y1={y0 + bh} x2={x0 - 26} y2={y0 + bh} stroke={T.red} strokeWidth={4} />
          <text x={x0 - 60} y={y0 + bh / 2} fontFamily={F.display} fontSize={56} fill={T.red} textAnchor="end">
            {t('b.h')}
          </text>
          <line x1={x0} y1={y0 + bh + 34} x2={x0 + bw} y2={y0 + bh + 34} stroke={T.red} strokeWidth={4} />
          <text x={x0 + bw / 2} y={y0 + bh + 84} fontFamily={F.display} fontSize={48} fill={T.red} textAnchor="middle">
            {t('b.w')}
          </text>
          <line x1={x0 + bw + 22} y1={y0 + bh + 6} x2={x0 + bw + dd + 22} y2={y0 + bh - dd + 6} stroke={T.red} strokeWidth={4} />
          <text x={x0 + bw + dd + 34} y={y0 + bh - dd + 18} fontFamily={F.display} fontSize={48} fill={T.red}>
            {t('b.d')}
          </text>
        </g>
        {/* Nắp: nửa mở được, 7 chốt, ống nói. */}
        <g opacity={bolts}>
          <line x1={x0 + bw / 2} y1={y0 - 2} x2={x0 + bw / 2 + dd} y2={y0 - dd - 2} stroke={ink} strokeWidth={3} strokeDasharray="8 6" />
          {Array.from({length: 7}, (_, i) => {
            const u = (i + 0.5) / 7;
            const bx = x0 + bw / 2 + u * dd * 0.2 + bw * 0.45 * u;
            return <circle key={i} cx={bx} cy={y0 - 6 - u * dd * 0.6} r={6} fill={T.red} opacity={interpolate(frame, [sec(fps, 0.4) + i * 3, sec(fps, 0.4) + i * 3 + 4], [0, 1], clamp) * (stage === 2 ? 1 : 1)} />;
          })}
          <rect x={x0 + bw * 0.16} y={y0 - dd * 0.5 - 46} width={20} height={46} fill="#8f8a80" stroke={ink} strokeWidth={3} />
          {stage === 2 && label(x0 + bw * 0.16 - 14, y0 - dd * 0.5 - 58, 'b.tube', bolts, 'end')}
        </g>
        {stage === 2 && (
          <g opacity={bolts}>
            {label(x0 + bw + dd + 30, y0 - dd + 40, 'b.lid', bolts)}
            {label(x0 + bw + dd + 30, y0 - dd + 100, 'b.bolts', bolts, 'start', T.red)}
          </g>
        )}
        {/* Bên trong: kệ, ghế ngồi, đèn + dây tới ắc quy chôn ngoài. */}
        <g opacity={inner}>
          <line x1={x0 + 10} y1={y0 + bh * 0.3} x2={x0 + bw - 10} y2={y0 + bh * 0.3} stroke={ink} strokeWidth={6} />
          <rect x={x0 + 10} y={y0 + bh * 0.72} width={bw - 20} height={14} fill="#a88d62" stroke={ink} strokeWidth={3} />
          <circle cx={x0 + bw / 2} cy={y0 + 34} r={13} fill={T.mustard} stroke={ink} strokeWidth={3} />
          <path d={`M ${x0 + bw} ${y0 + 34} L ${x0 + bw + dd + 60} ${y0 + 34} L ${x0 + bw + dd + 60} ${y0 + bh * 0.5}`} fill="none" stroke={ink} strokeWidth={3} strokeDasharray="6 5" />
          <rect x={x0 + bw + dd + 30} y={y0 + bh * 0.5} width={64} height={44} fill="#3c3c3c" stroke={ink} strokeWidth={3} />
        </g>
        {stage === 3 && (
          <g opacity={inner}>
            {label(x0 + bw + dd + 110, y0 + bh * 0.5 + 30, 'b.battery', inner)}
            {label(x0 - 20, y0 + bh * 0.3 + 10, 'b.shelf', inner, 'end')}
            {label(x0 - 20, y0 + bh * 0.72 + 12, 'b.seat', inner, 'end')}
            {label(x0 - 20, y0 + 44, 'b.lamp', inner, 'end')}
          </g>
        )}
        {/* Hai hệ ống thông khí chạy ngang dưới mặt đất. */}
        <g opacity={pipes}>
          <path
            d={`M ${x0 + bw * 0.3} ${y0 - dd * 0.4} L ${x0 + bw * 0.3} ${ground + 30} L ${W * 0.07} ${ground + 30} L ${W * 0.07} ${ground - 6}`}
            fill="none"
            stroke="#7f8a8f"
            strokeWidth={14}
            strokeLinejoin="round"
            strokeDasharray={1400}
            strokeDashoffset={1400 * (1 - pipes)}
          />
          <path
            d={`M ${x0 + bw} ${y0 + bh * 0.36} L ${x0 + bw + dd + 150} ${y0 + bh * 0.36} L ${x0 + bw + dd + 150} ${ground + 30} L ${W * 0.6} ${ground + 30} L ${W * 0.6} ${ground - 6}`}
            fill="none"
            stroke="#7f8a8f"
            strokeWidth={14}
            strokeLinejoin="round"
            strokeDasharray={1600}
            strokeDashoffset={1600 * (1 - pipes)}
          />
        </g>
        {/* 5 cây vân sam non ngụy trang trên mặt đất. */}
        {soil > 0 &&
          Array.from({length: 5}, (_, i) => {
            const cx = x0 + bw * 0.1 + i * (bw + dd) * 0.22;
            const s = spring({frame: frame - (sec(fps, 0.6) + Math.round(D * 0.24) + i * 4), fps, config: {stiffness: 200, damping: 14}});
            return (
              <path
                key={i}
                d={`M ${cx} ${ground - 70 * s} L ${cx - 20 * s} ${ground - 22 * s} L ${cx - 8 * s} ${ground - 24 * s} L ${cx - 26 * s} ${ground} L ${cx + 26 * s} ${ground} L ${cx + 8 * s} ${ground - 24 * s} L ${cx + 20 * s} ${ground - 22 * s} Z`}
                fill="#3f5a3a"
                stroke={ink}
                strokeWidth={2}
              />
            );
          })}
      </svg>
      {stage === 4 && (
        <div style={{position: 'absolute', left: W * 0.66, top: H * 0.2, width: W * 0.3}}>
          <Fade at={Math.round(D * 0.2)}>
            <div style={{fontFamily: F.display, fontSize: 52, color: T.ink, lineHeight: 1.1}}>{t('b.pipes')}</div>
            <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 32, color: T.inkSoft, marginTop: 12}}>{t('b.pipesSub')}</div>
          </Fade>
          <Fade at={Math.round(D * 0.45)} style={{marginTop: 40}}>
            <div style={{fontFamily: F.display, fontSize: 52, color: T.ink, lineHeight: 1.1}}>{t('b.soil')}</div>
          </Fade>
        </div>
      )}
      {stage === 1 && (
        <div style={{position: 'absolute', left: W * 0.66, top: H * 0.3, width: W * 0.3}}>
          <StampText text={t('b.title')} at={sec(fps, 0.3)} size={84} color={T.ink} rot={-2} style={{whiteSpace: 'normal', lineHeight: 1.05}} />
          <Fade at={Math.round(D * 0.5)} style={{marginTop: 26}}>
            <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 34, color: T.inkSoft}}>{t('b.weight')}</div>
          </Fade>
        </div>
      )}
      <div style={{position: 'absolute', right: W * 0.03, top: H * 0.04}}>
        <Tape text={t('b.note')} rot={1.5} size={18} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Đếm cuộc gọi theo ngày: mỗi cuộc một biểu tượng điện thoại bật lên.
// v: {days: [{label: key, n, sub?: key}], note?: key, from?: số cuộc đã hiện sẵn}
const Handset: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill={T.paperEdge} stroke={color} strokeWidth={5} />
    <path d="M 30 26 Q 24 30 26 40 Q 34 62 56 74 Q 66 78 72 72 L 66 62 Q 62 58 56 62 L 52 64 Q 42 58 36 48 L 38 44 Q 42 38 38 34 Z" fill={color} />
  </svg>
);

const Calls: K = ({v, t, D}) => {
  const {width: W, height: H, fps} = useVideoConfig();
  const days: {label: string; n: number; sub?: string}[] = v.days ?? [];
  const from: number = v.from ?? 0;
  // upto: số cuộc tối đa hiện trong shot này (các cuộc sau để trống chỗ, viền mờ).
  const total = Math.min(v.upto ?? 99, days.reduce((a, d) => a + d.n, 0));
  const frame = useCurrentFrame();
  const step = Math.max(3, Math.round((D * 0.6) / Math.max(1, total - from)));
  let idx = 0;
  const shown = Math.min(total, from + Math.max(0, Math.floor((frame - sec(fps, 0.3)) / step) + 1));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: H * 0.1, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: W * 0.08}}>
        {days.map((d, di) => (
          <div key={di} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: W * 0.36}}>
            <div style={{fontFamily: F.display, fontSize: 64, color: T.ink, letterSpacing: 2}}>{t(d.label)}</div>
            {d.sub && <div style={{fontFamily: F.mono, fontSize: 26, color: T.inkSoft, marginTop: 6}}>{t(d.sub)}</div>}
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18, marginTop: 34, width: W * 0.34}}>
              {Array.from({length: d.n}, () => {
                const i = idx++;
                if (i >= total)
                  return <div key={i} style={{width: 120, height: 120, borderRadius: 60, border: `4px dashed ${T.landStroke}`, boxSizing: 'border-box', opacity: 0.6}} />;
                const at = i < from ? -100 : sec(fps, 0.3) + (i - from) * step;
                const s = spring({frame: frame - at, fps, config: {stiffness: 220, damping: 12}});
                return (
                  <div key={i} style={{transform: `scale(${s})`, opacity: Math.min(1, s * 2)}}>
                    <Handset size={120} color={T.ink} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', right: W * 0.05, bottom: H * 0.18, textAlign: 'right'}}>
        <div style={{fontFamily: F.display, fontSize: 130, color: T.red, lineHeight: 1}}>{shown}</div>
        {v.note && <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 34, color: T.ink}}>{t(v.note)}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Thang mức độ chắc chắn của giám định (bậc thang trái → phải); ghim đỏ ở bậc `hit`, các bậc trên mờ đi.
// v: {steps: [{de: key, vi: key}], hit, note?: key, title?: key}
const Ladder: K = ({v, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const steps: {de: string; vi: string}[] = v.steps ?? [];
  const hit: number = v.hit ?? -1;
  const n = steps.length;
  const sw = (W * 0.84) / n;
  const x0 = W * 0.08;
  const base = H * 0.78;
  const sh = H * 0.1;
  const pinAt = hit >= 0 ? Math.round(D * 0.45) : 1e9;
  const pin = spring({frame: frame - pinAt, fps, config: {stiffness: 180, damping: 11}});
  const dim = interpolate(frame, [pinAt + 10, pinAt + 24], [1, 0.35], clamp);
  return (
    <AbsoluteFill>
      {v.title && (
        <div style={{position: 'absolute', left: x0, top: H * 0.07}}>
          <Tape text={t(v.title)} rot={-1.5} size={26} />
        </div>
      )}
      {steps.map((s, i) => {
        const at = sec(fps, 0.2) + i * Math.round(D * 0.06);
        const e = enterAt(frame, at, fps);
        const top = base - (i + 1) * sh;
        const isHit = i === hit;
        const above = hit >= 0 && i > hit;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0 + i * sw,
              top,
              width: sw - 10,
              height: base - top,
              background: isHit ? T.red : T.paperEdge,
              border: `4px solid ${T.ink}`,
              boxShadow: `5px 5px 0 ${T.ink}`,
              opacity: e * (above ? dim : 1),
              transform: `translateY(${(1 - e) * 60}px)`,
              padding: '16px 18px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 30, lineHeight: 1.15, color: isHit ? T.paperEdge : T.ink}}>{t(s.de)}</div>
            <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.2, color: isHit ? T.paperEdge : T.inkSoft, marginTop: 10}}>{t(s.vi)}</div>
          </div>
        );
      })}
      {hit >= 0 && pin > 0.001 && (
        <div style={{position: 'absolute', left: x0 + hit * sw + sw / 2 - 30, top: base - (hit + 1) * sh - 150 - (1 - pin) * 120, opacity: Math.min(1, pin * 2)}}>
          <svg width={60} height={84} viewBox="0 0 60 84">
            <path d="M30 82 C 22 60, 4 46, 4 28 A 26 26 0 1 1 56 28 C 56 46, 38 60, 30 82 Z" fill={T.red} stroke={T.paperEdge} strokeWidth={3} />
            <circle cx="30" cy="28" r="9" fill={T.paperEdge} />
          </svg>
        </div>
      )}
      {v.note && (
        <Fade at={pinAt + 14} style={{position: 'absolute', left: x0, top: H * 0.16, width: W * 0.5}}>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: T.ink}}>{t(v.note)}</div>
        </Fade>
      )}
    </AbsoluteFill>
  );
};
const enterAt = (frame: number, at: number, fps: number) => spring({frame: frame - at, fps, config: {stiffness: 160, damping: 14}});

// ---------------------------------------------------------------------------------------------
// Ảnh bản đồ (scan cổ) có camera phóng và lớp đánh dấu vẽ bằng code (tọa độ = tỉ lệ ảnh 0..1).
// v: {src, aspect (rộng/cao ảnh), cam: [{at 0..1, x, y, zoom (1 = ảnh rộng bằng khung)}],
//     paths?: [{pts: [[x,y]], at, dur?, color?: 'red'|'ink', dash?}], marks?: [{x, y, at, label?: key, kind?: 'dot'|'x'|'box', dx?, dy?}],
//     tape?: key (nguồn), title?: key}
const MapPhoto: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const keys: {at: number; x: number; y: number; zoom: number}[] = (v.cam ?? [{at: 0, x: 0.5, y: 0.5, zoom: 1}]).map((c: V) => ({...c, at: Math.round(c.at * D)}));
  const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
  let cam = keys[keys.length - 1];
  if (frame <= keys[0].at) cam = keys[0];
  else
    for (let i = 1; i < keys.length; i++) {
      const [a, b] = [keys[i - 1], keys[i]];
      if (frame <= b.at) {
        const u = ease((frame - a.at) / Math.max(1, b.at - a.at));
        cam = {at: frame, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * u)};
        break;
      }
    }
  const aspect: number = v.aspect ?? 1;
  const iw = W * cam.zoom;
  const ih = iw / aspect;
  const left = W / 2 - cam.x * iw;
  const top = H / 2 - cam.y * ih;
  const paths: V[] = v.paths ?? [];
  const marks: V[] = v.marks ?? [];
  return (
    <AbsoluteFill style={{background: T.paperDark}}>
      <div style={{position: 'absolute', left, top, width: iw, height: ih}}>
        <Img src={asset(project, v.src)} style={{width: '100%', height: '100%', display: 'block', filter: 'sepia(0.35) saturate(0.85) contrast(1.05)'}} />
        <svg width={iw} height={ih} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {paths.map((pth, i) => {
            const at = Math.round((pth.at ?? 0) * D);
            const pr = interpolate(frame, [at, at + Math.round((pth.dur ?? 0.25) * D)], [0, 1], clamp);
            if (pr <= 0) return null;
            const pts: number[][] = pth.pts;
            const d = pts.map(([x, y], j) => `${j ? 'L' : 'M'} ${x * iw} ${y * ih}`).join(' ');
            let len = 0;
            for (let j = 1; j < pts.length; j++) len += Math.hypot((pts[j][0] - pts[j - 1][0]) * iw, (pts[j][1] - pts[j - 1][1]) * ih);
            const col = pth.color === 'ink' ? T.ink : T.red;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={T.paperEdge} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - pr)} opacity={0.7} />
                <path d={d} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={pth.dash ? '14 10' : len} strokeDashoffset={pth.dash ? 0 : len * (1 - pr)} opacity={pth.dash ? pr : 1} />
              </g>
            );
          })}
        </svg>
      </div>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 55%, ${T.vignette} 100%)`}} />
      {marks.map((m, i) => {
        const at = Math.round((m.at ?? 0) * D);
        const s = spring({frame: frame - at, fps, config: {stiffness: 200, damping: 13}});
        if (s <= 0.001) return null;
        const sx = left + m.x * iw;
        const sy = top + m.y * ih;
        const kind = m.kind ?? 'dot';
        return (
          <React.Fragment key={i}>
            {kind === 'dot' && <div style={{position: 'absolute', left: sx - 13, top: sy - 13, width: 26, height: 26, borderRadius: 13, background: T.red, border: `4px solid ${T.paperEdge}`, transform: `scale(${s})`}} />}
            {kind === 'x' && (
              <svg width={60} height={60} style={{position: 'absolute', left: sx - 30, top: sy - 30, transform: `scale(${s})`, overflow: 'visible'}}>
                <line x1={8} y1={8} x2={52} y2={52} stroke={T.paperEdge} strokeWidth={16} strokeLinecap="round" />
                <line x1={52} y1={8} x2={8} y2={52} stroke={T.paperEdge} strokeWidth={16} strokeLinecap="round" />
                <line x1={8} y1={8} x2={52} y2={52} stroke={T.red} strokeWidth={9} strokeLinecap="round" />
                <line x1={52} y1={8} x2={8} y2={52} stroke={T.red} strokeWidth={9} strokeLinecap="round" />
              </svg>
            )}
            {kind === 'box' && <div style={{position: 'absolute', left: sx - 16, top: sy - 24, width: 32, height: 48, background: '#c9b38d', border: `4px solid ${T.ink}`, transform: `scale(${s})`, boxShadow: `0 0 0 4px ${T.paperEdge}`}} />}
            {m.label && (
              <div
                style={{
                  position: 'absolute',
                  left: sx + (m.dx ?? 34),
                  top: sy + (m.dy ?? -22),
                  transform: m.dx != null && m.dx < 0 ? 'translateX(-100%)' : undefined,
                  opacity: Math.min(1, s * 2),
                  background: T.paperEdge,
                  border: `3px solid ${T.ink}`,
                  boxShadow: `3px 3px 0 ${T.ink}`,
                  padding: '4px 14px',
                  fontFamily: F.body,
                  fontWeight: 700,
                  fontSize: 30,
                  color: T.ink,
                  whiteSpace: 'nowrap',
                }}
              >
                {t(m.label)}
              </div>
            )}
          </React.Fragment>
        );
      })}
      {(v.title || v.tape) && (
        <div style={{position: 'absolute', left: W * 0.04, top: H * 0.05, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12}}>
          {v.title && <Tape text={t(v.title)} rot={-2} size={30} />}
          {v.tape && <Tape text={t(v.tape)} rot={1} size={18} />}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Dòng thời gian năm: các mốc (y thập phân) hiện dần, nhãn so le trên/dưới; `gap` tô dải đỏ có nhãn.
// v: {from, to, events: [{y, label: key, red?}], shown?: số mốc hiện sẵn, upto?: số mốc tối đa, focus?: chỉ số, gap?: [a, b], gapLabel?: key}
const Timeline: K = ({v, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const y0: number = v.from;
  const y1: number = v.to;
  const x0 = W * 0.07;
  const x1 = W * 0.93;
  const X = (y: number) => x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
  const cy = H * 0.47;
  const draw = interpolate(frame, [0, sec(fps, 0.6)], [0, 1], clamp);
  const events: {y: number; label: string; red?: boolean}[] = (v.events ?? []).slice(0, v.upto ?? 99);
  const shown: number = v.shown ?? 0;
  const fresh = Math.max(1, events.length - shown);
  const gap: number[] = v.gap ?? [];
  const gp = interpolate(frame, [Math.round(D * 0.3), Math.round(D * 0.6)], [0, 1], clamp);
  const step = Math.max(1, Math.round((y1 - y0) / 12));
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <line x1={x0} y1={cy} x2={x0 + (x1 - x0) * draw} y2={cy} stroke={T.ink} strokeWidth={5} />
        {Array.from({length: y1 - y0 + 1}, (_, i) => y0 + i).map((y) =>
          (y - y0) % step === 0 ? (
            <g key={y} opacity={draw}>
              <line x1={X(y)} y1={cy - 10} x2={X(y)} y2={cy + 10} stroke={T.ink} strokeWidth={2} />
              <text x={X(y)} y={cy + 44} fontSize={24} fontFamily={F.mono} fill={T.inkSoft} textAnchor="middle">
                {y}
              </text>
            </g>
          ) : null,
        )}
        {gap.length === 2 && gp > 0 && <rect x={X(gap[0])} y={cy - 70} width={(X(gap[1]) - X(gap[0])) * gp} height={140} fill={T.red} opacity={0.13} />}
      </svg>
      {events.map((ev, i) => {
        const at = i < shown ? -100 : sec(fps, 0.4) + (i - shown) * Math.round((D * 0.55) / fresh);
        const s = spring({frame: frame - at, fps, config: {stiffness: 200, damping: 14}});
        if (s <= 0.001) return null;
        const up = i % 2 === 0;
        const focus = v.focus === i;
        const col = ev.red || focus ? T.red : T.ink;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: X(ev.y) - 14, top: cy - 14, width: 28, height: 28, borderRadius: 14, background: col, border: `4px solid ${T.paperEdge}`, transform: `scale(${s * (focus ? 1.3 : 1)})`}} />
            <div style={{position: 'absolute', left: X(ev.y), top: up ? cy - 30 : cy + 70, width: 2, height: up ? 0 : 0}} />
            <div
              style={{
                position: 'absolute',
                left: Math.min(W * 0.84, Math.max(W * 0.02, X(ev.y) - 130)),
                top: up ? cy - 200 : cy + 70,
                width: 260,
                opacity: Math.min(1, s * 2),
                transform: `translateY(${(1 - s) * (up ? -20 : 20)}px)`,
                background: focus ? T.paperEdge : 'transparent',
                borderLeft: `6px solid ${col}`,
                padding: '6px 12px',
                boxShadow: focus ? `0 6px 12px ${T.shadow}` : undefined,
              }}
            >
              <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 28, lineHeight: 1.25, color: T.ink}}>{t(ev.label)}</div>
            </div>
          </React.Fragment>
        );
      })}
      {gap.length === 2 && v.gapLabel && (
        <div style={{position: 'absolute', left: (X(gap[0]) + X(gap[1])) / 2, top: cy + 190, transform: 'translateX(-50%)'}}>
          <StampText text={t(v.gapLabel)} at={Math.round(D * 0.55)} size={72} color={T.red} rot={-2} boxed />
        </div>
      )}
      {v.title && (
        <div style={{position: 'absolute', left: x0, top: H * 0.06}}>
          <Tape text={t(v.title)} rot={-1.5} size={26} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Minh họa so sánh âm thanh: hai dải "nốt nhạc hiệu" (thanh biên độ), nốt cao nhất yếu hẳn ở cả hai, khoanh đỏ;
// ba vạch tiếng phím. Dữ liệu sóng là hình minh họa, không phải bản ghi thật (ghi ở băng chú thích).
// v: {rows: [key, key?], show?: 1|2, clicks?: [key], note?: key}
const Wave: K = ({v, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const rows: string[] = v.rows ?? [];
  const show: number = v.show ?? rows.length;
  const clicks: string[] = v.clicks ?? [];
  // Giai điệu minh họa: 7 nốt, nốt thứ 5 là nốt cao nhất (bị yếu).
  const notes = [0.55, 0.7, 0.62, 0.8, 0.22, 0.66, 0.5];
  const x0 = W * 0.2;
  const x1 = W * 0.92;
  const nw = (x1 - x0) / notes.length;
  const rowY = (i: number) => H * (0.3 + i * 0.27);
  const amp = H * 0.1;
  const circleAt = Math.round(D * 0.45);
  return (
    <AbsoluteFill>
      {rows.slice(0, show).map((r, ri) => {
        const at = sec(fps, 0.2) + ri * Math.round(D * 0.2);
        const reveal = interpolate(frame, [at, at + sec(fps, 0.8)], [0, 1], clamp);
        const cy = rowY(ri);
        return (
          <React.Fragment key={ri}>
            <div style={{position: 'absolute', left: W * 0.04, top: cy - 40, width: W * 0.15, fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.2, color: ri ? T.blue : T.red}}>
              {t(r)}
            </div>
            <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
              <line x1={x0} y1={cy} x2={x1} y2={cy} stroke={T.landStroke} strokeWidth={2} />
              {notes.map((a, ni) =>
                Array.from({length: 22}, (_, k) => {
                  const x = x0 + ni * nw + (k + 2) * (nw / 26);
                  if ((x - x0) / (x1 - x0) > reveal) return null;
                  const env = Math.sin(((k + 1) / 23) * Math.PI);
                  const jitter = 0.75 + random(`w${ri}${ni}${k}`) * 0.25;
                  const h = amp * a * env * jitter;
                  return <line key={`${ni}-${k}`} x1={x} y1={cy - h} x2={x} y2={cy + h} stroke={ri ? T.blue : T.red} strokeWidth={4} strokeLinecap="round" />;
                }),
              )}
              {clicks.map((_, ci) => {
                const x = x0 + (ci === 0 ? 0.2 : ci === 1 ? 0.5 * notes.length : notes.length - 0.15) * nw;
                return (x - x0) / (x1 - x0) <= reveal ? <line key={ci} x1={x} y1={cy - amp * 1.1} x2={x} y2={cy + amp * 1.1} stroke={T.ink} strokeWidth={3} strokeDasharray="6 5" /> : null;
              })}
            </svg>
          </React.Fragment>
        );
      })}
      {show >= 1 && rows.length > 0 && (
        <>
          {rows.slice(0, show).map((_, ri) => (
            <MarkerCircle key={ri} x={x0 + 4.5 * nw} y={rowY(ri)} w={nw * 1.3} h={amp * 1.6} at={circleAt + ri * 6} />
          ))}
        </>
      )}
      {clicks.length > 0 && (
        <div style={{position: 'absolute', left: x0, top: rowY(Math.max(0, show - 1)) + amp * 1.25, width: x1 - x0, display: 'flex', justifyContent: 'space-between'}}>
          {clicks.map((c, ci) => (
            <Fade key={ci} at={Math.round(D * 0.55) + ci * 6}>
              <div style={{fontFamily: F.mono, fontSize: 22, color: T.ink, background: T.paperEdge, padding: '2px 8px'}}>{t(c)}</div>
            </Fade>
          ))}
        </div>
      )}
      {v.note && (
        <Fade at={circleAt + 10} style={{position: 'absolute', left: W * 0.58, top: H * 0.1, width: W * 0.36}}>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 32, lineHeight: 1.25, color: T.red}}>{t(v.note)}</div>
        </Fade>
      )}
      <div style={{position: 'absolute', right: W * 0.03, bottom: H * 0.17}}>
        <Tape text={t('u.waveNote')} rot={-1} size={18} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Danh sách có dấu: ✓ (đã xác định), ? (chưa rõ), × (bị bác), • (mục thường). `from`: các mục trước đó hiện sẵn.
// v: {title?: key, items: [{text: key, sub?: key, mark?: 'check'|'q'|'x'|'dot'}], from?, hot?: chỉ số}
const Mark: React.FC<{kind: string; size: number}> = ({kind, size}) => {
  const col = kind === 'q' || kind === 'x' ? T.red : T.ink;
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <rect x={4} y={4} width={52} height={52} fill={T.paperEdge} stroke={T.ink} strokeWidth={4} />
      {kind === 'check' && <path d="M 14 31 L 26 43 L 48 17" fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />}
      {kind === 'x' && <path d="M 16 16 L 44 44 M 44 16 L 16 44" fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" />}
      {kind === 'q' && (
        <text x={30} y={46} textAnchor="middle" fontFamily={F.display} fontSize={44} fill={col}>
          ?
        </text>
      )}
      {kind === 'dot' && <circle cx={30} cy={30} r={9} fill={col} />}
    </svg>
  );
};

const Checklist: K = ({v, t, D}) => {
  const {width: W, height: H, fps} = useVideoConfig();
  const items: {text: string; sub?: string; mark?: string}[] = v.items ?? [];
  const from: number = v.from ?? 0;
  const fresh = Math.max(1, items.length - from);
  const big = items.length <= 4;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: W * 0.1, top: H * (v.title ? 0.08 : 0.12), width: W * 0.8}}>
        {v.title && (
          <div style={{fontFamily: F.serif, fontWeight: 900, fontSize: 58, color: T.ink, borderBottom: `4px solid ${T.ink}`, paddingBottom: 10, marginBottom: 26}}>{t(v.title)}</div>
        )}
        {items.map((it, i) => {
          const at = i < from ? 0 : sec(fps, 0.3) + (i - from) * Math.round((D * 0.5) / fresh);
          const hot = v.hot === i || (v.hot == null && i >= from && fresh === 1);
          return (
            <Fade key={i} at={at} style={{display: 'flex', alignItems: 'center', gap: 26, marginBottom: big ? 26 : 16}}>
              <Mark kind={it.mark ?? 'dot'} size={big ? 66 : 54} />
              <div style={{background: hot ? T.paperEdge : 'transparent', padding: hot ? '6px 16px' : 0, boxShadow: hot ? `0 6px 12px ${T.shadow}` : undefined, borderLeft: hot ? `8px solid ${T.red}` : undefined}}>
                <div style={{fontFamily: F.body, fontWeight: 700, fontSize: big ? 42 : 36, lineHeight: 1.2, color: i < from && !hot ? T.inkSoft : T.ink}}>{t(it.text)}</div>
                {it.sub && <div style={{fontFamily: F.body, fontWeight: 500, fontSize: big ? 28 : 26, color: T.inkSoft, marginTop: 4}}>{t(it.sub)}</div>}
              </div>
            </Fade>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const CASE_SHOTS: Record<string, K> = {
  letter: Letter,
  boxplan: BoxPlan,
  calls: Calls,
  ladder: Ladder,
  mapphoto: MapPhoto,
  timeline: Timeline,
  wave: Wave,
  checklist: Checklist,
};

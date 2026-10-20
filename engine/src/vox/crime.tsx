import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {voxTheme as T} from '../theme';
import {voxFonts as F} from './fonts';
import {Cutout, StampText, Tape, asset, clamp, useEnter} from './paper';
import {useUsMap} from './UsMap';
import type {ShotCtx} from './shots';
import type {V} from './types';

// Các kind riêng cho phim tài liệu true crime (2026-truecrime-unabomber). Đăng ký qua CRIME_SHOTS trong shots.tsx.
type K = React.FC<ShotCtx>;
const sec = (fps: number, s: number) => Math.round(fps * s);

const Fade: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({at, children, style, dy = 16}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return <div style={{opacity: o, transform: `translateY(${(1 - o) * dy}px)`, ...style}}>{children}</div>;
};

// Thẻ chương: số lớn đỏ + tên chương, gạch chân quét ngang.
const Chapter: K = ({v, t}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const line = interpolate(frame, [sec(fps, 0.5), sec(fps, 1.1)], [0, W * 0.42], clamp);
  return (
    <AbsoluteFill style={{background: T.paperDark}}>
      <div style={{position: 'absolute', left: W * 0.1, top: H * 0.3}}>
        <Fade at={0}>
          <div style={{fontFamily: F.mono, fontSize: 34, letterSpacing: 10, color: T.landStroke}}>{t(v.label ?? 'u.chapter')}</div>
        </Fade>
        <StampText text={v.num} at={sec(fps, 0.1)} size={230} color={T.red} rot={-2} />
        <div style={{width: line, height: 8, background: T.red, margin: '10px 0 24px'}} />
        <Fade at={sec(fps, 0.7)}>
          <div style={{fontFamily: F.display, fontSize: 96, color: T.paper, letterSpacing: 2}}>{t(v.title).toUpperCase()}</div>
        </Fade>
      </div>
    </AbsoluteFill>
  );
};

// Bản đồ các vụ tới số `upto`; các số trong `focus` nổi lên (đỏ nếu có người chết) kèm thẻ ghi chú.
const BombMap: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const data = useUsMap(asset(project, 'usmap.json'));
  const cardE = useEnter(sec(fps, 0.5), 150, 15);
  if (!data) return null;
  const upto: number = v.upto ?? 16;
  const focus: number[] = v.focus ?? [];
  const mw = W * 0.66;
  const k = mw / data.width;
  const mh = data.height * k;
  const bombs = data.points.filter((p) => p.n > 0 && p.n <= upto);
  // Điểm trùng thành phố tách nhẹ quanh tâm.
  const seen = new Map<string, number>();
  const pts = bombs.map((p) => {
    const j = seen.get(p.place) ?? 0;
    seen.set(p.place, j + 1);
    const a = j * 2.3 - 0.4;
    const r = j === 0 ? 0 : 22;
    return {...p, ox: p.x + Math.cos(a) * r, oy: p.y + Math.sin(a) * r, first: j === 0};
  });
  const card: V | undefined = v.card;
  const ox = W * 0.04;
  const oy = (H - mh) / 2 - H * 0.02;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: ox, top: oy}}>
        <svg width={mw} height={mh} viewBox={`0 0 ${data.width} ${data.height}`} style={{overflow: 'visible', filter: `drop-shadow(0 8px 10px ${T.shadow})`}}>
          <g filter="url(#vox-rough)">
            {data.states.map((s) => (
              <path key={s.id} d={s.d} fill={T.land} stroke={T.landStroke} strokeWidth={1.1} />
            ))}
          </g>
          {pts.map((p, i) => {
            const isFocus = focus.includes(p.n);
            const at = isFocus ? sec(fps, 0.2) + focus.indexOf(p.n) * sec(fps, 0.35) : -100;
            const e = isFocus ? spring({frame: frame - at, fps, config: {stiffness: 200, damping: 12}}) : 1;
            if (e <= 0.001) return null;
            const col = p.death ? T.red : T.ink;
            const r = isFocus ? 15 : 11;
            const ring = isFocus ? interpolate(frame - at, [0, 20], [r, r * 3.4], clamp) : 0;
            const ringO = isFocus ? interpolate(frame - at, [0, 20], [0.9, 0], clamp) : 0;
            return (
              <g key={i} opacity={isFocus ? 1 : 0.55}>
                {isFocus && <circle cx={p.ox} cy={p.oy} r={ring} fill="none" stroke={col} strokeWidth={3} opacity={ringO} />}
                <circle cx={p.ox} cy={p.oy} r={r * e} fill={col} stroke={T.paperEdge} strokeWidth={2.5} />
                <text x={p.ox} y={p.oy + 5} fontSize={isFocus ? 15 : 12} fontFamily={F.mono} fontWeight={700} fill={T.paperEdge} textAnchor="middle" opacity={e}>
                  {p.n}
                </text>
                {isFocus && p.first && (
                  <text x={p.x + (p.lx ?? 22)} y={p.y + (p.ly ?? -18)} fontSize={18} fontFamily={F.mono} fontWeight={700} fill={T.ink} textAnchor={p.la ?? 'start'} opacity={e}>
                    {p.place.split(',')[0]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{position: 'absolute', right: W * 0.04, top: H * 0.08, textAlign: 'right'}}>
        <div style={{fontFamily: F.display, fontSize: 120, color: T.red, lineHeight: 1}}>{bombs.length}</div>
        <div style={{fontFamily: F.mono, fontSize: 30, color: T.ink}}>/ 16</div>
      </div>
      {card && (
        <div
          style={{
            position: 'absolute',
            right: W * 0.04,
            bottom: H * 0.17,
            maxWidth: W * 0.3,
            background: T.paperEdge,
            borderLeft: `12px solid ${T.red}`,
            padding: '18px 26px',
            boxShadow: `0 8px 14px ${T.shadow}`,
            transform: `translateX(${(1 - cardE) * 80}px) rotate(-1deg)`,
            opacity: Math.min(1, cardE * 2),
          }}
        >
          <div style={{fontFamily: F.display, fontSize: 64, color: T.ink, lineHeight: 1.05}}>{t(card.title)}</div>
          {(card.lines ?? []).map((l: string) => (
            <div key={l} style={{fontFamily: F.body, fontWeight: 600, fontSize: 30, color: T.inkSoft, marginTop: 8}}>
              {t(l)}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Trang hồ sơ (ảnh scan) cắt giấy bên trái, khung bút dạ đỏ quanh vùng `mark` [x,y,w,h] (tỉ lệ ảnh), tiêu đề + nguồn bên phải.
const DocPage: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const e = useEnter(0, 120, 16);
  const mark: number[] | undefined = v.mark;
  const mp = interpolate(frame, [Math.round(D * 0.3), Math.round(D * 0.3) + 16], [0, 1], clamp);
  // wide: crop tài liệu dạng dải ngang (vài dòng) đặt to ở trên, tiêu đề xuống dưới để chữ scan đọc được.
  const wide = !!v.wide;
  const pw = wide ? W * 0.86 : W * 0.5;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: wide ? W * 0.07 : W * 0.05,
          top: wide ? H * 0.1 : H * 0.5,
          ...(wide && v.aspect ? {maxWidth: pw} : {width: pw}),
          transform: `translateY(${wide ? 0 : -50}%) translateY(${(1 - e) * 70}px) rotate(${(wide ? -0.8 : -1.5) + (1 - e) * 4}deg)`,
          opacity: Math.min(1, e * 2),
          filter: `drop-shadow(0 12px 16px ${T.shadow})`,
        }}
      >
        <div style={{background: T.paperEdge, padding: v.photo ? 14 : 22}}>
          <div style={{position: 'relative'}}>
            <Img
              src={asset(project, v.src)}
              style={{
                // wide: ảnh cao tối đa 0.4H để tiêu đề ở 0.56H không đè lên; khung co theo ảnh.
                // `aspect` (rộng/cao ảnh) cho phép phóng ảnh nhỏ lên cho vừa; không có thì giữ cỡ gốc.
                ...(wide
                  ? v.aspect
                    ? {width: Math.min(pw - 44, H * 0.4 * v.aspect)}
                    : {width: '100%', maxHeight: H * 0.78, objectFit: 'contain' as const}
                  : {width: '100%', maxHeight: H * 0.78, objectFit: 'contain' as const}),
                display: 'block',
                filter: v.photo ? 'saturate(0.8) sepia(0.12)' : 'contrast(1.1)',
              }}
            />
            {mark && (
              <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect
                  x={mark[0] * 100}
                  y={mark[1] * 100}
                  width={mark[2] * 100}
                  height={mark[3] * 100}
                  fill={T.highlight}
                  opacity={0.35 * mp}
                  rx={1}
                />
                <rect
                  x={mark[0] * 100}
                  y={mark[1] * 100}
                  width={mark[2] * 100}
                  height={mark[3] * 100}
                  fill="none"
                  stroke={T.red}
                  strokeWidth={0.6}
                  vectorEffect="non-scaling-stroke"
                  style={{strokeWidth: 6}}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - mp}
                  rx={1}
                />
              </svg>
            )}
          </div>
        </div>
        <div style={{position: 'absolute', right: -6, bottom: -20}}>
          <Tape text={t(v.tape ?? (v.photo ? 'c.fbi' : 'c.fbiDoc'))} rot={-3} size={17} />
        </div>
      </div>
      <div style={wide ? {position: 'absolute', left: W * 0.08, top: H * 0.56, width: W * 0.8} : {position: 'absolute', left: W * 0.6, top: H * 0.3, width: W * 0.35}}>
        <StampText text={t(v.title)} at={sec(fps, 0.4)} size={t(v.title).length > 22 ? 58 : 76} color={T.red} rot={-2} style={{whiteSpace: 'normal', lineHeight: 1.05}} />
        {v.sub && (
          <Fade at={sec(fps, 0.9)} style={{marginTop: 26}}>
            <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 34, color: T.inkSoft, lineHeight: 1.35}}>{t(v.sub)}</div>
          </Fade>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Thước năm: mỗi năm một vạch, chấm theo số vụ trong năm, khoảng `gap` tô đỏ có nhãn.
const YearBar: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const data = useUsMap(asset(project, 'usmap.json'));
  if (!data) return null;
  const y0: number = v.from ?? 1978;
  const y1: number = v.to ?? 1996;
  const x0 = W * 0.08;
  const x1 = W * 0.92;
  const X = (y: number) => x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
  const yr = (d: string) => {
    const [a, b, c] = d.split('-').map(Number);
    return a + (b - 1) / 12 + (c - 1) / 365;
  };
  const draw = interpolate(frame, [0, sec(fps, 0.8)], [0, 1], clamp);
  const gap: number[] = v.gap ?? [];
  const gp = interpolate(frame, [Math.round(D * 0.25), Math.round(D * 0.55)], [0, 1], clamp);
  const cy = H * 0.52;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <line x1={x0} y1={cy} x2={x0 + (x1 - x0) * draw} y2={cy} stroke={T.ink} strokeWidth={5} />
        {Array.from({length: y1 - y0 + 1}, (_, i) => y0 + i).map((y) => (
          <g key={y} opacity={X(y) <= x0 + (x1 - x0) * draw ? 1 : 0}>
            <line x1={X(y)} y1={cy - 14} x2={X(y)} y2={cy + 14} stroke={T.ink} strokeWidth={2} />
            {(y - y0) % 2 === 0 && (
              <text x={X(y)} y={cy + 58} fontSize={26} fontFamily={F.mono} fill={T.inkSoft} textAnchor="middle">
                {y}
              </text>
            )}
          </g>
        ))}
        {data.points
          .filter((p) => p.n > 0)
          .map((p) => (
            <circle key={p.id} cx={X(yr(p.date))} cy={cy - 40} r={13} fill={p.death ? T.red : T.ink} stroke={T.paperEdge} strokeWidth={2.5} opacity={draw} />
          ))}
        {gap.length === 2 && gp > 0 && (
          <g>
            <rect x={X(gap[0])} y={cy - 90} width={(X(gap[1]) - X(gap[0])) * gp} height={180} fill={T.red} opacity={0.14} />
            <path
              d={`M ${X(gap[0])} ${cy + 90} L ${X(gap[0])} ${cy + 110} L ${X(gap[0]) + (X(gap[1]) - X(gap[0])) * gp} ${cy + 110} L ${X(gap[0]) + (X(gap[1]) - X(gap[0])) * gp} ${cy + 90}`}
              fill="none"
              stroke={T.red}
              strokeWidth={6}
            />
          </g>
        )}
      </svg>
      {gap.length === 2 && (
        <div style={{position: 'absolute', left: (X(gap[0]) + X(gap[1])) / 2, top: cy + 130, transform: 'translateX(-50%)'}}>
          <StampText text={t(v.label)} at={Math.round(D * 0.5)} size={84} color={T.red} rot={-2} boxed />
        </div>
      )}
    </AbsoluteFill>
  );
};

// Tem bưu chính vẽ bằng code (không chép hình tem thật): khung răng cưa, mệnh giá $1, ngày dưới tem.
const StampCard: React.FC<{at: number; year: string; rot: number}> = ({at, year, rot}) => {
  const e = useEnter(at, 180, 13);
  const w = 260;
  const h = 320;
  const teeth = 14;
  return (
    <div style={{opacity: Math.min(1, e * 2), transform: `translateY(${(1 - e) * -80}px) rotate(${rot}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
      <svg width={w} height={h} style={{filter: `drop-shadow(0 10px 12px ${T.shadow})`}}>
        <defs>
          <mask id={`perf${year.replace('/', '')}`}>
            <rect width={w} height={h} fill="#fff" />
            {Array.from({length: teeth + 1}, (_, i) => (
              <g key={i}>
                <circle cx={(i * w) / teeth} cy={0} r={7} fill="#000" />
                <circle cx={(i * w) / teeth} cy={h} r={7} fill="#000" />
                <circle cx={0} cy={(i * h) / teeth} r={7} fill="#000" />
                <circle cx={w} cy={(i * h) / teeth} r={7} fill="#000" />
              </g>
            ))}
          </mask>
        </defs>
        <g mask={`url(#perf${year.replace('/', '')})`}>
          <rect width={w} height={h} fill={T.paperEdge} />
          <rect x={22} y={22} width={w - 44} height={h - 44} fill="#5b3f6e" />
          <text x={w / 2} y={h * 0.62} fontSize={110} fontFamily={F.display} fill={T.paperEdge} textAnchor="middle">
            $1
          </text>
          <text x={w / 2} y={h * 0.82} fontSize={20} fontFamily={F.mono} fill={T.paperEdge} textAnchor="middle" letterSpacing={3}>
            USA
          </text>
        </g>
      </svg>
      <div style={{fontFamily: F.display, fontSize: 60, color: T.ink}}>{year}</div>
    </div>
  );
};

const Stamps: K = ({v, t, D}) => {
  const {width: W, height: H, fps} = useVideoConfig();
  const years: string[] = v.years ?? [];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: H * 0.07, width: W, textAlign: 'center'}}>
        <StampText text={t(v.title)} at={0} size={84} color={T.ink} rot={-1} style={{display: 'inline-block'}} />
      </div>
      <div style={{position: 'absolute', top: H * 0.27, width: W, display: 'flex', justifyContent: 'center', gap: W * 0.07}}>
        {years.map((y, i) => (
          <StampCard key={y} at={sec(fps, 0.4) + i * Math.round(D * 0.12)} year={y} rot={[-4, 2, -1][i % 3]} />
        ))}
      </div>
      {v.sub && (
        <Fade at={Math.round(D * 0.5)} style={{position: 'absolute', top: H * 0.74, width: W, textAlign: 'center'}}>
          <div style={{fontFamily: F.mono, fontSize: 28, color: T.inkSoft}}>{t(v.sub)}</div>
        </Fade>
      )}
    </AbsoluteFill>
  );
};

// Thẻ hồ sơ nhân vật: ảnh halftone bên trái, các dòng [mốc, nội dung] hiện dần, dòng nguồn dưới cùng.
// `from`: các dòng có chỉ số < from hiện ngay (shot nối tiếp shot trước).
const FactCard: K = ({v, t, project, D}) => {
  const {width: W, height: H, fps} = useVideoConfig();
  const rows: string[][] = v.rows ?? [];
  const from: number = v.from ?? 0;
  const n = Math.max(1, rows.length - from);
  return (
    <AbsoluteFill>
      {v.img && <Cutout src={asset(project, v.img)} x={W * 0.24} y={H * 0.48} w={W * 0.3} rot={-2.5} at={0} caption={t(v.imgCaption ?? 'c.fbi')} halftone />}
      <div style={{position: 'absolute', left: W * 0.45, top: H * 0.16, width: W * 0.5}}>
        <div style={{fontFamily: F.serif, fontWeight: 900, fontSize: 64, color: T.ink, borderBottom: `4px solid ${T.ink}`, paddingBottom: 12, marginBottom: 26}}>
          {t(v.title)}
        </div>
        {rows.map(([k, val], i) => (
          <Fade key={k} at={i < from ? 0 : sec(fps, 0.4) + (i - from) * Math.round((D * 0.55) / n)} style={{display: 'flex', gap: 26, alignItems: 'baseline', marginBottom: 26}}>
            <div style={{fontFamily: F.display, fontSize: 56, color: T.red, minWidth: W * 0.11}}>{t(k)}</div>
            <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 34, color: T.ink, lineHeight: 1.3}}>{t(val)}</div>
          </Fade>
        ))}
        {v.src && (
          <Fade at={sec(fps, 0.8)} style={{marginTop: 30}}>
            <div style={{fontFamily: F.mono, fontSize: 22, color: T.inkSoft}}>{t(v.src)}</div>
          </Fade>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const CRIME_SHOTS: Record<string, K> = {
  chapter: Chapter,
  bombmap: BombMap,
  docpage: DocPage,
  yearbar: YearBar,
  stamps: Stamps,
  factcard: FactCard,
};

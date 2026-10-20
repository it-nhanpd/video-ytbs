import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {voxTheme as T} from '../theme';
import {voxFonts as F} from './fonts';
import {Atmos} from './atmos';
import {camAt, camStyle} from './camera';
import {Tape, asset, clamp, useEnter} from './paper';
import type {ShotCtx} from './shots';

// Các kind "điện ảnh" (reenactment-first.md: hình theo vai trò nhịp). Đăng ký qua CINE_SHOTS trong shots.tsx.
// Các kind này tự lo camera (SELF_CAM), VoxVideo không đẩy/rung thêm lớp ngoài.
type K = React.FC<ShotCtx>;
const sec = (fps: number, s: number) => Math.round(fps * s);
const ease = Easing.bezier(0.45, 0, 0.55, 1);

// Màu (grade) phủ lên cảnh: lọc ảnh + lớp màu nhân.
const GRADES: Record<string, {filter: string; tint?: string}> = {
  night: {filter: 'brightness(0.62) saturate(0.7) contrast(1.08)', tint: 'rgba(28,44,74,0.42)'},
  dusk: {filter: 'brightness(0.86) saturate(0.85)', tint: 'rgba(150,84,40,0.22)'},
  cold: {filter: 'brightness(0.9) saturate(0.6) contrast(1.05)', tint: 'rgba(60,80,100,0.2)'},
  warm: {filter: 'saturate(0.9) sepia(0.12)', tint: 'rgba(170,120,60,0.12)'},
  old: {filter: 'grayscale(0.55) sepia(0.35) contrast(1.1)', tint: 'rgba(120,90,50,0.12)'},
};

// Nhãn chữ phụ đè lên cảnh (số liệu, giờ, nguồn): gõ dần từng ký tự, nền tối, vạch đỏ bên trái.
type Chip = {text: string; at?: number; pos?: 'tl' | 'tr' | 'bl' | 'br'; big?: boolean};
const Chips: React.FC<{chips?: Chip[]; t: (k?: string) => string; D: number}> = ({chips, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  if (!chips?.length) return null;
  const used: Record<string, number> = {}; // px đã dùng theo góc
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {chips.map((c, i) => {
        const pos = c.pos ?? 'tl';
        const at = Math.round(D * (c.at ?? 0.15));
        const text = t(c.text);
        const shown = Math.floor(interpolate(frame, [at, at + Math.max(8, text.length * 1.2)], [0, text.length], clamp));
        if (frame < at) return null;
        const size = c.big ? 54 : 30;
        const off = used[pos] ?? 0;
        used[pos] = off + size * 1.9;
        const top = pos[0] === 't' ? H * 0.07 + off : undefined;
        const bottom = pos[0] === 'b' ? H * 0.19 + off : undefined;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top,
              bottom,
              ...(pos[1] === 'l' ? {left: W * 0.045} : {right: W * 0.045}),
              background: 'rgba(14,12,10,0.78)',
              borderLeft: `6px solid ${T.red}`,
              color: '#f3ede0',
              fontFamily: c.big ? F.display : F.mono,
              fontSize: size,
              letterSpacing: c.big ? 1 : 0,
              padding: c.big ? '6px 22px' : '8px 18px',
              maxWidth: W * 0.5,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.25,
            }}
          >
            {text.slice(0, shown)}
            <span style={{opacity: shown < text.length ? 1 : 0}}>▌</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Cảnh 2.5D: các lớp ảnh (nền xa → tiền cảnh) trôi theo camera với hệ số parallax z; không khí chen giữa nền và tiền cảnh.
// v: {img? | layers:[{img, z?: 1, fit?: 'cover'|'contain', opacity?}], cam?, amt?, fx?, fy?, grade?, atmos?: [...], dim?,
//     over?: 1.1 (phóng sẵn nền, tăng để cắt viền giấy trắng của ảnh AI), ox?: 0.5 (tâm phóng sẵn theo chiều ngang; 0 = cắt mép phải),
//     ai?: true (nhãn "Minh họa"), credit? (key nguồn ảnh), label? (key băng giấy), chips?: Chip[], title?, sub?}
const Scene25: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const layers: {img: string; z?: number; fit?: string; opacity?: number}[] = v.layers ?? [{img: v.img, z: 1}];
  const cam = camAt(v.cam ?? 'push', frame, D, fps, String(v.img ?? layers[0].img), v.fx, v.fy, v.amt ?? 1);
  const g = GRADES[v.grade as string];
  const fade = interpolate(frame, [0, sec(fps, 0.35)], [0, 1], clamp);
  const layer = (l: (typeof layers)[number], i: number) => (
    <AbsoluteFill key={i} style={{...camStyle(cam, W, H, l.z ?? 1), opacity: l.opacity ?? 1}}>
      <Img
        src={asset(project, l.img)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: (l.fit ?? 'cover') as 'cover',
          // Nền phóng sẵn 10%: pan/rung không lộ mép, và cắt viền giấy trắng của ảnh AI.
          transform: (l.z ?? 1) <= 1 ? `scale(${v.over ?? (v.ai ? 1.2 : 1.1)})` : undefined,
          transformOrigin: `${(v.ox ?? 0.5) * 100}% 50%`,
          filter: g?.filter,
        }}
      />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{background: T.paperDark, overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: fade}}>
        {layers.filter((l) => (l.z ?? 1) <= 1).map(layer)}
        {g?.tint && <AbsoluteFill style={{background: g.tint, mixBlendMode: 'multiply'}} />}
        <Atmos list={v.atmos} seed={String(v.img ?? layers[0].img)} />
        {layers.filter((l) => (l.z ?? 1) > 1).map(layer)}
        {v.dim > 0 && <AbsoluteFill style={{background: `rgba(10,8,6,${v.dim})`}} />}
        <AbsoluteFill style={{background: `radial-gradient(ellipse at center, transparent 60%, rgba(8,6,4,0.5) 100%)`}} />
      </AbsoluteFill>
      {v.title && <TitleOver title={t(v.title)} sub={v.sub ? t(v.sub) : undefined} D={D} />}
      <Chips chips={v.chips} t={t} D={D} />
      {(v.label || v.ai || v.credit) && (
        <div style={{position: 'absolute', left: W * 0.045, bottom: H * 0.19, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10}}>
          {v.label && <Tape text={t(v.label)} rot={-2} size={26} />}
          {(v.ai || v.credit) && <Tape text={v.ai ? t('c.ai') : t(v.credit)} rot={1} size={17} />}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Tựa lớn đè lên cảnh (mở đầu/chương): chữ trắng hiện dần, dòng phụ đỏ.
const TitleOver: React.FC<{title: string; sub?: string; D: number}> = ({title, sub, D}) => {
  const frame = useCurrentFrame();
  const {height: H} = useVideoConfig();
  const a = interpolate(frame, [8, 30], [0, 1], clamp);
  const b = interpolate(frame, [26, 44], [0, 1], clamp);
  const out = interpolate(frame, [D - 10, D], [1, 0], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: out}}>
      <div
        style={{
          fontFamily: F.display,
          fontSize: 150,
          color: '#f3ede0',
          letterSpacing: 6,
          opacity: a,
          transform: `scale(${1.08 - 0.08 * a})`,
          textShadow: '0 6px 30px rgba(0,0,0,0.7)',
          textAlign: 'center',
          lineHeight: 1,
        }}
      >
        {title}
      </div>
      {sub && (
        <div style={{marginTop: H * 0.03, fontFamily: F.mono, fontSize: 34, color: T.red, opacity: b, letterSpacing: 4, background: 'rgba(10,8,6,0.6)', padding: '6px 18px'}}>
          {sub}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Tài liệu gốc đặt trên bàn điều tra: giấy trượt vào, camera lướt tới câu được trích, bút dạ quang tô câu đó,
// bản dịch hiện trên băng giấy, quầng đèn bàn + bụi. Dùng cho nhịp "chứng cứ".
// v: {src, aspect (rộng/cao, builder đọc từ PNG), mark?: [x,y,w,h] (tỉ lệ ảnh), markAt?: 0.35, trans? (key dịch),
//     source? (key nguồn), bg?: 'ai/ai_desk.jpg', photo?: true (ảnh in viền trắng), zoom?: tối đa 1.7, atmos?,
//     note?: {lines: [key], sign?: key} (thư chép lại bằng chữ máy, khi không có ảnh văn bản), chips?}
const Desk: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const note = v.note as {lines: string[]; sign?: string} | undefined;
  const aspect: number = note ? 1.5 : (v.aspect ?? 1.4);
  const dw = Math.min(W * (v.w ?? (note ? 0.5 : 0.6)), H * 0.74 * aspect);
  const dh = dw / aspect;
  const left = (W - dw) / 2;
  const top = (H - dh) / 2 - H * 0.03;
  const e = useEnter(0, 90, 15);
  const mark: number[] | undefined = v.mark;
  const markAt = Math.round(D * (v.markAt ?? 0.35));
  // Camera: tới tâm vùng trích sao cho vùng trích rộng ~62% khung (giới hạn zoom); không có vùng trích thì đẩy nhẹ.
  const P = mark ? [left + (mark[0] + mark[2] / 2) * dw, top + (mark[1] + mark[3] / 2) * dh] : [W / 2, H / 2];
  const zT = mark ? Math.min(v.zoom ?? 1.7, Math.max(1.05, (W * 0.62) / (mark[2] * dw))) : 1.06;
  const k = ease(interpolate(frame, [sec(fps, 0.3), Math.max(sec(fps, 0.4), markAt)], [0, 1], clamp));
  const drift = interpolate(frame, [markAt, D], [0, 0.03], clamp);
  const s = 1 + (zT - 1) * k + drift;
  const C = [W / 2, H * 0.47];
  const tx = (C[0] - P[0] * s) * k + (1 - k) * ((W / 2) * (1 - s));
  const ty = (C[1] - P[1] * s) * k + (1 - k) * ((H / 2) * (1 - s));
  const hl = interpolate(frame, [markAt, markAt + sec(fps, 0.6)], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const transIn = interpolate(frame, [markAt + sec(fps, 0.3), markAt + sec(fps, 0.7)], [0, 1], clamp);
  const typed = note ? Math.floor(interpolate(frame, [sec(fps, 0.5), D * 0.75], [0, 1], clamp) * 400) : 0;
  let budget = typed;
  return (
    <AbsoluteFill style={{background: '#120e0a', overflow: 'hidden'}}>
      <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
        <Img src={asset(project, v.bg ?? 'ai/ai_desk.jpg')} style={{position: 'absolute', inset: -40, width: W + 80, height: H + 80, objectFit: 'cover', filter: 'brightness(0.55) saturate(0.8)'}} />
        <div
          style={{
            position: 'absolute',
            left,
            top,
            width: dw,
            height: dh,
            transform: `translateY(${(1 - e) * H * 0.5}px) rotate(${-1.2 + (1 - e) * 5}deg)`,
            boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
            background: note ? '#efe6d2' : '#f6f2e8',
            padding: v.photo ? dw * 0.03 : 0,
            boxSizing: 'border-box',
          }}
        >
          {note ? (
            <div style={{padding: dw * 0.09, fontFamily: F.mono, fontSize: dw * 0.042, lineHeight: 1.55, color: '#22201c'}}>
              {[...note.lines, ...(note.sign ? [note.sign] : [])].map((key, i) => {
                const txt = t(key);
                const n = Math.max(0, Math.min(txt.length, budget));
                budget -= txt.length;
                return (
                  <div key={i} style={{marginTop: i === note.lines.length ? dw * 0.06 : 0, textAlign: i === note.lines.length ? 'right' : 'left', minHeight: '1.55em'}}>
                    {txt.slice(0, n)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
              <Img src={asset(project, v.src)} style={{width: '100%', height: '100%', display: 'block', filter: v.photo ? 'saturate(0.8) sepia(0.12)' : 'contrast(1.12) sepia(0.06)'}} />
              {mark && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${mark[0] * 100}%`,
                    top: `${mark[1] * 100}%`,
                    width: `${mark[2] * 100 * hl}%`,
                    height: `${mark[3] * 100}%`,
                    background: 'rgba(255,214,40,0.5)',
                    mixBlendMode: 'multiply',
                    borderRadius: 3,
                  }}
                />
              )}
            </div>
          )}
        </div>
      </AbsoluteFill>
      <Atmos list={v.atmos ?? ['lamp', 'dust']} seed={String(v.src ?? 'note')} lampX={0.35} lampY={0.35} />
      {v.trans && (
        <div
          style={{
            position: 'absolute',
            left: v.chips?.length ? W * 0.42 : W * 0.14,
            right: W * 0.14,
            top: H * 0.06,
            opacity: transIn,
            transform: `translateY(${(1 - transIn) * -20}px)`,
            display: 'flex',
            justifyContent: v.chips?.length ? 'flex-end' : 'center',
          }}
        >
          <div style={{background: T.paperEdge, padding: '14px 26px', boxShadow: `0 8px 20px rgba(0,0,0,0.5)`, transform: 'rotate(-0.6deg)', maxWidth: '100%'}}>
            <span style={{fontFamily: F.mono, fontSize: 20, color: T.red, marginRight: 14, letterSpacing: 2}}>{t('u.trans')}</span>
            <span style={{fontFamily: F.bodyItalic, fontSize: 32, color: T.ink, lineHeight: 1.35}}>{t(v.trans)}</span>
          </div>
        </div>
      )}
      <Chips chips={v.chips} t={t} D={D} />
      {v.source && (
        <div style={{position: 'absolute', right: W * 0.04, bottom: H * 0.19}}>
          <Tape text={t(v.source)} rot={-1.5} size={19} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// Bảng chứng cứ: thẻ ghim (chữ hoặc ảnh), chỉ đỏ nối ghim; thẻ mới (có `at`) rơi vào, chỉ mới căng dần.
// Lặp lại qua video, mỗi lần thêm chứng cứ (builder giữ trạng thái bảng). Thẻ còn tranh cãi: q → dấu "?" đỏ.
// v: {cards: [{id, text, sub?, x, y (tâm, tỉ lệ khung), w? (0.15), img?, q?, at? (0..1), rot?}], links?: [[a, b, at?]],
//     focus?: id (camera tiến về thẻ), bg?: 'ai/ai_board.jpg', chips?}
type Card = {id: string; text?: string; sub?: string; x: number; y: number; w?: number; img?: string; q?: boolean; at?: number; rot?: number};
const BoardCard: React.FC<{c: Card; t: (k?: string) => string; project: string; D: number}> = ({c, t, project, D}) => {
  const {width: W, height: H} = useVideoConfig();
  const at = c.at === undefined ? -30 : Math.round(D * c.at);
  const e = useEnter(at, 170, 14);
  const frame = useCurrentFrame();
  const qe = interpolate(frame, [at + 14, at + 22], [0, 1], clamp);
  const w = (c.w ?? 0.15) * W;
  if (e <= 0.001) return null;
  const rot = c.rot ?? 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: c.x * W,
        top: c.y * H,
        width: w,
        transform: `translate(-50%, -50%) translateY(${(1 - e) * -60}px) rotate(${rot + (1 - e) * 8}deg) scale(${1.12 - 0.12 * e})`,
        opacity: Math.min(1, e * 2),
        background: c.img ? '#f4efe4' : '#f2ead6',
        padding: c.img ? `${w * 0.05}px ${w * 0.05}px ${w * 0.03}px` : `${w * 0.09}px ${w * 0.08}px`,
        boxShadow: '0 10px 18px rgba(0,0,0,0.55)',
        boxSizing: 'border-box',
      }}
    >
      {c.img && <Img src={asset(project, c.img)} style={{width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block', filter: 'saturate(0.75) sepia(0.15) contrast(1.05)'}} />}
      {c.text && (
        <div style={{fontFamily: F.body, fontWeight: 800, fontSize: w * 0.12, lineHeight: 1.15, color: T.ink, marginTop: c.img ? w * 0.04 : 0, textAlign: 'center'}}>{t(c.text)}</div>
      )}
      {c.sub && <div style={{fontFamily: F.mono, fontSize: w * 0.075, color: T.inkSoft, marginTop: w * 0.03, textAlign: 'center'}}>{t(c.sub)}</div>}
      {/* Ghim đỏ */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -10,
          width: 22,
          height: 22,
          marginLeft: -11,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #ff7a6a, #b3241a 60%, #6e140e)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
        }}
      />
      {c.q && (
        <div
          style={{
            position: 'absolute',
            right: -w * 0.12,
            top: -w * 0.16,
            fontFamily: F.display,
            fontSize: w * 0.34,
            color: T.red,
            transform: `rotate(12deg) scale(${1.6 - 0.6 * qe})`,
            opacity: qe,
            textShadow: '0 3px 6px rgba(0,0,0,0.45)',
          }}
        >
          ?
        </div>
      )}
    </div>
  );
};

const Board: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const cards: Card[] = v.cards ?? [];
  const byId = Object.fromEntries(cards.map((c) => [c.id, c]));
  const focus = v.focus ? byId[v.focus] : undefined;
  // Camera: tiến về thẻ đang nói (focus), không thì đẩy nhẹ toàn bảng.
  const k = ease(interpolate(frame, [0, D], [0, 1], clamp));
  const zT = focus ? (v.zoom ?? 1.35) : 1.05;
  const s = 1 + (zT - 1) * k;
  // Phóng quanh thẻ focus (thẻ đó đứng yên, thẻ khác giãn ra), không dịch cả bảng nên không thẻ nào bị cắt khỏi khung ở mức zoom ≤ 1,15.
  const origin = focus ? `${focus.x * W}px ${focus.y * H}px` : '50% 50%';
  const pinY = (c: Card) => c.y * H - ((c.img ? 1.05 : 0.55) * (c.w ?? 0.15) * W) / 2 + 2;
  return (
    <AbsoluteFill style={{background: '#1a140e', overflow: 'hidden'}}>
      <AbsoluteFill style={{transformOrigin: origin, transform: `scale(${s})`}}>
        <Img src={asset(project, v.bg ?? 'ai/ai_board.jpg')} style={{position: 'absolute', inset: -40, width: W + 80, height: H + 80, objectFit: 'cover', transform: 'scale(1.14)', filter: 'brightness(0.62) saturate(0.85)'}} />
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {(v.links ?? []).map(([a, b, at]: [string, string, number?], i: number) => {
            const A = byId[a];
            const B = byId[b];
            if (!A || !B) return null;
            const st = at === undefined ? -30 : Math.round(D * at);
            const p = interpolate(frame, [st, st + sec(fps, 0.5)], [0, 1], clamp);
            if (p <= 0) return null;
            const x1 = A.x * W;
            const y1 = pinY(A);
            const x2 = B.x * W;
            const y2 = pinY(B);
            const sag = Math.hypot(x2 - x1, y2 - y1) * 0.08;
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag} ${x2} ${y2}`}
                stroke="#c42a1e"
                strokeWidth={4}
                fill="none"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
                style={{filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.5))'}}
              />
            );
          })}
        </svg>
        {cards.map((c) => (
          <BoardCard key={c.id} c={c} t={t} project={project} D={D} />
        ))}
      </AbsoluteFill>
      <Atmos list={v.atmos ?? ['lamp']} seed="board" lampX={0.5} lampY={0.3} />
      <Chips chips={v.chips} t={t} D={D} />
    </AbsoluteFill>
  );
};

export const CINE_SHOTS: Record<string, K> = {scene25: Scene25, desk: Desk, board: Board};
export const SELF_CAM = new Set(['scene25', 'desk', 'board']);

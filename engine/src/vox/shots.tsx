import React from 'react';
import {AbsoluteFill, Img, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {voxTheme as T} from '../theme';
import {voxFonts as F} from './fonts';
import {BgImage, Cutout, MarkerCircle, RedX, StampText, Tape, asset, clamp, useEnter} from './paper';
import {UsMap, mapCount, mapYear, useUsMap} from './UsMap';
import {GeoMap, useGeoMap, type CamKey, type GeoLabel} from './GeoMap';
import {CRIME_SHOTS} from './crime';
import {HISTORY_SHOTS} from './history';
import {CASE_SHOTS} from './case';
import {CINE_SHOTS} from './cine';
import type {V} from './types';

export type ShotCtx = {v: V; t: (k?: string) => string; project: string; D: number};
type K = React.FC<ShotCtx>;

const sec = (fps: number, s: number) => Math.round(fps * s);

// Chữ phụ (Be Vietnam Pro / mono) trượt lên.
const Sub: React.FC<{text: string; at: number; size?: number; color?: string; mono?: boolean; style?: React.CSSProperties}> = ({
  text,
  at,
  size = 46,
  color = T.inkSoft,
  mono,
  style,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 1], clamp);
  return (
    <div
      style={{
        fontFamily: mono ? F.mono : F.body,
        fontWeight: mono ? 700 : 600,
        fontSize: size,
        color,
        opacity: o,
        transform: `translateY(${(1 - o) * 18}px)`,
        letterSpacing: mono ? 3 : 0,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Số chạy (3, 16, 23): chỉ khi chuỗi là số nguyên thuần.
const useCount = (to: number, at: number, dur: number) => {
  const frame = useCurrentFrame();
  return Math.round(interpolate(frame, [at, at + dur], [0, to], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)}));
};

const Stamp: K = ({v, t, project}) => {
  const {width: W, height: H, fps} = useVideoConfig();
  const dark = !!v.dark;
  const color = v.color === 'red' ? T.red : dark ? T.paper : T.ink;
  const n = useCount(v.count ?? 0, sec(fps, 0.15), sec(fps, 1.2));
  const side = v.imgSide === 'right' ? 'right' : 'left';
  const hasImg = !!v.img;
  const textX = hasImg ? (side === 'left' ? W * 0.68 : W * 0.33) : W / 2;
  return (
    <AbsoluteFill>
      {v.bg && <BgImage src={asset(project, v.bg)} dim={dark ? 0.72 : 0.12} />}
      {hasImg && (
        <Cutout
          src={asset(project, v.img)}
          x={side === 'left' ? W * 0.3 : W * 0.7}
          y={H * 0.48}
          w={W * 0.4}
          rot={side === 'left' ? -4 : 4}
          at={sec(fps, 0.05)}
          caption={t(v.imgCaption)}
        />
      )}
      <div style={{position: 'absolute', left: textX, top: H * 0.46, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
        <StampText
          text={v.count ? String(n) : t(v.text)}
          at={v.count ? 0 : sec(fps, 0.25)}
          size={v.count ? 330 : t(v.text).length > 8 ? 150 : 230}
          color={color}
          boxed={v.color === 'red' && !v.count}
        />
        {v.sub && (
          <Sub
            text={t(v.sub)}
            at={sec(fps, 0.6)}
            mono
            size={42}
            color={dark ? T.paper : T.inkSoft}
            style={{marginTop: 24, textAlign: 'center', maxWidth: W * 0.7, ...(v.bg ? {background: dark ? T.subPlateDark : T.stampPlate, padding: '8px 20px'} : {})}}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

// Biểu tượng vẽ bằng nét (không dùng ảnh): vân tay, camera an ninh.
const Icon: React.FC<{kind: string; size: number}> = ({kind, size}) =>
  kind === 'finger' ? (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={T.ink} strokeWidth={3.2} strokeLinecap="round">
      {[10, 17, 24, 31, 38].map((r, i) => (
        <path key={r} d={`M ${50 - r} ${58 + i} C ${50 - r} ${58 - r * 1.25}, ${50 + r} ${58 - r * 1.25}, ${50 + r} ${58 + i * 2}`} />
      ))}
      <path d="M 50 50 L 50 86" />
      <path d="M 36 70 C 38 82, 42 88, 44 92" />
      <path d="M 64 66 C 62 80, 58 88, 56 92" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={T.ink} strokeWidth={3.2} strokeLinejoin="round">
      <rect x="14" y="30" width="56" height="26" rx="4" transform="rotate(12 42 43)" />
      <path d="M 70 44 L 84 38 L 86 58 L 72 56" transform="rotate(12 42 43)" />
      <path d="M 30 62 L 26 80 L 10 80" />
      <circle cx="58" cy="46" r="5" />
    </svg>
  );

const Crossout: K = ({v, t, D}) => {
  const {width: W, height: H} = useVideoConfig();
  const items: V[] = v.items ?? [];
  const size = 300;
  return (
    <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: W * 0.1}}>
      {items.map((it, i) => {
        const at = Math.round(D * (0.08 + i * 0.12));
        return <CrossCard key={i} at={at} xAt={Math.round(D * (0.38 + i * 0.17))} size={size} label={t(it.label)} icon={it.icon} />;
      })}
      <div style={{position: 'absolute', top: H * 0.1, width: W}} />
    </AbsoluteFill>
  );
};

const CrossCard: React.FC<{at: number; xAt: number; size: number; label: string; icon: string}> = ({at, xAt, size, label, icon}) => {
  const e = useEnter(at);
  return (
    <div style={{opacity: Math.min(1, e * 2), transform: `translateY(${(1 - e) * -60}px) rotate(${(icon === 'finger' ? -3 : 3) * e}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
      <div style={{position: 'relative', width: size + 80, height: size + 80, background: T.paperEdge, boxShadow: `0 12px 18px ${T.shadow}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon kind={icon} size={size} />
        <div style={{position: 'absolute', inset: 20}}>
          <RedX size={size + 40} at={xAt} />
        </div>
      </div>
      <div style={{fontFamily: F.display, fontSize: 64, color: T.ink, letterSpacing: 2}}>{label}</div>
    </div>
  );
};

const Title: K = ({v, t, project}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const text = t(v.text);
  const typed = Math.floor(interpolate(frame, [sec(fps, 0.2), sec(fps, 1.3)], [0, text.length], clamp));
  return (
    <AbsoluteFill style={{background: T.paperDark}}>
      {v.bg && <BgImage src={asset(project, v.bg)} dim={0.78} />}
      {v.img && (
        <div style={{position: 'absolute', right: W * 0.04, top: H * 0.06, height: H * 0.88, opacity: interpolate(frame, [0, sec(fps, 1)], [0, 0.32], clamp)}}>
          <Img src={asset(project, v.img)} style={{height: '100%', filter: 'invert(1) contrast(1.2)', mixBlendMode: 'screen'}} />
        </div>
      )}
      <div style={{position: 'absolute', left: W * 0.08, top: H * 0.34}}>
        <div style={{fontFamily: F.display, fontSize: 210, color: T.paper, letterSpacing: 10, filter: 'url(#vox-rough)'}}>
          {text.slice(0, typed)}
          <span style={{opacity: frame % 16 < 8 ? 1 : 0, color: T.red}}>▍</span>
        </div>
        <div style={{width: interpolate(frame, [sec(fps, 1.2), sec(fps, 1.8)], [0, W * 0.5], clamp), height: 10, background: T.red, margin: '14px 0 26px'}} />
        <Sub text={t(v.sub)} at={sec(fps, 1.4)} size={48} color={T.paper} />
      </div>
    </AbsoluteFill>
  );
};

const MapShot: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const data = useUsMap(asset(project, 'usmap.json'));
  const pin = useEnterAt(Math.round(D * 0.3));
  if (!data) return null;
  const mw = W * 0.74;
  if (v.mode === 'timeline') {
    const r0 = Math.round(D * 0.1);
    const r1 = Math.round(D * 0.82);
    const year = mapYear(data, frame, r0, r1);
    const count = mapCount(data, frame, r0, r1);
    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: (W - mw) / 2 + W * 0.05, top: H * 0.16}}>
          <UsMap data={data} mode="timeline" width={mw} revealFrom={r0} revealTo={r1} />
        </div>
        <div style={{position: 'absolute', left: W * 0.05, top: H * 0.07}}>
          <div style={{fontFamily: F.display, fontSize: 150, color: T.red, lineHeight: 1}}>{year}</div>
          <Sub text={`${count} / 16`} at={0} mono size={44} color={T.ink} />
        </div>
        <div style={{position: 'absolute', right: W * 0.05, top: H * 0.08}}>
          <Tape text={t(v.title)} rot={2} size={30} />
        </div>
        <div style={{position: 'absolute', right: W * 0.05, bottom: H * 0.16, display: 'flex', gap: 28, fontFamily: F.mono, fontSize: 24, color: T.ink}}>
          <span>
            <span style={{color: T.red}}>●</span> có người chết
          </span>
          <span>
            <span style={{color: T.ink}}>●</span> không có người chết
          </span>
        </div>
      </AbsoluteFill>
    );
  }
  // focus: phóng vào Montana, cắm ghim, rồi chuyển sang ảnh căn chòi.
  const z0 = Math.round(D * 0.04);
  const z1 = Math.round(D * 0.36);
  const swap = Math.round(D * 0.5);
  const o = interpolate(frame, [swap, swap + 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: (W - mw) / 2, top: (H - mw * (data.height / data.width)) / 2}}>
        <UsMap data={data} mode="focus" width={mw} zoomFrom={z0} zoomTo={z1} />
        {pin > 0.001 && (
          <div style={{position: 'absolute', left: mw / 2, top: (mw * (data.height / data.width)) / 2, transform: `translate(-50%, -100%) translateY(${(1 - pin) * -80}px)`}}>
            <svg width={60} height={84} viewBox="0 0 60 84">
              <path d="M30 82 C 22 60, 4 46, 4 28 A 26 26 0 1 1 56 28 C 56 46, 38 60, 30 82 Z" fill={T.red} stroke={T.paperEdge} strokeWidth={3} />
              <circle cx="30" cy="28" r="9" fill={T.paperEdge} />
            </svg>
          </div>
        )}
      </div>
      <div style={{position: 'absolute', left: W * 0.06, top: H * 0.08}}>
        <StampText text={t(v.title)} at={Math.round(D * 0.32)} size={120} color={T.red} boxed />
      </div>
      {o > 0 && (
        <AbsoluteFill style={{opacity: o}}>
          {v.bg && <BgImage src={asset(project, v.bg)} dim={0.15} />}
          <Cutout src={asset(project, v.img)} x={W * 0.56} y={H * 0.5} w={W * 0.5} rot={-2} at={swap + 4} caption={t(v.imgCaption)} />
          <div style={{position: 'absolute', left: W * 0.06, top: H * 0.08}}>
            <StampText text={t(v.title)} at={0} size={120} color={T.red} boxed />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
const useEnterAt = (at: number) => useEnter(at, 220, 11);

const Acronym: K = ({t, D}) => {
  const {width: W, height: H} = useVideoConfig();
  const rows = [
    {hot: 'UN', key: 't.uni', vi: 't.uniVi'},
    {hot: 'A', key: 't.air', vi: 't.airVi'},
    {hot: 'BOM', key: 't.bom', vi: ''},
  ];
  const frame = useCurrentFrame();
  const merge = Math.round(D * 0.72);
  const mo = interpolate(frame, [merge, merge + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{paddingLeft: W * 0.14, paddingTop: H * 0.14}}>
      {rows.map((r, i) => {
        const at = Math.round(D * (0.05 + i * 0.22));
        const word = t(r.key);
        return <AcroRow key={i} at={at} hot={r.hot} rest={word.slice(r.hot.length)} vi={r.vi ? t(r.vi) : ''} dimmed={1 - mo * 0.6} />;
      })}
      <div style={{position: 'absolute', right: W * 0.08, bottom: H * 0.16, opacity: mo, transform: `scale(${0.8 + mo * 0.2}) rotate(-4deg)`}}>
        <div style={{fontFamily: F.display, fontSize: 170, color: T.red, border: `10px solid ${T.red}`, padding: '0 40px', filter: 'url(#vox-rough)'}}>UNABOM</div>
      </div>
    </AbsoluteFill>
  );
};

const AcroRow: React.FC<{at: number; hot: string; rest: string; vi: string; dimmed: number}> = ({at, hot, rest, vi, dimmed}) => {
  const e = useEnter(at);
  return (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 30, opacity: Math.min(1, e * 2) * dimmed, transform: `translateX(${(1 - e) * -80}px)`, marginBottom: 14}}>
      <div style={{fontFamily: F.display, fontSize: 170, lineHeight: 1.05, letterSpacing: 4}}>
        <span style={{color: T.red}}>{hot}</span>
        <span style={{color: T.ink}}>{rest}</span>
      </div>
      {vi && <div style={{fontFamily: F.body, fontStyle: 'italic', fontSize: 44, color: T.inkSoft}}>= {vi}</div>}
    </div>
  );
};

const Stats: K = ({v, t, D}) => {
  const items: V[] = v.items ?? [];
  const {width: W} = useVideoConfig();
  const big = items.length <= 2;
  // ≤2 mục: xếp ngang, chữ rất lớn; nhiều hơn: xếp dọc như bảng kết quả.
  return (
    <AbsoluteFill
      style={{flexDirection: big ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: big ? W * 0.12 : 18, paddingBottom: big ? 0 : 60}}
    >
      {items.map((it, i) => (
        <StatItem
          key={i}
          at={Math.round(D * (0.04 + i * (big ? 0.3 : 0.24)))}
          value={t(it.value)}
          label={it.label ? t(it.label) : ''}
          red={it.color === 'red'}
          size={v.size ?? (big ? 300 : 140)}
          row={!big}
        />
      ))}
    </AbsoluteFill>
  );
};

const StatItem: React.FC<{at: number; value: string; label: string; red: boolean; size: number; row?: boolean}> = ({at, value, label, red, size, row}) => {
  const {fps} = useVideoConfig();
  const numeric = /^\d+$/.test(value);
  const n = useCount(numeric ? Number(value) : 0, at, sec(fps, 0.9));
  const e = useEnter(at);
  return (
    <div style={{display: 'flex', flexDirection: row ? 'row' : 'column', alignItems: row ? 'baseline' : 'center', gap: row ? 30 : 0, opacity: Math.min(1, e * 2)}}>
      <StampText text={numeric ? String(n) : value} at={at} size={size} color={red ? T.red : T.ink} rot={row ? -1.5 : red ? -3 : 2} />
      {label && <Sub text={label} at={at + 8} size={42} />}
    </div>
  );
};

const Cutouts: K = ({v, t, project, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H, fps} = useVideoConfig();
  const items: V[] = v.items ?? [];
  const pos = items.map((it) => ({x: it.x * W, y: it.y * H}));
  const linkAt = Math.round(fps * ((items[1]?.delay ?? 1) + 0.6));
  const lp = interpolate(frame, [linkAt, linkAt + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      {v.bg && <BgImage src={asset(project, v.bg)} dim={0.35} />}
      {v.headline && (
        <div style={{position: 'absolute', top: H * 0.07, width: W, textAlign: 'center'}}>
          <Sub text={t(v.headline)} at={sec(fps, 0.3)} size={64} color={T.ink} style={{fontFamily: F.serif, fontWeight: 900, fontStyle: 'italic'}} />
          {v.headlineSub && <Sub text={`“${t(v.headlineSub)}”`} at={sec(fps, 0.9)} size={38} />}
        </div>
      )}
      {v.link && items.length >= 2 && lp > 0 && (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <path
            d={`M ${pos[0].x} ${pos[0].y - H * 0.18} Q ${W / 2} ${H * 0.12}, ${pos[1].x} ${pos[1].y - H * 0.18}`}
            fill="none"
            stroke={T.red}
            strokeWidth={6}
            strokeDasharray={W}
            strokeDashoffset={W * (1 - lp)}
          />
          <text x={W / 2} y={H * 0.17} textAnchor="middle" fontFamily={F.display} fontSize={60} fill={T.red} opacity={lp}>
            ?
          </text>
        </svg>
      )}
      {items.map((it, i) => (
        <Cutout
          key={i}
          src={asset(project, it.src)}
          x={pos[i].x}
          y={pos[i].y}
          w={it.w * W}
          rot={it.rot}
          at={sec(fps, it.delay ?? 0.1 + i * 0.25)}
          caption={t(it.caption)}
          halftone={it.halftone}
        >
          {it.tag && (
            <div style={{position: 'absolute', left: '6%', bottom: '-30%', transform: 'rotate(-1.5deg)'}}>
              <div style={{background: T.paperEdge, padding: '12px 22px', boxShadow: `0 6px 10px ${T.shadow}`, borderLeft: `10px solid ${T.red}`}}>
                <div style={{fontFamily: F.display, fontSize: 52, color: T.ink, letterSpacing: 2}}>{t(it.tag)}</div>
                {it.tagSub && <div style={{fontFamily: F.body, fontSize: 28, color: T.inkSoft}}>{t(it.tagSub)}</div>}
                {it.tagSub2 && <div style={{fontFamily: F.body, fontSize: 28, color: T.inkSoft}}>{t(it.tagSub2)}</div>}
              </div>
            </div>
          )}
        </Cutout>
      ))}
      {v.stamp && (
        <div style={{position: 'absolute', left: W * 0.7, top: H * 0.42, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          <StampText text={t(v.stamp)} at={Math.round(D * 0.35)} size={v.stampSub ? 150 : 120} color={T.red} boxed rot={-6} />
          {v.stampSub && (
            <Sub text={t(v.stampSub)} at={Math.round(D * 0.45)} size={56} color={T.ink} mono style={v.bg ? {background: T.stampPlate, padding: '6px 22px'} : {}} />
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Hai tờ báo chung chung (không logo thật), dấu đỏ đóng ngang.
const Papers: K = ({v, t, D}) => {
  const {width: W, height: H} = useVideoConfig();
  const names: string[] = v.names ?? [];
  return (
    <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: W * 0.06}}>
      {names.map((n, i) => (
        <PaperCard key={i} at={Math.round(D * (0.03 + i * 0.18))} name={t(n)} rot={i ? 3 : -3} seed={n} />
      ))}
      <div style={{position: 'absolute', left: W / 2, top: H * 0.52, transform: 'translate(-50%, -50%)'}}>
        <StampText text={t(v.stamp)} at={Math.round(D * 0.55)} size={130} color={T.red} boxed rot={-8} />
      </div>
    </AbsoluteFill>
  );
};

const PaperCard: React.FC<{at: number; name: string; rot: number; seed: string}> = ({at, name, rot, seed}) => {
  const e = useEnter(at);
  const lines = Array.from({length: 18}, (_, i) => 0.55 + random(`${seed}${i}`) * 0.45);
  return (
    <div style={{width: 620, height: 760, background: T.paperEdge, boxShadow: `0 14px 20px ${T.shadow}`, padding: 34, opacity: Math.min(1, e * 2), transform: `translateY(${(1 - e) * -80}px) rotate(${rot}deg)`}}>
      <div style={{fontFamily: F.serif, fontWeight: 900, fontSize: 50, textAlign: 'center', color: T.ink, borderBottom: `4px double ${T.ink}`, paddingBottom: 12}}>{name}</div>
      <div style={{display: 'flex', gap: 18, marginTop: 24}}>
        {[0, 1, 2].map((c) => (
          <div key={c} style={{flex: 1}}>
            {lines.slice(c * 6, c * 6 + 6).map((w, i) => (
              <div key={i} style={{height: 12, width: `${w * 100}%`, background: 'rgba(40,36,30,0.28)', marginBottom: 14}} />
            ))}
            <div style={{height: 150, background: 'rgba(40,36,30,0.14)', marginTop: 6}} />
          </div>
        ))}
      </div>
    </div>
  );
};

const NameTag: K = ({v, t, project, D}) => {
  const {width: W, height: H} = useVideoConfig();
  const e = useEnter(Math.round(D * 0.15));
  return (
    <AbsoluteFill>
      <BgImage src={asset(project, v.bg)} />
      <div style={{position: 'absolute', left: W * 0.06, bottom: H * 0.2, transform: `translateX(${(1 - e) * -120}px)`, opacity: Math.min(1, e * 2)}}>
        <div style={{background: T.paperEdge, padding: '18px 34px', borderLeft: `14px solid ${T.red}`, boxShadow: `0 8px 14px ${T.shadow}`}}>
          <div style={{fontFamily: F.display, fontSize: 96, color: T.ink, letterSpacing: 3}}>{t(v.name)}</div>
          <div style={{fontFamily: F.body, fontSize: 36, color: T.inkSoft}}>{t(v.sub)}</div>
        </div>
      </div>
      {v.caption && (
        <div style={{position: 'absolute', right: W * 0.03, top: H * 0.04}}>
          <Tape text={t(v.caption)} size={18} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const Split: K = ({v, t, project, D}) => {
  const {width: W, height: H} = useVideoConfig();
  return (
    <AbsoluteFill>
      <BgImage src={asset(project, v.bg)} />
      <div style={{position: 'absolute', left: W * 0.08, top: H * 0.1}}>
        <StampText text={t(v.left)} at={Math.round(D * 0.3)} size={120} color={T.ink} rot={-4} boxed style={{background: 'rgba(248,244,234,0.85)'}} />
      </div>
      <div style={{position: 'absolute', right: W * 0.08, top: H * 0.1}}>
        <StampText text={t(v.right)} at={Math.round(D * 0.55)} size={120} color={T.red} rot={4} boxed style={{background: 'rgba(248,244,234,0.85)'}} />
      </div>
      {v.caption && (
        <div style={{position: 'absolute', right: W * 0.03, bottom: H * 0.04}}>
          <Tape text={t(v.caption)} size={18} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// Trang hồ sơ tòa án: câu trích tiếng Anh, bút dạ vàng quét qua cụm `mark`, dịch tiếng Việt bên dưới.
const Doc: K = ({v, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const e = useEnter(0, 120, 16);
  const q = t(v.quote);
  const mark: string = v.mark ?? '';
  const i = mark ? q.indexOf(mark) : -1;
  const hp = interpolate(frame, [Math.round(D * 0.25), Math.round(D * 0.55)], [0, 100], clamp);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          width: W * 0.7,
          minHeight: H * 0.66,
          background: T.paperEdge,
          boxShadow: `0 16px 26px ${T.shadow}`,
          padding: '56px 80px',
          transform: `translateY(${(1 - e) * 60}px) rotate(-1deg)`,
          opacity: Math.min(1, e * 2),
          backgroundImage: 'repeating-linear-gradient(transparent 0 63px, rgba(44,74,107,0.12) 63px 65px)',
        }}
      >
        <div style={{fontFamily: F.mono, fontSize: 24, color: T.blue, letterSpacing: 2, marginBottom: 34}}>{t(v.cite).toUpperCase()}</div>
        <div style={{fontFamily: F.serif, fontSize: 54, lineHeight: 1.45, color: T.ink}}>
          {i < 0 ? (
            q
          ) : (
            <>
              {q.slice(0, i)}
              <span style={{backgroundImage: `linear-gradient(${T.highlight}, ${T.highlight})`, backgroundRepeat: 'no-repeat', backgroundSize: `${hp}% 70%`, backgroundPosition: '0 70%'}}>{mark}</span>
              {q.slice(i + mark.length)}
            </>
          )}
        </div>
        <Sub text={t(v.quoteVi)} at={Math.round(D * 0.4)} size={38} style={{fontFamily: F.body, fontStyle: 'italic', fontWeight: 400, marginTop: 40, borderTop: `2px solid ${T.landStroke}`, paddingTop: 22}} />
      </div>
    </AbsoluteFill>
  );
};

// Bìa sách chung chung vẽ bằng code (không chép bìa thật), khoanh đỏ.
const Book: K = ({v, t, D}) => {
  const frame = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const e = useEnter(0, 110, 14);
  const ry = interpolate(frame, [0, D], [-18, -8]);
  const bw = 440;
  const bh = 640;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: W * 0.3 - bw / 2, top: H / 2 - bh / 2, perspective: 1200}}>
        <div
          style={{
            width: bw,
            height: bh,
            background: T.blue,
            transform: `rotateY(${ry}deg) rotate(-3deg) translateY(${(1 - e) * -90}px)`,
            opacity: Math.min(1, e * 2),
            boxShadow: `18px 22px 30px ${T.shadow}`,
            borderLeft: `22px solid rgba(0,0,0,0.25)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 40,
          }}
        >
          <div style={{border: `3px solid ${T.paper}`, padding: '40px 20px', textAlign: 'center'}}>
            <div style={{fontFamily: F.serif, fontWeight: 900, fontSize: 64, lineHeight: 1.1, color: T.paper}}>{t(v.title)}</div>
          </div>
        </div>
      </div>
      <MarkerCircle x={W * 0.3} y={H / 2} w={bw * 1.5} h={bh * 1.25} at={Math.round(D * 0.4)} dur={18} />
      <div style={{position: 'absolute', left: W * 0.54, top: H * 0.36, width: W * 0.4}}>
        <StampText text={t(v.title)} at={Math.round(D * 0.2)} size={78} color={T.ink} rot={-2} style={{fontFamily: F.serif, fontWeight: 900, whiteSpace: 'normal'}} />
        <Sub text={t(v.sub)} at={Math.round(D * 0.45)} size={40} style={{marginTop: 26}} />
      </div>
    </AbsoluteFill>
  );
};

const Memorial: K = ({v, t, D}) => {
  const {height: H} = useVideoConfig();
  const names: string[] = v.names ?? [];
  return (
    <AbsoluteFill style={{background: T.paperDark, alignItems: 'center', justifyContent: 'center'}}>
      <Sub text={t(v.title).toUpperCase()} at={4} mono size={30} color={T.landStroke} style={{marginBottom: H * 0.05, letterSpacing: 8}} />
      {names.map((n, i) => (
        <Sub key={n} text={t(n)} at={Math.round(D * (0.12 + i * 0.16))} size={86} color={T.paper} style={{fontFamily: F.serif, fontWeight: 400, margin: '10px 0'}} />
      ))}
    </AbsoluteFill>
  );
};

const Finale: K = ({v, t, project, D}) => {
  const {width: W, height: H, fps} = useVideoConfig();
  const imgs: string[] = v.imgs ?? [];
  const lines: string[] = v.lines ?? [];
  const spots = [
    {x: 0.2, y: 0.3, w: 0.3, r: -5},
    {x: 0.5, y: 0.26, w: 0.28, r: 3},
    {x: 0.8, y: 0.32, w: 0.28, r: -2},
  ];
  return (
    <AbsoluteFill>
      {imgs.map((s, i) => (
        <Cutout key={s} src={asset(project, s)} x={spots[i].x * W} y={spots[i].y * H} w={spots[i].w * W} rot={spots[i].r} at={sec(fps, 0.1 + i * 0.3)} />
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.62, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        {lines.map((l, i) => (
          <StampText key={l} text={t(l)} at={Math.round(D * (0.15 + i * 0.4))} size={110} color={i ? T.red : T.ink} rot={i ? -2 : 1} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Sources: K = ({v, t}) => {
  const lines: string[] = v.lines ?? [];
  const {width: W} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: T.paperDark, padding: `120px ${W * 0.12}px`}}>
      <Sub text={t(v.title).toUpperCase()} at={0} mono size={36} color={T.mustard} style={{letterSpacing: 8, marginBottom: 40}} />
      {lines.map((l, i) => (
        <Sub key={l} text={t(l)} at={6 + i * 5} size={34} color={T.paper} style={{fontWeight: 400, margin: '12px 0'}} />
      ))}
    </AbsoluteFill>
  );
};

// Bản đồ giấy cổ khu vực (history-cel-docu.md): camera phóng qua các khóa, nhãn hiện dần.
// v: {src?, cam: [{at: 0..1 (phần của shot), pt | lon/lat, zoom}], fill?, split17?, dmz?, provinces?,
//     focusProvince?, provinceAt?, labels?: [{text: key, at, pt | lon/lat, style?, dx?, dy?, size?}], title?}
const GeoMapShot: K = ({v, t, project, D}) => {
  const {width: W, height: H} = useVideoConfig();
  const data = useGeoMap(asset(project, v.src ?? 'vnmap.json'));
  if (!data) return null;
  const f = (x: number) => Math.round(x * D);
  const cam: CamKey[] = (v.cam as CamKey[]).map((c) => ({...c, at: f(c.at)}));
  const labels: GeoLabel[] = ((v.labels ?? []) as GeoLabel[]).map((l) => ({...l, text: t(l.text), at: f(l.at)}));
  const bursts = ((v.bursts ?? []) as V[]).map((b) => ({...b, at: f(b.at)}));
  // Bảng số liệu góc phải (key locale, hiện lần lượt) + băng nguồn dưới tiêu đề.
  const panel: V[] = v.panel ?? [];
  return (
    <AbsoluteFill>
      <GeoMap
        data={data}
        cam={cam}
        fill={v.fill}
        split17={v.split17}
        dmz={v.dmz}
        provinces={v.provinces}
        focusProvince={v.focusProvince}
        provinceAt={f(v.provinceAt ?? 0)}
        labels={labels}
        bursts={bursts}
      />
      {(v.title || v.source) && (
        <div style={{position: 'absolute', left: W * 0.05, top: H * 0.07, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14}}>
          {v.title && <Tape text={t(v.title)} rot={-2} size={30} />}
          {v.source && <Tape text={t(v.source)} rot={1} size={20} />}
        </div>
      )}
      {panel.length > 0 && (
        <div style={{position: 'absolute', right: W * 0.05, top: H * 0.12, background: T.paperEdge, boxShadow: `0 10px 18px ${T.shadow}`, padding: '26px 34px', transform: 'rotate(1.5deg)'}}>
          {panel.map((p, i) => (
            <Sub key={i} text={t(p.text)} at={f(p.at ?? 0.1 + i * 0.08)} size={p.big ? 54 : 36} color={p.color === 'red' ? T.red : T.ink} style={{fontFamily: F.display, letterSpacing: 2, margin: '6px 0'}} />
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const SHOTS: Record<string, K> = {
  geomap: GeoMapShot,
  stamp: Stamp,
  crossout: Crossout,
  title: Title,
  map: MapShot,
  acronym: Acronym,
  stats: Stats,
  cutouts: Cutouts,
  papers: Papers,
  nametag: NameTag,
  split: Split,
  doc: Doc,
  book: Book,
  memorial: Memorial,
  finale: Finale,
  sources: Sources,
  ...CRIME_SHOTS,
  ...HISTORY_SHOTS,
  ...CASE_SHOTS,
  ...CINE_SHOTS,
};

// Shot nền tối: chữ phụ đề và nền giấy đổi theo.
export const DARK_KINDS = new Set(['title', 'memorial', 'sources', 'chapter']);

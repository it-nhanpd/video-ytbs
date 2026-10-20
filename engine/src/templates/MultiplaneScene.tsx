import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import type {LocaleT, SceneT} from '../schema';
import {grades} from '../theme';
import {easings, overScene, parallaxFactor} from '../utils';
import {Layer} from '../components/Layer';
import {Sky} from '../components/Sky';
import {NoiseSilhouette} from '../components/NoiseSilhouette';
import {Fog} from '../components/Fog';
import {Haze} from '../components/Haze';
import {ImageAsset} from '../components/ImageAsset';
import {RigAsset} from '../components/RigAsset';
import {RunnerAsset} from '../components/RunnerAsset';
import {Burst} from '../components/Burst';
import {Chip} from '../components/Chip';
import {MapAsset} from '../components/MapAsset';

import {Arena} from '../components/Arena';
import {FighterLayer} from '../components/FighterLayer';
import {Look} from '../components/Look';
import {LowerThird} from '../components/LowerThird';

export type MultiplaneProps = {scene: SceneT; locale: LocaleT};

// Thứ tự lớp: z tăng dần (xa → gần), sau đó là Look (grade/grain/letterbox), cuối cùng là chữ.
export const MultiplaneScene: React.FC<MultiplaneProps> = ({scene, locale}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height, fps} = useVideoConfig();
  const grade = grades[scene.grade];
  if (!grade) throw new Error(`Unknown grade "${scene.grade}"`);

  const camX = overScene(frame, durationInFrames, scene.camera.x, scene.camera.ease);
  let camZoom = overScene(frame, durationInFrames, scene.camera.zoom, scene.camera.ease);
  // Camera nhiều đoạn: nội suy giữa các mốc (zoom quanh điểm fx, fy).
  let origin: string | undefined;
  const shots = scene.camera.shots;
  if (shots && shots.length) {
    const sec = frame / fps;
    const sorted = [...shots].sort((a, b) => a.atSec - b.atSec);
    let a = sorted[0];
    let b = sorted[0];
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].atSec <= sec) {
        a = sorted[i];
        b = sorted[i + 1] ?? sorted[i];
      }
    }
    const k = a === b ? 0 : easings.inOutCubic(Math.max(0, Math.min(1, (sec - a.atSec) / (b.atSec - a.atSec))));
    const mix = (x: number, y: number) => x + (y - x) * k;
    camZoom = mix(a.zoom, b.zoom);
    origin = `${mix(a.fx, b.fx) * 100}% ${mix(a.fy, b.fy) * 100}%`;
  }
  // Máy quay cầm tay: trôi và thở rất nhẹ để khung không đứng cứng. Zoom chỉ cộng thêm (≥ 0,007 khi hệ số 1),
  // đủ phủ độ trôi ngang 6 px nên lớp full khung không lộ mép.
  const tSec = frame / fps;
  const hh = scene.handheld;
  const camXd = camX + noise2D('cam-x', tSec * 0.45, 0) * 6 * hh;
  camZoom += (0.01 + noise2D('cam-z', tSec * 0.3, 1) * 0.003) * hh;
  // Lớp ẩn (opacity 0) chỉ là nguồn dữ liệu (vd. bộ phận để đổi): không vẽ, nhưng rig vẫn đọc được qua scene.layers.
  const layers = scene.layers.filter((l) => l.opacity !== 0).sort((a, b) => a.z - b.z);
  const bar = scene.letterbox ? Math.max(0, (height - width / scene.letterbox) / 2) : 0;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {layers.map((l) => (
        <Layer
          key={l.id}
          z={l.z}
          focusZ={scene.focusZ}
          camX={camXd}
          camZoom={camZoom}
          origin={origin}
          blur={l.blurZoom ? (l.blur ?? 0) + l.blurZoom * (camZoom - 1) : l.blur}
          darken={l.darken}
          opacity={l.opacity}
          boil={l.boil}
        >
          {l.type === 'sky' ? <Sky grade={grade} sun={l.sun} /> : null}
          {l.type === 'silhouette' ? (
            <NoiseSilhouette seed={l.seed} baseY={l.baseY} amp={l.amp} color={l.color} palms={l.palms} palmScale={l.palmScale} />
          ) : null}
          {l.type === 'fog' ? <Fog y={l.y} height={l.height} color={l.color} /> : null}
          {l.type === 'haze' ? <Haze count={l.count} color={l.color} seed={l.seed} /> : null}
          {l.type === 'arena' ? <Arena floorY={l.floorY} seed={l.seed} /> : null}
          {l.type === 'fighters' ? <FighterLayer layer={l} /> : null}
          {l.type === 'rig' ? <RigAsset layer={l} durationInFrames={durationInFrames} allLayers={scene.layers} /> : null}
          {l.type === 'runner' ? <RunnerAsset layer={l} /> : null}
          {l.type === 'burst' ? <Burst events={l.events} /> : null}
          {l.type === 'map' ? <MapAsset layer={l} locale={locale} /> : null}
          {l.type === 'image' ? <ImageAsset layer={l} durationInFrames={durationInFrames} scrollPx={scene.walkSpeed * parallaxFactor(l.z, scene.focusZ)} /> : null}
        </Layer>
      ))}
      <Look grade={grade} letterbox={scene.letterbox} />
      {scene.text.map((t, i) =>
        t.type === 'chip' ? (
          <Chip
            key={i}
            title={locale[t.key] ?? `⟦${t.key}⟧`}
            sub={t.subKey ? (locale[t.subKey] ?? `⟦${t.subKey}⟧`) : undefined}
            from={t.from}
            to={t.to}
            topOffset={bar}
          />
        ) : (
          <LowerThird
            key={i}
            title={locale[t.key] ?? `⟦${t.key}⟧`}
            sub={t.subKey ? (locale[t.subKey] ?? `⟦${t.subKey}⟧`) : undefined}
            from={t.from}
            to={t.to}
            bottomOffset={bar}
            plate={t.type === 'credit'}
            plain={t.type === 'caption'}
          />
        ),
      )}
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {LocaleT, SceneT} from '../schema';
import {grades} from '../theme';
import {overScene} from '../utils';
import {Layer} from '../components/Layer';
import {Sky} from '../components/Sky';
import {NoiseSilhouette} from '../components/NoiseSilhouette';
import {Fog} from '../components/Fog';
import {Haze} from '../components/Haze';
import {ImageAsset} from '../components/ImageAsset';
import {Look} from '../components/Look';
import {LowerThird} from '../components/LowerThird';

export type MultiplaneProps = {scene: SceneT; locale: LocaleT};

// Thứ tự lớp: z tăng dần (xa → gần), sau đó là Look (grade/grain/letterbox), cuối cùng là chữ.
export const MultiplaneScene: React.FC<MultiplaneProps> = ({scene, locale}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  const grade = grades[scene.grade];
  if (!grade) throw new Error(`Unknown grade "${scene.grade}"`);

  const camX = overScene(frame, durationInFrames, scene.camera.x, scene.camera.ease);
  const camZoom = overScene(frame, durationInFrames, scene.camera.zoom, scene.camera.ease);
  const layers = [...scene.layers].sort((a, b) => a.z - b.z);
  const bar = scene.letterbox ? Math.max(0, (height - width / scene.letterbox) / 2) : 0;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {layers.map((l) => (
        <Layer
          key={l.id}
          z={l.z}
          focusZ={scene.focusZ}
          camX={camX}
          camZoom={camZoom}
          blur={l.blur}
          darken={l.darken}
          opacity={l.opacity}
        >
          {l.type === 'sky' ? <Sky grade={grade} sun={l.sun} /> : null}
          {l.type === 'silhouette' ? (
            <NoiseSilhouette seed={l.seed} baseY={l.baseY} amp={l.amp} color={l.color} palms={l.palms} palmScale={l.palmScale} />
          ) : null}
          {l.type === 'fog' ? <Fog y={l.y} height={l.height} color={l.color} /> : null}
          {l.type === 'haze' ? <Haze count={l.count} color={l.color} seed={l.seed} /> : null}
          {l.type === 'image' ? <ImageAsset layer={l} durationInFrames={durationInFrames} /> : null}
        </Layer>
      ))}
      <Look grade={grade} letterbox={scene.letterbox} />
      {scene.text.map((t, i) => (
        <LowerThird
          key={i}
          title={locale[t.key] ?? `⟦${t.key}⟧`}
          sub={t.subKey ? (locale[t.subKey] ?? `⟦${t.subKey}⟧`) : undefined}
          from={t.from}
          to={t.to}
          bottomOffset={bar}
        />
      ))}
    </AbsoluteFill>
  );
};

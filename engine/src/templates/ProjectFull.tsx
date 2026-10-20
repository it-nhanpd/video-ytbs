import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import type {LocaleT, ProjectT} from '../schema';
import {MultiplaneScene} from './MultiplaneScene';

export const CROSSFADE_FRAMES = 12; // 0,5 giây ở 24fps

export type ProjectFullProps = {project: ProjectT; locale: LocaleT};

// Mốc bắt đầu từng cảnh (frame): cảnh sau chồng lên cảnh trước CROSSFADE_FRAMES để chuyển mờ dần.
export const sceneStarts = (project: ProjectT) => {
  let at = 0;
  return project.scenes.map((s, i) => {
    const dur = Math.round(s.durationSec * project.fps);
    const from = i === 0 ? 0 : at - CROSSFADE_FRAMES;
    at = from + dur;
    return {id: s.id, from, dur};
  });
};

export const fullDuration = (project: ProjectT) => {
  const st = sceneStarts(project);
  const last = st[st.length - 1];
  return last ? last.from + last.dur : 1;
};

const FadeIn: React.FC<{enabled: boolean; children: React.ReactNode}> = ({enabled, children}) => {
  const frame = useCurrentFrame();
  const o = enabled ? interpolate(frame, [0, CROSSFADE_FRAMES], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// Ghép toàn bộ cảnh của dự án theo thứ tự trong scenes.json.
export const ProjectFull: React.FC<ProjectFullProps> = ({project, locale}) => {
  const starts = sceneStarts(project);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {project.scenes.map((scene, i) => (
        <Sequence key={scene.id} from={starts[i].from} durationInFrames={starts[i].dur} name={scene.id}>
          <FadeIn enabled={i > 0}>
            <MultiplaneScene scene={scene} locale={locale} />
          </FadeIn>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

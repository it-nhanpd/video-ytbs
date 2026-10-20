import React from 'react';
import {Composition} from 'remotion';
import {Locale, Project} from './schema';
import {MultiplaneScene} from './templates/MultiplaneScene';
import {ProjectFull, fullDuration} from './templates/ProjectFull';
import germanProjectJson from '../../content/projects/2026-german-army-uniforms/scenes.json';
import germanLocaleJson from '../../content/projects/2026-german-army-uniforms/locales/vi.json';

import empiresProjectJson from '../../content/projects/2026-largest-empires/scenes.json';
import empiresLocaleJson from '../../content/projects/2026-largest-empires/locales/vi.json';
import run20ProjectJson from '../../content/projects/_ref-run20/scenes.json';
import run20LocaleJson from '../../content/projects/_ref-run20/locales/vi.json';
import rigDemoProjectJson from '../../content/projects/_rig-demo/scenes.json';
import rigDemoLocaleJson from '../../content/projects/_rig-demo/locales/vi.json';
import ww2ProjectJson from '../../content/projects/2026-ww2-dday/scenes.json';
import ww2LocaleJson from '../../content/projects/2026-ww2-dday/locales/vi.json';
import {Vox, shotFrames} from './vox/types';
import {VoxSingle, VoxVideo, voxTotal} from './vox/VoxVideo';
import unaVoxJson from '../../content/projects/2026-truecrime-unabomber/vox.json';
import unaLocaleJson from '../../content/projects/2026-truecrime-unabomber/locales/vi.json';
import unaTimingJson from '../../content/projects/2026-truecrime-unabomber/assets/audio/timing.json';
import myLaiVoxJson from '../../content/projects/2026-truecrime-my-lai/vox.json';
import myLaiLocaleJson from '../../content/projects/2026-truecrime-my-lai/locales/vi.json';
import myLaiTimingJson from '../../content/projects/2026-truecrime-my-lai/assets/audio/timing.json';
import ursulaVoxJson from '../../content/projects/2026-truecrime-ursula-herrmann/vox.json';
import ursulaLocaleJson from '../../content/projects/2026-truecrime-ursula-herrmann/locales/vi.json';
import ursulaTimingJson from '../../content/projects/2026-truecrime-ursula-herrmann/assets/audio/timing.json';
import ursulaV2VoxJson from '../../content/projects/2026-truecrime-ursula-herrmann/vox-v2.json';
import ursulaV2LocaleJson from '../../content/projects/2026-truecrime-ursula-herrmann/locales/vi-v2.json';
import zdVoxJson from '../../content/projects/2026-truecrime-zodiac-dahlia/vox.json';
import zdLocaleJson from '../../content/projects/2026-truecrime-zodiac-dahlia/locales/vi.json';
import zdTimingJson from '../../content/projects/2026-truecrime-zodiac-dahlia/assets/audio/timing.json';

// Dự án template vox (collage true crime): <project>-full và <project>-vox-<shotId>.
// Id composition của một bản vox: <project> hoặc <project>-<variant>.
const voxId = (v: {project: string; variant?: string}) => (v.variant ? `${v.project}-${v.variant}` : v.project);

const voxProjects = [
  {vox: Vox.parse(unaVoxJson), locale: unaLocaleJson as Record<string, string>, timing: unaTimingJson as Record<string, number>},
  {vox: Vox.parse(myLaiVoxJson), locale: myLaiLocaleJson as Record<string, string>, timing: myLaiTimingJson as Record<string, number>},
  {vox: Vox.parse(ursulaVoxJson), locale: ursulaLocaleJson as Record<string, string>, timing: ursulaTimingJson as Record<string, number>},
  // Pilot v2 (hồ sơ vụ án): dùng chung assets/ và timing.json với bản 19:22, id shot riêng (P…).
  {vox: Vox.parse(ursulaV2VoxJson), locale: ursulaV2LocaleJson as Record<string, string>, timing: ursulaTimingJson as Record<string, number>},
  {vox: Vox.parse(zdVoxJson), locale: zdLocaleJson as Record<string, string>, timing: zdTimingJson as Record<string, number>},
];

// Mỗi cảnh là một composition: <project>-<sceneId>. Dữ liệu đi qua zod trước khi render.
const projects = [
  {project: Project.parse(germanProjectJson), locale: Locale.parse(germanLocaleJson)},
  {project: Project.parse(empiresProjectJson), locale: Locale.parse(empiresLocaleJson)},
  {project: Project.parse(run20ProjectJson), locale: Locale.parse(run20LocaleJson)}, // bài thử 20 s bám video tham chiếu (nội bộ, không đăng)
  {project: Project.parse(rigDemoProjectJson), locale: Locale.parse(rigDemoLocaleJson)}, // rig mẫu hình hộp: kiểm tra chuyển động
  {project: Project.parse(ww2ProjectJson), locale: Locale.parse(ww2LocaleJson)}, // D-Day 1944 Omaha
];

export const RemotionRoot: React.FC = () => (
  <>
    {projects.map(({project, locale}) => (
      <Composition
        key={`${project.project}-full`}
        id={`${project.project}-full`}
        component={ProjectFull}
        durationInFrames={fullDuration(project)}
        fps={project.fps}
        width={project.width}
        height={project.height}
        defaultProps={{project, locale}}
      />
    ))}
    {projects.flatMap(({project, locale}) =>
      project.scenes.map((scene) => (
        <Composition
          key={`${project.project}-${scene.id}`}
          id={`${project.project}-${scene.id}`}
          component={MultiplaneScene}
          durationInFrames={Math.round(scene.durationSec * project.fps)}
          fps={project.fps}
          width={project.width}
          height={project.height}
          defaultProps={{scene, locale}}
        />
      )),
    )}
    {voxProjects.map((p) => (
      <Composition
        key={`${voxId(p.vox)}-full`}
        id={`${voxId(p.vox)}-full`}
        component={VoxVideo}
        durationInFrames={voxTotal(p.vox, p.timing)}
        fps={p.vox.fps}
        width={p.vox.width}
        height={p.vox.height}
        defaultProps={p}
      />
    ))}
    {voxProjects.flatMap((p) =>
      p.vox.shots.map((s) => (
        <Composition
          key={`${voxId(p.vox)}-vox-${s.id}`}
          id={`${voxId(p.vox)}-vox-${s.id}`}
          component={VoxSingle}
          durationInFrames={shotFrames(s, p.timing, p.vox.fps)}
          fps={p.vox.fps}
          width={p.vox.width}
          height={p.vox.height}
          defaultProps={{...p, shotId: s.id}}
        />
      )),
    )}
  </>
);

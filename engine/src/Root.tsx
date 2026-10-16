import React from 'react';
import {Composition} from 'remotion';
import {Locale, Project} from './schema';
import {MultiplaneScene} from './templates/MultiplaneScene';
import projectJson from '../../content/projects/2026-test-huey/scenes.json';
import localeJson from '../../content/projects/2026-test-huey/locales/vi.json';

// Mỗi cảnh là một composition: <project>-<sceneId>. Dữ liệu đi qua zod trước khi render.
const project = Project.parse(projectJson);
const locale = Locale.parse(localeJson);

export const RemotionRoot: React.FC = () => (
  <>
    {project.scenes.map((scene) => (
      <Composition
        key={scene.id}
        id={`${project.project}-${scene.id}`}
        component={MultiplaneScene}
        durationInFrames={Math.round(scene.durationSec * project.fps)}
        fps={project.fps}
        width={project.width}
        height={project.height}
        defaultProps={{scene, locale}}
      />
    ))}
  </>
);

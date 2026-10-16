import React from 'react';
import {Composition} from 'remotion';
import {Locale, Project} from './schema';
import {MultiplaneScene} from './templates/MultiplaneScene';
import hueyProjectJson from '../../content/projects/2026-test-huey/scenes.json';
import hueyLocaleJson from '../../content/projects/2026-test-huey/locales/vi.json';
import germanProjectJson from '../../content/projects/2026-german-army-uniforms/scenes.json';
import germanLocaleJson from '../../content/projects/2026-german-army-uniforms/locales/vi.json';

// Mỗi cảnh là một composition: <project>-<sceneId>. Dữ liệu đi qua zod trước khi render.
const projects = [
  {project: Project.parse(hueyProjectJson), locale: Locale.parse(hueyLocaleJson)},
  {project: Project.parse(germanProjectJson), locale: Locale.parse(germanLocaleJson)},
];

export const RemotionRoot: React.FC = () => (
  <>
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
  </>
);

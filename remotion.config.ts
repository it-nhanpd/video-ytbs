import {Config} from '@remotion/cli/config';

// content/ chứa library/ và projects/ — staticFile('library/...') / staticFile('projects/...')
Config.setPublicDir('content');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

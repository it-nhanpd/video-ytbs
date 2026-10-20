import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadBody} from '@remotion/google-fonts/BeVietnamPro';
import {loadFont as loadMono} from '@remotion/google-fonts/RobotoMono';
import {loadFont as loadSerif} from '@remotion/google-fonts/PlayfairDisplay';

// Cả bốn font có subset tiếng Việt (truecrime-collage.md).
const subsets: ('vietnamese' | 'latin' | 'latin-ext')[] = ['vietnamese', 'latin', 'latin-ext'];
export const voxFonts = {
  display: loadAnton('normal', {weights: ['400'], subsets}).fontFamily,
  body: loadBody('normal', {weights: ['400', '600', '800'], subsets}).fontFamily,
  bodyItalic: loadBody('italic', {weights: ['400'], subsets}).fontFamily,
  mono: loadMono('normal', {weights: ['400', '700'], subsets}).fontFamily,
  serif: loadSerif('normal', {weights: ['400', '700', '900'], subsets}).fontFamily,
  serifItalic: loadSerif('italic', {weights: ['400'], subsets}).fontFamily,
};

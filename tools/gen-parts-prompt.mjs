// Sinh prompt "bảng bộ phận" (rig) cho một nhân vật từ mô tả quân phục ngắn.
// Dùng: node tools/gen-parts-prompt.mjs --facing right|left --uniform "<mô tả quân phục tiếng Anh>" [--torso "<chi tiết thân>"] [--sleeve "<chi tiết tay áo>"] [--legs "<chi tiết chân/giày>"] --out <file.txt>
// Mô tả không được chứa từ nhạy cảm (style-lock.md). Mẫu gốc đã duyệt: content/projects/_rig-demo/prompts/g-labs/1-parts-1871.txt
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d = '') => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const facing = opt('facing', 'right').toUpperCase();
const uniform = opt('uniform');
const out = opt('out');
if (!uniform || !out || !['RIGHT', 'LEFT'].includes(facing)) {
  console.error('Dùng: node tools/gen-parts-prompt.mjs --facing right|left --uniform "..." [--torso ".."] [--sleeve ".."] [--legs ".."] --out file.txt');
  process.exit(1);
}
const torso = opt('torso', 'the tunic, belt and personal equipment');
const sleeve = opt('sleeve', 'the sleeve cuff');
const legs = opt('legs', 'trousers tucked into boots');
const dirWord = facing === 'RIGHT' ? 'right' : 'left';
const forward = facing === 'RIGHT' ? 'RIGHT' : 'LEFT';

const prompt = `Character parts sheet for 2D cut-out animation: the SAME soldier taken apart into exactly 7 separate pieces drawn in ONE horizontal row from left to right, in this exact order: (1) HEAD with helmet only, strict ${dirWord}-facing side profile, ending in a short neck stub cut flat at the bottom; (2) TORSO only, from the collar down to the hip, with ${torso}, with NO head, NO arms and NO legs, the shoulder joint area and the bottom edge simply cut clean; (3) UPPER ARM only, the sleeve from shoulder to elbow, hanging straight vertical; (4) FOREARM AND HAND only, from the elbow to the fingertips, hanging straight vertical with ${sleeve} and a relaxed loosely closed hand; (5) THIGH only, the trouser leg from hip to knee, straight vertical; (6) LOWER LEG only, from knee to ankle with ${legs}, straight vertical, ending above the foot; (7) FOOT only, the boot or shoe from heel to toe, horizontal, toe pointing ${forward}, flat sole. Every piece is drawn straight and un-bent, and every joint end (shoulder, elbow, hip, knee, ankle, neck) is rounded and extends a little beyond the joint so that the pieces overlap cleanly when rotated against each other. All 7 pieces use exactly the same drawing scale, as if cut from one standing soldier about 900 pixels tall (head about 120 px tall, torso about 300 px, thigh about 220 px, lower leg about 220 px, foot about 150 px wide), identical outline thickness, identical colors and identical uniform details on every piece. Uniform details: ${uniform}, unarmed. The man has a square jaw, prominent straight nose, clean-shaven with no mustache, no beard and no stubble, neutral serious expression. Exactly the same soldier and uniform as the attached character image. Leave at least 90 px of empty background between neighbouring pieces, no overlap, no piece touching the image edge, all pieces standing on the same imaginary bottom line but with no ground line drawn. Landscape 16:9 composition, solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise, no shadow, no reflection, no labels, no numbers, no arrows, no text of any kind, no part of any piece uses the same neutral gray as the background. 2D animated documentary style, clean dark ink outlines of even thickness, flat cel shading with two tones (light and shadow), subtle warm rim light, muted earthy palette, hand-drawn animation look, no photorealism, no 3D render, no anime. Avoid: photo, 3D, anime, glossy, varying outline thickness, shadow on ground, bent or posed limbs, extra pieces, assembled full figure, watermark, text. The attached style reference images are for drawing style, color and mood only: do not reproduce their people, helmets, weapons, vehicles or locations.
`;
fs.writeFileSync(out, prompt);
console.log(`✓ ${out} (${prompt.length} ký tự, hướng ${forward})`);

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run studio        # Remotion Studio (engine/src/index.ts)
npm run render        # remotion render engine/src/index.ts <CompId> <out>
npm run still         # remotion still engine/src/index.ts <CompId> <out>
npm run validate      # tsx tools/validate.ts
npm run ingest        # tsx tools/ingest.ts
npm run typecheck     # tsc --noEmit (strict; covers engine/src, tools)
```

No test runner or linter is configured. Comments and UI strings are in Vietnamese; keep that convention.

Usage: `npm run render -- test-huey-s001 content/projects/2026-test-huey/renders/x.mp4` (composition id is `<project>-<sceneId>`); `npm run ingest -- test-huey` moves `inbox/` files into `assets/` per `prompts/manifest.json` and updates `scenes.json`. It accepts `.jpg/.png/.jpeg/.webp` (newest wins; manifest `inbox` is the stem without extension), normalizes to PNG RGBA, then applies `process`: `crop` → `keyOut` (edge flood-fill of the flat background + large enclosed holes) → `trim` → `fit` (2000×800), and converts source-pixel `anchors` into rotor positions on the layer. `crop`/`anchors` are measured per image, see the `prompt-pack` skill ("Hiệu chỉnh manifest").

## Principles

- **Claude never calls an image/video AI directly.** The `prompt-pack` skill writes prompts; from 2026-10-21 all agent-triggered image/video generation goes **only through G-Labs Studio** (`tools/glabs.mjs` / `tools/glabs-video.mjs`; see `.claude/rules/glabs-delegation.md`). Do not use agy for media. User-supplied images still land in `content/projects/<p>/inbox/` and follow the same QA flow.
- **Check `content/library/INDEX.md` first** and reuse existing characters/props/vehicles before creating new assets.
- **`scenes.json` holds no literal on-screen text**, only i18n keys resolved from `locales/<locale>.json`. Fonts must include a Vietnamese subset.
- Characters have black ink outlines, backgrounds are painterly with none. Character walking = **rig of separated parts** (one "parts sheet" image per character, split by `splitParts`, walk cycle generated in code by `engine/src/walkCycle.ts`); special gestures = action image → image-to-video done outside; rotor blades, particles, fog, smoke and grade are done in code. The 12-pose sprite-sheet (`splitFrames`) approach is legacy (colors/scales drifted between independently generated sheets). To reproduce the motion of a reference video exactly, use the `runner` layer (`components/RunnerAsset.tsx`, measured per-drawing track JSON; tools in `tools/run20-track/`, see its README).
- Image layers default to 5:2 (`aspect` 0.4 in `components/ImageAsset.tsx`) for vehicles. Human characters use the `rig` layer type (`components/RigAsset.tsx`: parts + pivots + parent/child, forward kinematics, feet always grounded); `walkSpeed` on the scene scrolls tiled backgrounds. Sandbox/regression project: `content/projects/_rig-demo` (`node tools/synth-rig.mjs` makes box-shaped parts; composition `rig-demo-walk`).

## Architecture

A data-driven video system built on Remotion. Each video is a **project** described by JSON, rendered as a stack of parallax **layers** (a 2.5D multiplane look) instead of hand-written React per scene.

- `content/` is Remotion's public dir (`remotion.config.ts` → `setPublicDir('content')`), so assets load via `staticFile('library/...')` / `staticFile('projects/...')`.
  - `content/library/` — reusable assets (e.g. `vehicles/uh1-huey`, `foreground`).
  - `content/projects/<name>/` — per project: `assets/`, `inbox/` (incoming generated images), `locales/<locale>.json`, `prompts/` (with `manifest.json`), `renders/`.
- `engine/src/schema.ts` is the source of truth for the project format (zod). `Project → scenes[] → layers[]`; `Layer` is a discriminated union on `type`: `sky | silhouette | fog | haze | image`. Scene has `focusZ`, an interpolated `camera` (`x`/`zoom` as `[from, to]` ranges with an ease name) and `text` items (`lowerThird`) whose `key` resolves in the locale JSON. Types are inferred from the schemas (`ProjectT`, `SceneT`, `LayerT`).
- Layer depth model: every layer has a `z`. `utils.parallaxFactor(z, focusZ)` scales camera translate/zoom per layer, and `components/Layer.tsx` derives blur (depth of field) from `|z - focusZ| * blurPerZ` unless `blur` is set. `utils.overScene` interpolates `[from, to]` ranges across the whole scene duration.
- `engine/src/theme.ts` holds all colors/grades (`ochre_dusk`, `misty_green`) and fonts; components must not hardcode colors. A scene's `grade` is a key into `grades`.
- **Template `vox`** (collage true crime, `engine/src/vox/`): một video = `content/projects/<p>/vox.json` (mỗi shot = 1 câu lời dẫn `say` + 1 hình `v.kind`: stamp, map, cutouts, doc, stats…), chữ ở `locales/vi.json`. Giọng: `node tools/vox-tts.mjs <p>` (edge-tts hoặc F5-TTS clone qua Colab GPU: `node tools/vox-tts.mjs <p> --provider f5 --url <gradio_url> --voice mc_vantung|tra_an`, ghi `assets/audio/<id>.mp3` + `timing.json`, thời lượng shot lấy từ đây, xem skill `voice-clone`). Bản đồ Mỹ: `node tools/us-map-extract.mjs`. Composition `<p>-full` và `<p>-vox-<shotId>`. Style: `content/library/styles/truecrime-collage.md`.
- **Composition registration is manual** in `engine/src/Root.tsx`: a new project's `scenes.json`/`vox.json` + `locales/vi.json` (+ `assets/audio/timing.json` for vox) must be imported and added to the `projects` / `voxProjects` arrays. Scene projects yield `<project>-full` (`templates/ProjectFull.tsx`) and `<project>-<sceneId>` (`templates/MultiplaneScene.tsx`); vox yields `<project>[-<variant>]-full` and `...-vox-<shotId>`. All JSON is parsed by zod at load, so a schema error breaks the whole Studio. `engine/src/stick/` (poses/moves) serves the stickman project.
- `npm run render` already passes `--concurrency=2`. Project-specific plans live in each project's `project.md`/`PLAYBOOK.md`; `.claude/progress/` holds handoff notes (mirrored in `.agent/`).
- Image layers carry `assetId` + `status: 'placeholder' | 'final'`. The intended flow: prompts in `prompts/manifest.json` → generated images dropped into `inbox/` → `ingest` swaps `src` for the matching `assetId` and flips status to `final`.

## Claude config

`.claude/` contains a `bash-helper` agent (Haiku), a `simple-bash` skill, and `rules/bash-simple.md` for generating simple, read-only shell commands. The Bash tool runs Git Bash on Windows: use POSIX syntax and `/d/videos-system/...` paths.

## Rules bắt buộc (đọc trước khi làm ảnh/prompt/shotlist)

- **Dự án mới: chọn họ style trước, không trộn.** Ghi `Style-family: investigation | history` vào `project.md`, nạp skill `video-style-investigation` (tra án, collage giấy, tài liệu gốc) **hoặc** `video-style-history` (lịch sử, bản đồ giấy + cel), cộng `content/library/styles/pacing-and-footage.md` (tốc độ đọc/nhịp, footage). Chủ đề lai hai họ: hỏi người dùng. Lẫn họ từng gây thất bại.
- Clip video G-Labs (`tools/glabs-video.mjs`) **chỉ cho cảnh khó**, pilot 1 clip, có trần số clip trong `project.md`; phần lớn chuyển động làm bằng code (xem `glabs-delegation.md`).

- `.claude/rules/style-lock.md`: khóa style (style bible `content/library/styles/uniform-showcase.md`, danh sách cấm, không `flipX` cho nhân vật có phù hiệu bất đối xứng).
- `.claude/rules/workflow-gates.md`: không làm khi chưa duyệt, pilot trước loạt, báo cáo trung thực.
- `.claude/rules/one-source.md`: `.claude/` là nguồn gốc, đồng bộ sang `.agent/`.
- `.claude/rules/reenactment-first.md`: mọi video ưu tiên dựng lại cảnh (nhân vật + hành động), số liệu chỉ là chữ phụ đè lên cảnh.
- Skill `script-craft` viết thẻ cảnh (hook, open loop, nhịp, nguồn Fxx, tự phản biện) cho từng cảnh; làm từng cảnh một, mỗi cảnh có cổng duyệt (`workflow-gates.md` mục 7). Ảnh 2D qua G-Labs dùng `nano_banana_2_lite`/`nano_banana_2`, không dùng Pro.
- Skill `style-capture` ghi lại style từ video tham chiếu; công thức lớp nền/tiền cảnh ở `content/library/styles/layer-recipe.md` (nền phẳng có viền, nhiều lớp, cỏ che chân).
- Skill `style-guard` chấm mọi ảnh trước khi `ingest`; skill `prompt-pack` tách ràng buộc theo loại chủ thể (nhân vật người / phương tiện / nền).

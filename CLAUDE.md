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

- **The system never calls an image/video AI.** The `prompt-pack` skill only writes prompts; the user generates images with Nano Banana and drops them in `content/projects/<p>/inbox/`.
- **Check `content/library/INDEX.md` first** and reuse existing characters/props/vehicles before creating new assets.
- **`scenes.json` holds no literal on-screen text**, only i18n keys resolved from `locales/<locale>.json`. Fonts must include a Vietnamese subset.
- Characters have black ink outlines, backgrounds are painterly with none. Character motion comes from action image → image-to-video (no SVG rigs); rotor blades, particles, fog and grade are done in code.
- Image layers are laid out at a fixed 5:2 aspect (`aspect = 0.4` in `components/ImageAsset.tsx`).

## Architecture

A data-driven video system built on Remotion. Each video is a **project** described by JSON, rendered as a stack of parallax **layers** (a 2.5D multiplane look) instead of hand-written React per scene.

- `content/` is Remotion's public dir (`remotion.config.ts` → `setPublicDir('content')`), so assets load via `staticFile('library/...')` / `staticFile('projects/...')`.
  - `content/library/` — reusable assets (e.g. `vehicles/uh1-huey`, `foreground`).
  - `content/projects/<name>/` — per project: `assets/`, `inbox/` (incoming generated images), `locales/<locale>.json`, `prompts/` (with `manifest.json`), `renders/`.
- `engine/src/schema.ts` is the source of truth for the project format (zod). `Project → scenes[] → layers[]`; `Layer` is a discriminated union on `type`: `sky | silhouette | fog | haze | image`. Scene has `focusZ`, an interpolated `camera` (`x`/`zoom` as `[from, to]` ranges with an ease name) and `text` items (`lowerThird`) whose `key` resolves in the locale JSON. Types are inferred from the schemas (`ProjectT`, `SceneT`, `LayerT`).
- Layer depth model: every layer has a `z`. `utils.parallaxFactor(z, focusZ)` scales camera translate/zoom per layer, and `components/Layer.tsx` derives blur (depth of field) from `|z - focusZ| * blurPerZ` unless `blur` is set. `utils.overScene` interpolates `[from, to]` ranges across the whole scene duration.
- `engine/src/theme.ts` holds all colors/grades (`ochre_dusk`, `misty_green`) and fonts; components must not hardcode colors. A scene's `grade` is a key into `grades`.
- Image layers carry `assetId` + `status: 'placeholder' | 'final'`. The intended flow: prompts in `prompts/manifest.json` → generated images dropped into `inbox/` → `ingest` swaps `src` for the matching `assetId` and flips status to `final`.

## Claude config

`.claude/` contains a `bash-helper` agent (Haiku), a `simple-bash` skill, and `rules/bash-simple.md` for generating simple, read-only shell commands. The Bash tool runs Git Bash on Windows: use POSIX syntax and `/d/videos-system/...` paths.

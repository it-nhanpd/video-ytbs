# Playbook: bắt đầu một video mới

Cách dùng: copy file này vào `content/projects/<yyyy-slug>/PLAYBOOK.md`, điền khối **THÔNG SỐ**, rồi đưa agent từng bước một.
Mỗi bước có: **Đầu vào → Việc agent làm → Đầu ra (file) → Cổng duyệt** (bạn duyệt xong mới sang bước kế).
Câu lệnh đưa agent nằm trong khối `PROMPT`. Chỉ cần thay `{{...}}`.

Hệ thống không tự tạo ảnh/video AI. Mọi ảnh do bạn tạo bằng Nano Banana rồi thả vào `inbox/`.

---

## THÔNG SỐ (điền trước)

```
slug:            {{2026-ten-du-an}}
topic:           {{chủ đề, vd: trận X / nhân vật Y / hiện tượng Z}}
niche:           {{ngách: lịch sử quân sự | tiểu sử | giải thích | ...}}
style-family:    {{investigation | history}}   (BẮT BUỘC chọn đúng một; xem Bước 0. Không trộn.)
locale:          {{vi}}            (thêm locale khác = thêm locales/<xx>.json, không sửa scenes.json)
thời lượng:      {{8–12 phút}}
khán giả:        {{ai xem, họ đã biết gì}}
giọng điệu:      {{trung lập giáo dục | kể chuyện | ...}}
video tham chiếu:{{URL YouTube}}
nguồn ưu tiên:   {{sách, tài liệu lưu trữ, bài báo học thuật, bảo tàng...}}
```

---

## Một video YouTube cần những gì (checklist tổng)

| Nhóm | Sản phẩm | Làm ở bước |
|---|---|---|
| Chiến lược | Phân tích tham chiếu, góc nhìn khác biệt, hook | 1 |
| Nội dung | Kịch bản đã kiểm chứng + bảng nguồn, ghi chú điểm gây tranh cãi | 2 |
| Hình | Danh sách cảnh, asset (library/mới), prompt pack, ảnh đã ingest | 3–4 |
| Dựng | `scenes.json` + `locales/<locale>.json`, bản đồ nếu có | 5 |
| Âm | Voice, nhạc, SFX, mức loudness | 6 |
| Xuất | Render, QA từng cảnh, bản hoàn chỉnh | 7 |
| Đóng gói | Tiêu đề, thumbnail, mô tả, chương, tag, ghim bình luận | 8 |
| Hậu kỳ | Promote asset vào library, ghi chú bài học | 9 |

---

## Bước 0 — Khởi tạo dự án

- **Đầu vào:** khối THÔNG SỐ.
- **Việc agent làm:** tạo `content/projects/<slug>/{project.md, scenes.json (rỗng), locales/<locale>.json, inbox/, assets/, prompts/, renders/, script/, research/}`. Ghi THÔNG SỐ vào `project.md`.
- **Chọn họ style (bắt buộc, trước mọi thứ khác):** `style-family: investigation` (tra án: vụ án, chứng cứ, che giấu) hoặc `history` (lịch sử: chiến tranh, đế chế, nhân vật, bản đồ + cảnh dựng). Nạp skill tương ứng (`video-style-investigation` hoặc `video-style-history`) **và** `content/library/styles/pacing-and-footage.md`; ghi `Style-family`, style bible, template vào `project.md`. Chủ đề lai: hỏi bạn chọn một, không trộn. Thiếu trường này thì không sang Bước 1.
- **Đầu ra:** cây thư mục + `project.md` (có `Style-family`, trần số clip G-Labs nếu dùng clip).
- **Cổng duyệt:** bạn xác nhận thông số và họ style.

```
PROMPT 0
Tạo dự án mới theo content/projects/2026-test-huey làm mẫu. Thông số: <dán khối THÔNG SỐ>.
Nạp skill video-style-<investigation|history> theo style-family và content/library/styles/pacing-and-footage.md. Nếu chủ đề lai hai họ, dừng và hỏi tôi.
Chỉ tạo khung, chưa viết nội dung. Chạy npm run validate để kiểm tra.
```

## Bước 1 — Phân tích video tham chiếu

- **Đầu vào:** URL tham chiếu (nên có transcript hoặc bạn dán bảng frame).
- **Việc agent làm:** phân tích **cấu trúc**, không sao chép: hook 30 giây đầu, nhịp (số cảnh/phút, độ dài cảnh trung bình), tỉ lệ loại cảnh (nhân vật, bản đồ, tư liệu, text), kiểu chuyển động camera, phong cách đồ họa/bản đồ/chữ, âm thanh, điểm giữ chân (câu hỏi mở, đảo chiều, mốc thời gian). Rồi đề xuất **3 điểm khác biệt** để video mình không giống bản gốc.
- **Đầu ra:** `research/01-reference-analysis.md` gồm: tóm tắt, bảng nhịp, bảng cảnh mẫu, "điều nên học / điều không được copy", 3 điểm khác biệt, rủi ro (nhạy cảm, bản quyền).
- **Style lock (bắt buộc, cuối Bước 1):** mọi điều rút ra về hướng nhìn, hướng đi, tỉ lệ nhân vật/khung, chuyển động, nền, chú thích, bảng màu phải thành **style bible** `content/library/styles/<tên>.md` (mẫu: `uniform-showcase.md`, có danh sách cấm đo được) và ảnh tham chiếu style trong `styles/refs/`. Không có style bible thì không sang Bước 3.
- **Cổng duyệt:** bạn chọn hướng khác biệt và duyệt style bible.

```
PROMPT 1
Phân tích video {{URL}} để dùng làm tham chiếu CẤU TRÚC cho dự án {{slug}}.
Xuất research/01-reference-analysis.md theo các mục: hook, nhịp, loại cảnh, camera, đồ họa, âm thanh,
điểm giữ chân, điều nên học, điều KHÔNG được copy (nhận diện kênh, câu chữ, hình ảnh), 3 điểm khác biệt đề xuất.
Không viết kịch bản ở bước này.
```

## Bước 2 — Nghiên cứu và viết kịch bản bám nguồn kiểm chứng

- **Đầu vào:** bước 1 đã duyệt, topic, nguồn ưu tiên.
- **Việc agent làm:**
  1. Lập **bảng nguồn** (`research/02-sources.md`): mỗi nguồn gồm loại (sơ cấp/thứ cấp), tác giả, năm, link, độ tin cậy. Ưu tiên tài liệu sơ cấp và học thuật; nguồn yếu chỉ để tham khảo.
  2. Lập **bảng sự kiện** (`research/03-facts.md`): mỗi dòng = một khẳng định + ngày/địa điểm/số liệu + ≥2 nguồn độc lập + trạng thái (đã kiểm chứng / tranh cãi / chưa rõ). Số liệu tranh cãi phải ghi khoảng giá trị và ai nói gì.
  3. Viết kịch bản `script/<locale>.md` chỉ dùng các dòng "đã kiểm chứng". Phần tranh cãi nêu rõ là tranh cãi.
  4. Mỗi đoạn kịch bản gắn mã sự kiện (`[F12]`) để truy ngược nguồn.
- **Cấu trúc kịch bản gợi ý:** hook (câu hỏi/khoảnh khắc) → bối cảnh → diễn biến theo mốc thời gian → điểm ngoặt → hệ quả → bài học/câu hỏi để lại. Mỗi 60–90 giây có một "nhịp mới" (thông tin bất ngờ, địa điểm mới, đảo chiều).
- **Quy tắc viết:** câu ngắn, đọc lên tự nhiên, ~140–160 từ/phút tiếng Việt, tên riêng viết đúng dấu, không bịa chi tiết cảm xúc/lời thoại không có nguồn, không phán xét thay người xem.
- **Đầu ra:** `research/02-sources.md`, `research/03-facts.md`, `script/<locale>.md`, `research/04-open-questions.md` (điểm chưa chắc).
- **Cổng duyệt:** bạn đọc bảng sự kiện và kịch bản; sửa/duyệt. Không sang bước 3 khi còn dòng "chưa rõ" được dùng trong kịch bản.

```
PROMPT 2
Dựa trên research/01-reference-analysis.md (hướng khác biệt đã chọn: {{...}}), nghiên cứu topic "{{topic}}".
Làm lần lượt: (a) research/02-sources.md, (b) research/03-facts.md với ≥2 nguồn độc lập cho mỗi dòng,
(c) script/{{locale}}.md dài khoảng {{N}} từ, mỗi đoạn gắn mã [Fxx].
Chỉ dùng dữ kiện đã kiểm chứng; chỗ tranh cãi phải nói rõ. Ghi mọi điểm chưa chắc vào research/04-open-questions.md.
Không dán nguyên văn câu chữ từ nguồn hay từ video tham chiếu.
```

## Bước 3 — Chia cảnh và prompt pack tạo ảnh

- **Đầu vào:** kịch bản đã duyệt.
- **Việc agent làm:**
  1. Chia kịch bản thành **bảng cảnh** `script/shotlist.md`: mã cảnh, đoạn lời, thời lượng, loại (multiplane / bản đồ / tư liệu / text), mô tả hình, camera, grade, tiền cảnh/hậu cảnh, âm thanh gợi ý.
  2. **Tra `content/library/INDEX.md` trước.** Asset đã có thì dùng lại; chỉ tạo mới phần thiếu.
  3. Với asset thiếu: dùng skill `prompt-pack` để ghi `prompts/<scene>.md` + `prompts/manifest.json`. Prompt **phải** dán đúng block theo loại chủ thể trong skill `prompt-pack` (nhân vật người: hướng PHẢI, đang đi, base body, khung theo tỉ lệ người; phương tiện: 5:2, 90°; nền: block nền riêng) và block style của style bible. **Không áp luật vật thể cứng (5:2, hướng trái, flipX) cho nhân vật người.**
  4. Vũ khí/phương tiện/quân phục phải đúng thời kỳ: ghi rõ ảnh tham chiếu thật cần đính kèm.
  5. Chuyển động nhân vật: sprite sheet bước đi 12 tư thế (3 ảnh × 4, 12fps, mượt cao) từ ảnh anchor đã duyệt; cử động đặc biệt dùng prompt image-to-video riêng (2–4 giây). Không bỏ chuyển động để đơn giản hóa khi chưa được bạn duyệt.
  6. **Prompt nền (environment plate)** cho mỗi bối cảnh, không chỉ nhân vật.
  7. **Pilot trước loạt:** chỉ làm 1 nhân vật + 1 nền + 1 cảnh dựng thử; chạy skill `style-guard`; chờ bạn duyệt "pilot đã duyệt" rồi mới làm phần còn lại.
- **Đầu ra:** `script/shotlist.md`, `prompts/*.md`, `prompts/manifest.json`, danh sách "asset dùng lại / asset cần tạo".
- **Cổng duyệt:** bạn xem shotlist và prompt; chỉnh trước khi đi tạo ảnh. Sau pilot, bạn duyệt style rồi mới làm loạt.

```
PROMPT 3
Từ script/{{locale}}.md hãy lập script/shotlist.md (mã cảnh, lời, thời lượng, loại cảnh, mô tả hình, camera, grade, lớp z).
Tra content/library/INDEX.md để đánh dấu asset dùng lại. Với asset còn thiếu, dùng skill prompt-pack sinh prompts/<scene>.md
và manifest.json (có khối ràng buộc kỹ thuật). Mỗi prompt kèm ảnh tham chiếu cần đính kèm và checklist QA.
Kết thúc bằng bảng: asset | dùng lại hay tạo mới | file prompt.
```

## Vòng làm từng cảnh (thay cho làm loạt toàn video)
Mỗi cảnh một vòng, có cổng duyệt; không làm hai cảnh song song (`.claude/rules/workflow-gates.md` mục 7).
1. **G1: thẻ cảnh.** Skill `script-craft` viết `script/scenes/sNNN.md` (ý định, open loop, nhịp, lời dẫn + bản TTS, nguồn Fxx, asset cần, tự phản biện). Người dùng nhận xét/duyệt.
2. **G2: asset.** Đối chiếu `library/INDEX.md`; nêu số ảnh thiếu (bảng bộ phận nhân vật, nền) và model (`nano_banana_2_lite` hoặc `nano_banana_2`). Người dùng xác nhận.
3. Tạo ảnh qua `tools/glabs.mjs` (hoặc người dùng tạo tay) → `style-guard` → `ingest`.
4. Dựng cảnh trong `scenes.json`; cập nhật shotlist cảnh đó theo style bible mới.
5. **G3: xem.** Claude render still các nhịp chính; người dùng tự render/xem clip và nhận xét.
6. Sửa theo nhận xét; ghi "đã duyệt" vào `.claude/progress/`; cập nhật `script/vi.md` và `audio/vi-tts.md` cho cảnh đó.

## Bước 4 — Bạn tạo ảnh, agent ingest

- **Bạn làm:** tạo ảnh bằng Nano Banana theo prompt pack, QA bằng checklist, thả vào `inbox/` (tên file = `<assetId>`, đuôi jpg/png/webp đều được).
- **Agent làm:** chạy skill `style-guard` cho từng ảnh (không đạt thì dừng, báo lỗi, sửa prompt), rồi xem ảnh thật, **đo lại `crop` và `anchors`** trong manifest (mỗi ảnh một khác), chạy `npm run ingest -- <project>`, `npm run validate`, render một still và kiểm tra: viền bẩn, lỗ xám, cánh quạt lệch trục. Sai thì chỉnh manifest, ingest lại.
- **Đầu ra:** `assets/*.png`, `scenes.json` cập nhật `src/status`.
- **Cổng duyệt:** bạn xem still từng asset.

```
PROMPT 4
Tôi đã thả ảnh vào inbox/: {{danh sách}}. Dùng skill prompt-pack, phần "Hiệu chỉnh manifest":
xem từng ảnh, điền process trong manifest.json, chạy ingest + validate, render still cho mỗi cảnh liên quan
và báo lỗi nhìn thấy (viền, lỗ, lệch). Chưa render video đầy đủ.
```

## Bước 5 — Dựng `scenes.json` và text i18n

- **Đầu vào:** shotlist + asset đã ingest.
- **Việc agent làm:** viết `scenes.json` (mỗi cảnh: layers, z, camera, grade, focusZ, text). **Không để chữ cứng**, chỉ key; chữ nằm ở `locales/<locale>.json` (có dấu tiếng Việt, font có subset vietnamese). Cảnh nào chưa có ảnh final thì dùng placeholder và đánh dấu.
- **Đầu ra:** `scenes.json`, `locales/<locale>.json`, `npm run validate` pass.
- **Cổng duyệt:** bạn xem still đại diện của từng loại cảnh.

> Hiện engine có template `MultiplaneScene`. Bản đồ (Atlas 1960s), cảnh tư liệu, bảng chữ lớn **chưa build**: nếu shotlist có loại này, yêu cầu agent đề xuất template mới trước khi dựng.

```
PROMPT 5
Dựng scenes.json cho {{danh sách cảnh}} theo shotlist. Dùng template MultiplaneScene, grade {{ochre_dusk|misty_green|...}}.
Mọi chữ trên màn hình dùng key i18n, thêm vào locales/{{locale}}.json. Chạy npm run typecheck && npm run validate,
rồi render still frame đầu/giữa/cuối của mỗi cảnh vào renders/ để tôi xem.
```

## Bước 6 — Âm thanh

- **Việc làm:** voice (thu hoặc TTS), nhạc nền (kiểm tra bản quyền/giấy phép), SFX theo cảnh, trộn. Mức loudness mục tiêu khoảng -14 LUFS.
- **Đầu ra:** `audio/<locale>/voice.*`, `audio/music.*`, ghi giấy phép vào `project.md`.
- **Lưu ý:** timing cảnh phải khớp voice. Có file voice rồi thì nhờ agent chỉnh `durationSec` từng cảnh theo thời lượng lời.

> Skill/tool cho voice và timestamp (WhisperX) **chưa build**.

```
PROMPT 6
Voice đã có ở audio/{{locale}}/voice.wav. Đo thời lượng theo từng đoạn của kịch bản, đề xuất durationSec cho mỗi cảnh,
cập nhật scenes.json sau khi tôi đồng ý. Liệt kê nhạc/SFX cần có và điều kiện giấy phép.
```

## Bước 7 — Render và QA

- **Việc agent làm:** render từng cảnh, trích frame, soi: chữ có đúng dấu, text không tràn, độ nét/mờ theo lớp, viền asset, flicker, đúng thời kỳ vũ khí/quân phục, không có chi tiết hình ảnh gây phản cảm không cần thiết với chủ đề nhạy cảm. Ghép cảnh + audio ra bản hoàn chỉnh.
- **Đầu ra:** `renders/<scene>.mp4`, `renders/full.mp4`, `research/05-qa-report.md`.
- **Cổng duyệt:** bạn xem toàn bộ video.

```
PROMPT 7
Render tất cả cảnh (npm run render, concurrency 2), trích 3 frame mỗi cảnh, viết research/05-qa-report.md:
lỗi theo mức nặng/nhẹ, cảnh nào cần tạo lại ảnh, cảnh nào chỉ cần chỉnh scenes.json. Chưa sửa gì khi chưa hỏi tôi.
```

## Bước 8 — Tiêu đề, thumbnail, mô tả (theo ngách)

- **Việc agent làm:**
  1. **Tiêu đề:** đưa 10 phương án chia theo mẫu (câu hỏi, con số/mốc thời gian, nghịch lý, "điều bị bỏ quên"). Mỗi phương án ≤ 60 ký tự, không gây hiểu sai (không clickbait nói sai nội dung). Gợi ý chọn 3 phương án để A/B.
  2. **Thumbnail:** 3 ý tưởng, mỗi ý: một điểm nhìn duy nhất, tối đa 3–4 từ chữ, tương phản mạnh, đọc được ở kích thước nhỏ. Có prompt Nano Banana (nền/nhân vật theo style dự án) + bố cục chữ. Với chủ đề nhạy cảm: tiết chế, không dùng hình bạo lực trực diện.
  3. **Mô tả:** 2 dòng đầu chứa từ khóa và lời hứa của video; chương có mốc thời gian (lấy từ shotlist); nguồn tham khảo (lấy từ `02-sources.md`); ghi nhãn nội dung giáo dục nếu cần.
  4. **Tag/hashtag, bình luận ghim** (câu hỏi gợi tranh luận văn minh), danh sách video gợi ý kế tiếp.
- **Đầu ra:** `publish/titles.md`, `publish/thumbnail-prompts.md`, `publish/description.md`.
- **Cổng duyệt:** bạn chọn tiêu đề + thumbnail.

> Chưa có skill riêng cho bước này; agent làm trực tiếp theo PROMPT 8.

```
PROMPT 8
Ngách: {{niche}}. Khán giả: {{...}}. Dựa trên kịch bản và research/01-reference-analysis.md, tạo:
publish/titles.md (10 tiêu đề ≤60 ký tự, phân nhóm mẫu, đánh dấu 3 cái nên A/B và lý do),
publish/thumbnail-prompts.md (3 ý tưởng + prompt Nano Banana + bố cục chữ ≤4 từ),
publish/description.md (2 dòng đầu, chương có mốc thời gian, nguồn). Không hứa điều video không có.
```

## Bước 9 — Hậu kỳ: tái sử dụng

- **Việc agent làm:** với asset đã duyệt, copy vào `content/library/...`, cập nhật `meta.json` (`approved`, `usedIn`, `rotors`...), `INDEX.md`, và thẻ `.md` (prompt cuối cùng đã dùng, lỗi AI gặp, giá trị crop/anchors đã dùng). Ghi bài học vào cuối `project.md`.

```
PROMPT 9
Dự án {{slug}} đã xong. Promote các asset đã duyệt vào content/library (cập nhật meta.json, thẻ .md, INDEX.md).
Ghi bài học (điều gì lỗi, prompt nào hiệu quả, thời gian mỗi bước) vào cuối project.md.
```

---

## Quy tắc xuyên suốt cho agent (dán đầu phiên làm việc)

```
- Làm đúng một bước mỗi lần, dừng ở "Cổng duyệt" và chờ tôi.
- Mọi dữ kiện lịch sử phải truy được về nguồn; không chắc thì ghi "chưa rõ", đừng đoán.
- Không sao chép câu chữ/hình ảnh/nhận diện của video tham chiếu hay nguồn.
- Tra content/library/INDEX.md trước khi đề xuất asset mới.
- scenes.json không chứa chữ hiển thị, chỉ key i18n.
- Chọn style-family (investigation | history) và nạp skill video-style-* tương ứng trước khi làm; không trộn hai họ.
- Ảnh/clip AI chỉ qua kênh đã duyệt (G-Labs qua tools/glabs.mjs và tools/glabs-video.mjs, agy, hoặc tôi tự tạo). Clip chỉ cho cảnh khó, pilot 1 clip trước, có trần số clip.
- Đọc content/library/styles (style bible) và .claude/rules/style-lock.md, workflow-gates.md trước khi viết shotlist/prompt. Không tự đổi style.
- Không làm khi chưa duyệt: phân tích, nêu đặc tả, chờ tôi xác nhận. Pilot (1 nhân vật + 1 nền + 1 cảnh) trước khi làm loạt.
- Chỉ báo "đã xuất/đã kiểm" khi file tồn tại; nêu đường dẫn.
- Chạy npm run typecheck && npm run validate trước khi báo xong bước dựng.
- Chủ đề nhạy cảm (chiến tranh, thảm sát): góc nhìn giáo dục, tiết chế hình ảnh, nêu rõ phần tranh cãi.
```

## Hiện trạng công cụ (để biết bước nào còn thủ công)

| Bước | Có sẵn | Còn thiếu |
|---|---|---|
| 0 | dự án mẫu `2026-test-huey` | skill `video-brief` |
| 1–2 | không cần code | skill `script-writer`, `fact-checker` |
| 3 | skill `prompt-pack`, library, `INDEX.md` | skill `shot-planner` |
| 4 | `ingest`, `validate`, skill `style-guard` | tự động đo crop/anchors; tách sprite sheet bước đi (`frames`) |
| 5 | engine multiplane, i18n | template bản đồ, tư liệu, text lớn |
| 6 | — | voice, timing, mix |
| 7 | `render`, `still` | skill `render-qa`, ghép nhiều cảnh |
| 8 | — | skill thumbnail/title |

# Playbook: video nhân vật hoạt hình 2D – trận MMA (fiction)

Chỉnh từ `templates/NEW_PROJECT_PLAYBOOK.md` cho nhân vật hoạt hình 2D vẽ bằng code. Mỗi bước: **Đầu vào → Việc làm → Đầu ra → Cổng duyệt**. Làm đúng một bước mỗi lần, dừng ở cổng duyệt.

Khác với playbook gốc: **không có bước tạo ảnh AI cho nhân vật** (không Nano Banana/agy), không kiểm chứng nguồn lịch sử. Nhân vật hoạt hình 2D là component code (`FighterLayer`), chuyển động = pose keyframe.

## THÔNG SỐ
```
slug:            2026-mma-stickman
topic:           "Mũ gai vs Mũ thép": lính Phổ 1871 vs lính Đức 1916, 3 hiệp, tay không, hài
niche:           giải trí hoạt hình + quân phục Đức (fiction)
locale:          vi
thời lượng:      8–10 phút
khán giả:        người thích hoạt hình đánh nhau / MMA
giọng điệu:      hài, không lời (chữ ngắn + SFX)
video tham chiếu:{{1–2 URL kênh nhân vật hoạt hình 2D đánh nhau}}
```

## Checklist tổng
| Nhóm | Sản phẩm | Bước |
|---|---|---|
| Chiến lược | Phân tích tham chiếu, hook, style bible | 1 |
| Nội dung | Bible trận đấu, kịch bản | 2 |
| Hình | Shotlist, move library (danh sách đòn/pose), nền lồng đấu | 3 |
| Pilot | 1 nhân vật hoạt hình 2D + 1 nền + 1 cảnh render thử | 4 |
| Dựng | `scenes.json`, `locales/vi.json` | 5 |
| Âm | SFX đấm/đá, nhạc, bình luận | 6 |
| Xuất | Render, QA | 7 |
| Đóng gói | Tiêu đề, thumbnail, mô tả | 8 |
| Hậu kỳ | Đưa nhân vật + move library vào `library/` | 9 |

---

## Bước 1 — Tham chiếu và style bible
- **Đầu vào:** 1–2 URL kênh/video nhân vật hoạt hình 2D đánh nhau.
- **Việc làm:** phân tích **cấu trúc** (hook, nhịp, độ dài cảnh, loại đòn, hiệu ứng trúng đòn, góc máy, âm thanh), không sao chép nhận diện kênh. Đề xuất 3 điểm khác biệt. Viết style bible `content/library/styles/cartoon-mma.md`: độ dày nét, tỉ lệ cơ thể (đầu tròn, số khớp), màu hai võ sĩ (đỏ/xanh theo góc đài), nền (octagon dạng khối phẳng), ngôn ngữ hiệu ứng (impact star, speed lines, flash, shake), danh sách cấm đo được, ảnh/still tham chiếu vào `styles/refs/`.
- **Đầu ra:** `research/01-reference-analysis.md`, `content/library/styles/cartoon-mma.md`.
- **Cổng duyệt:** bạn chọn hướng khác biệt và duyệt style bible. Không có bible thì không sang Bước 3.

```
PROMPT 1
Phân tích {{URL}} làm tham chiếu CẤU TRÚC cho 2026-mma-stickman. Xuất research/01-reference-analysis.md
(hook, nhịp, loại cảnh, camera, hiệu ứng trúng đòn, âm thanh, điều nên học, điều KHÔNG được copy, 3 điểm khác biệt).
Sau đó đề xuất content/library/styles/cartoon-mma.md. Chưa viết kịch bản.
```

## Bước 2 — Bible trận đấu và kịch bản
- **Việc làm:** viết `research/02-fight-bible.md`: hai võ sĩ (tên, màu, lối đánh: striker vs grappler, tính cách, động cơ), luật (3 hiệp × 5 phút, cách thắng: KO/TKO/submission/điểm), diễn biến theo hiệp. Cấu trúc gợi ý: hook 30s (khoảnh khắc KO hoặc cú trúng đòn đẹp nhất) → giới thiệu → H1 thăm dò (striker áp đảo) → H2 đổi thế (đưa xuống đất) → H3 đảo chiều + kết → dư âm. Mỗi 60–90s một nhịp mới (cú bất ngờ, đảo thế, gần KO).
- **Quyết định:** có lời bình viên hay không lời (chỉ SFX + chữ). Ảnh hưởng độ dài, chi phí âm thanh.
- **Đầu ra:** `research/02-fight-bible.md`, `script/vi.md` (hoặc `script/beats.md` nếu không lời).
- **Cổng duyệt:** bạn duyệt diễn biến trận và kịch bản.

```
PROMPT 2
Theo style bible đã duyệt, viết research/02-fight-bible.md và script/vi.md cho trận MMA 3 hiệp ~{{N}} phút,
{{có lời bình / không lời}}. Mỗi đoạn gắn mã nhịp [Bxx]. Không tả máu me trực diện.
```

## Bước 3 — Shotlist và move library
- **Việc làm:** `script/shotlist.md` (mã cảnh, nhịp, thời lượng, mô tả, camera, hiệu ứng, âm thanh gợi ý). `script/move-library.md`: danh mục đòn dùng trong video, mỗi đòn = 3–5 pose (anticipation → impact → recover) với thời lượng frame; tối thiểu: đứng thủ, di chuyển, đấm thẳng, móc, đá vòng, né/đỡ, double-leg, ground & pound, khóa/siết, trúng đòn/ngã, KO, chiến thắng. Tra `content/library/INDEX.md` trước.
- **Đầu ra:** `script/shotlist.md`, `script/move-library.md`.
- **Cổng duyệt:** bạn duyệt shotlist và danh sách đòn.

## Bước 4 — Pilot (bắt buộc trước loạt)
- **Việc làm:** (a) viết component `FighterLayer` + layer `fighters` trong engine (xem phần Engine bên dưới), (b) 1 nhân vật hoạt hình 2D + 1 nền lồng đấu, (c) 1 cảnh thử: 1 combo đấm–đá + 1 cú trúng/KO có shake, freeze, impact star. Render still + mp4 vào `renders/pilot.*`.
- **Cổng duyệt:** bạn xem pilot và ghi **"pilot đã duyệt"** vào `project.md`. Chưa có thì cấm làm hàng loạt.

```
PROMPT 4
Làm pilot theo script/move-library.md: component FighterLayer + 1 cảnh thử (combo + KO). Chạy npm run typecheck &&
npm run validate, render still và mp4 vào renders/pilot.*. Báo đường dẫn file thật. Chưa làm các cảnh khác.
```

## Bước 5 — Dựng `scenes.json`
- Sau "pilot đã duyệt": dựng toàn bộ cảnh theo shotlist, mỗi đòn gọi từ move library, chữ chỉ dùng key i18n (`locales/vi.json`, font có subset Vietnamese). Chạy `npm run typecheck && npm run validate`. Still từng loại cảnh để bạn xem.

## Bước 6 — Âm thanh
- SFX là trọng tâm: đấm, đá, ngã, còi, đám đông, nhịp tim lúc gần KO. Nhạc nền (ghi giấy phép vào `project.md`), bình luận (nếu có), loudness ~ -14 LUFS. Chỉnh `durationSec` khớp âm thanh sau khi bạn đồng ý.

## Bước 7 — Render và QA
- Render từng cảnh, trích 3 frame/cảnh, soi: khớp pose giữa các đòn, khớp xương không méo, shake không làm chữ trôi, đòn trúng đúng thời điểm với SFX. Xuất `renders/full.mp4`, `research/05-qa-report.md`.

## Bước 8 — Tiêu đề, thumbnail, mô tả
- 10 tiêu đề ≤60 ký tự (kiểu "Ai thắng?", con số, đảo chiều), 3 ý thumbnail (hai nhân vật hoạt hình 2D đối đầu + 3–4 chữ, tương phản mạnh; thumbnail vẽ bằng chính engine bằng `npm run still`), mô tả có chương + mốc thời gian, tag, bình luận ghim ("Bạn đoán ai thắng hiệp 2?").

## Bước 9 — Hậu kỳ
- Đưa nhân vật nhân vật hoạt hình 2D, move library, nền lồng đấu vào `content/library/` (cập nhật `INDEX.md`), ghi bài học cuối `project.md`.

---

## Engine (làm ở Bước 4, sau khi bạn đồng ý bắt đầu pilot)
- Thêm layer `type: 'fighters'` vào `engine/src/schema.ts`: `fighter` (id/màu từ `theme.ts`), `x`, `facing`, `timeline: [{move, atFrame}]`.
- `engine/src/components/FighterLayer.tsx`: 12 khớp, vẽ bằng nét SVG dày; dữ liệu pose trong file riêng (`engine/src/moves/*.ts`), `interpolate` góc khớp giữa các pose với easing ngắn. Không dùng `flipX` bằng cách lật ảnh: lật bằng `facing` trong code (nhân vật hoạt hình 2D không có phù hiệu bất đối xứng nên an toàn).
- Hiệu ứng: `ImpactStar`, `SpeedLines`, `Flash`, camera shake dùng range camera hiện có.
- Màu chỉ lấy từ `engine/src/theme.ts`. Cập nhật `tools/validate.ts` (kiểm `move` tồn tại) và `engine/src/Root.tsx` (đăng ký composition `2026-mma-stickman`).

## Quy tắc xuyên suốt
- Một bước mỗi lần, dừng ở cổng duyệt; không làm khi chưa duyệt; pilot trước loạt (`.claude/rules/workflow-gates.md`).
- Không sửa `uniform-showcase.md`/`comic-cel-painterly.md`; style của dự án này là `cartoon-mma.md` (do bạn duyệt).
- `scenes.json` không chứa chữ hiển thị, chỉ key i18n.
- Chỉ báo "đã tạo/render/kiểm" khi file tồn tại và nêu đường dẫn.
- Nội dung bạo lực: tiết chế, không máu me trực diện, không nhắm vào người thật.

# truecrime-ursula-herrmann: "Chiếc hộp trong rừng"

## Thông số
- **slug:** 2026-truecrime-ursula-herrmann
- **Topic:** vụ bắt cóc Ursula Herrmann (Eching am Ammersee, Bayern, 15/9/1981), bản án LG Augsburg 2010 dựa trên chứng cứ gián tiếp (máy ghi âm Grundig TK 248, mức giám định "wahrscheinlich"), và việc anh trai nạn nhân nghi ngờ bản án.
- **Video tham chiếu (chỉ tham khảo, không phải nguồn):** "Kỳ án chấn động nước Đức | URSULA HERRMANN", CẢI KINH DỊ, https://www.youtube.com/watch?v=4tti9WpgBAg. Phân tích: `research/00-ref-analysis.md`.
- **Locale:** vi. **Khung:** 1920×1080, 30 fps. **Thời lượng mục tiêu:** ~20 phút (người dùng chọn 2026-10-18).
- **Template:** `vox` (paper-collage), style `content/library/styles/truecrime-collage.md` (dùng lại từ dự án Unabomber). Kind mới: `engine/src/vox/case.tsx` (letter, boxplan, calls, ladder, mapphoto, timeline, wave, checklist).

## Quyết định / ủy quyền
- **2026-10-18, người dùng:** duyệt kế hoạch (20 phút; "ưu tiên ảnh có giấy phép > code + AI minh họa"), yêu cầu nghiên cứu sâu trước, rồi "đồng ý" với báo cáo nghiên cứu `research/05-research-summary.md`. Áp tiếp quyền tự chạy G1/G2/G3 như dự án Unabomber; **render để người dùng tự làm**.
- Không tải video tham chiếu (người dùng từ chối lệnh tải); chỉ lấy phụ đề tự động.
- **Đạo đức / pháp lý (Claude tự đặt):**
  - Nạn nhân là trẻ em: không dùng ảnh nạn nhân, không tạo hình AI có trẻ em, không mô tả chi tiết cái chết.
  - Người bị kết án còn sống, đã được thả có điều kiện (2023) và vẫn phủ nhận: gọi là **"Werner M."** như báo chí Đức; mọi câu về tội viết "theo bản án / tòa kết luận"; luôn nêu việc ông phủ nhận và việc anh trai nạn nhân nghi ngờ.
  - Không nêu tên: người khai đào hố năm 1982 (chưa bị kết án, đã mất), vợ của Werner M. (trắng án), người bị nêu trong thư nặc danh, người trong vụ München 2006.
  - Không dùng các chi tiết sai/không nguồn của video tham chiếu (que cảm xạ, sợi tóc 2007, "bồi thẩm đoàn", "xuống địa ngục"…), xem `research/05-research-summary.md`.
- G-Labs: `nano_banana_2_lite`, 10 lần gọi (1 bị từ chối chính sách, không thử lại).

## Trạng thái
| Bước | Nội dung | Trạng thái |
|---|---|---|
| 1 | Nghiên cứu: bản án 310 tr. (SA1/SB1), OLG München 2020, Landtag 2016, thư ngỏ 2018, báo có tên | xong: `research/01-a-*.md`, `01-b-*.md`, tổng hợp `05-research-summary.md` |
| 2 | Kịch bản 163 shot, 8 chương | xong: `vox.json`, `locales/vi.json`, `script/vi.md` (cột nguồn FA/FB), `script/description.md`. Sinh từ `scratchpad/ursula/build.mjs` |
| 3 | Asset: 18 trích bản án, 14 ảnh Commons, 9 ảnh AI, bản đồ Natural Earth + Reichskarte 1899, TTS, nhạc | xem `qa/image-sources.md` |
| 4 | Engine: `case.tsx` + đăng ký `CASE_SHOTS` trong `shots.tsx`, dự án trong `Root.tsx`; `crime.tsx` docpage nhận `aspect` (không đổi hành vi khi thiếu, bản Unabomber giữ nguyên) | xong, typecheck sạch |
| 5 | TTS 163 câu (`assets/audio/*.mp3`, `timing.json`), nhạc `assets/audio/music.mp3` (1320 s) | xong; tổng **19:22** |
| 6 | Tự chấm 163 still + 72 still sửa | xong, `qa/stills-review.md` |

## Render (người dùng tự chạy)
```
npx remotion render engine/src/index.ts 2026-truecrime-ursula-herrmann-full content/projects/2026-truecrime-ursula-herrmann/renders/ursula-raw.mp4 --concurrency=4 --crf=18
cd content/projects/2026-truecrime-ursula-herrmann
ffmpeg -i renders/ursula-raw.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k renders/ursula-1080p.mp4
```

## Việc còn lại cho người dùng
- Nghe phát âm tên Đức (map `tts` trong `vox.json`: U-xu-la, Hơ-man, Ê-khinh, A-mơ-dê, Sôn-đoóc, Vec-nơ Em…); sửa rồi `node tools/vox-tts.mjs 2026-truecrime-ursula-herrmann --only <id> --force`.
- Nếu có quyền juris/beck-online: văn bản BGH 2011 và bản chính thức của bản án 2010 (hiện dùng bản do trang ủng hộ bị cáo đăng; số hồ sơ, Tenor khớp OLG 2020).
- Kiểm điều khoản thương mại của Edge TTS.

## Pilot v2 "hồ sơ vụ án" (2026-10-18, chờ người dùng duyệt)
Người dùng nhận xét bản 19:22 là ảnh tĩnh, thiếu hiệu ứng, nhạc, và muốn flow "người xem là thám tử". Chọn nguyên tắc **chia hình theo vai trò nhịp** (`.claude/rules/reenactment-first.md`) rồi duyệt kế hoạch.
- Pilot: `vox-v2.json` (28 shot, 3:54), không đè bản cũ. Id composition `2026-truecrime-ursula-herrmann-v2-full`.
- Kind mới (`engine/src/vox/cine.tsx`): `scene25` (nhiều lớp, parallax), `desk` (tài liệu trên bàn điều tra, bút dạ quang, dịch), `board` (bảng chứng cứ, chỉ đỏ). Camera theo shot `v.cam` (`camera.ts`), không khí `v.atmos` (`atmos.tsx`), SFX `v.sfx`, nhạc đổi theo đoạn `cues` + hạ khi có lời `duck`.
- Công cụ: `tools/sfx-synth.mjs`, `tools/music-synth.mjs --mood`, `tools/vox-tts.mjs --vox`.
- Gate: **pilot đã duyệt (người dùng, 2026-10-18)**; đang làm loạt chương 2–8. Tự chấm: `qa/pilot-v2-review.md`.
- Render clip pilot (người dùng tự chạy): `npx remotion render engine/src/index.ts 2026-truecrime-ursula-herrmann-v2-full content/projects/2026-truecrime-ursula-herrmann/renders/pilot-v2.mp4 --concurrency=4 --crf=18`

## Bản v2 đầy đủ (2026-10-18, chờ người dùng xem)
- Pilot đã duyệt; lô chương 2–8 xong: `vox-v2.json` **167 shot, 21:15**, composition `2026-truecrime-ursula-herrmann-v2-full`. Tự chấm: `qa/v2-review.md`. Mô tả: `script/description-v2.md` (mốc chương mới).
- Cấu trúc "hồ sơ vụ án": mở đầu lạnh, Hồ sơ số 1–8, bảng chứng cứ ghim thêm thẻ cuối chương, chương cuối "Bạn là thẩm phán" (hai cột: tòa dựa vào / câu hỏi còn lại), không phán thay người xem.
- G-Labs thêm 14 lần (lô v2), tổng 32. Nhạc: `mus_tension`, `mus_invest`, `mus_grief` (đổi theo chương qua `cues`), SFX `assets/sfx/`.
- Render đầy đủ (người dùng tự chạy):
```
npx remotion render engine/src/index.ts 2026-truecrime-ursula-herrmann-v2-full content/projects/2026-truecrime-ursula-herrmann/renders/ursula-v2-raw.mp4 --concurrency=4 --crf=18
cd content/projects/2026-truecrime-ursula-herrmann
ffmpeg -i renders/ursula-v2-raw.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k renders/ursula-v2-1080p.mp4
```

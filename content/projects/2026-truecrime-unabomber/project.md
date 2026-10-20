# truecrime-unabomber — "17 năm, 16 quả bom, và một người em đọc báo"

## Thông số
- **slug:** 2026-truecrime-unabomber
- **Topic:** vụ UNABOM (1978–1998): FBI truy 17 năm không ra, vụ án được phá nhờ David Kaczynski nhận ra anh mình qua bản tuyên ngôn đăng báo năm 1995.
- **Lý do chọn vụ:** vụ liên bang Mỹ, đã kết án (nhận tội 1998), có nhiều tư liệu chính phủ thuộc phạm vi công cộng (ảnh vật chứng FBI, áp phích UNABOM, ảnh US Marshals) và văn bản tòa án đọc được.
- **Dạng:** thử nghiệm "Vox-style" cho kênh true crime (phân tích kênh Criminally Listed / Truly Criminal ngày 2026-10-17: hai kênh dùng footage/stock thật, không dựng lại 1:1 được; hướng chuyển thể: cấu trúc 1 vụ/video + hình collage Vox với tư liệu PD).
- **Locale:** vi. **Khung:** 1920×1080, 30fps. **Thời lượng mục tiêu:** ~3–4 phút (bản pilot hoàn chỉnh).
- **Giọng đọc:** edge-tts `vi-VN-NamMinhNeural` (miễn phí, Microsoft neural TTS online), mỗi câu một file để khớp hình.
- **Style:** `content/library/styles/truecrime-collage.md` (mới, viết cho dự án này).

## Quyết định / ủy quyền
- **2026-10-17, người dùng (văn bản trong chat):** "tạo plan => thu thập => implement => test => debug cho đến khi done và tôi cho quyền bạn tuyệt đối. Hay auto làm đến khi done tác phẩm." → Áp cho dự án này: Claude tự chạy các cổng G1/G2/G3 (`workflow-gates.md` mục 7), tự duyệt pilot, tự tạo style bible mới thay vì chờ duyệt (`style-lock.md`). Người dùng xem lại toàn bộ khi quay lại; mọi quyết định ghi ở đây.
- Giới hạn Claude tự đặt dù có ủy quyền: không dùng Atlas Cloud/`vox-director` (trả phí); G-Labs chỉ `nano_banana_2_lite`/`nano_banana_2`, tối đa ~10 ảnh; không tạo ảnh AI giống người thật; không dùng ảnh gia đình/ảnh riêng tư; không đăng tải gì lên mạng.
- **Nguồn:** theo `source-policy.md`. FBI.gov, Britannica, Smithsonian, LoC chặn truy cập tự động (403) → căn cứ chính là văn bản tòa án liên bang (law.resource.org) + áp phích UNABOM của FBI (tài liệu gốc). Câu nào chỉ có 1 nguồn thì viết có giới hạn ("theo hồ sơ tòa án", "theo FBI").

## Trạng thái
| Bước | Nội dung | Trạng thái |
|---|---|---|
| 1 | Nguồn + bảng sự kiện | xong: `research/02-sources.md`, `research/03-facts.md` |
| 2 | Kịch bản (28 shot) | xong: `locales/vi.json`, bảng đọc `script/vi.md`, mô tả YouTube `script/description.md` |
| 3 | Asset: ảnh PD (12, FBI), ảnh AI (5 lần gọi G-Labs lite), TTS (27 câu), nhạc tổng hợp | xong, hồ sơ `qa/image-sources.md` |
| 4 | Engine: template `vox` (`engine/src/vox/`), `tools/vox-tts.mjs`, `tools/us-map-extract.mjs` | xong, typecheck sạch |
| 5 | Render + tự chấm | xong (2026-10-17): nháp `renders/draft1-half.mp4` → sửa s05/s14/s23/s24/s25/s28 → bản cuối `renders/unabomber-vox-vi-1080p.mp4` (1920×1080, 3:06, -14,1 LUFS) |

## Bản dài ~10 phút (2026-10-17, người dùng yêu cầu "implement", render để người dùng tự làm)
- Sau khi so sánh với 3 video tiếng Việt cùng chủ đề (Lật Lại Kỳ Án, Bí ẩn - Kỳ thú, Hồ Sơ Chuyên Án): mở rộng thành 7 chương, 74 shot, 9:47.
- `vox.json` = bản dài (shot L01–L69, có L09b/L52b/L61b/L63b/L65b); bản 3 phút cũ giữ ở `vox-short.json` (audio s01–s27 vẫn còn).
- Nguồn mới: FBI Vault phần 1–2 (S6, S7), phụ trương Washington Post (S8), Mathematics Genealogy Project (S9) → `research/02-sources.md`, F17–F27 trong `research/03-facts.md`. Chủ động **không** dùng "IQ 167", "Harvard năm 16 tuổi", cái chết 2023 (không có nguồn gốc đọc được); video nói rõ điều này (L30–L31).
- Kind mới `engine/src/vox/crime.tsx`: chapter, bombmap, docpage (`wide` cho crop dạng dải), yearbar, stamps, factcard. Phối hợp với phiên `2026-truecrime-my-lai` (họ thêm `geomap`, `history.tsx`); mỗi bên chỉ thêm 1 dòng đăng ký trong `shots.tsx`.
- Âm thanh: 73 câu TTS (`assets/audio/L*.mp3`, `timing.json`), nhạc `assets/audio/music-long.mp3` (660 s).
- Tự chấm: 42 still nửa độ phân giải (2 đợt); lỗi đã sửa: L19/L27 chữ scan quá nhỏ (thêm `wide`), L26 dòng nguồn bị phụ đề che, L33 phụ đề "F C".
- **Render (người dùng tự chạy):** `npx remotion render engine/src/index.ts 2026-truecrime-unabomber-full content/projects/2026-truecrime-unabomber/renders/unabomber-long-raw.mp4 --concurrency=4 --crf=18`, rồi chuẩn hóa âm thanh: `ffmpeg -i renders/unabomber-long-raw.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k renders/unabomber-long-1080p.mp4`.

## Việc còn lại cho người dùng
- Nghe giọng TTS: phiên âm tên riêng (Ca-din-xki, Iu-na-bom-mơ…) đặt ở `vox.json` > `tts`; sửa rồi chạy `node tools/vox-tts.mjs 2026-truecrime-unabomber --force` và render lại.
- Kiểm điều khoản thương mại của giọng Edge TTS trước khi bật kiếm tiền; cân nhắc giọng người thật.
- Rủi ro ảnh phác họa (pd07): nguồn trung gian, xem `qa/image-sources.md`.

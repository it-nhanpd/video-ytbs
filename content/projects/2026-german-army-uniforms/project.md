# german-army-uniforms — Sự tiến hóa quân phục lục quân Đức

## Thông số
- **slug:** 2026-german-army-uniforms
- **Topic:** sự tiến hóa quân phục lục quân Đức, phạm vi D' (1871 → nay), trục "quy định vs thực tế"
- **Ngách:** lịch sử quân sự (quân phục/trang bị), dạng hoạt hình
- **Locale:** vi (key i18n trong `locales/vi.json`, `scenes.json` không chứa text cứng)
- **Thời lượng:** 19 phút 30 giây (1.170 giây, chia thành 14 cảnh `s001`–`s014`)
- **Ảnh tham khảo:** 6 ảnh trong `research/images/` (ch01×1, ch02×2, ch03×1, ch05×1, ch07×1), chỉ minh họa, không phải bằng chứng; đã sửa giấy phép `ch01` sang `CC BY-SA 3.0` trong `metadata.csv`
- **Khán giả:** người xem VN thích lịch sử quân sự/đồ họa, biết sơ về Đức, chưa rành chi tiết quân phục từng thời kỳ
- **Giọng điệu:** trung lập giáo dục
- **Video tham chiếu:** https://www.youtube.com/watch?v=5nX9uVBi95s
- **Nguồn ưu tiên:** ảnh/tư liệu bảo tàng quân sự (DHM, AWM, DPM, Karlshorst, Runde Ecke), văn bản sơ cấp (RGBl, Osten-Sacken 1916, TM-E 30-451, tài liệu Bundestag, TL 8305-0290/0297), bài học thuật (Hoffmann, Hüpel, Köster, Wenzke)
- **Khung:** 1920×1080, 24fps, letterbox 2.35:1

## Trạng thái các bước
| Bước | Nội dung | Trạng thái |
|---|---|---|
| 0 | Khởi tạo dự án | xong |
| 1 | Phân tích video tham chiếu + khảo sát phạm vi | xong, đã duyệt (D', cả 5 hướng) |
| 2 | Nghiên cứu + kịch bản | xong bản nháp đầy đủ (`research/02-04`, `research/ch04-ch07/`, `script/vi.md`) — chờ bạn duyệt cùng Bước 3 |
| 3 | Shotlist + prompt pack | **xong, chờ duyệt** (`script/shotlist.md`, `prompts/s001.md`–`s014.md`, `prompts/manifest.json`, 14 thẻ library) |
| 4 | Tạo ảnh + ingest | chưa (chờ bạn tạo ảnh từ prompt pack và thả vào `inbox/`) |
| 5 | Dựng scenes.json | đã dựng khung 14 cảnh + `locales/vi.json` với placeholder SVG |
| 6 | Âm thanh | chưa |
| 7 | Render + QA | chưa |
| 8 | Tiêu đề, thumbnail, mô tả | chưa |
| 9 | Promote asset vào library | chưa |

## Cảnh (`s001` – `s014`)
- `s001` (75s, `misty_green`): Hook — So sánh cạnh nhau Bộ binh Phổ 1871 vs Bộ binh Đức 1916
- `s002` (70s, `ochre_dusk`): Ch.1 — Tuyên bố Đế quốc 1871 & ngoại lệ quân phục Bayern
- `s003` (65s, `ochre_dusk`): Ch.1 — Cải tổ Sachsen 1867 & sự thu nhỏ của mũ Pickelhaube (1867 → 1871)
- `s004` (75s, `ochre_dusk`): Ch.2 — Schutztruppe Tây Nam Phi (Mũ *Südwester* & vải bông kaki)
- `s005` (75s, `ochre_dusk`): Ch.2 — Lính Askari Đông Phi (Mũ *Tarbusch* kaki & bối cảnh chiến tranh thuộc địa)
- `s006` (90s, `misty_green`): Ch.3 — Thế chiến I: Feldgrau, mũ *Ersatz* nỉ/bìa ép & mũ M1915 tháo mũi nhọn
- `s007` (90s, `misty_green`): Ch.3 — Sắc lệnh 21/9/1915 & sự ra đời của mũ thép *Stahlhelm* M1916
- `s008` (75s, `misty_green`): Ch.4 — Reichswehr (1921–1932): Trần 100.000 quân & mũ thép M18 gắn khiên bang
- `s009` (75s, `misty_green`): Ch.4 — Giai đoạn chuyển giao 1933–1935: Cockade 1933, chính trị hóa 1934 & mũ M35
- `s010` (110s, `ochre_dusk`): Ch.5 — Wehrmacht Heer: So sánh cạnh nhau Mẫu 1936 vs Mẫu 1944 & ngộ nhận Hugo Boss
- `s011` (100s, `misty_green`): Ch.5 — Khí hậu cực đoan (Nhiệt đới vs Đông 1941–42) & *Volkssturm* 1944
- `s012` (150s, `misty_green`): Ch.6 — Chia cắt Đông–Tây: *Bundeswehr* 1956 (mũ kiểu M1 Mỹ, *Splittertarn*) vs *NVA* 1956 (mũ M56, đồ xám đá)
- `s013` (90s, `ochre_dusk`): Ch.7 — Thống nhất 1990, *Flecktarn* 5 màu (TL 8305-0290), mũ Aramid M92 & *3-Farb-Tarndruck* sa mạc
- `s014` (60s, `misty_green`): Ch.7 — Hiện đại hóa 2022–2026: Hệ thống *KBS SK*, họa tiết *Multitarn* & cắt giảm định mức 173 → 77 món

## Asset dùng (14 nhân vật tạo mới trong `content/library/characters/`)
1. `de_prussia_infantry_1871` (`s001`, `s002`, `s003`)
2. `de_schutztruppe_soldier_1896` (`s004`)
3. `de_askari_infantry_1914` (`s005`)
4. `de_heer_ersatz_1915` (`s006`)
5. `de_heer_infantry_1916` (`s001`, `s007`)
6. `de_reichswehr_infantry_1921` (`s008`)
7. `de_reichswehr_transition_1934` (`s009`)
8. `de_wehrmacht_infantry_1936` (`s010`)
9. `de_wehrmacht_infantry_1944` (`s010`, `s011`)
10. `de_bundeswehr_soldier_1956` (`s012`)
11. `de_nva_soldier_1956` (`s012`)
12. `de_bundeswehr_flecktarn_1991` (`s013`)
13. `de_bundeswehr_tropentarn_2002` (`s013`)
14. `de_bundeswehr_kbssk_2026` (`s014`)

## Giấy phép nhạc/SFX/tư liệu
- Chi tiết giấy phép ảnh tham khảo nằm ở `research/images/metadata.csv` (lưu ý `ch01`, `ch02_bundesarchiv`, `ch03`, `ch07` mang giấy phép CC BY-SA; hình trong video được vẽ mới hoàn toàn bằng Nano Banana theo style `comic-cel-painterly`).

## Bài học
(điền ở bước 9)

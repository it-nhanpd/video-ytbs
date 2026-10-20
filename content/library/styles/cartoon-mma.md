# Style bible: nhân vật hoạt hình 2D MMA (cartoon-mma)

Trạng thái: **ĐỀ XUẤT, người dùng đã chọn hướng "cartoon dày nét, đầu to" (2026-10-17), chờ duyệt pilot**. Thay thế bản người que (`stickman-mma`). Chỉ áp cho dự án `2026-mma-stickman` (tên thư mục giữ nguyên); không thay `uniform-showcase.md`/`comic-cel-painterly.md`. Soạn không qua video tham chiếu. Ảnh tham chiếu: lấy từ still pilot (`styles/refs/`) sau khi duyệt.

## Nhân vật (vẽ bằng code trên bộ xương pose, không ảnh AI)
- Tỉ lệ: đầu bán kính **1.5R** (đầu to ≈ 1/3 chiều cao); thân 3R, chân 2×2.6R, tay 2×2R, R = 44px ở khung 1080p.
- Nét mực `toon.ink` bao mọi hình, độ dày viền ≈ 0.12R mỗi bên. Tô phẳng, không gradient, không bóng trên cơ thể. Duy nhất một bóng: elip đổ dưới sàn.
- Thân trần dạng chữ V (vai 1.55R, eo 0.8R), quần đấu cùng màu góc đài, găng tròn cỡ 0.85R cùng màu, giày tối có đế elip.
- Mặt (hệ cục bộ, nhìn về phía đối thủ): mắt trắng + đồng tử, lông mày chéo, mũi nhô, tai, miệng. **Biểu cảm theo đòn** (`expr` trong move): `neutral` (miệng gạch, mày nhíu), `shout` (miệng mở khi ra đòn), `hurt` (mắt `>`/`<`, miệng lượn sóng khi bị đánh), `ko` (mắt X, lưỡi thè).
- Hai nhân vật chính là lính Đức hai thời kỳ (`theme.ts › cast`), tay không (nắm đấm màu da, không găng):
  - Thép (`ho`, trái) = `heer1916`: mũ M1916 xanh olive đậm có chốt thông gió, áo xanh xám ngả lục, thắt lưng đen, hộp mặt nạ phòng độc ở hông, ủng.
  - Gai (`rua`, phải) = `prussia1871`: mũ Pickelhaube đen, mũi và đĩa đồng, áo xanh Phổ, cổ đỏ, thắt lưng trắng, quần tối, ủng cao.
  - Màu lấy từ thẻ library `de-heer-infantry-1916` và `de-prussia-infantry-1871` (bộ `wehrmacht1936` có sẵn trong `theme.ts` nhưng không dùng). Hồi pilot đầu còn bộ võ sĩ `red`/`blue`/`ref` (quần đấu + găng), giữ lại để dùng cho trọng tài.
- **Không phù hiệu**: không hình chữ thập ngoặc, ký hiệu SS, đại bàng quốc huy, cờ hay ký hiệu chính trị nào, trên quân phục và nền (xem bible trận đấu và `style-lock.md`).
- Màu chỉ lấy từ `cast`/`toon`/`arena` trong `theme.ts`.

## Nền, camera, hiệu ứng
Giữ như bản trước: nền đài khối phẳng ≤3 lớp (`Arena`), camera ngang, zoom khi trúng đòn; hiệu ứng impact star, freeze 2–3 frame, shake, speed lines, flash, slow-mo, fade (xem `FighterLayer.tsx`). Sao va chạm màu vàng nhạt `toon.impact`.

## Danh sách cấm (đo được)
1. Không máu, không vết thương trực diện.
2. Không ảnh AI/ảnh chụp cho nhân vật; không hardcode màu ngoài `theme.ts`.
3. Không thêm phụ kiện ngoài bộ đồ trong thẻ library tương ứng; đổi trang phục phải qua duyệt và đối chiếu thẻ library.
4. Không đánh người đã ngã/KO sau khi trọng tài can thiệp; không đòn vào đầu người nằm.
5. Không tên/nhận diện người thật, giải đấu/logo thật.
6. Không lật ngang hình; đổi hướng bằng `facing` trong code (mặt vẽ theo `facing`, không có chữ/phù hiệu bất đối xứng).
7. Không chữ cứng trong `scenes.json`; chỉ key i18n.
8. Không quá 2 hiệu ứng trúng đòn cùng lúc trên đòn thường (đòn KO tối đa 4).

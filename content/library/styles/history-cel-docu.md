# Style: history-cel-docu (phim tài liệu lịch sử hoạt hình cel + bản đồ giấy)

Ghi ngày 2026-10-17 bằng skill `style-capture` từ video tham chiếu **"Mỹ Lai Massacre" — The Armchair Historian** (YouTube `o9sr8sviSIs`, đăng 2026-09-20, 11:34). Khung trích: `refs/ref-video/my-lai/` (gitignore, không đưa lên kho). **Chỉ học ngữ pháp hình** (loại cảnh, nhịp, cách dựng bản đồ); không chép nhân vật, bố cục cụ thể, lời dẫn, nhạc, phòng của người dẫn hay nhận diện kênh.

Số liệu đo bằng ffmpeg/khung trích; chỗ nhìn bằng mắt ghi *(ước lượng)*. Không có phụ đề tải được nên **không phân tích lời dẫn**.

## 1. Cấu trúc tổng (đo)
| Đoạn | Thời gian | Nội dung |
|---|---|---|
| Mở | 0:00–0:45 | người dẫn ngồi trong phòng đọc (host on-camera) |
| Bối cảnh | 0:45–1:50 | bản đồ khu vực → sơ đồ đơn vị → cảnh hoạt hình bối cảnh chiến tranh |
| Diễn biến | 1:50–8:40 | xen kẽ bản đồ tác chiến chi tiết, cảnh hoạt hình, người dẫn |
| Hậu quả | 8:40–10:20 | chân dung các nhân vật điều tra, phong cảnh tĩnh, đài tưởng niệm, người dẫn kết |
| Quảng cáo | 10:20–11:34 | quảng cáo game của kênh (bỏ qua) |

- Người dẫn on-camera chiếm khoảng 30–35% thời lượng nội dung *(ước lượng, theo khung 10 s)*. **Ta không có người dẫn → thay bằng lời dẫn đè lên hình** (bản đồ/hoạt hình), không dựng phòng người dẫn.
- Khung hình **2.35:1** (1920×822, có viền đen trên dưới khi xem 16:9).

## 2. Nhịp (đo)
- 46 cắt cứng (`select='gt(scene,0.35)'`) trên ~10:20 nội dung → trung bình ~13 s/cắt. Nhiều chuyển cảnh là **hòa tan/pan trong cùng shot** nên số shot thật cao hơn; mỗi ý hình kéo 5–15 s *(ước lượng)*.
- Cụm cắt nhanh (0,3–3 s) ở đoạn cao trào 6:53–7:30 và 10:36–11:07.
- Nhịp chậm, nghiêm, không hiệu ứng lòe loẹt.

## 3. Các loại cảnh (ngữ pháp hình)
1. **Bản đồ giấy cổ** (loại chủ lực): nền giấy ngà, đất màu be/kem, biển xanh xám nhạt có đường bờ kép, sông vẽ tay; nhãn chữ in hoa serif đậm; quốc gia đang nói tô đỏ đặc. Camera **zoom/pan dần** từ khu vực → tỉnh → làng.
2. **Khung phóng to (inset callout)**: chấm đỏ trên bản đồ lớn + khung chữ nhật viền đen dày nối bằng hình nêm, bên trong là bản đồ chi tiết; nhãn địa danh **hiện từng cái** trong ô chữ nhật nền trắng viền đen (đo ở 3:00–3:03: 1 nhãn mỗi ~0,5–1 s).
3. **Sơ đồ đơn vị**: phù hiệu (huy hiệu) + băng nhãn trắng viền đen xếp bậc thang (sư đoàn → lữ đoàn → trung đoàn → tiểu đoàn → đại đội), cụm lính đứng nhóm ở góc. Các tầng hiện lần lượt.
4. **Quân cờ trên bản đồ**: tượng lính đồ chơi / thẻ hình tròn chân đế màu đặt lên bản đồ, trượt theo hướng tiến quân.
5. **Cảnh "trình chiếu"**: người vẽ đứng quay lưng, cầm que chỉ vào bản đồ chiếu trên màn sáng trong phòng tối; camera đẩy vào màn chiếu, bản đồ thành full khung (3:04–3:14).
6. **Cảnh hoạt hình cel**: viền mực đen, tô phẳng 2 tông, nền vẽ tay (rừng, ruộng lúa, làng, trực thăng). Chuyển động hạn chế: pan nền, trực thăng trôi, nhân vật cử động ít *(ước lượng)*.
7. **Khung truyện tranh chia đôi**: đường chéo trắng chia 2 panel, bong bóng thoại.
8. **Thẻ chân dung**: 2–3 chân dung vẽ đơn sắc trong khung viền, đặt trên nền màu (giới thiệu nhân vật điều tra/chỉ huy).
9. **Bóng/silhouette**: nhóm người tối màu trên nền mờ khi nói về chỉ huy hay mưu đồ.
10. **Phong cảnh tĩnh trầm**: hoàng hôn khói, cánh đồng sau sự kiện; dùng làm khoảng lặng.
11. **Thẻ chữ đen**: chữ trắng in hoa nhỏ giữa màn đen cho ý tổng kết.

## 4. Màu (ước lượng từ khung)
- Bản đồ: giấy ngà ~`#e9e1cc`, đất be ~`#d8c48f`, biển xám xanh ~`#c9d3d0`, nhấn đỏ ~`#d43a2c`.
- Hoạt hình: xanh rêu quân phục, vàng cam hoàng hôn, nâu khói; cảnh đêm/lửa đỏ cam trên nền gần đen.

## 5. Chữ
- Nhãn bản đồ: serif in hoa đậm có dấu tiếng Việt (vd. "SƠN MỸ"), ô nhãn trắng viền đen.
- Thẻ chữ: sans in hoa nhỏ, căn giữa.

## 6. Không sao chép
- Người dẫn, phòng đọc (lò sưởi, quả địa cầu…), logo, phần quảng cáo game.
- Thiết kế nhân vật, bố cục từng khung, câu chữ lời dẫn, nhạc.
- **Không dùng hình máu/xác người** dù tham chiếu có (vũng máu + vỏ đạn 4:10–4:20, bắn dân thường 3:40). Ta diễn tả bằng ẩn dụ: làng bốc khói, bóng, khoảng lặng, tài liệu.

## 7. Áp vào dự án của ta
- Hình nhân vật: style block `comic-cel-painterly.md` (đã có, cùng họ "2D animated documentary, ink outlines, flat cel").
- Bản đồ, nhãn, sơ đồ đơn vị, quân cờ, thẻ chữ: vẽ bằng code (Remotion), dữ liệu bản đồ Natural Earth.
- Khung 16:9 1920×1080 (có thể thêm viền đen 2.35:1 như tùy chọn).

## 8. Dựng lại cảnh (quyết định 2026-10-18, dự án Mỹ Lai)
- **Cảnh dựng lại là chính**, đồ họa số liệu/tài liệu là phụ (chữ đè góc, băng nguồn). Mục tiêu tỉ lệ: ≥ 2/3 số shot là cảnh có nhân vật.
- **Cấu trúc shot 2.5D:** nền painterly không viền (block nền) + nhân vật cel viền mực tách nền (block nhân vật) đặt thành 2–4 lớp; camera đẩy/pan/parallax; khói, lửa, bụi, ánh đèn bằng code. Không image-to-video.
- **Người thật:** nhân vật cel cách điệu theo thẻ nhân vật cố định (`content/library/characters/us-army-*-1968/`), không chép ảnh chân dung thật, không cố giống mặt thật; nhãn "Minh họa". Dùng ảnh thẻ nhân vật làm `--ref` khi tạo pose mới để giữ đồng nhất.
- **Bạo lực:** theo mức video tham chiếu (cel cách điệu: nổ súng, máu, vũng máu + vỏ đạn); **không** vẽ trẻ em bị giết/thi thể trẻ em, **không** bạo lực tình dục.
- Khung chia đôi kiểu truyện tranh, bong bóng thoại chỉ cho lời có nguồn (lời khai/văn bản), dịch tiếng Việt.

## Phát hiện của người dùng
- 2026-10-18: "video của tôi ưu tiên dựng lại cảnh để thu hút người xem. I don't like video chỉ đưa ra số liệu, tối đa cảnh".

## Duyệt
- 2026-10-17: người dùng duyệt style doc ("good! pls continue"). Dùng cho `2026-truecrime-my-lai`.

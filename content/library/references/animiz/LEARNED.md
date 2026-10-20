# Animiz: cách họ tạo chuyển động (rút từ transcript, chỉ ghi điều video nói)

Nguồn: 10 transcript `NN-<id>.md` cùng thư mục (phụ đề tự động, tải bằng yt-dlp) + video #1. Video chỉ có lời giảng; hình ảnh thao tác không có trong transcript.

## Mô hình chuyển động của Animiz
1. **Nhân vật dựng sẵn + Motion có sẵn.** Chọn nhân vật trong thư viện → chọn "Motion" (Walking, Running, ...) → nhân vật **đi tại chỗ** (#5, #45).
2. **Move = đường đi tách riêng khỏi bước chân.** Thêm hiệu ứng Move vào cùng nhân vật, kéo điểm đầu/điểm cuối. Hai thanh (Walking và Move) **phải dài bằng nhau**, nếu không chuyển động lệch (#45, #5).
3. **Tốc độ = độ dài thanh.** Thanh ~1–2 s thì nhân vật "bắn vèo như máy bay"; từ ~5–6 s trở lên mới đi chậm tự nhiên (#45, #5, #33).
4. **Đổi hướng = Flip Horizontally**, không có ảnh nhân vật quay hướng khác (#8, #45). Cô gái đi từ phải sang trái mặc định; chàng trai được lật để quay lại.
5. **Biểu cảm/nói = lớp hiệu ứng có sẵn** (Blink, Smile, nói + âm thanh). Người nói thì người kia "lắng nghe" bằng Blink (#45).
6. **Chỉnh kích cỡ ngay khi chèn nhân vật**, nếu không đoạn sau to/nhỏ không đều (#45). Khóa lớp nền để khỏi kéo nhầm.
7. **Xe cộ**: ảnh xe đã tách nền (PNG) + Move; bánh xe không quay riêng trong video #17 (chỉ đường đi + nền).

## Nhân vật ngoài (#53, quan trọng nhất)
- Ảnh PNG liền khối: chỉ có **Move/Shake/Slide**, không tự có bước đi.
- **GIF động tách nền** (remove.bg-kiểu) chèn vào, rồi thêm Move. Ví dụ: "cây biết nói" = PNG cây + GIF mắt + GIF miệng chồng lên.
- Muốn nhân vật ngoài có bộ phận chuyển động thật: họ dẫn sang **Adobe Animate** (file .ai/SVG, **group/tách rời các bộ phận**, thêm chuyển động) hoặc Moho, Blender, "crazy" (CrazyTalk). Tác giả nói các phần mềm này **mất thời gian, cần cấu hình cao**, còn Animiz/Animate "chỉ ở mức cơ bản".
- Phiên bản Mango Animate có Motion cho ảnh ngoài nhưng **trả phí** (tác giả nêu 139 đô cho doanh nghiệp).

## Hệ quả cho dự án (khớp với hướng rig trong code)
- Animiz **không** cho thấy cách rig nhân vật tự vẽ; nó dùng thư viện sẵn, tương tự sprite-sheet. Cách làm bộ phận có trục mà tác giả nhắc đến là Adobe Animate: **tách bộ phận + đặt trục + thêm chuyển động**.
- Mô hình "đi tại chỗ + đường đi riêng + thời lượng quyết định tốc độ" **trùng** với cách hệ thống của ta (`walkSpeed`, nền trượt).
- Bài học dùng được: khóa kích cỡ nhân vật từ đầu (#45), tốc độ bước phải khớp tốc độ nền, đổi hướng nên có sẵn ảnh hướng đúng (chính họ dùng Flip nên bị lật phù hiệu, bài học của ta là tránh).
- Chưa biết (transcript không nói): cách thư viện Animiz tạo Walking (sprite hay rig).

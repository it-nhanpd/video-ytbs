# uh1-huey — Bell UH-1D "Huey", quân đội Mỹ, thập niên 1960

## Prompt block (dán nguyên văn)
```
Bell UH-1D Iroquois "Huey" military helicopter, strict side profile view facing LEFT, olive drab paint,
open sliding cargo door showing three soldiers in M1 helmets standing inside, pilot visible in cockpit,
"UNITED STATES ARMY" in small black capital letters on the tail boom, skids, red anti-collision light on tail fin,
NO main rotor blades and NO tail rotor blades (mast stub and hub only, blades are added later in animation),
full helicopter fits inside the frame, wide landscape composition,
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
helicopter centered with at least 12% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the helicopter uses the same neutral gray as the background: the cabin interior behind the soldiers and the
view through the open door must be deep shadow (dark olive/black), not gray
```
Sau đó dán style block: `library/styles/comic-cel-painterly.md` (khối nhân vật/phương tiện).

## Ảnh tham chiếu cần đính kèm khi tạo
- Ảnh Huey tham chiếu thật (side view UH-1D) để giữ tỉ lệ thân, mũi, đuôi.
- Frame Huey hoàng hôn của video gốc (chỉ tham khảo bố cục/màu, **không** copy nguyên).

## Bất biến (không được đổi)
- Nhìn ngang đúng 90°, đầu hướng trái (engine có `flipX` nếu cần đảo).
- Không có cánh quạt (engine vẽ bằng code, ra motion blur đúng tốc độ).
- Mũi tròn có kính chắn gió lớn, cửa trượt mở, ống xả bướu động cơ phía trên, thanh trượt (skid).

## Lỗi AI hay gặp
- Vẽ luôn cánh quạt → loại, tạo lại hoặc xóa trong Photopea.
- Nhầm sang AH-1 Cobra (thân hẹp) hoặc CH-47 (hai rotor).
- Chữ "UNITED STATES ARMY" sai chính tả. Nếu sai, xóa chữ và để engine/Photopea thêm sau.
- Nền không phẳng hoặc có bóng đổ → `ingest` sẽ cắt nền bằng màu góc ảnh, bóng đổ làm viền bẩn.
- **Watermark hình sao ở góc dưới phải** (Nano Banana/Gemini): crop bỏ trong manifest, nên chủ thể không được lấn vào góc đó.
- **Nội thất khoang/cửa mở màu xám trùng nền** → bị xóa thành lỗ, nhìn xuyên thấy trời. Prompt đã yêu cầu nội thất tối; nếu ảnh vẫn ra xám thì chấp nhận (nhìn xuyên thấy trời cũng hợp lý) hoặc tạo lại.

## Hiệu chỉnh đã dùng (ảnh `huey_side.jpg` 1376×768, đã duyệt trong test-huey)
`crop {left:100, top:130, width:1276, height:500}` · `anchors mainHub [556,190], tailHub [1289,262]` · `fit 2000×800`.
Ảnh mới có bố cục khác thì **phải đo lại** các giá trị này (xem skill prompt-pack, mục "Hiệu chỉnh manifest").

## Điểm gắn cánh quạt sau ingest (tỉ lệ theo ảnh 2000×800 cuối, ingest tự ghi vào scenes.json)
- Trục rotor chính: x≈0.338, y≈0.077 · bán kính ≈0.55 chiều rộng chủ thể
- Rotor đuôi: x≈0.980, y≈0.235 · bán kính ≈0.085

## Đã dùng
- test-huey / s001

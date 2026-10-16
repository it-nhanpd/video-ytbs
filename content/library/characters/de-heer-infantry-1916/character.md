# de-heer-infantry-1916 — Bộ binh Đức 1916 (Stahlhelm M1916 & Mặt nạ phòng độc)

## Prompt block (dán nguyên văn)
```
German World War I infantryman in 1916, full-body strict 90-degree side profile view facing LEFT, standard adult male base body proportion,
wearing the deep-skirted Model 1916 steel helmet (Stahlhelm M1916) painted dark olive-green with the prominent cylindrical side ventilation lug ("horn") clearly visible and leather chinstrap,
wearing the greenish field-grey (Feldgrau) wool M1915 Bluse tunic with concealed buttons, blackened leather belt with three cartridge pouches, and a corrugated cylindrical metal gas-mask canister (Bereitschaftsbüchse) slung on a strap across the chest/hip,
greenish-grey wool trousers with ankle puttees and blackened leather ankle boots, canvas haversack and entrenching tool on belt, unarmed,
all field-grey and helmet tones rendered in dark olive-green (#4a5746 and #394336) with zero neutral gray (#808080),
wide landscape composition (5:2 aspect ratio) with full figure inside frame,
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
subject centered with at least 12% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the subject uses the same neutral gray as the background (interiors and openings must be deep shadow or a clearly different color)
```
Sau đó dán style block: `library/styles/comic-cel-painterly.md` (khối nhân vật/phương tiện).

## Ảnh tham chiếu cần đính kèm khi tạo
- `content/projects/2026-german-army-uniforms/research/images/ch03_stahlhelm_m1916_gm018374.jpg` (hiện vật Stahlhelm M1916 bảo tàng Glomdalsmuseet GM.018374 `[F62, F63]`).
- Hồ sơ DHM U 88/27 (Stahlhelm M1916, `S63`) và Gasmaske 16/17 (`S66, S72`, `[F68]`).

## Bất biến (không được đổi)
- Nhìn ngang đúng 90° hướng TRÁI, cùng tỉ lệ thân hình chuẩn với người lính 1871 để đặt cạnh nhau ở cảnh `s001`.
- Mũ thép *Stahlhelm* M1916 có vành che gáy sâu và chốt thông gió hình trụ nhô ra bên hông mũ `[F63]`.
- Đeo hộp trụ đựng mặt nạ phòng độc (`[F68]`), áo *Bluse* M1915 xanh xám ngả lục đậm (không trùng màu xám nền `#808080`).

## Lỗi AI hay gặp
- Vẽ nhầm mũ M35 của Thế chiến II (vành ngắn, không có chốt thông gió nhô ra).
- Mũ thép hoặc hộp mặt nạ phòng độc tô màu xám trung tính `#808080` trùng màu nền.
- **Watermark hình sao ở góc dưới phải** (Nano Banana/Gemini): crop bỏ trong manifest, nên chủ thể không được lấn vào góc đó.

## Đã dùng
- german-army-uniforms/s001
- german-army-uniforms/s007

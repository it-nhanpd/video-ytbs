# de-wehrmacht-infantry-1936 — Bộ binh Heer đầu chiến tranh (Mẫu 1936, cổ xanh sẫm, ủng cao)

## Prompt block (dán nguyên văn)
```
German Heer infantryman of 1936-1939 in pre-war regulation field uniform, full-body strict 90-degree side profile view facing LEFT, standard adult male base body proportion,
wearing a dark olive-slate Model 1935 steel helmet (Stahlhelm M35) with rolled edge,
wearing the tailored 1936 pattern field tunic (Feldbluse) in rich greenish field-grey wool with a contrasting dark bottle-green collar and shoulder straps, four patch pockets with vertical box pleats and scalloped flaps, small simplified geometric wing silhouette above right pocket,
slate-olive wool trousers tucked into tall calf-high black leather marching jackboots (Marschstiefel), black leather belt with Y-straps and breadbag, unarmed,
no part of the uniform uses neutral gray #808080 (trousers and tunic use deep olive-green and dark slate-olive tones),
wide landscape composition (5:2 aspect ratio) with full figure inside frame,
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
subject centered with at least 12% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the subject uses the same neutral gray as the background (interiors and openings must be deep shadow or a clearly different color)
```
Sau đó dán style block: `library/styles/comic-cel-painterly.md` (khối nhân vật/phương tiện).

## Ảnh tham chiếu cần đính kèm khi tạo
- Sổ tay tình báo Bộ Chiến tranh Mỹ *TM-E 30-451* (1943 & 1945, `S500, S501`, `[F503, F511, F512]`) và hồ sơ hiện vật DHM (`S518, S521`).

## Bất biến (không được đổi)
- Nhìn ngang đúng 90° hướng TRÁI, cùng tỉ lệ thân hình chuẩn để đặt so sánh cạnh nhau với mẫu 1944 ở cảnh `s010`.
- Áo mẫu 1936 có **cổ áo và cầu vai màu xanh lục sẫm (bottle-green)**, 4 túi có nếp gấp dọc và nắp túi lượn sóng `[F503]`.
- Đi **ủng da cao cổ (Marschstiefel)** đen bóng `[F511]`, đội mũ sắt M35 có mép gập `[F512]`.
- Không vẽ chữ thập ngoặc (`[F544]`).

## Lỗi AI hay gặp
- Quần xám đá bị tô đúng mã `#808080` của nền → phải dùng màu xanh xám sẫm (dark slate-olive `#444d41`).
- Quên vẽ cổ áo màu xanh lục sẫm hoặc vẽ giày thấp cổ thay vì ủng cao cổ.
- **Watermark hình sao ở góc dưới phải** (Nano Banana/Gemini): crop bỏ trong manifest, nên chủ thể không được lấn vào góc đó.

## Đã dùng
- german-army-uniforms/s010

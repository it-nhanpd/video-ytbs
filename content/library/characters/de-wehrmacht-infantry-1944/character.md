# de-wehrmacht-infantry-1944 — Bộ binh Heer cuối chiến tranh (Áo ngắn M44 vải tái chế, M42, giày thấp + ghệt)

## Prompt block (dán nguyên văn)
```
Late-war German Heer infantryman in late 1944, full-body strict 90-degree side profile view facing LEFT, standard adult male base body proportion,
wearing the simplified Model 1942 steel helmet (Stahlhelm M42) with raw unrolled flared rim edge and NO decals or insignia on the helmet,
wearing the austere waist-length late-1944 pattern field jacket (Model 1944 tunic) made of coarse brownish-olive recycled wool-rayon blend, with only two straight-flap breast pockets without pleats, collar in the same brownish-olive cloth as the jacket,
matching loose brownish-olive trousers gathered at the ankles with canvas gaiters (Gamaschen) over brown/black low ankle boots (Schnürschuhe) instead of tall jackboots, simple web belt and breadbag, unarmed,
all fabrics rendered in earthy olive-drab and brownish-ochre tones with zero neutral gray (#808080),
wide landscape composition (5:2 aspect ratio) with full figure inside frame,
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
subject centered with at least 12% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the subject uses the same neutral gray as the background (interiors and openings must be deep shadow or a clearly different color)
```
Sau đó dán style block: `library/styles/comic-cel-painterly.md` (khối nhân vật/phương tiện).

## Ảnh tham chiếu cần đính kèm khi tạo
- Sổ tay tình báo Mỹ *TM-E 30-451* (bản 1945, `S501`, `[F504, F506, F507, F511, F515, F516]`) và hồ sơ hiện vật M42 bảo tàng Karlshorst (`S514`).

## Bất biến (không được đổi)
- Nhìn ngang đúng 90° hướng TRÁI, cùng tỉ lệ thân hình chuẩn với mẫu 1936 để đặt cạnh nhau trong cảnh `s010`.
- Áo mẫu 1944 **cắt ngắn ngang thắt lưng**, chỉ có 2 túi ngực **nắp thẳng không có nếp gấp**, cổ áo cùng màu vải nâu-ôliu thô của thân áo `[F504, F506, F507]`.
- Đi **giày thấp cổ kèm ghệt vải (Gamaschen)** thay vì ủng cao cổ `[F511]`.
- Mũ sắt M42 mép loe không gập viền, **không còn huy hiệu** bên sườn mũ `[F515, F516]`.

## Lỗi AI hay gặp
- Vẽ áo dài trùm hông 4 túi như mẫu 1936 hoặc vẫn vẽ ủng da cao cổ.
- Vẽ huy hiệu cờ/đại bàng trên mũ sắt (đến 1944–45 đã bỏ theo `[F516]`).
- **Watermark hình sao ở góc dưới phải** (Nano Banana/Gemini): crop bỏ trong manifest, nên chủ thể không được lấn vào góc đó.

## Đã dùng
- german-army-uniforms/s010
- german-army-uniforms/s011

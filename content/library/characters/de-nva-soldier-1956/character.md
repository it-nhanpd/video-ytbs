# de-nva-soldier-1956 — Lính NVA Đông Đức 1956 (Mũ M56 vát nghiêng & Quân phục xám đá)

## Prompt block (dán nguyên văn)
```
East German National People's Army (NVA) infantry soldier in 1956-1957, full-body strict 90-degree side profile view facing LEFT, standard adult male base body proportion,
wearing the distinctive East German Model 1956 steel helmet (Stahlhelm M56) with its wide, steeply sloped conical flaring sides and smooth dome in dark stone-olive paint,
wearing the 1956 NVA stone-olive-grey (steingrau) wool tunic cut in traditional German four-pocket style with a dark collar, silver-grey collar tabs, and buttoned patch pockets,
matching stone-olive breeches tucked into black calf-high leather marching boots (Halbschaftstiefel), brown/black leather belt, unarmed,
important: render the "steingrau" fabric in a distinct warm olive-taupe/khaki-grey shade (#585a4a) so that no part of the uniform matches the neutral #808080 background,
wide landscape composition (5:2 aspect ratio) with full figure inside frame,
solid flat uniform neutral gray background (#808080), perfectly even with no gradient, no vignette, no texture, no noise,
subject centered with at least 12% empty margin on every side and the bottom-right corner completely empty,
no ground, no shadow, no reflection, no other objects, single subject only,
no part of the subject uses the same neutral gray as the background (interiors and openings must be deep shadow or a clearly different color)
```
Sau đó dán style block: `library/styles/comic-cel-painterly.md` (khối nhân vật/phương tiện).

## Ảnh tham chiếu cần đính kèm khi tạo
- Hồ sơ hiện vật mũ M56 tại Museum in der „Runden Ecke" Leipzig (`S624`) và Deutsches Panzermuseum (`S623`, `[F628, F629]`).
- Nghiên cứu của Wenzke trên bpb (`S621`) và chú thích Stasi-Unterlagen-Archiv (`S620`, `[F624]`).

## Bất biến (không được đổi)
- Nhìn ngang đúng 90° hướng TRÁI, cùng tỉ lệ thân hình chuẩn với lính Bundeswehr 1956.
- Mũ thép **M56 có vành vát nghiêng rộng hình nón** đặc trưng của Đông Đức `[F628]`.
- Áo quân phục 4 túi đắp kèm cổ sẫm và ủng da nửa bắp chân gợi liên tưởng tới đường cắt truyền thống Đức `[F624]`, nhưng tô bằng tông **xám-ôliu ấm (`#585a4a`)** để tách nền sạch khỏi `#808080`.

## Lỗi AI hay gặp
- Tô màu xám đá (steingrau) trùng với màu xám trung tính `#808080` của nền làm thủng thân áo khi chạy `ingest`.
- Vẽ mũ SSh-40 của Liên Xô hoặc mũ M35 Wehrmacht thay vì mũ M56 vành vát nghiêng rộng.
- **Watermark hình sao ở góc dưới phải** (Nano Banana/Gemini): crop bỏ trong manifest, nên chủ thể không được lấn vào góc đó.

## Đã dùng
- german-army-uniforms/s012

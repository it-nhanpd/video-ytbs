# Nguồn hình (kiểm 2026-10-18)

Metadata đầy đủ (URL trang, license, tác giả, mô tả) lấy từ Commons API: `qa/commons-meta.json` (khóa cc01–cc18 = thứ tự tải). Ảnh CC BY-SA đã chỉnh (cắt, phủ màu, xé viền) phát hành lại theo cùng giấy phép; ghi công trên hình (băng chú thích) và trong mô tả video.

## Ảnh Commons đang dùng (`assets/cc/`)
| File | Gốc (Commons) | License | Tác giả | Shot | Ghi chú |
|---|---|---|---|---|---|
| eching_church.jpg | Eching am Ammersee, die Kirche St. Peter und Paul.jpg | CC BY 4.0 | Dguendel | C104 | ảnh 2006 |
| schondorf_autumn.jpg | Unterschondorf (Schondorf am Ammersee) Ammersee 661.jpg | CC BY-SA 3.0 | GFreihalter | C108 | có một người rất nhỏ ở xa, không nhận diện được |
| ammersee_aerial.jpg | Aerial image of the Ammersee (view from the south).jpg | CC BY-SA 4.0 | Carsten Steger | C103 | |
| ammersee_iss.jpg | ISS075-E-10615 … (cropped).jpg | Public domain (NASA) | NASA JSC | (dự phòng) | |
| ammersee_mist.jpg | Morgenstimmung über dem Ammersee.jpg | CC BY-SA 4.0 | Rosa-Maria Rinkl | C813 | |
| map1899.jpg, map1899_lake.jpg (cắt) | Deutsche Reichskarte Lechrain Ammersee Pfaffenwinkel 1899 1901.jpg | Public domain | Reichsamt für Landesaufnahme | C106, C111, C117 | Lớp đánh dấu (lối Seeweg, điểm bắt cóc, hộp ~800 m tây bắc) là **minh họa theo mô tả bản án**, không phải đo đạc; ghi trên hình |
| forest_path.jpg, forest_fog.jpg | Fürther Stadtwald - 5.jpg (CC0, Triplec85); Winter, Nebelstimmung 12.jpg (CC BY-SA 4.0, Katrin Schubert) | | | (dự phòng) | không phải hiện trường |
| landsberg.jpg | Landsberg am Lech - Panorama (2012).jpg | CC BY-SA 4.0 | Guido Radig | (dự phòng) | |
| augsburg_court.jpg | Landgericht Augsburg 1.jpg | CC BY-SA 4.0 | Ricardalovesmonuments | C603 | trụ sở LG; chú thích không khẳng định phòng xử; mặt ngoài (§59 UrhG) |
| bgh.jpg | Karlsruhe BGH Palais 1.jpg | CC BY 3.0 | Andreas Praefcke | C620 | |
| grundig_tk145.jpg | Late 1960s Grundig TK 145 de luxe … .jpg | CC BY 4.0 | R. Henrik Nilsson | C503 | chú thích "không phải TK 248" |
| grundig_tk121.jpg | Grundig TK121-1172.jpg | CC BY-SA 4.0 | Raimond Spekking | H05, C506 | chú thích "không phải TK 248" |
| phone_fetap.jpg | Post FeTAp 611-2.jpg | CC BY-SA 4.0 | Felix Winkelnkemper | C113 | |

Đã tải nhưng **loại**: cc02 (nhà riêng ở Eching), cc03 (panorama quá dẹt), cc09 (có bia đá tưởng niệm, dễ bị hiểu nhầm là bia của nạn nhân), cc18 (người nhận diện được ở tiền cảnh).

## Trích bản án (`assets/court/`)
Cắt từ bản Ausfertigung đã ẩn danh của bản án LG Augsburg 25/3/2010 (8 Ks 200 Js 103990/07), PDF do radonmaster.de đăng; render bằng pypdfium2, tọa độ cắt trong `scratchpad/ursula/cropj.js`. Phán quyết của tòa là văn bản chính thức (amtliches Werk, §5 Abs. 1 UrhG), không được bảo hộ bản quyền.
- **Không cắt dòng có họ tên đầy đủ, ngày sinh, địa chỉ**: tr. 1 (j_cover) chỉ lấy phần đầu tới "erkennt in dem Strafverfahren gegen"; tr. 4 bỏ dòng "MAZUREK Werner, geb. am …"; tr. 34 bỏ địa chỉ phong bì; tr. 305 bỏ dòng có họ.
- Các ô bôi đen trong ảnh là của tòa (bản ẩn danh), không phải của kênh.

## Ảnh AI (G-Labs `nano_banana_2_lite`, 10 lần gọi, 2026-10-18)
`assets/ai/`: ai_lakepath, ai_bike, ai_search, ai_phonebooth, ai_cutletters, ai_clearing, ai_courtroom, ai_prisongate, ai_mailbox. Prompt: `prompts/g-labs.txt` (dán nguyên block style của `truecrime-collage`). Lần gọi thứ 8 (ai_archive) bị từ chối `PUBLIC_ERROR_UNSAFE_GENERATION`; không thử lại, không dùng.
Tự chấm (xem full-res): đạt cả 9; collage giấy, không chữ/logo đọc được, người chỉ là bóng không mặt, **không có trẻ em**. Trên hình gắn "Minh họa (AI)".

## Bản đồ, âm thanh
- `assets/demap.json`: Natural Earth 1:10m (public domain), sinh bằng `tools/geo-map-extract.mjs`; tọa độ làng là gần đúng.
- Giọng: Microsoft Edge TTS `vi-VN-NamMinhNeural`. **Cần kiểm điều khoản thương mại trước khi bật kiếm tiền.**
- Nhạc: `tools/music-synth.mjs` (tự tổng hợp), không có bản quyền bên thứ ba.
- Thư tống tiền trên hình là **phỏng dựng** (chữ cắt vẽ bằng code), nội dung chữ lấy nguyên văn bản án chép; không dùng ảnh thư gốc.

## Ảnh AI lô v2 (G-Labs `nano_banana_2_lite`, 2026-10-18; 8 lần pilot + 14 lần lô chương 2–8 = 22 lần, 22/22 thành công)
Prompt: `prompts/g-labs-v2.txt` (pilot), `prompts/g-labs-v3.txt` (lô). Đã chấm `style-guard` (không mặt người, không trẻ em, không chữ/logo, bóng người lớn không đặc điểm):
- Pilot: ai_raid2007, ai_house_dusk, ai_bellwire, ai_search_night, ai_desk, ai_board; fg_spruce.png, fg_ferns.png (nền xanh lá, tách bằng chroma key, `scratchpad/ursula/greenkey.mjs`).
- Lô: ai_livingroom, ai_workshop, ai_dnalab, ai_soundlab, ai_fleamarket, ai_scanner, ai_binoculars, ai_studio, ai_prisonletter, ai_kappeln, ai_corridor, ai_kitchen, ai_lakedawn, ai_archive2.
- Mọi ảnh AI hiện nhãn "Minh họa (AI)" trên màn hình; chi tiết gợi hình (căn phòng, xưởng, buồng điện thoại...) ghi ở cột Nguồn của `script/vi-v2.md`.
- Ảnh Commons dùng lại như bản trước (xem bảng trên); không thêm ảnh mới.

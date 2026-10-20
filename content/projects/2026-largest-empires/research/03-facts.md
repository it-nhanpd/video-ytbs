# Bảng sự kiện (dự án 2026-largest-empires)

> **2026-10-17:** các bảng dưới đây được lập trước khi có `.claude/rules/source-policy.md`; cột nguồn còn Wikipedia/WHE/blog. **Trạng thái hiệu lực là mục "Rà soát theo source-policy" ở cuối file.**

## Thang trạng thái
- **Đã kiểm chứng**: ≥2 nguồn độc lập loại A/B khớp nhau, **hoặc** khẳng định chỉ nói "văn bản/hồ sơ ghi gì" và đã đọc chính văn bản đó. Được dùng trong kịch bản.
- **Đạt một phần**: có ≥1 nguồn A/B đã đọc, kèm nguồn C/D đồng thuận. Chỉ dùng với **câu có giới hạn** ("theo …", "khoảng …").
- **Sơ bộ**: chỉ C/D, hoặc A/B chỉ thấy tóm tắt. **Không dùng.**
- **Tranh cãi**: nguồn mâu thuẫn. Chỉ dùng nếu kịch bản nói rõ có tranh cãi.
- **Chưa rõ**: chưa có nguồn. Không dùng.

Đơn vị: triệu km² (Mkm²). **Cột nguồn dùng 2 họ số liệu:** (a) họ Taagepera: S01 Wikipedia và S02 Turchin 2006, **cùng gốc, không độc lập với nhau**; (b) họ Cliopatria: S03/S04, vẽ lại từ bản đồ, độc lập về phương pháp. Taagepera 1997 (S07) **chưa đọc được**, nên chưa có nguồn gốc nào của họ (a) được đọc trực tiếp. Hệ quả: trong dự án này **chưa có con số nào đủ điều kiện "Đã kiểm chứng" về giá trị cụ thể**; chỉ có thể kiểm chứng **thứ tự** và **khoảng giá trị** ở nhóm đầu.

Cách đọc cột Cliopatria: số do **tôi tự tính từ tệp dữ liệu v0.1.3** (S04): giá trị `Area` lớn nhất của đối tượng, năm = khoảng lấy mẫu `FromYear–ToYear`. Khoảng lấy mẫu **không phải** năm đỉnh theo sử học.

## Phần A: cách tính (mâu thuẫn về định nghĩa)

| ID | Khẳng định | Nguồn | Trạng thái | Ghi chú |
|---|---|---|---|---|
| F01 | Định nghĩa của danh sách phổ biến: kích thước = đất khô **kiểm soát thực tế** tại thời điểm đó (không phải diện tích tuyên bố); "đế chế" = thực thể có chủ quyền tương đối lớn mà các thành phần không có chủ quyền (Taagepera). **Không có xếp hạng chính thức**; nơi có khoảng ước lượng thì xếp theo giá trị thấp | S01 (C) | **Đạt một phần** (chỉ là cách Wikipedia nói lại Taagepera; chưa đọc chính Taagepera) | Dùng được câu "theo danh sách …". Cần S07 để xác nhận định nghĩa gốc |
| F02 | Danh sách của Turchin–Adams–Hall (2006) **loại các đế chế hàng hải châu Âu** (Anh, Tây Ban Nha, Pháp…) vì không liền kề; Wikipedia (S01) và Cliopatria (S03) **có tính** thuộc địa. Vì vậy "xếp hạng 10 đế chế lớn nhất" cho kết quả khác nhau tùy việc có tính thuộc địa hay không | S02 (B, đọc toàn văn), S01 (C), S03 (B, một phần) | **Đã kiểm chứng** (chỉ khẳng định "S02 loại, S01/S03 có tính"; đã đọc cả ba) | Đây là mâu thuẫn lớn nhất, xem 04-open-questions |
| F03 | Cliopatria xây đa giác **composite** (vd. Anh) từ các thực thể thành viên; tổng composite sẽ đếm trùng; bài không nêu rõ có tính thuộc địa/chư hầu ra sao ngoài cơ chế đó. Đa giác nhà du mục thảo nguyên vẽ "thận trọng" | S03 (B, đọc một phần) | **Đạt một phần** | Số Cliopatria cho Anh/Pháp/Tây Ban Nha có thể gồm vùng bảo hộ/phụ thuộc rộng hơn "kiểm soát thực tế" của S01 (chưa chứng minh) |
| F04 | Sai số: các đế chế đổi diện tích khoảng ±50% tùy người đo (Manning, blog); Achaemenid 5,5 (Turchin) so với 6,9 Mkm² (tự cộng) | S05 (D) | **Sơ bộ** | Không dùng làm khẳng định; chỉ biện minh việc ghi "khoảng" và hai nguồn. Các chênh lệch trong 03 (vd. Qing 14,7 so với 12,5; Abbasid 11,1 so với 8,2) **có thật** giữa S01 và S04 độc lập với blog này |

## Phần B: top đề xuất và số liệu từng đế chế

Hạng theo S01 (diện tích lớn nhất, bỏ qua chênh khoảng); cột "Cliopatria" là số tự tính từ S04.

| ID | Đế chế (Việt / gốc) | Diện tích đỉnh: họ Taagepera (S01, S02) | Diện tích đỉnh: Cliopatria (S04; S03 nếu có) | Năm đỉnh | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|
| F05 | Đế quốc Anh / British Empire | S01: 35,5 (1920). S02: loại (hàng hải) | S04: 36,82 (1918); S03 Bảng 5: 36,77 (1920) | S01 1920; S04 1918–19 (36,82/36,77); S03 1920 | **Đạt một phần**: thứ hạng 1 và khoảng 35,5–36,8 Mkm². Hai họ khớp trong 4% nhưng họ (a) chưa đọc gốc | Là số lớn nhất ở mọi bảng có tính thuộc địa. Cliopatria composite có thể đếm cả vùng bảo hộ |
| F06 | Đế quốc Mông Cổ / Mongol Empire (Yeke Mongγol Ulus) | S01: 24,0 (1270 hoặc 1309). S02: 24,00 (1270, đọc rõ trong bảng 1 và nói "lớn nhất lịch sử về lãnh thổ liền kề") | S04: 27,43 (1279–84); S03 Bảng 5: 27,99 (1280); S03 Bảng 4: 24,76 (1250) | S01 "1270 hoặc 1309"; S02 1270; S04 1279–84 | **Đã kiểm chứng** cho "liền kề lớn nhất, hạng 2 sau Anh nếu tính thuộc địa, 24–28 Mkm²"; **Tranh cãi** cho số cụ thể và năm (1270/1279–1280/1309) | Khoảng chênh ~14% giữa họ (a) và Cliopatria. Cần quyết dùng "khoảng 24 triệu" hay khoảng 24–27 |
| F07 | Đế quốc Nga / Russian Empire (Rossiyskaya Imperiya) | S01: 22,8 (1895). S02: 22,80 (bảng 1, đọc rõ "22.8 Mm² in 1895" trong văn bản) | S04: 22,89 (1900–04); 22,85 (1864–67); 22,16 (1895–97) | S01/S02 1895; S04 1900–04 | **Đã kiểm chứng** cho "khoảng 22,8–22,9 Mkm², hạng 3" | Khớp tốt nhất giữa hai họ. Năm 1895 hay 1900: chênh vì Cliopatria lấy mẫu năm 1900–04 (có thể gồm vùng ảnh hưởng ở Mãn Châu: chưa kiểm). **Liên Xô** (S04: 24,60 ở 1946; S01 ghi chú 22,3 ở 1945) là nhà nước kế vị, không phải "đế chế" theo tên: xem F14 |
| F08 | Nhà Thanh (đế quốc Đại Thanh) / Qing dynasty | S01: 14,7 (1790). S02: 14,70 (năm bị lỗi trích) | S04: 12,51 (1794–1821, hằng số) | S01 1790; S04 1794–1821 | **Tranh cãi** (14,7 so với 12,5): chênh 17% | Nguyên nhân chênh chưa biết. Thứ hạng quanh 4–6 phụ thuộc cách chọn số |
| F09 | Đế quốc Tây Ban Nha / Spanish Empire (Monarquía Hispánica / Imperio español) | S01: 13,7 (1810). S02: loại (hàng hải) | S04: 11,35 (1809–10); 11,80 composite "(Spanish Empire)" (1806) | S01 1810; S04 1809–10 | **Tranh cãi** nhẹ (13,7 so với 11,35–11,8) | Năm 1810 khớp nhau; vùng chưa kiểm soát (nội địa châu Mỹ) là nguồn bất định (S01 nói chung, không riêng mục này) |
| F10 | Đế quốc thực dân Pháp thứ hai / Second French colonial empire | S01: 11,5 (1920). S02: loại | S04: 12,75 (1920–21) composite "(Second French Empire)" | 1920 | **Đạt một phần**: khoảng 11,5–12,75; năm 1920 khớp | S04 đặt tên composite "(Second French Empire)": chưa xác định có trùng khái niệm "Second French colonial empire" của S01 (không thấy định nghĩa đọc được) |
| F11 | Nhà Nguyên / Yuan dynasty (Đại Nguyên) | S01: 11,0 (1310). S02: không có (chỉ có Golden Horde 6,0, Chagatai 3,5, Il-Khan) | S04: 14,21 (1294–1362, một đa giác duy nhất; 12,16 ở 1363–74) | S01 1310; S04 1294–1362 | **Tranh cãi** (11,0 so với 14,2: chênh 29%); năm đỉnh không phân biệt được trong S04 | S01 và S04 **tách Nguyên khỏi Đế quốc Mông Cổ**; nếu gộp lại thì không còn hạng riêng |
| F12a | Caliphate Umayyad / Umayyad Caliphate | S01: 11,1 (720). S02: bảng "Caliphate 750" bị lệch cột; 11,10 có thể thuộc đây (**chưa chắc**) | S04: 9,88 (732–40); 9,84 (718–23) | S01 720; S04 718–40 | **Tranh cãi** (11,1 so với 9,9); năm đỉnh 720 nằm trong khoảng 718–740 của S04 | |
| F12b | Caliphate Abbasid / Abbasid Caliphate | S01: 11,1 (750). | S04: 8,16 (778–82); 7,55 ở 751–54 | S01 750; S04 778–82 | **Tranh cãi mạnh** (11,1 so với 8,2: chênh 36%; năm 750 vs ~780) | S04 cho 750 là 2,74 (năm khởi đầu); S01 có thể gộp lãnh thổ Umayyad trước đó; **chưa kiểm** |
| F13 | Hạng 10: các ứng viên | S01: Hoa Kỳ 9,5 (1900); Xiongnu 9,0 (176 TCN; S02 cũng 9,00); Đế quốc Brazil 8,337 (1889); Nhật 7,4–8,51 (1942); Đường 5,4 (715) | S04: Hoa Kỳ 12,19 (1945); Brazil 8,51 (1870–76); Đường 8,72 (661–65); Nhật 7,05 (1943); Xiongnu 5,61 (-144 đến -127) | — | **Tranh cãi**: hạng 10 phụ thuộc nguồn và cách tính | Chỉ **Brazil** nhất quán giữa hai họ (8,34 so với 8,51). Xiongnu và Đường đảo hạng giữa hai họ. Hoa Kỳ là nước cộng hòa: xem F14 |
| F14 | Nhà nước kế vị/cộng hòa cạnh tranh hạng: **Liên Xô** (S04: 24,60 ở 1946, vượt Đế quốc Nga; S01: không có hàng riêng, ghi chú 22,3 ở 1945) và **Hoa Kỳ** (S01: 9,5 ở 1900; S04: 12,19 ở 1945) | S01 (C), S04 (B) | **Tranh cãi** về việc có tính hay không | | Nếu tính Liên Xô, hạng 3 là Liên Xô (S04) và tất cả hạng sau lùi một bậc. Cần quyết (04-open-questions) |

### Mốc năm mở rộng gợi ý cho bản đồ (đều lấy từ S04, Cliopatria v0.1.3; đơn vị Mkm²; "mẫu" = khoảng lấy mẫu trong dữ liệu, **không phải** ngày sự kiện)
Các mốc này **chưa gắn sự kiện lịch sử** (không có nguồn sử học đã đọc cho từng mốc): khi viết cảnh cần tra riêng.

| Đế chế | Mốc (mẫu: diện tích) | Trạng thái |
|---|---|---|
| Anh | 1763–68: 2,41; 1815–19: 3,41; 1860: 10,57; 1900–04: 27,30; 1918: 36,82 (đỉnh S04) | **Đạt một phần** (chỉ S04 là B; S01 chỉ cho đỉnh 1920) |
| Mông Cổ | 1206–09: 2,46; 1220–26: 8,51; 1241–49: 20,93; 1260–71: 25,80; 1279–84: 27,43 | **Đạt một phần** (S04 + S02 về đỉnh ~24 ở 1270) |
| Nga | 1721–26: 14,38; 1799–1802: 16,72; 1864–67: 22,85; 1900–04: 22,89 | **Đạt một phần** |
| Thanh | 1645–47: 3,63; 1696–99: 8,47; 1757–61: 11,37; 1794–1821: 12,51 | **Đạt một phần** |
| Tây Ban Nha | 1540–46: 3,97; 1582–87: 5,70; 1778–79: 11,01; 1809–10: 11,35 (đỉnh); 1822–23: 1,98 (sau độc lập) | **Đạt một phần** |
| Pháp (thực dân thứ hai) | 1848–52: 0,63; 1885–89: 2,36; 1895–97: 4,96; 1905–07: 11,50; 1920–21: 12,75 | **Đạt một phần** |
| Nguyên | S04 chỉ có một đa giác 14,21 (1294–1362) rồi 12,16 (1363–74): **không có chuỗi mở rộng riêng**; mốc phải lấy từ Mông Cổ | **Chưa rõ** cho chuỗi mở rộng |
| Umayyad | 661–65: 0,92; 666–73: 6,93; 692–704: 8,61; 718–23: 9,84; 732–40: 9,88 | **Đạt một phần** |
| Abbasid | 750: 2,74; 751–54: 7,55; 778–82: 8,16 (đỉnh S04); 875: 5,12 (suy giảm) | **Đạt một phần** |

## Cập nhật khẳng định của người dùng cần kiểm chứng
- "10 đế chế có diện tích đỉnh cao lớn nhất (km²)": **không có danh sách duy nhất** được nguồn nào đã đọc xác nhận. Hạng 1–3 ổn định; hạng 4–9 là cùng một tập (Thanh, Tây Ban Nha, Nguyên, Pháp, Umayyad, Abbasid) nhưng **thứ tự thay đổi** giữa hai họ; hạng 10 **tranh cãi**.

## Dòng được dùng trong kịch bản (và giới hạn câu chữ)
- Dùng được: F02 (nói rõ cách tính thuộc địa), F06/F07 (chỉ nói thứ tự và "khoảng 22–28 triệu km²", không nêu một số chính xác).
- Dùng có giới hạn ("theo …, khoảng …"): F05, F10, mốc năm trong bảng trên.
- Không dùng nếu chưa nêu tranh cãi: F08, F09, F11, F12a/b, F13, F14.
- Không dùng: F04 (chỉ blog).

---

# Chương bổ sung (2026-10-17): Đế quốc Nga, sự kiện lịch sử gắn vào 4 mốc Cliopatria

Phạm vi: gắn **sự kiện** (có nguồn đã đọc) vào các mốc 1721–26, 1799–1802, 1864–67, 1900–04 và bối cảnh 1895. Nguồn mới: S15–S34 (xem 02-sources.md). Lưu ý chung: **không nguồn nào đã đọc nêu diện tích của riêng từng sự kiện bằng phương pháp Cliopatria**; các số km² trong F22–F25 là số của sử gia/bách khoa khác nhau, **không cộng được** với chuỗi Cliopatria (F29) và có chỗ mâu thuẫn nhau. Kiểm chứng chéo giữa nguồn chỉ có mức B (bách khoa chuyên ngành, tổng quan chính phủ Mỹ); chưa đọc được sách/bài chuyên khảo nào (Davies, Taagepera, Kotkin, Paine, Ghosh, Brower).

## Phần C: sự kiện từng mốc

| ID | Mốc | Khẳng định | Nguồn | Trạng thái | Ghi chú / giới hạn câu chữ |
|---|---|---|---|---|---|
| F20 | 1721–26 (Cliopatria 14,38) | Hiệp ước Nystad ký **30/8 (10/9 lịch mới) 1721**, chấm dứt Đại chiến Phương Bắc: Thụy Điển nhượng cho Nga Livonia, Estonia, Ingria và một phần Karelia (gồm quận Vyborg) cùng nhiều đảo vùng Baltic; Nga rút khỏi Phần Lan | S16 (B, đọc toàn mục), S17 (C, đọc toàn trang), S30 (C, một phần) | **Đạt một phần** (một nguồn B + C khớp; chưa có hiệp ước gốc) | Dùng: "Năm 1721, Hiệp ước Nystad cho Nga các tỉnh Baltic (Livonia, Estonia, Ingria…)". **Không** gắn con số km² cho riêng Nystad (không nguồn). Ngày dùng 1721 là đủ; nếu ghi ngày cụ thể nói rõ 30/8 theo lịch Julius |
| F21 | 1721 | Nga trả Thụy Điển **2 triệu thaler**; Pyotr I nhận danh hiệu Đại đế, Hoàng đế, Quốc phụ ở Sankt-Peterburg **tháng 10/1721** | S16 (B, đọc) | **Đạt một phần** (chỉ một nguồn B; S17 không nêu số tiền; S30 chỉ nói "Peter được tuyên bố là hoàng đế tháng 11" [nguyên văn tóm tắt: "that November"], **mâu thuẫn tháng 10/11 chưa giải**) | Dùng "năm 1721 Pyotr I nhận danh hiệu hoàng đế" không nêu tháng. Số tiền chỉ dùng kèm "theo Hughes" nếu cần |
| F22a | 1799–1802 (16,72) | Ba lần chia cắt Ba Lan–Litva: lần I thương lượng 1771–72, hiệp ước cắt nhượng ký 9/1773 (Nga lấy vùng dọc Dvina và Dnepr); lần II 1793 (Nga lấy phần còn lại của Litva, vùng đông Ba Lan "kéo xuống gần Biển Đen"); lần III 1795 xóa nhà nước Ba Lan–Litva khỏi bản đồ; Phổ, Áo cùng tham gia | S18 (B, đọc), S19 (B, đọc), S20 (C, một phần) | **Đạt một phần** (hai nguồn B khớp về trình tự; hai nguồn B là **tổng quan**, S19 không dẫn tư liệu) | Dùng: "Ba lần chia cắt Ba Lan (1772/73, 1793, 1795) đưa phần lớn đất Ba Lan–Litva về Nga, Phổ, Áo". Nói "xóa khỏi bản đồ năm 1795" được (S19) |
| F22b | — | Ngày chia cắt II: **4/1/1793** (S18) so với **23/1/1793** (S20; bài dẫn Britannica, tóm tắt tìm kiếm cũng ghi 23/1, **chưa đọc**); lần III: **3/1/1795** (S18, Sankt-Peterburg) so với **24/10/1795** (S20) | S18, S20 | **Tranh cãi** (ngày) | Chỉ dùng năm (1793, 1795). Có thể là ngày khác sự kiện (hiệp ước ký so với Sejm phê chuẩn so với tuyên bố) nhưng **chưa kiểm** |
| F22c | — | Số diện tích phần Nga nhận: lần I 93.000 km², lần II 250.200, lần III 120.000, tổng **463.200 km²** (63,15% lãnh thổ Khối Thịnh vượng chung 1772); Wandycz ~62% | S20 (C) dẫn Davies *God's Playground* 2005 t. I tr. 394 (**chưa đọc**) | **Sơ bộ** (chỉ C; tìm kiếm cũng thấy 466.509 và 462.000 ở trang khác: mức ~460.000–467.000, **chưa đọc**) | **Không dùng.** Không so với chuỗi Cliopatria được (xem F29: mức tăng Cliopatria quanh các mốc 1772, 1793, 1795 không khớp tổng này) |
| F23 | 1864–67 (22,85) và bước nhảy 1860–61 trong chuỗi | Hiệp ước Aigun (Aigun 1858): ranh giới Nga–Trung dọc sông Amur từ Argun ra Biển Okhotsk, đi lại chung trên Amur/Ussuri/Sungari. Ngày **28/5/1858** (S21 B, S23 C) so với **21/5/1858** (S22). Vùng giữa Ussuri và biển để **cùng quản lý** đến 1860; nhà Thanh ban đầu không phê chuẩn | S21 (B, đọc), S22 (B/C, một phần), S23 (C) | Sự kiện: **Đạt một phần**; ngày chính xác: **Tranh cãi** (28/5 so với 21/5; prlib.ru "16 (28) 5" chưa đọc, nên 28/5 có thể là chuyển lịch mới) | Chỉ nói "năm 1858". Mệnh đề "nhà Thanh ban đầu không phê chuẩn" chỉ có S23 (C): **không dùng** nếu chưa có nguồn B |
| F24 | 1860–61 (Cliopatria 21,06 lên 21,97) | Công ước Bắc Kinh Nga–Thanh ký **14/11/1860** (lịch mới; prlib.ru "2 (14) 11" chưa đọc): xác nhận Aigun, Nga có vùng Ussuri, nay là phần Primorye (S23; S22: "thêm 300.000 km² ven Biển Nhật Bản, đem Vladivostok vào Nga" là **tóm tắt tìm kiếm, chưa đọc** cho phần Vladivostok) | S23 (C, đọc một phần), S22 (một phần) | **Sơ bộ** (chỉ C và tài liệu B/C chưa rõ; S21 không nhắc) | Chưa dùng. **Mâu thuẫn số km²:** Aigun >600.000 (S23, dẫn Paine 2003/Tzhou 1990) so với ~500.000 (S22); Bắc Kinh ~400.000 (S23, dẫn Ghosh 1977) so với ~300.000 (S22); cộng lại ~910.000 (bài "Outer Manchuria", chưa đọc) hay ~800.000–1.000.000. Trong chuỗi Cliopatria bước tăng 1859 → 1860–61 là **+0,91 Mkm²**, **trùng cỡ** với tổng ~0,9–1,0 nhưng chưa chứng minh nhân quả |
| F25 | 1864–67 (22,85) và tụt 1868–69 (21,49) | **Bán Alaska:** hiệp ước ký ở Washington **30/3/1867**; Senate thông qua 9/4; Tổng thống phê chuẩn 28/5; trao đổi phê chuẩn và công bố 20/6/1867; Điều I: Nga nhượng "toàn bộ lãnh thổ và quyền thống trị … trên lục địa châu Mỹ và các đảo lân cận"; Điều VI: **7,2 triệu đô la vàng**. Chuyển giao chính thức 18/10/1867 (Sitka) | S25 (A, bản chép, đọc), S26 (B, đọc một phần), S27 (C, đọc một phần) | **Đã kiểm chứng** cho ngày 30/3/1867, số tiền 7,2 triệu USD (vàng), việc nhượng toàn bộ phần Nga ở lục địa Mỹ (văn bản đọc + tổng quan Bộ Ngoại giao Mỹ khớp). 18/10/1867: **Đạt một phần** (chỉ S27) | Đây là **lần duy nhất trong 4 mốc mà lãnh thổ GIẢM**. Lý do bán: thiếu tiền, ít người định cư (không quá ~400 người Nga theo S26), hậu quả Crimea, Nga lần đầu chào bán 1859 (S26); S27 thêm lý do khó phòng thủ trước Anh/Canada: chỉ dùng "theo Bộ Ngoại giao Mỹ" cho lý do của S26 |
| F25b | — | Diện tích Alaska **586.412 dặm vuông (1.518.800 km²)**; khoảng **2 xu một mẫu Anh** | S27 (C, đọc); Britannica (chỉ tóm tắt tìm kiếm, **chưa đọc**); S25/S26 **không** nêu diện tích | **Sơ bộ** (chỉ một nguồn C đã đọc; hiệp ước không có số) | Phép tự tính: 586.412 × 640 = 375,3 triệu mẫu Anh; 7,2 triệu USD ÷ 375,3 triệu ≈ 0,019 USD/mẫu (**tính của tôi, dựa vào số diện tích chưa kiểm chứng**). Không dùng "2 xu/mẫu" làm số cứng khi chưa có nguồn B đọc được |
| F26 | 1864–67 và thập kỷ sau (chuỗi tăng nhẹ 1873–79) | Chinh phục Trung Á: Tashkent bị chiếm **1865** (Chernayev; đầu hàng 29/6/1865 theo S29); Samarqand **1868**; Bukhara ký hiệp ước thành **chư hầu/bảo hộ 1868** (S28; S29: hòa ước 5/7/1868); Khiva bảo hộ **1873**; Kokand/Quqon sáp nhập **1876**; Tashkent và Quqon thuộc thẳng một toàn quyền Nga | S28 (B, đọc đoạn), S29 (C, đọc một phần) | **Đạt một phần**; **lệch nhỏ:** S28 ghi Bukhoro "bị chiếm 1867" (có thể chỉ một thành) còn S29 và chính S28 ghi hiệp ước 1868 | Dùng: "từ 1865 đến 1876 Nga chiếm hoặc bắt các hãn quốc Trung Á làm chư hầu". **Không** nói "sáp nhập" cho Bukhara và Khiva (S28: bảo hộ, giữ nội trị). Khiva 1873 và Pamir 1895 trong S29 **chưa đọc** |
| F27 | 1895 / hook | **Múi giờ:** thời Đế quốc Nga **không có hệ múi giờ chuẩn**; phần lớn dùng giờ mặt trời địa phương, giờ Moscow chuẩn từ 1/1/1880; các múi UTC+2…+12 chỉ có sau khi Liên Xô thành lập. Nga ngày nay có **11 múi giờ**. Nên **không** thể nói "Đế quốc Nga 1895 trải 11 múi giờ" | S31 (C, đọc một phần; dẫn luật 107-FZ chưa đọc) | **Sơ bộ** (chỉ C; nhưng đủ để **cảnh báo cấm** câu anachronism) | Dùng được để **tránh sai**, chưa dùng làm sự thật cứng. Có thể nói "ngày nay nước Nga có 11 múi giờ" chỉ khi đọc được Luật 107-FZ hoặc nguồn B. Nếu muốn so sánh cho cảnh, chọn "khoảng một phần sáu đất liền" (F27b) |
| F27b | 1895 | "Khoảng một phần sáu đất liền của Trái Đất" | S30 (C, nói trong lời mở, dẫn Taagepera cho 22,8); tìm kiếm cũng thấy trang NBER 1926 và các trang chung (**chưa đọc**) | **Sơ bộ** | Không dùng như sự thật. Tính nhẩm 22,8 so với tổng đất liền Trái Đất (~149 triệu km², **số tôi nhớ chung, chưa có nguồn đọc**) ra ~15%, tức "khoảng một phần bảy hoặc sáu"; cần nguồn đất liền mới ghi |
| F28 | hook (không thuộc mốc) | Nga mở rộng trung bình **50 dặm vuông mỗi ngày** trong hơn bốn thế kỷ từ thời Ivan IV (Ivan Bạo chúa) (≈130 km²/ngày; quy đổi của tôi 50 × 2,59) | S32 (D, blog trích Kotkin *Stalin* t. I; chưa đọc sách) | **Sơ bộ** | **Không dùng.** Chỉ đáng theo dõi: nếu lấy được Kotkin (tr. nào) hoặc Taagepera thì thành hook rất mạnh. Không gắn vào mốc năm nào của Cliopatria |
| F29 | chuỗi Cliopatria Nga (S33) | Từ chuỗi đầy đủ của S04: 1721–26 **14,38**; 1769–71 15,71; 1772–74 16,05; 1792–93 16,53; 1794–95 16,69; 1797–98 16,69; **1799–1802 16,72** (thềm phẳng); 1846–47 19,00; 1848 20,92; 1860–61 21,97; **1864–67 22,85**; **1868–69 21,49** (−1,36); 1873–76 21,99; 1877–79 22,21; 1895–97 22,16; 1898–99 22,16; **1900–04 22,89**; 1905–11 22,12 | S04/S33 (B, tự tính từ tệp) | **Đạt một phần** (số là của Cliopatria, dữ liệu mô hình hóa) | Quan sát: (1) mức **tụt 1,36** giữa 1864–67 và 1868–69 **cùng chiều và gần cỡ** với Alaska 1,52 (S27, C) nhưng chênh 0,16, chưa giải; (2) mức tăng quanh chia cắt Ba Lan trong Cliopatria (+0,34 ở 1772–74; +0,12 ở 1792–93; +0,16 ở 1794–95) **không khớp** với 93.000/250.200/120.000 km² (F22c): đừng ghép; (3) bước nhảy lớn nhất khu vực 1846–48 (+3,3 từ 17,63 lên 20,92) **chưa tra được nguyên nhân** (nhiều khả năng Trung Á/thảo nguyên, **chưa nguồn**); (4) Trung Á 1868–79 trong Cliopatria chỉ **+0,7**; (5) bước 1900–04 (+0,73) rồi tụt 1905: **chưa tra** (S30 hộp thông tin ghi 22,5 ở 1906 theo Taagepera; Mãn Châu/Liaodong không đọc) |
| F30 | 1895 so với đỉnh Cliopatria | Taagepera (qua S01/S02/S30): **22,8 Mkm² năm 1895**; Cliopatria: 22,16 ở 1895–97, đỉnh **22,89 ở 1900–04**, và **22,85 ở 1864–67 trước khi bán Alaska**. Taagepera cho 15,0 ở 1725 (S30) so với Cliopatria 14,38 ở 1721–26 | S01, S02, S30 (cùng gốc), S33 | **Tranh cãi** (về năm đỉnh; khớp tốt về mức 22,1–22,9) | Câu an toàn: "theo các bộ số liệu, vào cuối thế kỷ 19 Nga đạt khoảng 22–23 triệu km²". Có thể nói hai bộ "đặt đỉnh ở thập niên khác nhau (1895 so với 1900–04, và Cliopatria còn cho 1864–67 gần bằng)" |

### Bảng sự kiện đề xuất theo mốc (cho tác giả cảnh)
| Mốc (Cliopatria, Mkm²) | Sự kiện có nguồn đã đọc | Mức dùng | Câu giới hạn |
|---|---|---|---|
| 1721–26: 14,38 | Hiệp ước Nystad 1721 (F20) | Dùng được, giới hạn | "theo Encyclopedia of Russian History / Hughes"; không nêu km² cho sự kiện |
| 1799–1802: 16,72 | Ba lần chia cắt Ba Lan 1772/73–1795 (F22a) | Dùng được, giới hạn; **mốc là thềm phẳng, không phải bước nhảy** | chỉ nêu năm và việc "đưa phần lớn đất Ba Lan–Litva về Nga, Phổ, Áo"; **không** nêu km² (F22c) |
| 1864–67: 22,85 | Trung Á từ 1865 (F26); Aigun/Bắc Kinh 1858–60 (F23, F24) ở mức hẹp; sau đó **bán Alaska 30/3/1867 giá 7,2 triệu USD vàng (F25)** | Alaska: **dùng được**; Trung Á: dùng có giới hạn; Amur/Bắc Kinh: **chưa dùng** | "Nga chiếm hoặc bắt các hãn quốc Trung Á làm chư hầu 1865–76"; "năm 1867 bán Alaska" |
| 1900–04: 22,89 | **Không tìm được sự kiện nào** cho bước +0,73 so với 1898–99 | **Chưa rõ** | không gắn sự kiện; nếu cần chỉ dùng F30 |
| 1895 (S01/S02: 22,8) | Chỉ có số; "một phần sáu" (F27b) và múi giờ (F27) **không dùng** | Dùng F07 đã có | giữ câu F07 "khoảng 22–23 triệu km², hạng 3" |

### Dòng được dùng trong kịch bản (chương bổ sung) và giới hạn
- Dùng được: F25 (ngày hiệp ước 30/3/1867, 7,2 triệu USD vàng, nhượng toàn bộ phần Nga ở lục địa Mỹ).
- Dùng có giới hạn ("theo …", chỉ năm): F20, F22a, F26, F29 (nói rõ "theo Cliopatria"), F30.
- Không dùng: F21 (chưa thống nhất tháng), F22b, F22c, F23 (ngày), F24, F25b, F27, F27b, F28.

## Chương Mông Cổ (F31–F37; agy thu thập, Claude kiểm lại 2026-10-17)
Trạng thái dưới đây do **Claude gán lại** theo những gì Claude tự mở được (cột "Claude kiểm lại" trong 02-sources.md), **không** lấy nhãn "Đã kiểm chứng" của agy. Báo cáo thô: `research/raw/agy-mongol-2026-10-17.md`.

| ID | Mốc | Khẳng định | Nguồn | Trạng thái | Giới hạn câu chữ |
|---|---|---|---|---|---|
| F31 | 1206–09 (Cliopatria 2,46) | Năm 1206 một *kuriltai* (đại hội thủ lĩnh) tôn Temüjin làm khan/Chinggis Khan, thống nhất các bộ tộc Mông Cổ | S35 (B, kiểm lại); S43/S41 (agy báo, chưa kiểm) | **Đạt một phần** | Chỉ nêu năm 1206; **không** nêu địa điểm (nguồn lệch: sông Onon / Kerulen / Karakorum) |
| F32 | 1220–26 (8,51) | Năm 1218 sứ giả của Chinggis bị đối xử tệ ở Khwarazm (S46: "mistreated"; S47: "the Shah had the ambassadors executed"); Chinggis tiến đánh; Khwarazm bị xóa sổ **khoảng 1220** (S46: "eradicated by 1220"; S47: xâm lược "between 1218 and 1220"). Các năm 1219 và 1221 **không** nằm trong hai trang này (1221 chỉ ghi riêng cho miền bắc Afghanistan ở S47) | S46 (B, Claude kiểm lại 2026-10-17), S47 (B/C, Claude kiểm lại) | **Đạt một phần** (hai nguồn độc lập khớp về 1218 → ~1220; nhưng S47 là bách khoa chuyên ngành hạng B/C, chưa đủ hai nguồn A/B) | Dùng: "khoảng năm 1220, đế quốc Khwarazm bị xóa sổ sau khi sứ giả Mông Cổ bị xúc phạm (một nguồn nói bị xử tử)". **Không** dùng: Otrar, "thương buôn" (không có trên S46/S47: agy thêm từ nguồn khác chưa kiểm), tên Muhammad II (S47 chỉ nói "Shah of Khwarazm"), số quân (S46 "hơn 200.000" so với agy báo S8 "100.000": mâu thuẫn, S47 không có số), năm 1219 |
| F33 | 1241–49 (20,93) | Quân Batu và Subetei hạ Kiev ngày 6/12 (1240), thắng ở Liegnitz 9/4/1241; rút khỏi Hungary mùa xuân 1242 vì thiếu đồng cỏ; tin Ögedei mất 11/12 (1241) tới nhanh qua mạng chuyển tin | S36 (B, kiểm lại), S39 (B/C, kiểm lại một phần) | **Đạt một phần** (Kiev 6/12/1240: S39 ghi rõ, S36 suy từ ngữ cảnh; Liegnitz: một nguồn; năm mất Ögedei: suy từ triều đại 1229–1241) | Chỉ nêu năm và "khoảng 1237–1241"; nguyên nhân rút quân là **tranh cãi** (Ögedei mất / thiếu đồng cỏ / kéo giãn): không khẳng định một nguyên nhân. Không dùng "600.000 quân" |
| F34 | 1260–71 (25,80) | Möngke mất tháng 8/1259 (kiết lỵ theo S37; sử liệu khác còn nêu thương tích: chưa kiểm); 1260 Kublai và Ariq Böke cùng xưng khan, nội chiến 1260–1264 (S40; S38 ghi Kublai thắng 1261) | S37, S38, S40 (kiểm lại) | **Đạt một phần**; nguyên nhân Möngke mất và năm kết thúc nội chiến: **Tranh cãi** | Chỉ nói "năm 1260 nội chiến kế vị bùng nổ"; không nêu nguyên nhân cái chết; không nêu năm kết thúc |
| F35 | 1279–84 (27,43) | Năm 1279 hạm đội Mông Cổ tiêu diệt tàn quân hạm đội Nam Tống; 19/3/1279 trận Nhai Sơn (S40); Nguyên 1271 (S40) hay 1279 (S38) tùy cách tính | S38, S40 (kiểm lại) | **Đạt một phần** cho "1279 Nam Tống diệt vong" (S38 loại B + S40 loại B/C đồng thuận; **hạ từ "Đã kiểm chứng" để nhất quán** với F32: chưa đủ hai nguồn A/B); ngày 19/3: một nguồn | Dùng năm 1279; năm lập triều Nguyên: **Tranh cãi (1271/1279)**, không nêu |
| F36 | hạng 2 | Mông Cổ lớn nhất về đất liền liền một dải, khoảng 24 triệu km² (Turchin 2006: 1270; Chase-Dunn 2010: 1300; Taagepera: 1294 23,5 / 1309 24,0); Nguyên tính riêng ~11,0 (1310) | S44, S13 (agy báo, chưa kiểm); **F06 đã có (S02, đọc toàn văn)** | **Dùng F06**; chi tiết mới: **Sơ bộ** | Chỉ nói "khoảng 24 triệu km²" và "liền một dải lớn nhất lịch sử". **Không** dùng câu agy trích từ S39 (không có trên trang) |
| F37 | hook | Mạng chuyển tin giúp tin Ögedei mất (11/12) tới tiền tuyến Batu rất nhanh (không suy ra "vì vậy rút quân" thành nguyên nhân duy nhất: F33) | S36 (B, kiểm lại: "incredibly swift Mongol messenger service"); S43 §279–280 (agy báo "20 người giữ ngựa mỗi chặng": **chưa kiểm**) | **Đạt một phần** cho "mạng chuyển tin rất nhanh"; chi tiết 20 phu: **Sơ bộ** | Dùng được ý "tin từ Mông Cổ tới Trung Âu nhờ mạng chuyển tin"; không nêu con số phu/trạm |

### Bảng sự kiện đề xuất theo mốc (Mông Cổ; mốc Cliopatria từ F06)
| Mốc (Mkm²) | Sự kiện có nguồn kiểm lại | Mức dùng | Câu giới hạn |
|---|---|---|---|
| 1206–09: 2,46 | 1206 kuriltai tôn Chinggis (F31) | Dùng có giới hạn | "Năm 1206, các thủ lĩnh Mông Cổ tôn Temüjin làm Chinggis Khan" (không nêu nơi chốn) |
| 1220–26: 8,51 | Khwarazm bị xóa sổ khoảng 1220 (F32) | Dùng có giới hạn | "Khoảng năm 1220, đế quốc Khwarazm bị xóa sổ" (không nêu Otrar, số quân, năm 1219) |
| 1241–49: 20,93 | Kiev 1240, Liegnitz 1241 (F33) | Dùng có giới hạn | Chỉ năm; "quân Mông Cổ tiến tới Đông Âu" |
| 1260–71: 25,80 | 1260 nội chiến kế vị (F34) | Dùng có giới hạn | "Năm 1260 các hoàng thân tranh ngôi, đế chế bắt đầu tách ra" (chỉ ở mức đó) |
| 1279–84: 27,43 | 1279 Nam Tống diệt vong (F35) | Dùng được (năm) | "Năm 1279, nhà Nam Tống sụp đổ" |

### Dòng được dùng trong kịch bản (chương Mông Cổ)
- Dùng được: F06 (hạng 2, liền một dải, khoảng 24 triệu km²).
- Dùng có giới hạn (chỉ năm / "khoảng"): F31, F32, F33, F34, F35, F37.
- Không dùng: số quân (600.000; 200.000; 100.000), Otrar/thương buôn/Muhammad II, số phu/trạm, nguyên nhân rút quân hoặc cái chết của Möngke như một khẳng định, địa điểm kurultai 1206.

## Rà soát theo `source-policy.md` (2026-10-17): ƯU TIÊN mục này hơn các bảng trên
Luật mới loại Wikipedia (S01, S20, S23, S27, S29, S30, S31), World History Encyclopedia (S39, S40, S47), blog (S05, S32), historyofwar.org (S17), trang giáo dục tổng quan (S10, S22, S41). Các nguồn đó không còn là căn cứ. "Đã đọc" của các nguồn hợp lệ phần lớn qua WebFetch tóm tắt (chưa `pdftotext`+`grep`): xem cột "Cần làm".
Viết tắt hạng: A sử liệu gốc; B học thuật bình duyệt/bộ dữ liệu có phương pháp công bố; B2 bách khoa thư học thuật có tác giả ký; G cơ quan nhà nước/thư viện/bảo tàng.

| Fxx | Căn cứ hợp lệ còn lại | Trạng thái mới | Dùng được trong kịch bản? | Cần làm |
|---|---|---|---|---|
| F01 | không (chỉ S01) | **Sơ bộ** | Không | Đọc định nghĩa trong Taagepera 1997 |
| F02 | S02 (B, đọc toàn văn), S04 (B, dữ liệu có "British Empire") | **Đã kiểm chứng** | Có (nói rõ cách tính) | — |
| F03 | S03 (B, đọc một phần) | **Đạt một phần** | Có giới hạn | `pdftotext` bài Scientific Data để xác nhận câu |
| F04 | không (blog) | **Sơ bộ** | Không | Bỏ |
| F05 Anh | S04 (36,82; 1918). Số 35,5 (Taagepera) chỉ qua Wikipedia | **Đạt một phần** (hạng 1, ~36,8 theo Cliopatria) | Có, ghi "theo Cliopatria" | Đọc Taagepera 1997 để có 35,5 |
| F06 Mông Cổ | S02 (24,00 ở 1270, "liền kề lớn nhất"), S04 (27,43) | **Đã kiểm chứng** (hạng 2, khoảng 24–27,4) | Có | — |
| F07 Nga | S02 (22,8 ở 1895), S04 (22,16–22,89) | **Đã kiểm chứng** (khoảng 22–23, hạng 3) | Có | — |
| F08 Thanh | S02 (14,70; năm bị lỗi trích), S04 (12,51) | **Tranh cãi** | Chỉ nếu nêu khoảng | Taagepera 1997 |
| F09 Tây Ban Nha | S04 (11,35). Số 13,7 chỉ Wikipedia | **Đạt một phần** (theo Cliopatria) | Có giới hạn | Taagepera 1997 |
| F10 Pháp | S04 (12,75). Số 11,5 chỉ Wikipedia | **Đạt một phần** (theo Cliopatria) | Có giới hạn | Taagepera 1997 |
| F11 Nguyên | S04 (14,21). Số 11,0 chỉ Wikipedia | **Đạt một phần** (theo Cliopatria) | Có giới hạn | Taagepera 1997 |
| F12a Umayyad | S04 (9,88). 11,1 chỉ Wikipedia; S02 bảng lệch cột | **Đạt một phần** (theo Cliopatria) | Có giới hạn | Taagepera 1997 |
| F12b Abbasid | S04 (8,16). 11,1 chỉ Wikipedia | **Đạt một phần** (theo Cliopatria) | Có giới hạn | Taagepera 1997 |
| F13 hạng 10 | S04 (Brazil 8,51; Xiongnu 5,61; Đường 8,72); S02 (Xiongnu 9,00) | **Tranh cãi** | Chỉ nếu nêu khoảng | Taagepera 1997 |
| F14 Liên Xô/Hoa Kỳ | S04 | **Đạt một phần** | Có giới hạn | — |
| F20 Nystad | S16 (B2, Hughes, *Encyclopedia of Russian History*) | **Đạt một phần** | Có giới hạn (năm, các tỉnh) | Bổ sung nguồn B/B2 thứ hai; xác nhận thông tin xuất bản bộ sách |
| F21 | S16 (B2) | **Đạt một phần** | Có (chỉ năm 1721) | như F20 |
| F22a Chia cắt Ba Lan | S18 (B2, Wyporska), S19 (G, LoC) | **Đạt một phần** | Có giới hạn | — (chưa dùng ở s009) |
| F22b / F22c | S18 cho ngày (4/1/1793; 3/1/1795); số km² chỉ Wikipedia/Davies chưa đọc | **Sơ bộ** (km²); ngày: Đạt một phần | Không | Davies, *God's Playground* |
| F23 Aigun | S21 (B2, Levine: 28/5/1858) | **Đạt một phần** (km² Sơ bộ) | Không (chưa dùng) | — |
| F24 Bắc Kinh | không | **Sơ bộ** | Không | Nguồn B/B2 |
| F25 Alaska | S25 (A, văn bản hiệp ước, **bản chép**), S26 (G) | **Đã kiểm chứng** (ngày 30/3/1867, 7,2 triệu USD vàng, nhượng toàn bộ phần Nga ở lục địa Mỹ: chính văn bản); "không bao giờ quá 400 người Nga": **Đạt một phần** (S26, G) | Có | Thay S25 bằng bản chính thức (15 Stat. 539 / NARA); trang S26 đã **ngừng bảo trì** |
| F25b | không | **Sơ bộ** | Không | — |
| F26 Trung Á | S28 (G, LoC) | **Đạt một phần** | Có giới hạn | Thêm nguồn B2/B; trang LoC không ghi biên tập/năm |
| F27, F27b, F28 | không | **Sơ bộ** | Không | — |
| F29 Cliopatria Nga | S04/S33 (B, dữ liệu tự tính) | **Đạt một phần** | Có, ghi "theo Cliopatria" | — |
| F30 | S02 (22,8; 1895), S04 | **Tranh cãi** (năm đỉnh); khoảng 22–23: **Đã kiểm chứng** | Có ("khoảng 22–23") | — |
| F31 1206 | S35 (G, LoC); S43 (A) agy báo, chưa kiểm | **Đạt một phần** | Có giới hạn (chỉ năm) | Kiểm S43 bằng `pdftotext`; thêm nguồn B |
| F32 Khwarazm | S46 (G, LoC); S47 bị loại | **Đạt một phần** (một nguồn G) | Có giới hạn ("khoảng 1220") | Nguồn B (Juvaini bản Boyle; Cambridge History of Iran) |
| F33 châu Âu | S36 (G, LoC); S39 bị loại | **Đạt một phần** | Có giới hạn (chỉ "khoảng 1237–1241") | Nguồn B |
| F34 | S37, S38 (G, LoC); S40 bị loại | **Đạt một phần** (Möngke mất tháng 8/1259; Kublai thắng 1261 theo S38). Năm 1260/1264 chỉ có WHE: **bỏ** | Có giới hạn | Nguồn B |
| F35 | S38 (G, LoC) | **Đạt một phần** | Có giới hạn (năm 1279) | Nguồn B |
| F36 | không kiểm lại được (S44 agy báo); dùng F06 | **Sơ bộ** (chi tiết mới) | Không (dùng F06) | Kiểm S44 |
| F37 | S36 (G) | **Đạt một phần** | Có giới hạn | Nguồn B |

### Hệ quả
- **s009 (pilot Nga) đứng vững:** câu nào cũng còn ≥1 nguồn hợp lệ (S02, S04, S16, S25, S26, S28). Chỉnh một chỗ: S26 ghi "never numbered more than four hundred" nên lời dẫn B7 sửa thành "không bao giờ quá bốn trăm người" (bỏ "khoảng").
- **Hạng 4–10:** số hiển thị phải là số Cliopatria hoặc nêu khoảng/tranh cãi cho tới khi có Taagepera 1997 trực tiếp.
- **Mông Cổ (s010):** căn cứ hiện chỉ là một bộ chuyên khảo LoC 1989 (G): mỏng. Cần nguồn A/B (Secret History đã có link, Juvaini, Cambridge History of Inner Asia, May/Atwood/Allsen/Jackson) trước khi viết thẻ cảnh.
- Thông tin xuất bản còn thiếu cho danh mục mô tả (xem `04-open-questions.md`).

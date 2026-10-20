# Kết quả đợt agy #2 (9 đế chế) và kiểm chứng của Claude (2026-10-17)

Báo cáo gốc của agy: `raw/agy-batch9-2026-10-17.md` (140 KB, chưa tin). Văn bản trích từ PDF: `raw/agy-batch9-txt/` (Taagepera 1997, Taagepera 1978, Turchin 2006). Kiểm bằng `pdftotext -layout` + so khớp chuỗi (chuẩn hóa khoảng trắng); trang HTML (Avalon) tải bằng curl rồi so khớp.

## 1. Đã đọc được toàn văn (đột phá so với trước)
Ba nguồn định lượng chính đã có PDF và đã mở đọc, thay cho trạng thái "chưa đọc được" ở `04-open-questions.md`:
- Taagepera 1997, *Int. Studies Quarterly* 41(3):475–504 (eScholarship qt3cn68807).
- Taagepera 1978, *Social Science Research* 7(2):108–127 (eScholarship qt8vx325vq), **Table 3 = bảng xếp hạng**.
- Turchin, Adams & Hall 2006, *JWSR* 12(2):219–229, Table 1.

## 2. Số diện tích đỉnh cao, đã khớp văn bản PDF
| Đế chế | Taagepera 1978 (Table 3) | Taagepera 1997 | Turchin 2006 | Ghi chú |
|---|---|---|---|---|
| Anh | 34 Mm² (1920) | 35,5 (1920, Appendix 3B; trong chính văn: "35 Mm2, in 1925") | không có (loại đế chế hàng hải) | khoảng 34–35,5 |
| Mông Cổ | 24 (1309) | 24 (1309); Haack ghi 27,5 cho 1280 | 24,00 (1270) | 24, có biến thể 27,5 |
| Nga | 23 (1905) | | 22,8 (1895) | đã dùng ở s009 |
| Pháp (thuộc địa thứ hai) | 15 (1920) | 11,5 (1920) | không có | **lệch lớn** 11,5–15 |
| Thanh | 15 (1800) | 14,7 (1790) | 14,70 | 14,7–15 |
| Tây Ban Nha | 14 (1800) | 13,7 (1780, 1810) | | 13,7–14 |
| Caliphate (Umayyad + Abbasid gộp một chuỗi) | 11 (750) | 11,1 (720 và 750; Roolvink 10,1) | | **không tách được Umayyad/Abbasid** |
| Nguyên | 11 (1320) | 11 (1310) | gộp vào Mông Cổ | 11 |
| Brazil (Đế quốc) | 8,5 (1970, là nước hiện đại) | 5,0? (1822), 8,51 (1900) | | Cliopatria cho phần Đế quốc |
Hệ quả: bảng của Taagepera 1978 chứa cả Canada (10), Trung Quốc (9,6), Mỹ (9,4), Hung Nô (9), Úc (7,7), Hán (6,5); theo cách tính đã chốt (loại cộng hòa, nước hiện đại) thứ tự 1–10 vẫn là: Anh, Mông Cổ, Nga, Pháp, Thanh, Tây Ban Nha, Caliphate (Umayyad/Abbasid), Nguyên, Hung Nô (9) hoặc Brazil. **Cần người dùng quyết:** Umayyad và Abbasid không tách được trong nguồn; xem mục 5.

## 3. Trích dẫn sự kiện: kết quả kiểm
OK = chuỗi khớp văn bản đã trích. "Nội dung đúng nhưng không nguyên văn" = đúng ý, nhưng chữ agy đưa không phải câu liền trong văn bản.
| Sự kiện | Nguồn | Kết quả |
|---|---|---|
| Anh 10/2/1763 Hiệp ước Paris, Canada cho Anh | Avalon + History.state.gov | Avalon OK ("10th day of February, 1763"; "cedes and guaranties to his said Britannick Majesty, in full right, Canada"); History.state.gov chưa kiểm lại |
| Anh/Pháp 28/6/1919 Điều 119 Versailles | Avalon partiv | OK nguyên văn |
| Anh 1920 35,5 "SW Africa, Tanganyika; peak size from EB 1952…" | Taagepera 1997 | OK |
| Mông Cổ 1294 "Tibet conquered; Kublai's death", 1309 "Last formal reunification" | Taagepera 1997 | OK |
| Mông Cổ 1258 cướp Baghdad | El-Hibri 2021 Chronology | OK |
| Mông Cổ 1206 Chinggis | Taagepera 1997 / El-Hibri | **KHÔNG tìm thấy** chuỗi agy đưa; bảng Taagepera bị vỡ cột. Chưa dùng. |
| Nguyên "1310 11 … Break-up; largest successor state" | Taagepera 1997 | OK |
| Nguyên quân chiếm Nam Tống "by 1276" | Birge 2002 | OK (lưu ý Birge ghi 1276 trong lời, 1279 trong niên biểu) |
| Nguyên 1271 | Holcombe 2011 timeline | Nội dung khớp ("Yuan, 1271–1368"); chuỗi có ký tự gạch ngang lỗi mã hóa |
| Thanh 1644 vào Bắc Kinh (Peterson/Roth Li) | Cambridge History of China 9 | **Không kiểm được**: PDF trích đoạn Cambridge là ảnh/trống chữ (chỉ ra chữ đầu trang). Chưa dùng. |
| Thanh 1760 "vast stretches had been added…" | Peterson | **Không kiểm được** (như trên) |
| Thanh 1760 "Ili, Tarim, Fergana" | Taagepera 1997 | Bảng vỡ cột, không khớp; chỉ khớp "1790 … Nepal, Annam" |
| Tây Ban Nha Tordesillas 7/6/1494, 370 leagues | Avalon | OK nguyên văn |
| Tây Ban Nha 1780/1810 13,7 | Taagepera 1997 | OK |
| Tây Ban Nha Louisiana/Florida (History.state.gov) | | Chưa kiểm lại |
| Pháp 1830 Algiers | History.state.gov; Viallet-Thévenin & Chambru 2022 | Chưa kiểm (HTML) |
| Pháp 1920 "Cameroons, Togo from Germany" | Taagepera 1997 | OK |
| Umayyad 661 "Omayyid dynasty begins" | Taagepera 1997 | OK |
| Umayyad "The Umayyads moved the capital … to Damascus" | Frantz-Murphy 1991 (Coptic Encyclopedia) | OK |
| Umayyad 705–715 al-Walid (Spain, Transoxiana, Indus) | El-Hibri 2021 Chronology | Nội dung đúng nhưng **không nguyên văn**: cột năm và cột chữ bị tách ở PDF (đã xem: "The reign of al-Walid b. Abd al-Malik marks the Arab conquest of Spain, Transoxiana, and the Indus river region" ở cột chữ, năm 705–715 ở cột trái, ghép theo thứ tự). Dùng được với câu "theo niên biểu El-Hibri". |
| Umayyad 720 "Transoxania, Indus, Spain" | Taagepera 1997 | OK |
| Abbasid 749/750 Zab, Kufa | El-Hibri 2021 | OK nguyên văn (ghi 749) |
| Abbasid 762–763 al-Mansur lập Baghdad | El-Hibri 2021 | OK |
| Abbasid "787 10.6 … Baghdad founded in 762" | Taagepera 1997 | OK |
| Brazil 1822 độc lập; "about one half of the present area effectively controlled by settlers" | Taagepera 1997 | OK |
| Brazil Preface Bethell "three on the Empire (1822–89)…" | Bethell 1989 | **Không kiểm được** (PDF chữ rỗng). Chưa dùng. |
| Brazil 1900 8,51 "Full control of present territory" | Taagepera 1997 | OK |

Hai trích dẫn không đạt: `"British empire at its peak (35 Mm2 in 1925)"` (văn bản thật: "At the peak size of the British empire (35 Mm2, in 1925)"), và câu "30 to 40 Mm2 … just before World War II" của Taagepera 1978 và "24 Mm2 (or 28 Mm2?)": **không tìm thấy** trong PDF. Loại ba dòng này khỏi `03-facts.md`. Số 35 (1925) vẫn đúng ý ở chính văn trang 486 (dòng "peak size of the British empire (35 Mm2, in 1925)").

## 4. Việc chưa làm
- HTML (History.state.gov, Viallet-Thévenin) chưa tải lại để so chuỗi; chỉ Avalon đã kiểm.
- Cambridge excerpt (Peterson, Franke & Twitchett, Bethell, Prochaska, Mosca): PDF không có lớp chữ; cần PDF toàn văn hoặc ảnh trang từ người dùng, hoặc chuyển sang sự kiện khác (hiệp ước/văn kiện) cho Thanh.
- Chưa ghi vào `03-facts.md`, chưa tạo `empires/*.json`.

## 5. Quyết định cần người dùng
1. **Umayyad và Abbasid:** cả ba nguồn định lượng gộp một chuỗi "Caliphate" (750: 11,1 Mm²). Muốn tách hai hạng riêng thì số diện tích mỗi đế chế phải lấy từ Cliopatria (tự tính). Hoặc gộp thành "Caliphate Hồi giáo (Umayyad–Abbasid)" một cảnh.
2. **Pháp:** khoảng 11,5–15 triệu km² (lệch >10%): theo luật hiển thị khoảng.

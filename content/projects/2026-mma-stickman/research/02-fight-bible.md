# Bible trận đấu: "Mũ gai vs Mũ thép" (hư cấu, hài)

Trạng thái: **bản nháp v3 chờ duyệt** (người dùng giao quyền quyết định 2026-10-17; các lựa chọn dưới đây là quyết định của tôi, sửa được). Toàn bộ là hư cấu giải trí. Quân phục lấy từ thẻ library; không dùng chi tiết lịch sử làm khẳng định, trừ dòng đã kiểm chứng trong `2026-german-army-uniforms/research/03-facts.md` (ghi mã `[Fxx]`).

## Các quyết định đã chốt (và lý do)
| Câu hỏi | Quyết định | Lý do |
|---|---|---|
| Cặp thời kỳ | **Phổ 1871 (Gai) vs Heer 1916 (Thép)** | Cuộc tranh luận "mũ gai hay mũ thép" là điểm nhấn của kênh quân phục Đức (cảnh `s001` của dự án quân phục đã đặt hai người cạnh nhau); hai silhouette khác biệt rõ, đọc được ở thumbnail; tránh rủi ro nhạy cảm của Wehrmacht |
| Lời bình | **Không lời**, chữ ngắn + SFX | Rẻ, không cần voice/timing, hợp hài hành động, dễ cắt Shorts và đa ngôn ngữ (chỉ đổi `locales/<xx>.json`); thêm lồng tiếng sau nếu cần |
| Giọng điệu | **Hài** (gag quân phục), không nghiêm túc kiểu chiến trận | Thu hút hơn, an toàn hơn về nội dung; mỗi gag gắn với một chi tiết quân phục |

## Hai nhân vật
| | **Thép** (`ho`, trái) | **Gai** (`rua`, phải) |
|---|---|---|
| Quân phục | Bộ binh Đức 1916 (`de-heer-infantry-1916`): mũ M1916 có chốt thông gió, áo xanh xám ngả lục, hộp mặt nạ phòng độc ở hông, ủng | Bộ binh Phổ 1871 (`de-prussia-infantry-1871`): mũ Pickelhaube, áo xanh Phổ, cổ đỏ, thắt lưng trắng |
| Lối đánh | Striker: đấm móc, đá vòng, tiến liên tục | Grappler: quật, kiểm soát dưới đất, siết |
| Gag quân phục | Hộp mặt nạ đập vào chân khi đá; mũ thép "boong" mỗi lần trúng (SFX chuông); mũ nặng nên gật gù khi mệt | Mũi nhọn Pickelhaube cắm vào dây rào, vướng khi lăn; đồng lóe dưới đèn; mũ lệch rồi lăn khỏi đầu |
| Tính cách | Hăng, tự tin, hay khoe "mẫu mới" | Điềm tĩnh, cứng đầu, nhìn thua nhưng không bỏ cuộc |

"Thép"/"Gai" là biệt danh hư cấu, không gắn người thật, đơn vị thật hay chiến dịch thật.

## Luật
3 hiệp × 5 phút (đơn giản hóa luật Unified), thắng bằng KO/TKO, submission hoặc điểm. Tay không, không vũ khí, không phù hiệu.

## Diễn biến (khung ≈ 8 phút)
| Phần | Nội dung | Điểm giữ chân |
|---|---|---|
| Hook (0:00–0:14) | Thép đá vòng chậm 0.4× trúng mũ Gai, "boong", flash, chữ "Chuyện gì xảy ra trước đó?" | khoảnh khắc đẹp nhất mở đầu + câu hỏi |
| Giới thiệu (0:14–1:20) | Vào đài, so dáng; chú thích ngắn kiểu bảng đấu ("Mũ gai 1871" vs "Mũ thép 1916") | đối lập rõ, hứa hẹn tranh luận |
| Hiệp 1 (1:20–3:20) | Thép áp đảo; mũ Gai lệch dần; Gai ngã cuối hiệp, mũ lăn trên sàn | Thép dẫn, gag mũ lăn |
| Nghỉ (3:20–3:50) | Gai đội lại mũ, nhìn đôi ủng/hộp mặt nạ nặng của Thép | chuẩn bị đảo chiều |
| Hiệp 2 (3:50–6:00) | Gai quật, kiểm soát dưới đất; hộp mặt nạ Thép vướng; mũ thép cộm xuống sàn | đảo thế |
| Hiệp 3 (6:00–7:30) | Kiệt sức; Thép lặp cú đá vòng (hook), Gai né, bắt chân, quật, siết cổ; Thép vỗ tay | hook được "trả lời" |
| Kết (7:30–8:00) | Trọng tài giơ tay Gai, hai người bắt tay; câu hỏi cho người xem "Bạn chọn mũ gai hay mũ thép?" | kêu gọi bình luận |

## Kế hoạch giữ chân người xem
1. **Hook ≤ 14 giây**, không giải thích: cú KO hài + câu hỏi mở rồi mới kể lại.
2. **Mỗi 60–90 giây một nhịp mới** (đảo thế, gag, cú suýt KO); không cảnh nào im quá 20 giây.
3. **Gag lặp có tiến triển (running gag):** mũ Gai lệch → lăn → đội lại → cuối cùng giữ vững khi thắng; "boong" của mũ thép lặp 3 lần với 3 mức độ.
4. **Âm thanh quyết định hài:** SFX đấm/đá/boong to và đúng frame (`hit` trong move library); nhạc ngắt (im lặng) trước cú đòn lớn.
5. **Chữ lớn dễ đọc ở điện thoại**; không phụ thuộc lời bình.
6. **Kết mở gây tranh luận lành mạnh:** không phán ai "tốt hơn", đặt câu hỏi cho bình luận; bình luận ghim nhắc "mũ gai hay mũ thép?".
7. **Bản Shorts 30–45 giây:** cắt từ B01 (hook) + B13–B15 (cú trả lời); cần chốt khung dọc 9:16 ở Bước 5 (hiện khung 16:9).
8. **Thumbnail:** hai nhân vật đầu to đối mặt, mũi nhọn vs mũ thép, 3–4 chữ ("GAI vs THÉP"), tương phản mạnh; vẽ bằng chính engine (`npm run still`).

## Quy tắc nội dung (bắt buộc)
- Không phù hiệu, cờ, ký hiệu chính trị nào trên quân phục hoặc nền; mô tả/prompt dùng hình thức trung tính (`style-lock.md`).
- Không nhắc chiến tranh/chiến dịch, không so sánh "quân đội nào tốt hơn" theo ý thức hệ; kết thúc bắt tay.
- Không máu, không đánh người đã ngã/KO sau khi trọng tài can thiệp.
- Dữ kiện lịch sử trong chữ/mô tả: chỉ dùng dòng đã kiểm chứng, ghi `[Fxx]`; dòng "Sơ bộ" (ví dụ F14 về mũ Pickelhaube thời chiến) không nêu như sự thật. Gag chỉ dựa vào hình dạng nhìn thấy trên thẻ library.

## Việc còn mở (không chặn Bước 3)
- Có lồng tiếng bình luận sau này không (không cần ngay).
- Có dùng "Wehrmacht 1936" như một nhân vật phụ/bản mở rộng sau không (đã có sẵn bộ `wehrmacht1936` trong `theme.ts`, hiện không dùng).

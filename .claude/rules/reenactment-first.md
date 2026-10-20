# Quy tắc chọn hình theo vai trò nhịp (BẮT BUỘC cho mọi video/cảnh)

Người dùng quyết định qua hai bước:
- **2026-10-18 (Mỹ Lai):** "video của tôi ưu tiên dựng lại cảnh để thu hút người xem. I don't like video chỉ đưa ra số liệu, tối đa cảnh".
- **2026-10-18 (Ursula Herrmann):** chọn nguyên tắc "chia theo vai trò nhịp". Tài liệu gốc là xương sống cho khẳng định; dựng cảnh là mạch cảm xúc cho trải nghiệm.

Áp cho mọi dự án.

## Chọn hình cho mỗi nhịp lời theo việc nhịp đó làm
| Nhịp đang làm gì | Hình dùng |
|---|---|
| Nêu **khẳng định hoặc chứng cứ** (bản án kết luận gì, thư viết gì, báo cáo ghi gì) | **Bắt buộc dùng tài liệu gốc** khi có. Đặt tài liệu vào bối cảnh: bàn điều tra, đèn, tay cầm, bút dạ quang tô câu trích, camera lướt dòng chữ. Dựng cảnh không được thay tài liệu đang có. |
| **Kể chuyện hoặc gợi cảm xúc** (diễn biến, chờ đợi, tìm kiếm) | **Dựng cảnh là lựa chọn chính**, kể cả khi có tài liệu liên quan: nhân vật (người, phương tiện) làm hành động trong bối cảnh, có camera và chuyển động. |
| **Định vị** nơi chốn, thời gian | Ảnh địa điểm thật có giấy phép, bản đồ; có chuyển động (2.5D, parallax, không khí). |
| **Chỉ có chữ hoặc số** (thẻ số, tem chữ, bảng) | Ngoại lệ, **tối đa 10% số shot**. Mỗi shot phải ghi lý do trong thẻ cảnh; chỉ dùng cho mốc ngày hoặc con số then chốt. |

## Quy định kèm theo
- **Số liệu, ngày, tên, nguồn đặt thành chữ phụ đè lên cảnh hoặc tài liệu** (góc, băng nguồn, nhãn), không thành shot riêng.
- **Thẻ cảnh ghi vai trò từng nhịp** (chứng cứ / kể / định vị / chữ). Tỉ lệ mục tiêu đặt trong `project.md` của từng dự án.
- **Kỹ thuật mặc định cho cảnh dựng:**
  - 2.5D nhiều lớp: nền + nhân vật tách nền + tiền cảnh.
  - Camera đẩy/pan/parallax; hiệu ứng (khói, sương, bụi, ánh sáng) bằng code, gắn với bối cảnh, không rải đều mọi shot.
  - Nhân vật lặp lại dùng thẻ nhân vật cố định + ảnh tham chiếu (`--ref`) để đồng nhất.
- **Không đổi sự kiện để dựng cảnh:**
  - Cảnh dựng chỉ minh họa điều có nguồn (`source-policy.md`).
  - Chi tiết thêm cho có hình (thời tiết, tư thế, đồ vật) đánh dấu *(gợi hình)* trong thẻ cảnh.
  - Mọi ảnh dựng có nhãn "Minh họa" trên màn hình.
- **Ranh giới nội dung** (người thật, trẻ em, bạo lực) theo `project.md` của từng dự án. Chưa có quyết định ghi ở đó thì hỏi người dùng trước khi vẽ.
- **Mục tự phản biện của `script-craft`** thêm câu hỏi: "Nhịp chứng cứ nào chưa dùng tài liệu gốc đang có? Nhịp kể nào chỉ là chữ/số, có dựng thành cảnh được không? Chữ thuần có vượt 10% không?"

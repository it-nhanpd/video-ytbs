# Template thẻ cảnh chuẩn

Không đổi thứ tự, tên mục hoặc tên cột. Nếu một trường chưa có dữ liệu, ghi `chưa có` thay vì xóa trường.

```markdown
# sNNN — <tên cảnh> (<durationSec>s, chương <n>)

## 1. Ý định
- **Người xem mang đi:** <một câu cụ thể>
- **Cảm xúc:** <một cảm xúc chính>
- **Vai trò trong video:** <hook / bối cảnh / bước ngoặt / cao trào / hệ quả>

## 2. Open loop
- **Mở trong 0–3s:** <mâu thuẫn/câu hỏi cụ thể>
- **Đóng:** <câu trả lời xuất hiện ở beat nào>
- **Dẫn sang cảnh sau:** <câu hỏi mới, không lặp>

## 3. Nhịp
| Thời điểm | Lời dẫn có [Fxx] | Vai trò | Hình / camera / chữ / SFX |
|---|---|---|---|
| 00–05s | ... | kể / chứng cứ / định vị / chữ | ... |

## 4. Lời dẫn bản TTS
> <lời đọc đã bỏ mã Fxx; câu ngắn; tên riêng viết theo quy ước TTS>

- **Đơn vị đọc:** <kết quả audit>
- **Tốc độ đã chốt:** <x> đơn vị/giây
- **Lời đọc ước tính:** <x>s
- **Khoảng lặng/SFX:** <x>s
- **Tổng:** <durationSec>s

## 5. Nguồn
| Fxx | Khẳng định được dùng | Trạng thái | Giới hạn câu chữ |
|---|---|---|---|

## 6. Asset
- **Có sẵn:** ...
- **Thiếu:** ...
- **Code:** ...
- **Nhãn bắt buộc:** Minh họa / nguồn ảnh / mốc thời gian

## 7. Tự phản biện
| Mục | ĐẠT/CHƯA | Bằng chứng hoặc cách sửa |
|---|---|---|
| Hook 0–3s | ... | ... |
| Open loop mở/đóng | ... | ... |
| Giọng nói tự nhiên | ... | ... |
| Không beat >12s | ... | ... |
| Mọi sự kiện có Fxx | ... | ... |
| Không câu tuyệt đối thiếu nguồn | ... | ... |
| Thời lượng đã audit | ... | ... |
| Chuyển cảnh kéo người xem | ... | ... |
| Hình đúng vai trò, chữ thuần ≤10% | ... | ... |

## 8. Cổng duyệt
- **Kết luận:** ĐẠT / CHƯA ĐẠT / ĐẠT CÓ ĐIỀU KIỆN
- **Cần người dùng quyết:** ...
- **Bước tiếp theo:** G1 / G2 / G3
```

## Template trả lời chat của agent

```markdown
## Phạm vi
## Kết luận
## Lỗi chặn
## Bản đã sửa
## Kiểm định
## Thay đổi
## Cổng tiếp theo
```

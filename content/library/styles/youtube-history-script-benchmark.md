# Benchmark viết kịch bản lịch sử YouTube

Mục tiêu của benchmark này là tạo một **ngữ pháp kể chung** cho mọi agent. Video tham chiếu chỉ dùng để học cấu trúc và nhịp; sự kiện lịch sử vẫn phải lấy từ nguồn A/B/B2/G và mã `Fxx`.

## Bộ vai trò tham chiếu tối thiểu

| Vai trò | Kênh/video mẫu | Học gì | Không sao chép |
|---|---|---|---|
| Bản đồ + chronology | The Armchair Historian — *D-Day from the American Perspective* | Đi từ toàn cảnh chiến dịch xuống một điểm nóng; chuyển bản đồ ↔ nhân vật khi quan hệ nhân quả thay đổi | Câu dẫn, storyboard, thiết kế nhân vật, nhạc |
| Giải thích cô đọng | Simple History — *Omaha Beach, D-Day* | Một beat một ý; đưa thuật ngữ và số liệu vào đúng lúc; kết quả mỗi đoạn rõ | Lời dẫn, minh họa, tiêu đề hoặc thumbnail |
| Tác chiến cấp nhỏ | The Operations Room — *Easy Company Assaults the Guns at Brecourt Manor* | Timeline rõ, hướng di chuyển rõ, mỗi quyết định tạo ra một hệ quả nhìn thấy được | Bản đồ, icon, animation hoặc lời bình |
| Nhân vật/cảm xúc | Yarnhub — *D-Day Hero* | Neo cảnh bằng một người, mục tiêu cụ thể, trở ngại cụ thể và lựa chọn dưới áp lực | Kịch bản nhân vật, shot điện ảnh, nhạc |

Một dự án không cần bắt chước mọi kênh. Nó phải chọn ít nhất ba vai trò và ghi rõ `REF-xx` trong `research/02-sources.md`.

## Công thức master script

1. **Cold open 0–15s:** một lời hứa bị phá vỡ, một vật/số cụ thể, hoặc một quyết định chưa biết kết quả.
2. **Thiết lập không gian ≤60s:** bản đồ trả lời ba câu: ở đâu, ai đang ở đâu, mục tiêu là gì.
3. **Chuỗi nhân quả:** mỗi cảnh viết thành `vì A → B xảy ra → buộc C phải quyết định`.
4. **Đỉnh người thật:** trước đoạn tổng kết hoặc số liệu phải có một nhân vật cụ thể làm một việc có nguồn.
5. **Hệ quả có giới hạn:** nói Omaha đóng góp gì cho Overlord; không biến một trận thành nguyên nhân duy nhất của toàn cuộc chiến.

## Công thức từng cảnh 45–65 giây

- 0–3s: mâu thuẫn hoặc câu hỏi cụ thể.
- 3–12s: định vị tối thiểu, không đọc danh sách đơn vị.
- 12–40s: 4–6 beat nhân quả, đổi hình mỗi 4–7s ở cao trào hoặc 8–12s ở đoạn thường.
- 40–55s: đóng loop bằng kết quả có nguồn.
- 5–10s cuối: mở một câu hỏi mới dẫn sang cảnh sau.

## Chuẩn lời dẫn

- Đa số câu 8–18 đơn vị đọc; xen một câu 3–6 đơn vị sau 2–3 câu dài.
- Một câu chỉ mang một khẳng định lịch sử chính.
- Danh từ cụ thể và động từ hữu hình tốt hơn tính từ cường điệu.
- Chỉ dùng so sánh nhất hoặc từ tuyệt đối khi nguồn chứng minh đúng phạm vi.
- Số liệu nằm trên hình; lời dẫn ưu tiên ý nghĩa của số đó.

## Checklist chống “mỗi agent một kiểu”

- Dùng đúng template của `script-craft/references/scene-template.md`.
- Giữ nguyên tám mục và tên cột.
- Dùng đúng ba trạng thái: `ĐẠT`, `CHƯA ĐẠT`, `ĐẠT CÓ ĐIỀU KIỆN`.
- Mọi cảnh chạy `audit-scene.mjs` trước khi báo hoàn tất.
- YouTube reference không bao giờ thay thế mã `Fxx`.
- Nếu agent đề xuất phá template, phải nêu lý do và chờ người dùng duyệt.

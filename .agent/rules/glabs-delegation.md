# Quy tắc dùng G-Labs Studio (Webhook API) để tạo ảnh

Người dùng đã chạy server webhook, đặt `GLABS_API_KEY` trong `.env` và dùng gói Max (2026-10-17). Claude được gọi G-Labs qua `tools/glabs.mjs`. Đây là kênh thứ ba, ngoài agy và tạo tay bằng Nano Banana.

- **Chỉ qua `tools/glabs.mjs`.** Không tự viết lệnh `curl` tới API, không đọc/in/ghi khóa API. Khóa chỉ nằm trong `.env` (đã gitignore) hoặc biến môi trường.
- **Trước mỗi đợt:** nêu số ảnh, model, thư mục đích, rồi chờ người dùng xác nhận. Việc hàng loạt (> 3 ảnh) phải kèm checklist `style-guard` và chỉ làm sau khi pilot được duyệt (`workflow-gates.md`).
- **Model:** ảnh 2D dùng `nano_banana_2_lite` (mặc định) hoặc `nano_banana_2` nếu lite kém; **không dùng `nano_banana_pro`** trừ khi người dùng yêu cầu (tốn hạn mức, 2D không cần).
- **Prompt:** vẫn theo `style-lock.md` (dán nguyên block style, không từ nhạy cảm kể cả dạng phủ định) và `prompt-pack`.
- **Đích ghi:** chỉ `content/projects/<p>/inbox/`. Công cụ không ghi đè file có sẵn trừ khi `--force`; không dùng `--force` khi chưa nhìn ảnh cũ.
- **Ảnh về → `style-guard` đạt → `ingest`.** Không đạt thì tạo lại, ghi vào `qa/`. Không "tạm chấp nhận".
- **Giới hạn:** mỗi lần gọi 1 ảnh; ghi số lần gọi đã dùng vào `.claude/progress/`. Tài khoản có hạn mức riêng: gặp lỗi quota/chính sách thì dừng và báo, không thử lại vòng quanh.
- **Báo cáo trung thực:** chỉ nói đã tạo khi file tồn tại (nêu đường dẫn); nói rõ ảnh nào lỗi, lỗi gì.
- **Clip video (người dùng duyệt 2026-10-19):** qua `tools/glabs-video.mjs` (`POST /api/video/generate`, tài liệu: `D:\G-Labs-Automation\WEBHOOK_INTEGRATION.en.md`). Chỉ cho **cảnh khó** theo `content/library/styles/pacing-and-footage.md` (phần lớn chuyển động vẫn bằng code, để không phụ thuộc credit). Mặc định `omni_flash`, `360p` nháp rồi mới `720p`, 4–6 s; không `4K`/`veo_31_lite_relaxed` (cần ULTRA). Mỗi lần gọi = 1 clip tốn credit: nêu số clip, model, độ phân giải và chờ xác nhận; **pilot 1 clip** trước; trần số clip/dự án ghi ở `project.md`; ghi mỗi lần gọi vào `.claude/progress/`. Clip đã duyệt lưu `content/library/footage/<id>.mp4` + thẻ để tái dùng. Gặp lỗi quota (429)/chính sách: dừng và báo.
- Server phải đang chạy (app mở, tab Webhook, Start) và tác vụ chỉ nằm trong bộ nhớ app: gửi, chờ và tải trong cùng một lần chạy (công cụ đã làm vậy).

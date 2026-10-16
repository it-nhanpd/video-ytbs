# Mẫu prompt: nghiên cứu một chương (Bước 2)

Dùng cho từng chương của dự án. Thay `{{...}}`, đưa agent (hoặc dùng subagent `source-researcher`). Chạy lần lượt từng chương, duyệt xong mới sang chương sau.

```
Nghiên cứu CHƯƠNG {{số}}: {{tên chương}} ({{phạm vi thời gian}}) của dự án content/projects/{{slug}}.
Làm đúng skill fact-research. Đọc trước: project.md, research/01-reference-analysis.md (mục 5, các khẳng định Vn của chương này: {{V..}}).

Việc cần làm:
1. Lập danh sách câu hỏi của chương (ai, khi nào, ở đâu, vật gì, số liệu, mâu thuẫn).
2. Tìm và ĐỌC nguồn thật theo thứ tự A (văn bản sơ cấp) > B (hồ sơ bảo tàng/học thuật) > C (bách khoa) > D (chỉ tìm hướng).
3. Cập nhật research/02-sources.md (cột "Đã đọc" trung thực), 03-facts.md (mỗi dòng 1 khẳng định, nguồn, trạng thái),
   04-open-questions.md (điều chưa chắc, nguồn cần tìm, nguồn cần tôi cung cấp).
4. Nêu mâu thuẫn giữa các nguồn, không chọn đại. Không dùng khẳng định chỉ có nguồn C/D hay mới thấy tóm tắt tìm kiếm.
5. Với mỗi khẳng định Vn của video tham chiếu thuộc chương: ghi kết quả tra (đúng/sai/chưa kiểm chứng).
6. Cuối cùng báo cáo: nguồn đã đọc, dòng đạt "Đã kiểm chứng"/"Đạt một phần", khoảng trống, việc cần tôi hỗ trợ (sách in, PDF).
Dừng ở cổng duyệt, chưa viết kịch bản.
```

## Định dạng đầu ra (bắt buộc giống chương 1)
- `02-sources.md`: bảng `ID | Nguồn | Loại | Độ tin cậy | Đã đọc | Dùng cho | Ghi chú`; mục "Sửa lỗi" nếu có.
- `03-facts.md`: bảng `ID | Khẳng định | Số liệu | Nguồn | Trạng thái | Ghi chú`; mục cập nhật Vn; mục "Dòng được dùng trong kịch bản"; mục "Khoảng trống".
- `04-open-questions.md`: danh sách theo chương, kèm "Cần bạn hỗ trợ".

## Sau khi nghiên cứu chương xong: Cổng duyệt
Bạn đọc `03-facts.md` và chọn dòng được dùng. Chỉ khi đó mới viết đoạn kịch bản của chương (mỗi đoạn gắn mã `[Fxx]`).

## Prompt viết kịch bản cho một chương (sau khi qua cổng)
```
Viết đoạn kịch bản CHƯƠNG {{số}} vào script/{{locale}}.md (khoảng {{N}} từ, ~140–160 từ/phút).
Chỉ dùng các dòng ở mục "Dòng được dùng trong kịch bản" của 03-facts.md, đúng giới hạn câu chữ ghi ở đó.
Mỗi đoạn gắn mã [Fxx]. Chỗ tranh cãi phải nói rõ. Không dán nguyên văn nguồn hay video tham chiếu.
Áp dụng 5 hướng khác biệt đã chọn (vì sao thay đổi; so sánh cạnh nhau; quy định vs thực tế; bỏ vũ khí; hook bằng câu hỏi).
```

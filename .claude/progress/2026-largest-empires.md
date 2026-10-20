# Progress: 2026-largest-empires

## G-Labs (số lần gọi)
| # | Ngày | Model | Tỉ lệ | Đích | Kết quả |
|---|---|---|---|---|---|
| 1 | 2026-10-17 | nano_banana_2_lite | 1:1 | `content/projects/2026-largest-empires/inbox/mascot-explorer-neutral.jpg` | tạo được (146.555 byte); chờ người dùng duyệt ảnh |

| 2 | 2026-10-17 | nano_banana_2_lite | 1:1 | `inbox/mascot-explorer-surprised.jpg` (141.693 byte), ref = neutral | tạo được |
| 3 | 2026-10-17 | nano_banana_2_lite | 1:1 | `inbox/mascot-explorer-thinking.jpg` (137.695 byte), ref = neutral | tạo được |
| 4 | 2026-10-17 | nano_banana_2_lite | 1:1 | `inbox/mascot-explorer-pointing.jpg` (145.881 byte), ref = neutral | tạo được, nét mặt tinh quái hơn prompt |

Tổng: 4 lần gọi.

## agy (số lần gọi)
| # | Ngày | Việc | Cờ | Kết quả |
|---|---|---|---|---|
| 1 | 2026-10-17 | Nghiên cứu sự kiện Đế quốc Mông Cổ (cwd = scratchpad/agy-mongol, 1 lần `agy -p`) | `--dangerously-skip-permissions` (người dùng duyệt) | trả `mongol-research.md` (43 KB); Claude kiểm lại 8 nguồn: đúng phần lớn, 1 câu trích sai (S39), 1 nguồn không kiểm được (S41). Bản thô lưu `research/raw/agy-mongol-2026-10-17.md` |

## Trạng thái
- Style bible `empire-map`: người dùng chỉ duyệt để thử mascot; chưa khóa (`research/05-style-proposal.md`).
- Chưa dùng `style-guard` chính thức (chưa có style bible khóa); đã kiểm tay bằng mục 4–5 của đề xuất.
- Cảnh pilot: Nga, 3 mốc (1721 → Trung Á 1865–67 → bán Alaska 1867), người dùng đã chọn.

## agy call #2 (2026-10-17)
- Lệnh: agy -p (prompt agy-batch/prompt.txt) --dangerously-skip-permissions, cwd = thư mục tạm; 9 đế chế; chạy ~66 phút, exit 0.
- Kết quả: report.md 140 KB + 24 PDF; kiểm bằng pdftotext: số diện tích Taagepera/Turchin khớp; một số trích dẫn không khớp hoặc PDF Cambridge không có lớp chữ. Chi tiết: research/07-agy-batch9-verify.md.

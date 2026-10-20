# run20-track: đo chuyển động từ video tham chiếu rồi dựng lại bằng layer `runner`

Dùng cho `content/projects/_ref-run20` (bài thử kỹ thuật nội bộ, không đăng). Chạy từ thư mục gốc repo: `node tools/run20-track/<tên>.mjs`.
Đầu vào: `_refs/run20/frames/f_0001..0602.jpg` (30 fps, 2520×1080; gitignored). Trung gian ghi vào `_refs/run20/`. Đầu ra dùng khi dựng: `content/projects/_ref-run20/run20_track.json`.

## Thứ tự chạy (đã chạy lại trọn chuỗi từ khung gốc 2026-10-17, ra cùng số đo)
| Bước | Việc | Ra |
|---|---|---|
| `01-track-body` | so khớp mẫu (template matching) theo dõi ngực, đầu, thắt lưng, khung 120–276 | `track.json` |
| `02-boot-chain` | tách hai giày theo màu, nối thành một chuỗi liên tục trong một chu kỳ (khung 120–154) | `_Xchain.json` |
| `03-ik-init` | chân thứ hai, IK khởi tạo gối từ hông + cổ chân | `_ikG.json` |
| `04-knees` | tinh chỉnh gối/hông theo IoU với mặt nạ ống quần | `_joints.json` |
| `05-hand` | tách bàn tay tự do theo màu da | `hand.json` |
| `06-build-track` | gộp: khớp tương đồng 3 điểm (thắt lưng, ngực, đầu) cho thân, góc giày từ trục chính, nội suy tay khuất | `run20_track.json` |
| `07-refine-legs` | chấm IoU đúng hình học đa giác của `RunnerAsset`, tối ưu toàn cục + gối từng hình (2 lượt), làm mượt 0,5 | ghi đè `run20_track.json` |
| `08-constrain` | ràng buộc giải phẫu: tâm khung chậu gắn cứng vào thắt lưng, mỗi chân một gốc đùi (lệch ≤ 25 px), đùi/ống dài chung ±10% (gối giải IK theo IoU); khuỷu tay tự do giải IK vai → bàn tay. Đọc bản trước-08 `_refs/run20/run20_track_pre08.json` nên chạy lại cho cùng kết quả | ghi đè `run20_track.json` (thêm `legs[].hip`, `elbow`, `shoulder`) |

Công cụ ảnh: `art-cut-upper` (cắt thân trên từ pose f9 theo gấu áo), `art-cut-arm` (tách tay áo trên và cẳng tay theo vòng cung khuỷu), `art-register` (căn thân trên vào khung gốc 120 bằng tối ưu sai khác màu). `art-fill-elbow` (lấp chỗ lõm ở đáy `run_arm_up.png` bằng hoa văn vải, bản gốc ở `_refs/run20/backup/run_arm_up.orig.png`: khi cánh tay trên quay khác cẳng tay, chỗ lõm lộ nền thành cung trắng ở khuỷu). QA: `qa-compare <idx,...> <ra.png> <thư mục khung dựng>` (gốc | dựng | chồng nửa trong suốt), `qa-strip` (dải cả chu kỳ).
`lib.mjs`, `boots.mjs`, `legiou.mjs` (đa giác chân + tô lưới, tách từ `07`) là thư viện dùng chung. Đừng đặt tên script kết thúc bằng `boots.mjs` hay `lib.mjs` (đoạn CLI của thư viện sẽ tự chạy).

## Số đo rút ra từ gốc (nguồn của các thông số trong `scenes.json`)
- Gốc là **vòng lặp chính xác 27 hình ở 24 fps (1,125 s)**: giày đóng vòng lệch 0,4 px sau 34 khung @30 fps; thân/đầu/thắt lưng lệch trung vị 0–2 px.
- **Gốc không khóa chân vào đất**: giày chống trượt ≈ 0,34 chiều rộng khung/giây, nền trôi 0,14 → trượt nhanh gấp ~2,4 lần nền. Đừng "khóa chân".
- Tay tự do vung như **con lắc gần thẳng quanh vai** (vai → bàn tay 191–221 px, khuỷu gập nhẹ), không phải cẳng tay quanh khuỷu cố định: giả định cũ đẩy khuỷu ra ngoài tay áo tới ~50 px ở f136–f145 (kiểm 2026-10-17). `08` giải khuỷu từng hình; `RunnerAsset` đặt đỉnh vai ảnh tay áo trên (`armUp.top`) lùi vào trong ngực `armUp.shoulderShift` (−30, 0) rồi kéo dọc trục tới khuỷu: vai IK nằm đúng mép ngực của ảnh thân trên nên đặt vòm ở đó (hoặc quay quanh khuỷu) đều làm vòm lòi ra trước ngực; vài hình tay khuất sau thân (đầu ngón vẫn ló dưới túi đạn).
- Gối/hông của `07` (hông tự do) làm đùi dài 110–244 px và hông trượt 65 px so với thắt lưng; `08` khóa lại, đổi IoU 0,672 → 0,660.
- Thân nhún ≈ 66 px (6% chiều cao khung) hai lần mỗi chu kỳ; đầu còn nhún riêng so với thân tối đa ≈ 13 px (chưa dựng).

## Giới hạn đã biết
- Thân trên + đầu + súng + tay cầm súng là MỘT ảnh cứng (cắt từ pose AI f9): không có biến dạng thân và nhún đầu riêng từng hình như gốc.
- Chân là đa giác phẳng 1 màu + 3 nét nhăn; độ khớp silhouette với ống quần gốc IoU ≈ 0,68 (trần của chỉ số ≈ 0,85 vì viền đen không nằm trong mặt nạ).
- Độ rộng ống (`leg.widths`), điểm cuối ống (`foot.tube`), tỉ lệ giày (`foot.scale`) trong `scenes.json` đặt tay từ kết quả `07` (không tự đồng bộ).

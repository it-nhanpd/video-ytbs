# _ref-run20: bài thử dựng lại 20 giây video tham chiếu (NỘI BỘ, KHÔNG ĐĂNG)

Người dùng yêu cầu (2026-10-17): "từ video gốc bạn làm giống 100% 20s", chọn "dựng lại thật sát cả hình", cảnh lính chạy 6:00–6:20 của `5nX9uVBi95s`. Phân tích số đo: `content/library/styles/run20-spec.md`. Khung gốc `_refs/run20/` (ngoài content/, gitignored).

## Ngoại lệ có chủ đích so với luật hiện hành (workflow-gates mục 5; người dùng duyệt bằng yêu cầu trên)
- Nhân vật nhìn 3/4 từ trước (trái `uniform-showcase.md` §4 mục 2 và §2 "90° phải"): theo gốc.
- Nền = MỘT tấm toàn cảnh lặp vòng trôi một tốc độ + trời đứng yên (trái "nhiều lớp / cỏ che chân"): theo số đo của gốc.
- Nhân vật gốc là lính Waffen-SS: chỉ để thử kỹ thuật; **không dùng trong video đăng**, không đưa tên đơn vị/phù hiệu vào prompt (style-lock). Heer có nguồn của `2026-german-army-uniforms` không bị ảnh hưởng.
- Ảnh tham chiếu (khung gốc) được đính kèm cho G-Labs để bám hình; chỉ nội bộ.

## Ảnh đã tạo (G-Labs, nano_banana_2): 13 lượt
Bảng bộ phận 3/4 (`rig_ref20_parts_v1`; nguồn của ảnh giày `rig_ref20_foot` và tay `rig_ref20_foreArm`), tấm nền A, tấm nền B (v1 bỏ, dùng v2), thân cây và cây tuyết quét, bảng pose s0 và s1–s3 (v1 hỏng vì ảnh nhận dạng chứa pose, v2 đạt). Thân trên đang dùng cắt từ pose f9 (bảng pose, `run_upper.png`). Không có lượt lỗi quota.

## Cách dựng (cập nhật 2026-10-17: layer `runner`)
- **Nhân vật**: layer `runner` (`engine/src/components/RunnerAsset.tsx`) dựng lại chuyển động ĐO từ gốc, `content/projects/_ref-run20/run20_track.json` (27 hình, 24 fps, on ones). Thân trên+đầu+súng+tay cầm = ảnh `run_upper.png` (cắt từ pose f9 theo gấu áo, `tools/run20-track/art-cut-upper.mjs`); chân = đa giác vector + ảnh giày/xà cạp; tay tự do = `run_arm_up.png` (đứng yên sau thân) + `run_arm_fore.png` (quay quanh khuỷu). Chuỗi đo và cách chạy lại: `tools/run20-track/README.md`.
- Nền: `node tools/concat-plates.mjs --out .../bg_ref20_pan.png --blend 0.05 --height 1080 --match-sky 0.2 "A@0,0" "B@0,0.07"`. Layer `bg`: `tile wrap`, `walkSpeed 269` (= 0,14 chiều rộng/giây đo từ gốc), cuộn mượt.
- Camera: `shots` zoom 1 → 1,85 tại 9,2–9,8 s, lùi tại 16,7–17,4 s; `blurZoom 2`. Quét: `sweepTrunk` (0–2 s), `sweepFir` (18,6–20 s). Chữ: `caption`.
- Khung hình: 1920×1080 + `letterbox 2.35`, 24 fps. Cảnh: `run20` (20 s), `wide10` (10 s toàn cảnh), `rtest` (4 s chỉ nhân vật, để so khung gốc).
- Lệnh render: `npm run render -- ref-run20-wide10 content/projects/_ref-run20/renders/wide10.mp4` (đặt `TEMP`/`TMP` sang ổ D nếu ổ C đầy). So khung gốc: `node tools/run20-track/qa-compare.mjs 0,9,14 out.png <thư mục khung dựng>`.
- Hướng cũ (rig walk-cycle, flipbook 14 pose + khóa chân) đã lưu trữ ở `_archive/ref-run20-flipbook-rig/`.

## Chưa đạt / chưa kiểm
Xem cuối `.claude/progress/2026-german-army-uniforms.md` (mục run20).

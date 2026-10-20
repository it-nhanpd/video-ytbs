# Pilot rig: bảng bộ phận 1871

Một ảnh (1 prompt): `1-parts-1871.txt`.

- Đính kèm: ảnh nhân vật 1871 đã duyệt (`content/projects/2026-german-army-uniforms/assets/de_prussia_infantry_1871_pose.png`, nếu mất dùng `inbox/de_prussia_infantry_1871_pose.jpg`) + 1–2 ảnh style trong `content/library/styles/refs/`.
- Lưu ảnh với tên `rig_prussia_1871_parts` (png/jpg) vào `content/projects/_rig-demo/inbox/`.
- Kết quả đúng: 7 bộ phận nằm một hàng trái → phải theo thứ tự đầu, thân, tay trên, cẳng tay, đùi, cẳng chân, bàn chân; mỗi bộ phận đứng thẳng, không chạm nhau, không chữ/nhãn.
- Sai thì tạo lại (không "tạm chấp nhận"): bộ phận dính nhau, thừa/thiếu mảnh, chi bị cong, có chữ hoặc đường kẻ đất, màu/viền khác nhau giữa các mảnh.
- Sau khi có ảnh: `npm run ingest -- _rig-demo` (manifest pilot sẽ được thêm), rồi render `rig-demo-walk`.

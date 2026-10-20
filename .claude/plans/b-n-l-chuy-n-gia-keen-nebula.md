# Kế hoạch: làm lại dáng chạy bằng key pose (flipbook "on twos") thay cho rig con rối, kèm nghiệm thu chấm điểm

## Context
Sau ~10 giờ, kết quả `_ref-run20` bị bạn đánh giá "lộ hết khớp, di chuyển không giống gốc, như người khuyết tật". Review bên ngoài cũng chỉ đúng: tạo hình/pose sai từ khâu xử lý nhân vật, Remotion chỉ di chuyển các mảnh thì càng kỳ quặc.

**Vì sao tệ (nhận lỗi, không biện minh):**
1. **Chọn sai kỹ thuật cho mức chất lượng.** Rig mảnh rời cứng (đùi/cẳng chân đầu bo tròn có viền) không thể cho khớp cong mượt như hoạt hình vẽ tay. Tôi biết sprite sheet 12 pose từng bị bỏ vì lệch màu/tỉ lệ, nhưng thay vì cân nhắc lại khi kết quả xấu, tôi cứ vá rig (crouch, IK, armBias, scale mảnh).
2. **Sai thứ tự ưu tiên.** Review đặt: giải phẫu > nhất quán nhân vật > chuyển động > bố cục > trau chuốt > độ phức tạp. Tôi làm ngược: dành thời gian cho letterbox, chữ caption, blurZoom, công cụ ghép nền, dọn dẹp, skill, script đo, trong khi lõi (dáng chạy) vẫn hỏng.
3. **Chấm bằng ảnh nhỏ và nói "khá sát".** Không chấm từng tiêu chí, không soi crop full-res, không xem chuỗi khung liên tiếp, chôn lỗi thật trong phần "hạn chế".
4. **Đo sai thứ cần đo.** Tôi đo chu kỳ/zoom/trôi nền (dễ đo) nhưng không đo quỹ đạo chân và dáng thân (thứ quyết định "chạy thật").

Bằng chứng cho hướng mới: bảng pose đi bộ cũ trong `_archive/german/inbox/de_wehrmacht_infantry_1944_sheetA.jpg` cho thấy model vẽ 4 pose liền một ảnh với chân gập gối tự nhiên, không lộ khớp, cùng một nhân vật; điểm yếu là lệch nhẹ tỉ lệ giữa các sheet và độ phân giải mỗi pose (~700 px cao).

## Quyết định đã chốt với bạn
- Bài thử đầu: **toàn cảnh, nhân vật trọn khung, chưa zoom**; **24 fps, 10 giây** (≈9 chu kỳ). Chỉ sau khi nghiệm thu đạt mới thêm cú zoom cận, cây quét, 20 giây (đã có sẵn trong `_ref-run20`).
- Kỹ thuật: **Phương án A của review (key pose)**, vẽ "on twos" (12 hình/giây) đúng kiểu hoạt hình tay của gốc. Rig (phương án C) tạm dừng, giữ lại cho cảnh đi bộ chung. Phương án B (chỉ camera/parallax trên ảnh gốc) là phương án dự phòng trung thực.

## Việc làm (mỗi bước có cổng; KHÔNG thêm tính năng engine ngoài phạm vi)
**Bước 1 — Phân tích pose (không code, không tạo ảnh):** từ khung gốc trong `_refs/run20/frames`, lấy một chu kỳ chạy (chu kỳ đo được 33,5 khung @30 fps ≈ 27 khung @24, ví dụ khung 306–340), chọn **14 khung cách nhau ~2 khung gốc** → ảnh ghép full-res có đánh số pha (contact, compression, passing, push-off, flight, contact đối diện, recovery). Viết `content/library/styles/run20-pose-guide.md`: tỉ lệ đầu:thân:chân (đo trên khung), vị trí súng/tay cầm theo từng pha, tay tự do, độ nhún thân, hướng mặt. Đây là "proportion guide" bắt buộc của review.

**Bước 2 — Khóa nhân vật + tạo pose (cổng G2: báo số ảnh trước):** 4 ảnh bảng, mỗi ảnh 4 pose của cùng nhân vật (14 pose + 2 dự phòng); mỗi lượt đính kèm (a) ảnh nhận dạng nhân vật (thân/đầu từ `rig_ref20_parts_v1`) và (b) một dải 4 khung gốc đúng pha làm tham chiếu tư thế. Prompt nêu rõ luật giải phẫu của review (gối gập đúng chiều, tay-súng nhất quán, đầu không bị cắt). Ngân sách **8–12 lượt `nano_banana_2`** (mỗi bảng ≥2 phương án chọn tốt nhất; bạn đã cho phép nhiều lượt sinh). Chấm từng pose theo checklist 9 mục giải phẫu; pose lỗi thì sinh lại, không "tạm chấp nhận".

**Bước 3 — Ingest và chuẩn hóa:** dùng `splitFrames` có sẵn (`tools/ingest.ts`), rồi chuẩn hóa mỗi hình theo **chiều cao thân (đỉnh mũ → đế giày)**, đường chân và trục chậu; cân màu về hình đầu tiên; kiểm vòng lặp (hình 14 → hình 1 không giật bằng chênh khung). Xuất **contact sheet 14 pose full-res** để bạn xem trước khi dựng.

**Bước 4 — Dựng bằng cơ chế có sẵn:** `ImageAsset` đã phát `frames` ở `frameFps` (12 = on twos @24 fps), thêm nền `bg_ref20_pan` + `walkSpeed` có sẵn; **hiệu chỉnh `walkSpeed` theo chân tiếp đất** (đo bàn chân đứng yên tương đối nền tại pha contact) để không trượt chân. Không đổi schema trừ khi bắt buộc.

**Bước 5 — Nghiệm thu có chấm điểm (tôi làm, trước khi báo):** render still ở contact/passing/flight/contact đối diện; chuỗi 14 khung liên tiếp full-res; crop full-res đầu gối, hông, khuỷu, bàn tay–súng cạnh khung gốc cùng pha; render MP4 10 s (đặt `TEMP`/`TMP` sang ổ D); bảng ĐẠT/KHÔNG ĐẠT 12 tiêu chí (review §9 + `run20-spec.md` §7). Báo cáo **mở đầu bằng các mục KHÔNG ĐẠT**; không dùng "sát/giống" nếu chưa có số đo.

**Bước 6 (chỉ khi Bước 5 đạt):** thêm zoom cận, cây quét, caption, mở rộng 20 s; chạy lại nghiệm thu.

**Dự phòng trung thực:** nếu sau ngân sách ảnh mà pose vẫn lỗi giải phẫu, dừng và báo; chuyển phương án B (nhân vật một pose đẹp + parallax/bụi/camera) và nói rõ giới hạn thay vì che bằng thêm code.

## Rủi ro nói thẳng
- **Độ nét cận cảnh:** mỗi pose ~700 px cao; ở zoom 1,85× sẽ mềm. Bài thử đầu không zoom nên chưa bị; sau đó có thể phải giới hạn zoom.
- **Lệch giữa các bảng:** có thể vẫn lệch nhẹ tỉ lệ/viền; cách giảm: ảnh nhận dạng trong mỗi lượt, chuẩn hóa chiều cao và cân màu bằng code, chọn phương án tốt nhất của mỗi bảng.
- **Số ảnh phụ thuộc may rủi:** ngân sách 8–12 lượt chỉ là ước lượng.
- **Ổ C đầy ~100%:** render có thể lỗi ENOSPC nếu không đặt `TEMP` sang ổ D.
- Nhân vật gốc là Waffen-SS: bài thử chỉ nội bộ, không đăng (đã ghi trong `project.md` của sandbox).

## File chính
- Mới: `content/library/styles/run20-pose-guide.md`, ảnh bảng pose trong `content/projects/_ref-run20/inbox/`, prompt trong `.../prompts/g-labs/`, contact sheet trong `.../qa/`.
- Sửa: `content/projects/_ref-run20/scenes.json` (layer `soldier` chuyển từ `rig` sang `image` + `frames`), `prompts/manifest.json` (splitFrames), có thể `tools/ingest.ts` (chuẩn hóa tỉ lệ/màu nếu `splitFrames` chưa đủ).
- Tái dùng: `tools/glabs.mjs` (`--ref`), `tools/ingest.ts` `splitFrames`, `engine/src/components/ImageAsset.tsx` (`frames`, `frameFps`), nền/quét/caption/camera đã có trong `_ref-run20`, `_refs/run20/` (khung gốc), `tools/measure-*.mjs`.

## Kiểm tra
- `npm run typecheck`, `npm run validate` sau mỗi thay đổi code.
- Hình: contact sheet 14 pose; chuỗi liên tiếp; crop full-res cạnh gốc; MP4 10 s; bảng chấm 12 mục.
- Lệnh người dùng chạy: `npm run studio`; render: `npm run render -- ref-run20-run20 content/projects/_ref-run20/renders/<tên>.mp4` (kèm `TEMP`/`TMP` sang ổ D nếu ổ C đầy).

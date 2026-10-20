---
name: script-craft
description: Viết, review, fact-check và nâng cấp kịch bản video YouTube lịch sử theo một chuẩn đầu ra cố định (hook, open loop, nhịp giữ chân, lời nói tự nhiên, mã nguồn Fxx, brief hình, tự phản biện, kiểm thời lượng). Luôn dùng khi người dùng yêu cầu viết/review/sửa script, narration, shotlist hoặc nói kịch bản nhạt, giảng bài, thiếu nhất quán giữa các agent. Mặc định làm một cảnh mỗi vòng; chỉ xử lý cả video theo lô khi người dùng yêu cầu rõ "review/fix all" hoặc project.md cho phép Script-First.
---

# script-craft: bộ não của người làm kênh 8 năm

Mặc định làm **một cảnh mỗi lần**, dừng chờ người dùng nhận xét (cổng G1, `workflow-gates.md` mục 7). Khi người dùng yêu cầu rõ review/sửa toàn bộ hoặc `project.md` ghi quy trình Script-First, được audit cả master nhưng vẫn phải báo kết quả và thay đổi theo từng cảnh. Không bịa sự kiện: nguồn là `research/03-facts.md` (mã `Fxx`) và `script/vi.md` (bản gốc cần nâng cấp).

## Hợp đồng đầu ra cố định giữa mọi agent

Mọi lần viết hoặc review script phải trả theo đúng thứ tự sau, kể cả agent khác thực hiện:

1. **Phạm vi** — cảnh/file nào, thời lượng mục tiêu, style-family.
2. **Kết luận** — `ĐẠT`, `CHƯA ĐẠT`, hoặc `ĐẠT CÓ ĐIỀU KIỆN`; không dùng lời khen chung chung.
3. **Lỗi chặn** — sự kiện sai, nguồn thiếu, chronology, câu tuyệt đối, thời lượng, hoặc nhịp hình.
4. **Bản đã sửa** — dùng đúng template trong `references/scene-template.md`; không tự đổi tên/mục.
5. **Kiểm định** — bảng Fxx, số đơn vị đọc, tốc độ, khoảng lặng, nhịp >12s, tỷ lệ chữ thuần.
6. **Thay đổi so với bản trước** — liệt kê ngắn câu nào sửa và lý do.
7. **Cổng tiếp theo** — G1/G2/G3 hoặc việc còn chờ người dùng.

Nếu sửa file, giữ `script/vi.md`, `script/scenes/sNNN.md`, `audio/vi-tts.md` đồng bộ. Không tuyên bố "đã đồng bộ" nếu một file chưa tồn tại.

## Tách nguồn sự thật khỏi nguồn học cách kể

- **Sự thật lịch sử:** chỉ lấy từ `research/03-facts.md` và nguồn đạt chuẩn `source-policy.md`.
- **Video YouTube tham chiếu:** chỉ học hook, cấu trúc, nhịp, cách chuyển bản đồ ↔ nhân vật, và cách đặt câu hỏi. Không dùng video YouTube làm nguồn cho một khẳng định lịch sử.
- Trước khi viết master, đọc `content/library/styles/youtube-history-script-benchmark.md`. Mỗi dự án chọn ít nhất **3 vai trò tham chiếu khác nhau**: một kênh mạnh về bản đồ/chronology, một kênh mạnh về giải thích ngắn gọn, một kênh mạnh về nhân vật/cảm xúc. Không sao chép câu chữ, shot hoặc nhạc.

**Họ style:** đọc `Style-family` trong `project.md` và nạp `video-style-investigation` hoặc `video-style-history` (không trộn); nhịp, tốc độ đọc và footage theo `content/library/styles/pacing-and-footage.md` (mục 1 thay cho ước lượng âm tiết/giây ở mục 5 khi hai bên lệch).

## Đầu vào cần đọc trước
- `project.md` (khán giả, giọng điệu, trục "quy định trên giấy vs thực tế chiến trường").
- Đoạn của cảnh trong `script/vi.md` + mục cảnh trong `script/shotlist.md` (lưu ý shotlist cũ có thể lỗi thời: hướng trái, `flipX`, không vũ khí; theo `content/library/styles/uniform-showcase.md`).
- Các `Fxx` được gắn trong đoạn đó (đọc dòng thật trong `research/03-facts.md`: trạng thái, giới hạn câu chữ), thẻ nhân vật trong `content/library/characters/`, `content/library/INDEX.md`.
- Cảnh trước và cảnh sau (để nối open loop, không lặp ý).
- `content/library/styles/youtube-history-script-benchmark.md` và danh sách `REF-xx` trong `research/02-sources.md`.

## Tư duy theo thứ tự (không bỏ bước)
1. **Ý định cảnh.** Một câu người xem mang đi + một cảm xúc (tò mò, ngạc nhiên, nể, rùng mình...). Nếu không nói được trong một câu: cảnh đang ôm quá nhiều ý, tách hoặc cắt.
2. **Khoảng trống tò mò (open loop).** Mở bằng một câu hỏi/mâu thuẫn **cụ thể** (số, vật, người), không mở bằng "Trong bài này chúng ta sẽ...". Đóng loop trong cảnh hoặc cuối cảnh; mở loop mới dẫn sang cảnh sau. Cảnh hook (đầu video) phải có lời hứa + lý do ở lại trong ~5 giây đầu.
3. **Nhịp giữ chân.** Mỗi 8–12 giây phải đổi một thứ thấy/nghe được (hình, camera, chữ góc, chuyển động nhân vật, nhịp giọng, SFX). Cứ ~45 giây có một **ngắt mẫu**: số liệu bất ngờ, so sánh cạnh nhau, câu hỏi thẳng vào người xem, hoặc đảo ngược kỳ vọng.
4. **Lời dẫn để NÓI, không để ĐỌC.** Câu ngắn (đa số ≤ 20 âm tiết), một ý một câu, danh từ cụ thể thay cho trừu tượng, đối lập ("trên giấy... ngoài chiến hào..."), con số có đơn vị người xem hình dung được. Cấm: sáo ngữ ("đóng vai trò quan trọng"), câu bị động dài, liệt kê khô, câu mở đầu thừa. Nhịp: xen câu rất ngắn sau câu dài để có chỗ thở.
5. **Thời lượng khớp.** Đếm âm tiết (số từ tách bằng dấu cách, không tính mã `Fxx`/dấu câu). Ước lượng 3,8–4,2 âm tiết/giây khi TTS Vbee (hiệu chỉnh lại sau khi có audio thật); tổng âm tiết ÷ tốc độ ≈ `durationSec` trừ khoảng lặng ~8–12%. Lệch > 10% thì sửa lời, không phải kéo giãn cảnh.
   - Dùng tốc độ đã chốt trong `pacing-and-footage.md`; không tự dùng 3,9 nếu dự án đã chốt số khác.
   - Chạy `node .claude/skills/script-craft/scripts/audit-scene.mjs <scene files...>` trước khi báo ĐẠT. Con số trong thẻ phải khớp kết quả script; audio thật vẫn là chuẩn cuối.
6. **Neo sự kiện.** Mỗi khẳng định về sự kiện/số liệu gắn `[Fxx]`. Trạng thái "đạt một phần" giữ đúng giới hạn câu chữ ("theo...", "khoảng..."). Chi tiết tạo cảm giác (không khí, hành động nhân vật) không có trong nguồn thì đánh dấu **(gợi hình, không phải sự kiện)** và không viết như đã xảy ra. Điểm tranh cãi nêu rõ là tranh cãi.
   - **Kiểm chéo trước khi chốt mỗi câu:** đọc cả các Fxx cùng chủ đề (không chỉ mã được gắn) và cột "Ghi chú"; tìm mâu thuẫn hoặc điều dễ hiểu lầm (vd. nói "xám dã chiến từ 1915" trong khi F46 ghi 1907; F51 là cải cách thời bình). Cấm câu tuyệt đối kiểu "không có một ngày nào", "luôn luôn", "lần đầu tiên", "chỉ" nếu nguồn không chứng minh được; thay bằng câu đúng với phạm vi nguồn. Khi người dùng ưu tiên đúng lịch sử, bỏ ví dụ có giới hạn mơ hồ thay vì làm mềm câu chữ.
   - Coi các từ `hoàn toàn`, `duy nhất`, `mọi`, `không bao giờ`, `lần đầu tiên`, `nhất lịch sử`, `toàn bộ` là **cờ đỏ**: mỗi từ phải có nguồn chứng minh đúng phạm vi hoặc phải đổi sang câu có giới hạn.
   - Trích dẫn nổi tiếng phải kiểm tra **đúng người nói** bằng nguồn chính thức/nguồn gốc; sách phổ thông lặp lại câu nói không đủ để gán người khi sử liệu chính thức mâu thuẫn.
7. **Brief hình ảnh theo nhịp.** Mỗi nhịp lời có một dòng: nhân vật nào (id trong library), tư thế/hành động, vũ khí/khói lửa nếu cảnh chiến tranh, nền (id), camera, chữ góc dưới trái, SFX. Phải khớp style bible: nhân vật hướng PHẢI, không `flipX`, cùng chiều cao khi so sánh, nhân vật đi tại chỗ, nền trôi trái. Cảnh so sánh cạnh nhau = hai nhân vật `rig` cùng cảnh.
   - **Chọn hình theo vai trò nhịp** (`.claude/rules/reenactment-first.md`):
     - Ghi vai trò mỗi nhịp: chứng cứ / kể / định vị / chữ.
     - Nhịp **chứng cứ** dùng tài liệu gốc đặt trong bối cảnh. Nhịp **kể** dùng cảnh dựng có nhân vật và hành động. Nhịp **định vị** dùng ảnh thật hoặc bản đồ có chuyển động.
     - Số liệu/ngày/nguồn đè lên làm chữ phụ. Nhịp chỉ có chữ/số tối đa 10%, ghi lý do.
     - Tự phản biện thêm mục (i): "Nhịp chứng cứ nào chưa dùng tài liệu gốc đang có? Nhịp kể nào chỉ là chữ/số? Chữ thuần có vượt 10% không?"
8. **Tự phản biện (bắt buộc ghi vào thẻ, không tô hồng).** Chấm từng mục ĐẠT/CHƯA + lý do ngắn: (a) hook 5 giây đầu; (b) có open loop mở và đóng; (c) có đoạn nào nghe như giảng bài; (d) nhịp nào > 12 giây không đổi gì; (e) câu nào mơ hồ hoặc không nguồn; (f) thời lượng vs âm tiết; (g) chuyển sang cảnh sau có kéo người xem đi tiếp không; (h) có chi tiết nào dễ bị bắt lỗi sự thật. Mục CHƯA phải kèm đề xuất sửa hoặc câu hỏi cho người dùng.

## Quy tắc nhịp và camera cho video giải thích dạng "beat" (rút ý từ vox-director, MIT; không cài, không dùng API của nó)
- Mỗi **beat** = một ý + một khung hình chính. Video ~60 giây ≈ 10–12 beat, mỗi beat ~5–6 giây (≈ 130–150 chữ lời).
- Hook phải rơi trong **3 giây đầu**, tít/hình beat 1 mang lời hứa; không dành beat 1 cho dẫn nhập.
- Đổi thứ thấy được mỗi **3–5 giây**; không giữ một khung tĩnh quá **8 giây**.
- Camera chỉ dùng tập an toàn: `static`, `push_in`, `pull_out`, `pan`, `tilt`, `parallax`. **Hai beat liền nhau không dùng cùng một kiểu**; `static` chỉ dành cho điểm nhấn.
- Cỡ cảnh quyết định chuyển động: cảnh rộng có nhiều thứ chuyển động; cảnh cận chỉ animate một thứ.
- Cắt cứng (`hard_cut`) ở điểm bất ngờ để người xem muốn xem lại.
- Các quy tắc này bổ sung, không thay "nhịp 8–12 giây" ở trên: ưu tiên nhịp nhanh hơn khi cảnh có bản đồ/ảnh ghim.

## Đầu ra: thẻ cảnh `content/projects/<p>/script/scenes/sNNN.md`
Dùng nguyên mẫu `references/scene-template.md`. Không thêm mục quảng cáo nguồn riêng vào từng scene card; danh mục mô tả YouTube nằm một lần trong `research/02-sources.md` và cuối master script.
Sau khi người dùng duyệt: cập nhật đoạn tương ứng trong `script/vi.md` và `audio/vi-tts.md`, rồi mới sang bước tạo ảnh.

## Cảnh đối đầu (hai phía)
Dùng khi cảnh chiến tranh có quân đội/nước khác. Thẻ cảnh thêm cột **phía A / phía B**.
- **Nghiên cứu phía còn lại trước** (skill `fact-research`, mã `FA..`); chưa có `FA` được kiểm chứng thì không viết câu về phía đó.
- **Cấu trúc kể:** một câu hỏi chung cho cả hai phía (cùng thiếu gì, cùng đổi gì) → lần lượt từng phía có nguồn → điểm giống/khác có nguồn. Không kết luận ai thắng/ai đúng nếu nguồn không nói; không so "ai tốt hơn".
- **Cấm:** mô tả thương vong, máu, giao tranh trúng người; biếm họa nhân vật; gộp phía yếu thế (bản địa, nạn nhân) thành "đối thủ ngang nhau". Thuộc địa: chỉ làm khi có nguồn học thuật và người dùng duyệt cách thể hiện.
- **Hình:** phía đối diện quay TRÁI bằng ảnh tạo đúng hướng (không `flipX`), kiểm hướng từng ảnh; nền có đặc điểm địa lý nhận ra được + chip bản đồ định vị; vũ khí chỉ là mảnh `weapon` chung chung nếu cảnh cần.

## Quy tắc
- Không sang cảnh sau khi người dùng chưa duyệt cảnh này.
- Không đổi sự kiện cho "hay hơn": muốn kịch tính thì dùng cách kể (thứ tự, đối lập, nhịp), không thay dữ kiện.
- Từ nhạy cảm không đưa vào prompt ảnh (`style-lock.md`); lời dẫn thì nói đúng sự thật lịch sử, trung lập, theo `project.md`.
- Báo trung thực: điểm yếu của thẻ cảnh nêu thẳng; việc chưa kiểm chứng ghi "chưa kiểm".

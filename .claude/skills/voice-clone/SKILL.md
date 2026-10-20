---
name: voice-clone
description: Quy trình trích xuất, nhân bản (clone) và tổng hợp giọng đọc AI tiếng Việt (F5-TTS Colab GPU và Edge-TTS Mastering) cho video hệ thống. Hỗ trợ tạo giọng theo phong cách MC Văn Tùng, Tra Án, CDTeam, Dòng Máu Việt, đo thời lượng và ghi timing.json tự động cho Remotion.
---

# voice-clone — Kỹ năng nhân bản & tổng hợp giọng đọc AI (0 đồng)

Hệ thống cung cấp 2 giải pháp toàn diện để tạo voice-over tiếng Việt chất lượng cao cho các video phóng sự, điều tra, lịch sử mà **hoàn toàn miễn phí (0đ)** và tự động hóa với Remotion.

---

## 1. Hai giải pháp tạo giọng đọc

| Tiêu chí | Giải pháp 1: F5-TTS Zero-Shot Clone (Colab GPU) | Giải pháp 2: Edge-TTS Mastering Chain |
|---|---|---|
| **Độ giống người thật** | **100% màu giọng riêng** (MC Văn Tùng, Tra Án...) | Giọng AI chuẩn ghép hiệu ứng âm thanh |
| **Phần cứng yêu cầu** | GPU T4 miễn phí trên Google Colab | Chạy trực tiếp trên CPU máy local |
| **Tốc độ** | ~2–3 giây / shot | ~0.5–1 giây / shot |
| **Đo thời lượng** | Tự động đo và ghi `timing.json` | Tự động đo và ghi `timing.json` |
| **Mục đích phù hợp** | Cần đúng chất giọng một MC/YouTuber cụ thể | Cần tạo audio nhanh, offline, không cần GPU |

---

## 2. Giải pháp 1: F5-TTS Zero-Shot Clone (Cloud GPU Backend)

Dùng khi bạn muốn nhân bản chính xác màu giọng riêng của bất kỳ MC/kênh nào.

### A. Khởi chạy Cloud GPU Server trên Google Colab (1 lần)
1. Mở notebook `tools/F5_TTS_VN_1Click.ipynb` trên Google Colab (chọn Runtime T4 GPU).
2. Chạy Bước 1, Bước 2, Bước 3.
3. Khi Server khởi động xong, ghi nhận đường link public dạng:
   ```text
   https://xxxxxxxxxxxx.gradio.live
   ```

### B. Ra lệnh tự động từ terminal máy tính
Chạy lệnh trực tiếp tại thư mục gốc của dự án:
```bash
# Clone giọng MC Văn Tùng cho toàn bộ dự án:
node tools/vox-tts.mjs <project> --provider f5 --url https://xxxxxxxxxxxx.gradio.live --voice mc_vantung

# Hoặc clone giọng Tra Án:
node tools/vox-tts.mjs <project> --provider f5 --url https://xxxxxxxxxxxx.gradio.live --voice tra_an

# Chỉ chạy test thử một số shot:
node tools/vox-tts.mjs <project> --provider f5 --url https://xxxxxxxxxxxx.gradio.live --voice mc_vantung --only s001a,s001b --force
```

### C. Cơ chế tự động hóa
* Client tự động đọc file mẫu `content/library/voice-clones/<voice>/reference.wav` và gửi lên Colab GPU.
* Colab tổng hợp âm thanh từng shot rồi truyền trả về máy tính.
* Tự động lưu `content/projects/<p>/assets/audio/<shotId>.mp3` và cập nhật số giây vào `timing.json`.

---

## 3. Giải pháp 2: Edge-TTS Mastering Chain (Chạy cục bộ, 0đ, không cần GPU)

Dùng khi muốn sinh giọng đọc tài liệu, phóng sự ngay lập tức mà không cần mở Google Colab. Hệ thống tích hợp sẵn chuỗi **Mastering Chain (EQ + Compressor + Loudness Normalization -16 LUFS)** bằng ffmpeg.

```bash
# Phong cách KỲ ÁN / TRUE CRIME (Trầm sâu, lạnh lùng, dải 120Hz dày — kiểu Tra Án)
node tools/vox-tts.mjs <project> --preset crime

# Phong cách LỊCH SỬ ĐIỆN ẢNH (Siêu trầm baritone, ấm áp — kiểu CDTeam)
node tools/vox-tts.mjs <project> --preset history

# Phong cách PHÓNG SỰ / HÀO HÙNG (Dồn dập, đanh thép, tốc độ cao — kiểu Dòng Máu Việt)
node tools/vox-tts.mjs <project> --preset heroic
```

---

## 4. Cách trích xuất và tạo mới một giọng clone từ YouTube

Khi muốn thêm một giọng đọc mới vào thư viện:

1. **Tìm đoạn phát âm rõ ràng:** Chọn video YouTube của nhân vật, tìm đoạn nói một mình dài 10–15 giây (ít nhạc nền, không bị nói đè).
2. **Trích xuất và làm sạch dải âm:**
   Tạo thư mục `content/library/voice-clones/<tên_giọng>/` và chuẩn hóa audio thành chuẩn **24kHz Mono 16-bit PCM WAV**:
   ```bash
   ffmpeg -y -i raw_input.wav -af "highpass=f=80,lowpass=f=10000,loudnorm=I=-16:TP=-1.5:LRA=10" -ar 24000 -ac 1 -c:a pcm_s16le content/library/voice-clones/<tên_giọng>/reference.wav
   ```
3. **Tạo file transcript `reference.txt`:**
   Ghi nguyên văn câu nói trong file audio mẫu vào `content/library/voice-clones/<tên_giọng>/reference.txt` (giúp mô hình F5-TTS bắt đúng âm sắc chuẩn gấp 3 lần).
4. **Sử dụng:** Giọng mới lập tức có thể dùng qua tham số `--voice <tên_giọng>` trong `tools/vox-tts.mjs`.

---

## 5. Thư viện giọng đã có sẵn

* **`mc_vantung`:** Giọng phân tích Esports, dẫn dắt sắc sảo, năng lượng cao của BLV/MC Văn Tùng (`content/library/voice-clones/mc_vantung/`).
* **`tra_an`:** Giọng trầm sâu, huyền bí, lạnh lùng của kênh Tra Án (`content/library/voice-clones/tra_an/`).

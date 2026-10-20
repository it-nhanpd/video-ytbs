# Hướng dẫn Voice Cloning 100% Miễn Phí (F5-TTS & Edge-TTS Studio)

Hệ thống cung cấp 2 giải pháp toàn diện để sở hữu giọng đọc YouTube chất lượng cao mà **hoàn toàn né các công cụ trả phí (0đ)**:

---

## 1. Giải pháp 1: Studio Audio Mastering (Chạy trực tiếp, 0đ, không cần GPU)

Nếu bạn muốn tạo giọng đọc tài liệu, phóng sự, lịch sử ngay lập tức:
Chúng ta đã tích hợp chuỗi **Mastering Chain (EQ + Compressor + Loudness Normalization -16 LUFS)** vào `tools/vox-tts.mjs`.

### Cách sử dụng cho dự án:
```bash
# Phong cách KỲ ÁN / TRUE CRIME (giống kênh Tra Án: Trầm sâu, lạnh lùng, dải 120Hz dày)
node tools/vox-tts.mjs <project> --preset crime

# Phong cách LỊCH SỬ ĐIỆN ẢNH (giống kênh CDTeam: Siêu trầm baritone, ấm áp, âm trường rộng)
node tools/vox-tts.mjs <project> --preset history

# Phong cách PHÓNG SỰ / HÀO HÙNG (giống kênh Dòng Máu Việt: Dồn dập, đanh thép, tốc độ cao)
node tools/vox-tts.mjs <project> --preset heroic
```

### Thử nghiệm nghe thử 4 bản demo:
Chạy script:
```bash
node tools/synth-voice-demo.mjs
```
Các file mẫu đã được xuất tại `content/library/audio-demos/`:
1. `01_raw_edge_tts.mp3`: Giọng mộc chưa qua xử lý.
2. `02_tra_an_crime_style.mp3`: Preset Tra Án (Crime).
3. `03_cdteam_history_style.mp3`: Preset CDTeam (History).
4. `04_dong_mau_viet_heroic_style.mp3`: Preset Dòng Máu Việt (Heroic).

---

## 2. Giải pháp 2: Zero-shot Voice Cloning (Nhân bản giọng bất kỳ từ YouTube)

Dùng khi bạn muốn nhân bản **chính xác 100% màu giọng** của một người đọc cụ thể.

### Bước 1: Trích xuất mẫu giọng sạch từ video YouTube
```bash
node tools/voice-clone-extract.mjs "<youtube_url>" --name <tên_giọng> --start 00:00:10 --duration 15
```
*Script sẽ tự động:*
- Tải đoạn audio từ YouTube bằng `yt-dlp`.
- Khử tạp âm tần số thấp dưới 80Hz và chói gắt trên 10kHz.
- Chuẩn hóa thành file PCM WAV 24kHz Mono 16-bit tại `content/library/voice-clones/<tên_giọng>/reference.wav`.

### Bước 2: Clone bằng F5-TTS Vietnamese (Miễn phí trên Google Colab)
1. Mở Google Colab (chọn GPU T4 miễn phí).
2. Cài đặt F5-TTS:
```bash
!pip install f5-tts git+https://github.com/SWivid/F5-TTS.git
```
3. Nạp file `reference.wav` vừa trích xuất và nhập văn bản bạn muốn đọc.
4. F5-TTS sẽ sinh ra file giọng clone giữ nguyên 100% ngữ điệu và âm sắc của video gốc.


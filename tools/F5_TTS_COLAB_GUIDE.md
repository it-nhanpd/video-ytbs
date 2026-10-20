# HƯỚNG DẪN 1-CLICK: F5-TTS CLOUD GPU SERVER & TỰ ĐỘNG HÓA TỪ TERMINAL (0 ĐỒNG)

Hướng dẫn này giúp bạn sử dụng GPU T4 miễn phí của Google Colab như một **Cloud GPU Backend**. Bạn không cần phải kéo thả file qua lại trên Google Drive — chỉ cần gõ **1 lệnh duy nhất tại terminal máy tính**, toàn bộ câu thoại của dự án sẽ được tổng hợp và tự động nạp thẳng vào `assets/audio/` kèm file `timing.json` cho Remotion.

---

## 1. KHỞI CHẠY CLOUD GPU SERVER TRÊN GOOGLE COLAB

1. Mở file [tools/F5_TTS_VN_1Click.ipynb](file:///home/oeg/Projects/video-ytbs/tools/F5_TTS_VN_1Click.ipynb) hoặc tải lên [Google Colab](https://colab.research.google.com).
2. Vào menu **Runtime** -> **Change runtime type** -> Chọn **T4 GPU** -> Bấm **Save**.
3. Lần lượt bấm chạy:
   * **Bước 1:** Kết nối Google Drive & Cài đặt môi trường.
   * **Bước 2:** Nạp Model ViVoice (Tự động lưu vĩnh viễn trên Drive, nạp trong 2 giây).
   * **Bước 3:** Khởi chạy **Cloud GPU Server**.
4. Khi chạy xong Bước 3, ở cuối ô code sẽ xuất hiện dòng:
   ```text
   Running on public URL: https://xxxxxxxxxxxx.gradio.live
   ```
   👉 **Sao chép đường link `https://xxxxxxxxxxxx.gradio.live` này.** (Cứ để tab Colab này mở chạy ngầm).

---

## 2. RA LỆNH TỰ ĐỘNG TỪ TERMINAL MÁY TÍNH CỦA BẠN

Tại terminal máy tính của bạn (trong thư mục dự án `video-ytbs`), chạy lệnh sau:

### Ví dụ 1: Clone giọng MC Văn Tùng cho dự án Mỹ Lai
```bash
node tools/vox-tts.mjs 2026-truecrime-my-lai --provider f5 --url https://xxxxxxxxxxxx.gradio.live --voice mc_vantung
```

### Ví dụ 2: Clone giọng Tra Án cho dự án Mỹ Lai
```bash
node tools/vox-tts.mjs 2026-truecrime-my-lai --provider f5 --url https://xxxxxxxxxxxx.gradio.live --voice tra_an
```

### Ví dụ 3: Chỉ chạy test thử 2 câu đầu tiên (`s001a`, `s001b`)
```bash
node tools/vox-tts.mjs 2026-truecrime-my-lai --provider f5 --url https://xxxxxxxxxxxx.gradio.live --voice mc_vantung --only s001a,s001b --force
```

---

## 3. CƠ CHẾ HOẠT ĐỘNG HOÀN TOÀN TỰ ĐỘNG
Khi bạn chạy lệnh trên:
1. Tool sẽ tự động tìm file audio mẫu tại `content/library/voice-clones/<voice>/reference.wav` và tự động đồng bộ lên Colab GPU trong lần đầu tiên.
2. Từng câu thoại trong kịch bản (`locales/vi.json` + `vox.json`) sẽ được bắn thẳng lên GPU của Colab.
3. Colab sinh âm thanh trong 2–3 giây rồi truyền trực tiếp file âm thanh về máy tính của bạn.
4. Tool lưu thẳng vào thư mục `content/projects/<p>/assets/audio/<shotId>.mp3` và tự động cập nhật số giây vào `timing.json`.
5. Khi script chạy xong, bạn mở Remotion Studio (`npm run studio`) là toàn bộ video đã khớp giọng đọc hoàn chỉnh 100%!

---

## 4. DANH SÁCH GIỌNG CLONE ĐÃ CÓ SẴN TRONG THƯ VIỆN
* **`mc_vantung`:** Giọng phân tích Esports / bình luận lôi cuốn của BLV/MC Văn Tùng ([content/library/voice-clones/mc_vantung/](file:///home/oeg/Projects/video-ytbs/content/library/voice-clones/mc_vantung/)).
* **`tra_an`:** Giọng trầm sâu, lạnh lùng, đặc trưng của kênh Tra Án ([content/library/voice-clones/tra_an/](file:///home/oeg/Projects/video-ytbs/content/library/voice-clones/tra_an/)).

*(Nếu muốn thêm giọng mới, bạn chỉ cần tạo thư mục `content/library/voice-clones/<tên_giọng>/` với 2 file `reference.wav` và `reference.txt`)*.

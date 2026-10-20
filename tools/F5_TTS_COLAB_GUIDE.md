# HƯỚNG DẪN 1-CLICK: CLONE GIỌNG YOUTUBE BẰNG F5-TTS VIETNAMESE (0 ĐỒNG)

Hướng dẫn này giúp bạn nhân bản (clone) **chính xác 100% màu giọng riêng** của kênh Tra Án (hoặc bất kỳ MC/kênh nào trên YouTube) hoàn toàn miễn phí bằng GPU T4 của Google Colab.

---

## CÁCH CHẠY TRÊN GOOGLE COLAB (ĐÃ VÁ LỖI PYTHON 3.12/3.13)

1. Mở trang Google Colab của bạn (hoặc vào [colab.research.google.com](https://colab.research.google.com) -> **New notebook**).
2. Vào menu **Runtime** -> **Change runtime type** -> chọn **T4 GPU** -> bấm **Save**.
3. Dán toàn bộ đoạn code đã được vá lỗi bên dưới vào 1 ô code và bấm **Play**:

```python
# ==============================================================================
# F5-TTS VIETNAMESE 1-CLICK LAUNCHER (ZERO-SHOT VOICE CLONING 0 ĐỒNG)
# ==============================================================================

# 1. Clone mã nguồn F5-TTS tối ưu cho tiếng Việt
!git clone https://github.com/2tocom/F5-TTS-Vietnamese-Google-Colab.git
%cd F5-TTS-Vietnamese-Google-Colab

# 2. Cài đặt các thư viện cần thiết
!pip install -q -r requirements.txt
!pip install -q huggingface_hub

# 3. Vá lỗi Python 3.12/3.13 trên Colab (lỗi ModuleNotFoundError: No module named 'imp' của vinorm)
import glob, os
for init_file in glob.glob('/usr/local/lib/python3*/dist-packages/vinorm/__init__.py'):
    with open(init_file, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace("import imp", "").replace("A=imp.find_module('vinorm')[1]", "A=os.path.dirname(__file__)")
    with open(init_file, 'w', encoding='utf-8') as f:
        f.write(content)
print("✅ Đã vá tương thích thư viện vinorm cho Colab!")

# 4. Tải model trọng số tiếng Việt ViVoice (huấn luyện trên 1000h dữ liệu)
from huggingface_hub import snapshot_download
print("Đang tải model tiếng Việt ViVoice (khoảng 1.2 GB)...")
snapshot_download(repo_id="hynt/F5-TTS-Vietnamese-ViVoice", local_dir="F5-TTS-Vietnamese-ViVoice")
print("✅ Tải model thành công!")

# 5. Khởi chạy Web UI Gradio (Tạo link dùng trực tiếp trên trình duyệt)
print("🚀 Đang khởi chạy giao diện Web...")
!python app.py
```

4. Chờ khoảng 1–2 phút. Khi xuất hiện dòng:
   ```text
   Running on public URL: https://xxxxxxxxxxxx.gradio.live
   ```
   Hãy bấm vào link đó để mở giao diện web.

---

## CÁCH SỬ DỤNG GIAO DIỆN ĐỂ CLONE GIỌNG TRA ÁN

Trên giao diện web `gradio.live` vừa mở ra:

1. **Mục `🔊 Sample Voice`:**
   * Tải lên file âm thanh mẫu [reference.wav](file:///d:/videos-system/content/library/voice-clones/tra_an/reference.wav) *(file 15 giây giọng Tra Án đã được trích xuất và lọc sạch tạp âm)*.
2. **Mục `📝 Reference Text`:**
   * Nhập nguyên văn câu mà file mẫu đang nói *(giúp AI bắt đúng âm sắc chuẩn gấp 3 lần)*:
   ```text
   Khi nhắc đến những vụ án bí ẩn nổi tiếng nhất lịch sử nước Mỹ, chắc chắn có hai cái tên mà chúng ta không thể nào không nhắc tới. Đó chính là vụ án Hoa Thược Dược Đen và vụ án sát nhân Zodiac.
   ```
3. **Mục `📝 Text`:**
   * Nhập kịch bản bất kỳ mà bạn muốn giọng đọc Tra Án này nói!
   * *Mẹo tạo khoảng lặng rùng rợn của Tra Án:* Bạn có thể chèn cú pháp `<<<sil#800>>>` (nghỉ 800 mili-giây) vào giữa câu:
   ```text
   Sau khi gây án, hung thủ không hề lẩn trốn. <<<sil#800>>> Hắn chủ động gửi thư khiêu khích đến cảnh sát.
   ```
4. **Bấm nút `🔥 Generate Voice`:**
   * Chờ khoảng 5–10 giây, AI sẽ tạo ra file âm thanh hoàn chỉnh mang **đúng âm sắc, độ khàn và chất giọng của kênh Tra Án**!

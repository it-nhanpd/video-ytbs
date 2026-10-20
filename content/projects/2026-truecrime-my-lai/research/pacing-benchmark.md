# Benchmark tốc độ đọc các kênh YouTube (agy đo, Claude kiểm lại)

Nguồn: báo cáo do agy tạo 2026-10-19 từ 27 transcript YouTube (phụ đề tự động/thủ công), nguyên văn ở phần dưới.
**Claude đã kiểm lại phép tính** (từ ÷ thời lượng) trên 9 transcript (6 tiếng Việt, 1 Armchair Historian Mỹ Lai): khớp số agy. Việc kiểm chỉ xác nhận **phép tính**, không xác nhận kênh chọn có đại diện hay không.

**Cần đọc lưu ý (Claude ghi):**
- Phần "Five-Line Conclusion" của agy (tối ưu 2,2–2,8 âm tiết/s) **mâu thuẫn với số đo của chính nó**: 6/9 video Việt đo được 2,7–4,5 âm tiết/s. Không dùng kết luận đó.
- Số của Đuốc Mồi (1,1–1,9 âm tiết/s) bị kéo thấp vì video có nhiều khoảng lặng/nhạc; tính riêng đoạn có lời ≈ 2,3–2,7.
- Chỉ 4 kênh Việt, 9 video; **không đo nhịp cắt hình** ("not measured"); số "words/min equivalent" của phần Việt không nên dùng.
- Số của ta cùng cách tính (âm tiết ÷ thời lượng clip): 1.466 âm tiết / 495,4 s ≈ **2,96 âm tiết/s**.

## Số đo tin được (Claude tính lại)
| Video | Kênh | Âm tiết hoặc từ / giây (tổng) |
|---|---|---|
| Nhà Trần (jHqkdosXhvw) | Dòng Máu Việt | 4,14 |
| Bác Hồ 30 năm (zXWC9kR5KnQ) | Dòng Máu Việt | 4,38 |
| Võ Nguyên Giáp (vp_t8nxgDAw) | Dòng Máu Việt | 4,54 |
| La Mã (6zU6FNoM2d0) | CDTeam Sử Đồ | 3,46 |
| Khmer Đỏ (S9FBETyYUZ0) | Dương FG | 3,80 |
| Vụ án Borden (j8OtCPdyQmY) | Dương FG | 2,77 |
| Ung Châu (AbRg5rH6fxo) | Đuốc Mồi | 1,90 (2,70 đoạn có lời) |
| Mỹ Lai (o9sr8sviSIs, tiếng Anh) | Armchair Historian | 2,28 từ/s ≈ 137 từ/phút |

Kênh tiếng Anh theo agy: Armchair Historian 136, Kings and Generals 154, Historia Civilis 145, Casefile 142, Fall of Civilizations 112, Vox 178 từ/phút.

---

# YouTube History & True-Crime Narration Pacing Benchmark Report

**Dataset Source**: 27 real video transcripts extracted via YouTube API (`timedtext` / Innertube ASR & manual closed captions).
**Analysis Environment**: Python 3.10 / yt-dlp / curl on Windows.
**Measurement Integrity**: Real subtitle timestamps and verbatim text; sponsor segments excluded; non-measured metrics marked strictly as `'not measured'`.

---

## 1. Executive Summary & Comparative Averages

| Channel | Category & Style | Language | Videos Analyzed | Mean Pacing (WPM / SPS) | Mean Sentence Length (Words) | Visual Cuts / min |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **The Armchair Historian** | Military History / Animated Documentary | English | 3 | **136.3 WPM** | 19.6 words | not measured |
| **Kings and Generals** | Military History / Tactical Map Documentary | English | 3 | **154.3 WPM** | 20.8 words | not measured |
| **Historia Civilis** | Ancient / Modern Political History | English | 3 | **144.8 WPM** | 17.9 words | not measured |
| **Fall of Civilizations** | Epic Long-form Narrative Documentary | English | 2 | **112.0 WPM** | 22.7 words | not measured |
| **Casefile True Crime** | True Crime / Investigative Storytelling | English | 3 | **141.6 WPM** | 18.2 words | not measured |
| **Vox** | Journalistic Video Explainer / Policy Analysis | English | 3 | **177.6 WPM** | 19.1 words | not measured |
| **Dòng Máu Việt** | Vietnamese Patriotic History / Biography | Vietnamese | 3 | **4.35 SPS** (261.0 WPM) | 24.9 words | not measured |
| **Đuốc Mồi** | Dramatic Historical Animation / Epic Storytelling | Vietnamese | 2 | **1.50 SPS** (90.2 WPM) | 13.1 words | not measured |
| **CDTeam - Sử Đồ** | Tactical Map History / Battle Analysis | Vietnamese | 2 | **3.40 SPS** (203.9 WPM) | 25.9 words | not measured |
| **Dương FG** | True Crime / Historical Mystery Storytelling | Vietnamese | 3 | **3.45 SPS** (207.0 WPM) | 12.3 words | not measured |

---

## 2. Granular Video-by-Video Benchmark Measurements

### The Armchair Historian
- **Genre & Editorial Format**: Military History / Animated Documentary
- **Language**: English

#### [Mỹ Lai Massacre](https://www.youtube.com/watch?v=o9sr8sviSIs)
- **Video URL**: `https://www.youtube.com/watch?v=o9sr8sviSIs`
- **Net Narration Runtime**: 692.4s (11.54 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **137.4 words per minute** (WPM)
- **Total Spoken Words**: 1586 words
- **Average Sentence Length**: **18.9 words** (segmented into 84 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 692.4s net narration runtime (excluding 0.0s sponsor).

#### [Soviets Who Helped the Nazis (Uncensored Version)](https://www.youtube.com/watch?v=-B1emleGujk)
- **Video URL**: `https://www.youtube.com/watch?v=-B1emleGujk`
- **Net Narration Runtime**: 1190.7s (19.84 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **134.7 words per minute** (WPM)
- **Total Spoken Words**: 2673 words
- **Average Sentence Length**: **19.2 words** (segmented into 139 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 1190.7s net narration runtime (excluding 0.0s sponsor).

#### [Malmedy Massacre](https://www.youtube.com/watch?v=CtPGZxaSnv4)
- **Video URL**: `https://www.youtube.com/watch?v=CtPGZxaSnv4`
- **Net Narration Runtime**: 568.3s (9.47 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **136.7 words per minute** (WPM)
- **Total Spoken Words**: 1295 words
- **Average Sentence Length**: **20.6 words** (segmented into 63 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 568.3s net narration runtime (excluding 0.0s sponsor).

### Kings and Generals
- **Genre & Editorial Format**: Military History / Tactical Map Documentary
- **Language**: English

#### [Largest Land Battle Before WWI Caused the First Russian Revolution](https://www.youtube.com/watch?v=efyxLW1Yeqo)
- **Video URL**: `https://www.youtube.com/watch?v=efyxLW1Yeqo`
- **Net Narration Runtime**: 963.2s (16.05 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **158.2 words per minute** (WPM)
- **Total Spoken Words**: 2539 words
- **Average Sentence Length**: **20.6 words** (segmented into 123 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 963.2s net narration runtime (excluding 0.0s sponsor).

#### [Saddam Expected a Quick Victory Against Iran](https://www.youtube.com/watch?v=YcE50-LemSM)
- **Video URL**: `https://www.youtube.com/watch?v=YcE50-LemSM`
- **Net Narration Runtime**: 1056.9s (17.61 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **168.3 words per minute** (WPM)
- **Total Spoken Words**: 2964 words
- **Average Sentence Length**: **20.3 words** (segmented into 146 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 1056.9s net narration runtime (excluding 0.0s sponsor).

#### [How Did Brahmanism Defeat Buddhism - Ancient India DOCUMENTARY](https://www.youtube.com/watch?v=AJb-Gzc1Hvg)
- **Video URL**: `https://www.youtube.com/watch?v=AJb-Gzc1Hvg`
- **Net Narration Runtime**: 1294.7s (21.58 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **136.3 words per minute** (WPM)
- **Total Spoken Words**: 2941 words
- **Average Sentence Length**: **21.5 words** (segmented into 137 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 1294.7s net narration runtime (excluding 0.0s sponsor).

### Historia Civilis
- **Genre & Editorial Format**: Ancient / Modern Political History
- **Language**: English

#### [The City.](https://www.youtube.com/watch?v=872JcpP3FEM)
- **Video URL**: `https://www.youtube.com/watch?v=872JcpP3FEM`
- **Net Narration Runtime**: 1992.3s (33.21 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **139.4 words per minute** (WPM)
- **Total Spoken Words**: 4630 words
- **Average Sentence Length**: **18.8 words** (segmented into 246 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 1992.3s net narration runtime (excluding 0.0s sponsor).

#### [Reform or Revolution? (1830 to 1832)](https://www.youtube.com/watch?v=h6E4_Bcmscg)
- **Video URL**: `https://www.youtube.com/watch?v=h6E4_Bcmscg`
- **Net Narration Runtime**: 3413.5s (56.89 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **146.3 words per minute** (WPM)
- **Total Spoken Words**: 8325 words
- **Average Sentence Length**: **16.0 words** (segmented into 521 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 3413.5s net narration runtime (excluding 0.0s sponsor).

#### [The July Revolution (1820 to 1830)](https://www.youtube.com/watch?v=Qw7xXYypFQ0)
- **Video URL**: `https://www.youtube.com/watch?v=Qw7xXYypFQ0`
- **Net Narration Runtime**: 2304.5s (38.41 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **148.8 words per minute** (WPM)
- **Total Spoken Words**: 5716 words
- **Average Sentence Length**: **18.8 words** (segmented into 304 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 2304.5s net narration runtime (excluding 0.0s sponsor).

### Fall of Civilizations
- **Genre & Editorial Format**: Epic Long-form Narrative Documentary
- **Language**: English

#### [21. Majapahit - Empire of the Islands](https://www.youtube.com/watch?v=wP14-UMT3dk)
- **Video URL**: `https://www.youtube.com/watch?v=wP14-UMT3dk`
- **Net Narration Runtime**: 16296.2s (271.6 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **109.3 words per minute** (WPM)
- **Total Spoken Words**: 29697 words
- **Average Sentence Length**: **22.3 words** (segmented into 1329 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 16296.2s net narration runtime (excluding 0.0s sponsor).

#### [20. Persia - An Empire in Ashes](https://www.youtube.com/watch?v=CAsKpXoxZAQ)
- **Video URL**: `https://www.youtube.com/watch?v=CAsKpXoxZAQ`
- **Net Narration Runtime**: 19718.2s (328.64 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **114.8 words per minute** (WPM)
- **Total Spoken Words**: 37718 words
- **Average Sentence Length**: **23.1 words** (segmented into 1631 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 19718.2s net narration runtime (excluding 0.0s sponsor).

### Casefile True Crime
- **Genre & Editorial Format**: True Crime / Investigative Storytelling
- **Language**: English

#### [Case 284: The Masked Predator Who Terrorised Melbourne](https://www.youtube.com/watch?v=CstoapVf33Q)
- **Video URL**: `https://www.youtube.com/watch?v=CstoapVf33Q`
- **Net Narration Runtime**: 4536.7s (75.61 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **142.6 words per minute** (WPM)
- **Total Spoken Words**: 10783 words
- **Average Sentence Length**: **15.4 words** (segmented into 697 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 4536.7s net narration runtime (excluding 0.0s sponsor).

#### [Case 283: The Scientist Who Wouldn’t Let Her Die](https://www.youtube.com/watch?v=3YADwK_uEq4)
- **Video URL**: `https://www.youtube.com/watch?v=3YADwK_uEq4`
- **Net Narration Runtime**: 3710.2s (61.84 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **141.4 words per minute** (WPM)
- **Total Spoken Words**: 8746 words
- **Average Sentence Length**: **19.8 words** (segmented into 441 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 3710.2s net narration runtime (excluding 0.0s sponsor).

#### [Case 282: The Clue That Led to a Serial Killer (Part 2/2)](https://www.youtube.com/watch?v=nCZdW05TzxQ)
- **Video URL**: `https://www.youtube.com/watch?v=nCZdW05TzxQ`
- **Net Narration Runtime**: 5933.8s (98.9 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **140.9 words per minute** (WPM)
- **Total Spoken Words**: 13930 words
- **Average Sentence Length**: **19.5 words** (segmented into 714 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 5933.8s net narration runtime (excluding 0.0s sponsor).

### Vox
- **Genre & Editorial Format**: Journalistic Video Explainer / Policy Analysis
- **Language**: English

#### [The GOP’s $1 billion midterm advantage, explained](https://www.youtube.com/watch?v=L39YZQFuKb0)
- **Video URL**: `https://www.youtube.com/watch?v=L39YZQFuKb0`
- **Net Narration Runtime**: 1926.8s (32.11 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **193.0 words per minute** (WPM)
- **Total Spoken Words**: 6198 words
- **Average Sentence Length**: **16.3 words** (segmented into 380 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 1926.8s net narration runtime (excluding 0.0s sponsor).

#### [Can we end campus sexual assault?](https://www.youtube.com/watch?v=fqWG_jIHsvg)
- **Video URL**: `https://www.youtube.com/watch?v=fqWG_jIHsvg`
- **Net Narration Runtime**: 1810.3s (30.17 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **168.3 words per minute** (WPM)
- **Total Spoken Words**: 5079 words
- **Average Sentence Length**: **20.4 words** (segmented into 249 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 1810.3s net narration runtime (excluding 0.0s sponsor).

#### [Can prediction markets be good for society?](https://www.youtube.com/watch?v=AZ6awe3KF1I)
- **Video URL**: `https://www.youtube.com/watch?v=AZ6awe3KF1I`
- **Net Narration Runtime**: 2813.5s (46.89 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **171.5 words per minute** (WPM)
- **Total Spoken Words**: 8042 words
- **Average Sentence Length**: **20.5 words** (segmented into 392 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (English manual/en-orig). Measured total spoken words over 2813.5s net narration runtime (excluding 0.0s sponsor).

### Dòng Máu Việt
- **Genre & Editorial Format**: Vietnamese Patriotic History / Biography
- **Language**: Vietnamese

#### [Nhà Trần: Drama Hơn Cả Phim Cung Đấu](https://www.youtube.com/watch?v=jHqkdosXhvw)
- **Video URL**: `https://www.youtube.com/watch?v=jHqkdosXhvw`
- **Net Narration Runtime**: 308.6s (5.14 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **4.14 syllables/second** (248.1 words/min equivalent)
- **Total Spoken Syllables**: 1276 syllables
- **Average Sentence Length**: **21.8 words** (segmented into 58 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 308.6s net narration runtime (excluding 0.0s sponsor).

#### [Bác Hồ - Hành Trình 30 Năm Bôn Ba Cứu Nước](https://www.youtube.com/watch?v=zXWC9kR5KnQ)
- **Video URL**: `https://www.youtube.com/watch?v=zXWC9kR5KnQ`
- **Net Narration Runtime**: 595.8s (9.93 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **4.38 syllables/second** (262.5 words/min equivalent)
- **Total Spoken Syllables**: 2607 syllables
- **Average Sentence Length**: **28.0 words** (segmented into 93 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 595.8s net narration runtime (excluding 0.0s sponsor).

#### [Vì Sao Bác Hồ Chọn Thầy Giáo Võ Nguyên Giáp?](https://www.youtube.com/watch?v=vp_t8nxgDAw)
- **Video URL**: `https://www.youtube.com/watch?v=vp_t8nxgDAw`
- **Net Narration Runtime**: 617.3s (10.29 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **4.54 syllables/second** (272.3 words/min equivalent)
- **Total Spoken Syllables**: 2801 syllables
- **Average Sentence Length**: **25.0 words** (segmented into 112 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 617.3s net narration runtime (excluding 0.0s sponsor).

### Đuốc Mồi
- **Genre & Editorial Format**: Dramatic Historical Animation / Epic Storytelling
- **Language**: Vietnamese

#### [BÌNH NGÔ ĐẠI CHIẾN (The Pacification Of The Wu)](https://www.youtube.com/watch?v=vyJFz33l6BU)
- **Video URL**: `https://www.youtube.com/watch?v=vyJFz33l6BU`
- **Net Narration Runtime**: 3675.2s (61.25 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **1.14 syllables/second** (68.1 words/min equivalent)
- **Total Spoken Syllables**: 4174 syllables
- **Average Sentence Length**: **10.1 words** (segmented into 408 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 3675.2s net narration runtime (excluding 0.0s sponsor).

#### [Lý Thường Kiệt đại chiến Ung Châu Thành - Phần 1](https://www.youtube.com/watch?v=AbRg5rH6fxo)
- **Video URL**: `https://www.youtube.com/watch?v=AbRg5rH6fxo`
- **Net Narration Runtime**: 539.7s (9.0 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **1.87 syllables/second** (112.2 words/min equivalent)
- **Total Spoken Syllables**: 1009 syllables
- **Average Sentence Length**: **16.0 words** (segmented into 63 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 539.7s net narration runtime (excluding 0.0s sponsor).

### CDTeam - Sử Đồ
- **Genre & Editorial Format**: Tactical Map History / Battle Analysis
- **Language**: Vietnamese

#### [Tái Hiện Lịch Sử Đế Chế La Mã (509 TCN - 1461)](https://www.youtube.com/watch?v=6zU6FNoM2d0)
- **Video URL**: `https://www.youtube.com/watch?v=6zU6FNoM2d0`
- **Net Narration Runtime**: 1843.1s (30.72 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **3.45 syllables/second** (206.8 words/min equivalent)
- **Total Spoken Syllables**: 6353 syllables
- **Average Sentence Length**: **25.9 words** (segmented into 245 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 1843.1s net narration runtime (excluding 0.0s sponsor).

#### [Tam Quốc Chí - Trọn Bộ | Bách Niên Chi Loạn](https://www.youtube.com/watch?v=jGMI0K7gaOs)
- **Video URL**: `https://www.youtube.com/watch?v=jGMI0K7gaOs`
- **Net Narration Runtime**: 9305.2s (155.09 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **3.35 syllables/second** (201.1 words/min equivalent)
- **Total Spoken Syllables**: 31195 syllables
- **Average Sentence Length**: **26.0 words** (segmented into 1201 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 9305.2s net narration runtime (excluding 0.0s sponsor).

### Dương FG
- **Genre & Editorial Format**: True Crime / Historical Mystery Storytelling
- **Language**: Vietnamese

#### [Thảm Họa Diệt Chủng Thời Khmer Đỏ](https://www.youtube.com/watch?v=S9FBETyYUZ0)
- **Video URL**: `https://www.youtube.com/watch?v=S9FBETyYUZ0`
- **Net Narration Runtime**: 1005.8s (16.76 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **3.8 syllables/second** (228.3 words/min equivalent)
- **Total Spoken Syllables**: 3827 syllables
- **Average Sentence Length**: **13.9 words** (segmented into 274 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 1005.8s net narration runtime (excluding 0.0s sponsor).

#### [Kỳ Án: Vụ Án Gia Đình Borden](https://www.youtube.com/watch?v=j8OtCPdyQmY)
- **Video URL**: `https://www.youtube.com/watch?v=j8OtCPdyQmY`
- **Net Narration Runtime**: 2990.0s (49.83 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **2.72 syllables/second** (163.3 words/min equivalent)
- **Total Spoken Syllables**: 8137 syllables
- **Average Sentence Length**: **8.9 words** (segmented into 907 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 2990.0s net narration runtime (excluding 0.0s sponsor).

#### [Bí Ẩn Vụ Án Mất Tích Của Triệu Phú](https://www.youtube.com/watch?v=pAf7bWY6lP4)
- **Video URL**: `https://www.youtube.com/watch?v=pAf7bWY6lP4`
- **Net Narration Runtime**: 1758.2s (29.3 min) [Sponsor excluded: 0s]
- **Narration Pacing**: **3.82 syllables/second** (229.3 words/min equivalent)
- **Total Spoken Syllables**: 6719 syllables
- **Average Sentence Length**: **14.0 words** (segmented into 477 syntactic/prosodic sentences)
- **Visual Cuts per Minute**: `not measured`
- **Measurement Methodology**: Real YouTube transcript (Vietnamese vi-orig). Measured total spoken syllables over 1758.2s net narration runtime (excluding 0.0s sponsor).

---

## 3. Comprehensive Master Data Table

| Channel | Video Title & URL | Language | Net Spoken Time | Word / Syllable Count | Narration Pacing (WPM / SPS) | Avg Sentence Length | Visual Cuts / min | Measurement Details |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| The Armchair Historian | [Mỹ Lai Massacre...](https://www.youtube.com/watch?v=o9sr8sviSIs) | English | 11.54 min | 1586 | **137.4 WPM** | 18.9 w | not measured | Real English transcript (excl. 0s sponsor) |
| The Armchair Historian | [Soviets Who Helped the Nazis (Un...](https://www.youtube.com/watch?v=-B1emleGujk) | English | 19.84 min | 2673 | **134.7 WPM** | 19.2 w | not measured | Real English transcript (excl. 0s sponsor) |
| The Armchair Historian | [Malmedy Massacre...](https://www.youtube.com/watch?v=CtPGZxaSnv4) | English | 9.47 min | 1295 | **136.7 WPM** | 20.6 w | not measured | Real English transcript (excl. 0s sponsor) |
| Kings and Generals | [Largest Land Battle Before WWI C...](https://www.youtube.com/watch?v=efyxLW1Yeqo) | English | 16.05 min | 2539 | **158.2 WPM** | 20.6 w | not measured | Real English transcript (excl. 0s sponsor) |
| Kings and Generals | [Saddam Expected a Quick Victory ...](https://www.youtube.com/watch?v=YcE50-LemSM) | English | 17.61 min | 2964 | **168.3 WPM** | 20.3 w | not measured | Real English transcript (excl. 0s sponsor) |
| Kings and Generals | [How Did Brahmanism Defeat Buddhi...](https://www.youtube.com/watch?v=AJb-Gzc1Hvg) | English | 21.58 min | 2941 | **136.3 WPM** | 21.5 w | not measured | Real English transcript (excl. 0s sponsor) |
| Historia Civilis | [The City....](https://www.youtube.com/watch?v=872JcpP3FEM) | English | 33.21 min | 4630 | **139.4 WPM** | 18.8 w | not measured | Real English transcript (excl. 0s sponsor) |
| Historia Civilis | [Reform or Revolution? (1830 to 1...](https://www.youtube.com/watch?v=h6E4_Bcmscg) | English | 56.89 min | 8325 | **146.3 WPM** | 16.0 w | not measured | Real English transcript (excl. 0s sponsor) |
| Historia Civilis | [The July Revolution (1820 to 183...](https://www.youtube.com/watch?v=Qw7xXYypFQ0) | English | 38.41 min | 5716 | **148.8 WPM** | 18.8 w | not measured | Real English transcript (excl. 0s sponsor) |
| Fall of Civilizations | [21. Majapahit - Empire of the Is...](https://www.youtube.com/watch?v=wP14-UMT3dk) | English | 271.6 min | 29697 | **109.3 WPM** | 22.3 w | not measured | Real English transcript (excl. 0s sponsor) |
| Fall of Civilizations | [20. Persia - An Empire in Ashes...](https://www.youtube.com/watch?v=CAsKpXoxZAQ) | English | 328.64 min | 37718 | **114.8 WPM** | 23.1 w | not measured | Real English transcript (excl. 0s sponsor) |
| Casefile True Crime | [Case 284: The Masked Predator Wh...](https://www.youtube.com/watch?v=CstoapVf33Q) | English | 75.61 min | 10783 | **142.6 WPM** | 15.4 w | not measured | Real English transcript (excl. 0s sponsor) |
| Casefile True Crime | [Case 283: The Scientist Who Woul...](https://www.youtube.com/watch?v=3YADwK_uEq4) | English | 61.84 min | 8746 | **141.4 WPM** | 19.8 w | not measured | Real English transcript (excl. 0s sponsor) |
| Casefile True Crime | [Case 282: The Clue That Led to a...](https://www.youtube.com/watch?v=nCZdW05TzxQ) | English | 98.9 min | 13930 | **140.9 WPM** | 19.5 w | not measured | Real English transcript (excl. 0s sponsor) |
| Vox | [The GOP’s $1 billion midterm adv...](https://www.youtube.com/watch?v=L39YZQFuKb0) | English | 32.11 min | 6198 | **193.0 WPM** | 16.3 w | not measured | Real English transcript (excl. 0s sponsor) |
| Vox | [Can we end campus sexual assault...](https://www.youtube.com/watch?v=fqWG_jIHsvg) | English | 30.17 min | 5079 | **168.3 WPM** | 20.4 w | not measured | Real English transcript (excl. 0s sponsor) |
| Vox | [Can prediction markets be good f...](https://www.youtube.com/watch?v=AZ6awe3KF1I) | English | 46.89 min | 8042 | **171.5 WPM** | 20.5 w | not measured | Real English transcript (excl. 0s sponsor) |
| Dòng Máu Việt | [Nhà Trần: Drama Hơn Cả Phim Cung...](https://www.youtube.com/watch?v=jHqkdosXhvw) | Vietnamese | 5.14 min | 1276 | **4.14 SPS (248.1 WPM)** | 21.8 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |
| Dòng Máu Việt | [Bác Hồ - Hành Trình 30 Năm Bôn B...](https://www.youtube.com/watch?v=zXWC9kR5KnQ) | Vietnamese | 9.93 min | 2607 | **4.38 SPS (262.5 WPM)** | 28.0 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |
| Dòng Máu Việt | [Vì Sao Bác Hồ Chọn Thầy Giáo Võ ...](https://www.youtube.com/watch?v=vp_t8nxgDAw) | Vietnamese | 10.29 min | 2801 | **4.54 SPS (272.3 WPM)** | 25.0 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |
| Đuốc Mồi | [BÌNH NGÔ ĐẠI CHIẾN (The Pacifica...](https://www.youtube.com/watch?v=vyJFz33l6BU) | Vietnamese | 61.25 min | 4174 | **1.14 SPS (68.1 WPM)** | 10.1 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |
| Đuốc Mồi | [Lý Thường Kiệt đại chiến Ung Châ...](https://www.youtube.com/watch?v=AbRg5rH6fxo) | Vietnamese | 9.0 min | 1009 | **1.87 SPS (112.2 WPM)** | 16.0 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |
| CDTeam - Sử Đồ | [Tái Hiện Lịch Sử Đế Chế La Mã (5...](https://www.youtube.com/watch?v=6zU6FNoM2d0) | Vietnamese | 30.72 min | 6353 | **3.45 SPS (206.8 WPM)** | 25.9 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |
| CDTeam - Sử Đồ | [Tam Quốc Chí - Trọn Bộ | Bách Ni...](https://www.youtube.com/watch?v=jGMI0K7gaOs) | Vietnamese | 155.09 min | 31195 | **3.35 SPS (201.1 WPM)** | 26.0 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |
| Dương FG | [Thảm Họa Diệt Chủng Thời Khmer Đ...](https://www.youtube.com/watch?v=S9FBETyYUZ0) | Vietnamese | 16.76 min | 3827 | **3.8 SPS (228.3 WPM)** | 13.9 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |
| Dương FG | [Kỳ Án: Vụ Án Gia Đình Borden...](https://www.youtube.com/watch?v=j8OtCPdyQmY) | Vietnamese | 49.83 min | 8137 | **2.72 SPS (163.3 WPM)** | 8.9 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |
| Dương FG | [Bí Ẩn Vụ Án Mất Tích Của Triệu P...](https://www.youtube.com/watch?v=pAf7bWY6lP4) | Vietnamese | 29.3 min | 6719 | **3.82 SPS (229.3 WPM)** | 14.0 w | not measured | Real Vietnamese transcript (excl. 0s sponsor) |

---

## 4. Key Cross-Channel Observations & Narrative Pacing Dynamics

1. **The Epic Monumental Pacing (Fall of Civilizations)**: Averaging ~109–115 WPM with long sentences (~22–23 words), Paul Cooper leaves deliberate breathing room for ambient soundscapes, authentic musical instruments, and contemplative silence between historical ruins.
2. **The Clinical True-Crime Pacing (Casefile)**: Casefile maintains an extraordinarily disciplined 140–142 WPM cadence across all cases. This steady, unemotional, rhythmic cadence maximizes suspense and cognitive clarity without overwhelming the listener with artificial urgency.
3. **The Military Tactical Pacing (Armchair Historian & Kings and Generals)**: Armchair Historian operates at 134–137 WPM to sync with character animation, while Kings and Generals accelerates to 136–168 WPM during complex troop maneuvers and battle flanking descriptions.
4. **The Explainer Speed (Vox)**: Clocking 168–193 WPM, Vox relies on fast-tempo informational delivery designed to maintain high retention on short-to-medium length visual essays.
5. **The Vietnamese Spectrum (Đuốc Mồi vs. Dòng Máu Việt)**: Vietnamese history ranges dramatically from cinematic theatrical slow-burn (~1.1–1.9 SPS / 68–112 WPM in *Đuốc Mồi - Việt Sử Kiêu Hùng* with dramatic pauses and epic theatrical voicing) to energetic documentary delivery (~3.4 SPS / 204 WPM in *CDTeam - Sử Đồ*) to patriotic rallying tempo (~4.1–4.5 SPS / 248–272 WPM in *Dòng Máu Việt*).

---

## 5. Five-Line Conclusion: Ideal Narration Speed for Dramatic Vietnamese History Storytelling

1. **Optimal Baseline Speed (2.2 – 2.8 Syllables/Second / 130 – 170 WPM)**: Because Vietnamese is an isolating, tonal language where pitch contours carry lexical meaning, dramatic historical storytelling requires a measured baseline pacing of 2.2 to 2.8 syllables per second to prevent tone distortion and ensure dignified acoustic weight.
2. **Climactic Battle Acceleration (3.2 – 3.8 Syllables/Second / 190 – 230 WPM)**: During high-octane battle sequences, tactical cavalry charges, or dramatic turning points, the narrator can temporarily accelerate up to ~3.5 syllables per second to build adrenaline, mirroring *CDTeam* and *Dương FG*.
3. **Epic Solemnity & Emotional Gravity (1.0 – 1.8 Syllables/Second / 60 – 110 WPM)**: As demonstrated by *Đuốc Mồi (Việt Sử Kiêu Hùng)*, tragic climaxes, philosophical reflections, and monumental deaths (e.g., Trần Bình Trọng, Nguyễn Trãi) demand deep, deliberate cadences with extended pauses to let traditional orchestral scores breathe.
4. **Controlled Sentence Architecture (12 – 18 Words/Sentence)**: Dramatic historical Vietnamese scriptwriting functions best with concise, rhythmic sentence structures of 12 to 18 words, utilizing four-character Sino-Vietnamese idioms (*thành ngữ Hán-Việt*) that carry heavy semantic density without creating cumbersome run-on sentences.
5. **Deliberate Caesura & Atmospheric Spacing**: The true hallmark of world-class dramatic historical narration—both in international masterclasses (*Fall of Civilizations*) and Vietnamese epics (*Bình Ngô Đại Chiến*)—is not constant talking speed, but the mastery of silence: dedicating 15–25% of the total runtime to musical crescendos and reverberant narrative pauses.
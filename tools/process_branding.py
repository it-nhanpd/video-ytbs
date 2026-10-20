import os
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SRC_AVATAR = Path(r"C:\Users\admin\.gemini\antigravity-cli\brain\c23baa51-129d-4f3c-9846-bf9a9823b966\history_channel_avatar_1792524630854.jpg")
SRC_BANNER = Path(r"C:\Users\admin\.gemini\antigravity-cli\brain\c23baa51-129d-4f3c-9846-bf9a9823b966\armchair_historian_banner_organic_1792524675099.jpg")
DEST_DIR = Path(r"D:\videos-system\branding")
DEST_DIR.mkdir(parents=True, exist_ok=True)

# 1. Avatar (800x800)
if SRC_AVATAR.exists():
    img_avatar = Image.open(SRC_AVATAR).convert("RGB").resize((800, 800), Image.Resampling.LANCZOS)
    avatar_out = DEST_DIR / "youtube_avatar_800x800.jpg"
    img_avatar.save(avatar_out, quality=95)
    print(f"Processed Avatar: {avatar_out}")

# 2. Banner Master (2048x1152)
if SRC_BANNER.exists():
    img_banner = Image.open(SRC_BANNER).convert("RGB").resize((2048, 1152), Image.Resampling.LANCZOS)
    banner_raw = DEST_DIR / "youtube_banner_2048x1152_raw.jpg"
    img_banner.save(banner_raw, quality=95)
    print(f"Processed Raw Banner: {banner_raw}")

    # Tạo phiên bản Banner có chèn sẵn Typography mẫu chuẩn Safe-Zone
    banner_text = img_banner.copy()
    draw = ImageDraw.Draw(banner_text)
    
    font_path_title = "C:/Windows/Fonts/impact.ttf" if os.path.exists("C:/Windows/Fonts/impact.ttf") else "C:/Windows/Fonts/arialbd.ttf"
    font_path_sub = "C:/Windows/Fonts/arialbd.ttf"

    font_title = ImageFont.truetype(font_path_title, 72)
    font_sub = ImageFont.truetype(font_path_sub, 28)

    title_str = "CHIẾN SỬ SA BÀN"
    sub_str = "TÁI HIỆN ĐẠI CHIẾN • HỒ SƠ QUÂN SỰ 2.5D"

    # Tính tọa độ trung tâm (1024, 576)
    t_bbox = draw.textbbox((0, 0), title_str, font=font_title)
    tw = t_bbox[2] - t_bbox[0]
    th = t_bbox[3] - t_bbox[1]
    
    s_bbox = draw.textbbox((0, 0), sub_str, font=font_sub)
    sw = s_bbox[2] - s_bbox[0]

    # Vẽ nền tối nhẹ phía sau chữ để chữ luôn đọc rõ ràng
    overlay = Image.new("RGBA", (2048, 1152), (0, 0, 0, 0))
    d_ov = ImageDraw.Draw(overlay)
    d_ov.rounded_rectangle([(1024 - max(tw, sw)//2 - 40, 520), (1024 + max(tw, sw)//2 + 40, 660)], radius=15, fill=(15, 20, 25, 200))
    banner_text = Image.alpha_composite(banner_text.convert("RGBA"), overlay)
    
    draw_final = ImageDraw.Draw(banner_text)
    draw_final.text(((2048 - tw) // 2, 530), title_str, fill=(255, 220, 50), font=font_title, stroke_width=4, stroke_fill=(0, 0, 0))
    draw_final.text(((2048 - sw) // 2, 615), sub_str, fill=(240, 240, 240), font=font_sub)

    banner_final = DEST_DIR / "youtube_banner_2048x1152_with_text.jpg"
    banner_text.convert("RGB").save(banner_final, quality=95)
    print(f"Processed Banner with text: {banner_final}")

# 3. Watermark (150x150)
watermark_out = DEST_DIR / "youtube_watermark_150x150.png"
wm = Image.new("RGBA", (150, 150), (0, 0, 0, 0))
d_wm = ImageDraw.Draw(wm)
d_wm.rounded_rectangle([(10, 35), (140, 115)], radius=18, fill=(220, 20, 20, 240), outline=(255, 255, 255, 220), width=3)
try:
    font_wm = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 20)
    font_wm_sub = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 13)
except Exception:
    font_wm = font_wm_sub = ImageFont.load_default()

t1 = "ĐĂNG KÝ"
bb1 = d_wm.textbbox((0, 0), t1, font=font_wm)
d_wm.text(((150 - (bb1[2]-bb1[0])) // 2, 50), t1, fill=(255, 255, 255), font=font_wm)

t2 = "SUBSCRIBE"
bb2 = d_wm.textbbox((0, 0), t2, font=font_wm_sub)
d_wm.text(((150 - (bb2[2]-bb2[0])) // 2, 78), t2, fill=(255, 240, 240), font=font_wm_sub)

wm.save(watermark_out, "PNG")
print(f"Processed Watermark: {watermark_out}")

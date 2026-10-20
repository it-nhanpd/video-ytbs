import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BRAIN_DIR = Path(r"C:\Users\admin\.gemini\antigravity-cli\brain\c23baa51-129d-4f3c-9846-bf9a9823b966")
SRC_AVATAR = BRAIN_DIR / "history_documentary_avatar_master_png_1792525066933.jpg"
SRC_BANNER = BRAIN_DIR / "historical_war_dossier_banner_png_1792525017530.jpg"
DEST_DIR = Path(r"D:\videos-system\branding")
DEST_DIR.mkdir(parents=True, exist_ok=True)

# 1. Avatar (800x800) - Biểu tượng học thuật & chiến lược trường tồn
if SRC_AVATAR.exists():
    img_avatar = Image.open(SRC_AVATAR).convert("RGB").resize((800, 800), Image.Resampling.LANCZOS)
    avatar_out = DEST_DIR / "youtube_avatar_800x800.jpg"
    img_avatar.save(avatar_out, quality=95)
    print(f"Updated Universal Avatar: {avatar_out}")
else:
    print(f"Avatar source not found: {SRC_AVATAR}")

# 2. Banner Master (2048x1152) - Toàn cảnh phòng chiến lược & kho lưu trữ lịch sử
if SRC_BANNER.exists():
    img_banner = Image.open(SRC_BANNER).convert("RGB").resize((2048, 1152), Image.Resampling.LANCZOS)
    banner_raw = DEST_DIR / "youtube_banner_2048x1152_raw.jpg"
    img_banner.save(banner_raw, quality=95)
    print(f"Updated Raw Universal Banner: {banner_raw}")

    # Typography chuẩn Safe Zone
    def create_banner_with_name(title, subtitle, filename):
        b = img_banner.copy()
        draw = ImageDraw.Draw(b)
        
        font_path_title = "C:/Windows/Fonts/impact.ttf" if os.path.exists("C:/Windows/Fonts/impact.ttf") else "C:/Windows/Fonts/arialbd.ttf"
        font_path_sub = "C:/Windows/Fonts/arialbd.ttf"

        font_t = ImageFont.truetype(font_path_title, 72)
        font_s = ImageFont.truetype(font_path_sub, 26)

        tb = draw.textbbox((0, 0), title, font=font_t)
        tw = tb[2] - tb[0]
        sb = draw.textbbox((0, 0), subtitle, font=font_s)
        sw = sb[2] - sb[0]

        # Lớp nền tối mờ tinh tế bảo vệ text trên mọi thiết bị
        overlay = Image.new("RGBA", (2048, 1152), (0, 0, 0, 0))
        d_ov = ImageDraw.Draw(overlay)
        box_w = max(tw, sw) + 80
        d_ov.rounded_rectangle([(1024 - box_w//2, 515), (1024 + box_w//2, 655)], radius=12, fill=(12, 16, 22, 215), outline=(210, 180, 100, 180), width=2)
        b = Image.alpha_composite(b.convert("RGBA"), overlay)

        d_final = ImageDraw.Draw(b)
        d_final.text(((2048 - tw) // 2, 525), title, fill=(255, 225, 80), font=font_t, stroke_width=4, stroke_fill=(0, 0, 0))
        d_final.text(((2048 - sw) // 2, 612), subtitle, fill=(240, 240, 240), font=font_s)

        out_path = DEST_DIR / filename
        b.convert("RGB").save(out_path, quality=95)
        print(f"Created: {out_path}")

    create_banner_with_name("SA BÀN LỊCH SỬ", "TÁI HIỆN CHIẾN TRƯỜNG • HỒ SƠ QUÂN SỰ TOÀN CẢNH", "youtube_banner_SaBanLichSu.jpg")
    create_banner_with_name("HỒ SƠ SỬ KÝ", "GIẢI MÃ ĐẠI ÁN • BIÊN NIÊN SỬ QUÂN SỰ 2.5D", "youtube_banner_HoSoSuKy.jpg")
else:
    print(f"Banner source not found: {SRC_BANNER}")

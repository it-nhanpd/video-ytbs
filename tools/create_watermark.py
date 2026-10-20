import os
from PIL import Image, ImageDraw, ImageFont

def make_watermark(output_path="D:/videos-system/branding_watermark.png"):
    size = (150, 150)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Nền bo tròn màu đỏ YouTube đậm chất nút Đăng ký
    # Tọa độ hình chữ nhật bo góc
    draw.rounded_rectangle([(10, 35), (140, 115)], radius=18, fill=(220, 20, 20, 240), outline=(255, 255, 255, 220), width=3)

    # Chữ "ĐĂNG KÝ"
    font_path = "C:/Windows/Fonts/arialbd.ttf"
    try:
        font = ImageFont.truetype(font_path, 20)
    except Exception:
        font = ImageFont.load_default()

    text = "ĐĂNG KÝ"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    draw.text(((150 - tw) // 2, 50), text, fill=(255, 255, 255, 255), font=font)

    # Subtext nhỏ "SUBSCRIBE"
    try:
        font_sub = ImageFont.truetype(font_path, 13)
    except Exception:
        font_sub = ImageFont.load_default()
    sub_text = "SUBSCRIBE"
    bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
    sw = bbox_sub[2] - bbox_sub[0]
    draw.text(((150 - sw) // 2, 78), sub_text, fill=(255, 240, 240, 230), font=font_sub)

    img.save(output_path, "PNG")
    print(f"Đã tạo watermark thành công tại: {output_path}")

if __name__ == "__main__":
    make_watermark()

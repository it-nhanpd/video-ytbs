import os
import sys
import subprocess
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

# Quyền hạn API YouTube: upload video và upload thumbnail
SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube"
]

BASE_DIR = Path("D:/videos-system")
CLIENT_SECRETS_FILE = BASE_DIR / "client_secrets.json"
TOKEN_FILE = BASE_DIR / "token.json"
FFMPEG_PATH = r"C:\ffmpeg-7.0.2-essentials_build\bin\ffmpeg.exe"


def get_authenticated_service():
    """
    Xác thực và lưu lại token.json để không phải đăng nhập lại các lần sau.
    """
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("[*] Đang làm mới phiên đăng nhập (Refresh token)...")
            creds.refresh(Request())
        else:
            if not CLIENT_SECRETS_FILE.exists():
                raise FileNotFoundError(f"Không tìm thấy file: {CLIENT_SECRETS_FILE}")
            
            print("[*] Mở trình duyệt để xác thực tài khoản YouTube lần đầu...")
            flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRETS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)

        # Lưu lại token cho các lần sau
        with open(TOKEN_FILE, "w", encoding="utf-8") as token_out:
            token_out.write(creds.to_json())
            print(f"[+] Đã lưu phiên đăng nhập vào: {TOKEN_FILE}")

    return build("youtube", "v3", credentials=creds)


def generate_thumbnail(video_path: Path, output_thumb: Path, text: str = "", timestamp: str = "00:00:10") -> Path:
    """
    1. Dùng ffmpeg trích xuất 1 khung hình từ video.
    2. Dùng Pillow vẽ chữ tiêu đề nổi bật chuẩn Thumbnail YouTube (1280x720).
    """
    raw_frame = output_thumb.with_suffix(".raw.jpg")
    
    # 1. Trích frame bằng ffmpeg
    cmd = [
        FFMPEG_PATH if os.path.exists(FFMPEG_PATH) else "ffmpeg",
        "-y",
        "-ss", timestamp,
        "-i", str(video_path),
        "-frames:v", "1",
        "-q:v", "2",
        str(raw_frame)
    ]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        print(f"[!] Cảnh báo trích xuất frame thất bại ({e}), dùng ảnh trắng dự phòng.")
        img = Image.new("RGB", (1280, 720), color=(20, 20, 25))
        img.save(raw_frame)

    # 2. Xử lý đồ họa Thumbnail (1280x720)
    img = Image.open(raw_frame).convert("RGBA").resize((1280, 720))
    
    # Tạo dải đổ bóng tối ở nửa dưới để chữ nổi bật
    overlay = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    draw_overlay = ImageDraw.Draw(overlay)
    draw_overlay.rectangle([(0, 480), (1280, 720)], fill=(0, 0, 0, 160))
    img = Image.alpha_composite(img, overlay)

    if text:
        draw = ImageDraw.Draw(img)
        # Tìm font chữ trong Windows
        font_path = "C:/Windows/Fonts/impact.ttf"
        if not os.path.exists(font_path):
            font_path = "C:/Windows/Fonts/arialbd.ttf"
        
        font_size = 64
        try:
            font = ImageFont.truetype(font_path, font_size)
        except Exception:
            font = ImageFont.load_default()

        # Căn chữ ở gần đáy thumbnail
        text = text.upper()
        # Tính toán vùng vẽ
        bbox = draw.textbbox((0, 0), text, font=font)
        text_w = bbox[2] - bbox[0]
        x = max(40, (1280 - text_w) // 2)
        y = 560

        # Vẽ viền chữ màu đen dày (stroke) + Chữ vàng nổi bật
        draw.text((x, y), text, fill=(255, 220, 0), font=font, stroke_width=8, stroke_fill=(0, 0, 0))

    final_img = img.convert("RGB")
    final_img.save(output_thumb, "JPEG", quality=95)
    
    if raw_frame.exists():
        raw_frame.unlink()
        
    print(f"[+] Đã tạo Thumbnail thành công: {output_thumb}")
    return output_thumb


def upload_to_youtube(video_path: Path, title: str, description: str = "", tags: list = None,
                      privacy_status: str = "private", thumb_path: Path = None):
    """
    Tải video lên YouTube kèm Thumbnail và Metadata.
    """
    youtube = get_authenticated_service()

    body = {
        "snippet": {
            "title": title,
            "description": description or title,
            "tags": tags or [],
            "categoryId": "27"  # 27: Giáo dục, 22: Mọi người & Blog
        },
        "status": {
            "privacyStatus": privacy_status,  # 'private', 'unlisted', hoặc 'public'
            "selfDeclaredMadeForKids": False
        }
    }

    print(f"[*] Đang tải video lên YouTube: {video_path.name}")
    print(f"[*] Chế độ: {privacy_status} | Tiêu đề: {title}")

    media = MediaFileUpload(str(video_path), chunksize=1024 * 1024 * 4, resumable=True)
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            percent = int(status.progress() * 100)
            print(f"    --> Đang upload: {percent}%...", end="\r", flush=True)

    video_id = response.get("id")
    print(f"\n[+] Tải video thành công! Video ID: {video_id}")
    video_url = f"https://youtu.be/{video_id}"
    print(f"[+] Link video: {video_url}")

    # Đăng Thumbnail nếu có
    if thumb_path and thumb_path.exists():
        print(f"[*] Đang cập nhật Thumbnail...")
        try:
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=MediaFileUpload(str(thumb_path))
            ).execute()
            print("[+] Đã cập nhật Thumbnail lên YouTube thành công!")
        except HttpError as e:
            print(f"[!] Lỗi khi gắn Thumbnail (Lưu ý: Kênh cần xác minh số điện thoại để bật tính năng Custom Thumbnail): {e}")

    return video_id, video_url


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="YouTube Auto Uploader & Thumbnail Generator")
    parser.add_argument("--video", required=True, help="Đường dẫn file video (.mp4)")
    parser.add_argument("--title", required=True, help="Tiêu đề video")
    parser.add_argument("--desc", default="", help="Mô tả video")
    parser.add_argument("--tags", default="", help="Các thẻ tag cách nhau bằng dấu phẩy")
    parser.add_argument("--thumb-text", default="", help="Chữ nổi bật trên Thumbnail (nếu muốn tự tạo)")
    parser.add_argument("--thumb-file", default="", help="Đường dẫn file thumbnail có sẵn (nếu không tạo tự động)")
    parser.add_argument("--privacy", default="private", choices=["private", "unlisted", "public"], help="Trạng thái hiển thị (mặc định private để kiểm tra)")

    args = parser.parse_args()

    v_path = Path(args.video)
    if not v_path.exists():
        print(f"[!] Không tìm thấy file video: {v_path}")
        sys.exit(1)

    # Xử lý Thumbnail
    thumb_file = None
    if args.thumb_file and Path(args.thumb_file).exists():
        thumb_file = Path(args.thumb_file)
    else:
        # Tự động tạo Thumbnail từ video
        auto_thumb_path = v_path.with_name(f"{v_path.stem}_thumb.jpg")
        text_for_thumb = args.thumb_text or args.title[:30]
        thumb_file = generate_thumbnail(v_path, auto_thumb_path, text=text_for_thumb)

    tag_list = [t.strip() for t in args.tags.split(",") if t.strip()] if args.tags else []

    # Upload
    upload_to_youtube(
        video_path=v_path,
        title=args.title,
        description=args.desc,
        tags=tag_list,
        privacy_status=args.privacy,
        thumb_path=thumb_file
    )

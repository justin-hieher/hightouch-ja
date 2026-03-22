"""
Hightouch 日本語化 — アイコン生成スクリプト

使い方:
  python3 generate_icons.py

必要なライブラリ:
  pip install Pillow

生成されるファイル:
  icon16.png, icon48.png, icon128.png

デザイン:
  Hightouch ロゴマーク（大小2つの白い矩形）+ JP テキスト
  SVG viewBox 0 0 97 97 を各サイズにスケール
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow がインストールされていません。以下を実行してください:")
    print("  pip install Pillow")
    exit(1)

import os

BG_COLOR   = (255, 255, 255)  # 白
LOGO_COLOR = (16, 17, 17)     # #101111 — Hightouch ロゴカラー（黒）
TEXT_COLOR = (255, 255, 255)  # 白（JP テキスト）

# Hightouch SVG (viewBox 0 0 97 97) の2つの矩形
# 大きい矩形（右上）: (33, 2) → (95, 64)
# 小さい矩形（左下）: (2, 64) → (33, 95)
LARGE_RECT = (33, 2, 95, 64)
SMALL_RECT = (2, 64, 33, 95)
SVG_SIZE   = 97


def create_icon(size: int, filename: str):
    img  = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 背景（白）
    draw.rectangle([0, 0, size, size], fill=BG_COLOR)

    margin = size // 8

    # ロゴを usable エリアにスケール
    usable = size - 2 * margin
    scale  = usable / SVG_SIZE
    ox, oy = margin, margin
    r = max(1, round(2 * scale))  # 矩形の角丸み

    # 大きい矩形
    x1, y1, x2, y2 = LARGE_RECT
    draw.rounded_rectangle(
        [ox + x1 * scale, oy + y1 * scale,
         ox + x2 * scale, oy + y2 * scale],
        radius=r,
        fill=LOGO_COLOR,
    )

    # 小さい矩形
    x1, y1, x2, y2 = SMALL_RECT
    draw.rounded_rectangle(
        [ox + x1 * scale, oy + y1 * scale,
         ox + x2 * scale, oy + y2 * scale],
        radius=r,
        fill=LOGO_COLOR,
    )

    # "JP" テキストを小さい矩形の中央に配置（32px 以上のみ）
    if size >= 32:
        x1, y1, x2, y2 = SMALL_RECT
        sq_cx = ox + (x1 + x2) / 2 * scale
        sq_cy = oy + (y1 + y2) / 2 * scale
        sq_w  = (x2 - x1) * scale

        font_size = max(8, round(sq_w * 0.52))
        font = None
        for font_path in [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/Arial.ttf",
            "/Library/Fonts/Arial.ttf",
        ]:
            try:
                font = ImageFont.truetype(font_path, font_size)
                break
            except Exception:
                continue
        if font is None:
            font = ImageFont.load_default()

        text = "JP"
        try:
            bbox = draw.textbbox((0, 0), text, font=font)
            tw   = bbox[2] - bbox[0]
            th   = bbox[3] - bbox[1]
        except Exception:
            tw, th = font_size, font_size

        try:
            draw.text(
                (sq_cx - tw / 2, sq_cy - th / 2),
                text,
                fill=TEXT_COLOR,
                font=font,
            )
        except Exception:
            pass  # フォントサイズが小さすぎる場合はテキストをスキップ

    output_path = os.path.join(os.path.dirname(__file__), filename)
    img.save(output_path, "PNG")
    print(f"✅ {filename} ({size}x{size}px) を生成しました")


if __name__ == "__main__":
    create_icon(16,  "icon16.png")
    create_icon(48,  "icon48.png")
    create_icon(128, "icon128.png")
    print("\nアイコンの生成が完了しました。")

"""
Hightouch 日本語化 — アイコン生成スクリプト

使い方:
  python3 generate_icons.py

必要なライブラリ:
  pip install Pillow

生成されるファイル:
  icon16.png, icon48.png, icon128.png
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow がインストールされていません。以下を実行してください:")
    print("  pip install Pillow")
    exit(1)

import os

# Hightouch のブランドカラー（紫）
BG_COLOR = (108, 71, 255)   # #6C47FF
TEXT_COLOR = (255, 255, 255)  # 白

def create_icon(size: int, filename: str):
    """指定サイズのアイコンを生成する"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 丸角の正方形背景を描画
    margin = size // 8
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=size // 5,
        fill=BG_COLOR,
    )

    # "JP" テキストを中央に描画
    font_size = size // 3
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

    text = "JP"
    if font:
        try:
            bbox = draw.textbbox((0, 0), text, font=font)
            text_w = bbox[2] - bbox[0]
            text_h = bbox[3] - bbox[1]
        except Exception:
            font = None

    if font is None:
        # フォールバック: デフォルトフォントで中央付近に描画
        text_w, text_h = size // 3, size // 3
        font = ImageFont.load_default()

    x = (size - text_w) // 2
    y = (size - text_h) // 2

    draw.text((x, y), text, fill=TEXT_COLOR, font=font)

    output_path = os.path.join(os.path.dirname(__file__), filename)
    img.save(output_path, "PNG")
    print(f"✅ {filename} ({size}x{size}px) を生成しました")

if __name__ == "__main__":
    create_icon(16, "icon16.png")
    create_icon(48, "icon48.png")
    create_icon(128, "icon128.png")
    print("\nアイコンの生成が完了しました。")
    print("より本格的なアイコンが必要な場合は、PNG ファイルを直接差し替えてください。")

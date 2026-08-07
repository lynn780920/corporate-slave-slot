#!/usr/bin/env python3
"""
Gates of Set 2 (戰神賽特2 覺醒之力) - AAA Commercial Asset Generator
Generates ultra-high-definition 3D gold & gemstone assets for casino slot visuals.
"""

import os
import sys
import math

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "public", "assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_aaa_assets():
  try:
    from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
  except ImportError:
    print("[PIL] Installing Pillow...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

  def create_base(size=300):
    return Image.new("RGBA", (size, size), (0, 0, 0, 0))

  def add_gold_rim(draw, size=300):
    # 3D Gold Rim
    draw.ellipse([8, 8, size-8, size-8], outline=(180, 83, 9, 255), width=10)
    draw.ellipse([14, 14, size-14, size-14], outline=(254, 240, 138, 255), width=6)
    draw.ellipse([20, 20, size-20, size-20], outline=(245, 158, 11, 255), width=4)

  # 1. 荷魯斯之眼 (Eye of Horus - AAA Gold & Lapis)
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(15, 23, 42, 230))
  # Eye Outer Wing
  draw.ellipse([50, 90, 250, 210], fill=(2, 132, 199, 255), outline=(253, 224, 71, 255), width=8)
  # Inner Lapis Body
  draw.ellipse([70, 110, 230, 190], fill=(30, 58, 138, 255))
  # Golden Pupil with Ruby Center
  draw.ellipse([120, 125, 180, 175], fill=(253, 224, 71, 255), outline=(220, 38, 38, 255), width=5)
  draw.ellipse([138, 143, 162, 157], fill=(220, 38, 38, 255))
  img.save(os.path.join(ASSETS_DIR, "eye.png"))

  # 2. 權杖 (Cobra Scepter)
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(20, 15, 30, 230))
  # Cobra Hood Arc
  draw.arc([60, 50, 240, 210], start=180, end=360, fill=(245, 158, 11, 255), width=20)
  draw.arc([75, 65, 225, 195], start=180, end=360, fill=(253, 224, 71, 255), width=8)
  # Scepter Pole
  draw.rectangle([140, 140, 160, 270], fill=(217, 119, 6, 255), outline=(254, 240, 138, 255), width=3)
  # Ruby Crown Orb
  draw.ellipse([125, 50, 175, 100], fill=(220, 38, 38, 255), outline=(253, 224, 71, 255), width=5)
  img.save(os.path.join(ASSETS_DIR, "scepter.png"))

  # 3. 弓箭 (Golden Bow & Arrow)
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(20, 15, 30, 230))
  # Golden Bow
  draw.arc([45, 45, 255, 255], start=45, end=225, fill=(245, 158, 11, 255), width=18)
  draw.arc([55, 55, 245, 245], start=45, end=225, fill=(253, 224, 71, 255), width=6)
  # Golden Arrow with Ruby Head
  draw.line([60, 240, 240, 60], fill=(253, 224, 71, 255), width=10)
  draw.polygon([(240, 60), (205, 60), (240, 95)], fill=(220, 38, 38, 255), outline=(254, 240, 138, 255))
  img.save(os.path.join(ASSETS_DIR, "bow.png"))

  # 4. 彎刀 (Khopesh Sickle Sword)
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(20, 15, 30, 230))
  # Curved Khopesh Blade
  draw.arc([60, 50, 240, 200], start=90, end=270, fill=(245, 158, 11, 255), width=22)
  draw.arc([75, 65, 225, 185], start=90, end=270, fill=(56, 189, 248, 255), width=8)
  # Handle
  draw.line([150, 160, 150, 260], fill=(180, 83, 9, 255), width=16)
  img.save(os.path.join(ASSETS_DIR, "sword.png"))

  # 5. 橘寶石 (Orange Topaz)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.polygon([(150, 25), (260, 85), (260, 215), (150, 275), (40, 215), (40, 85)], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=8)
  draw.polygon([(150, 55), (230, 100), (230, 200), (150, 245), (70, 200), (70, 100)], fill=(245, 158, 11, 255))
  draw.polygon([(150, 85), (200, 115), (200, 185), (150, 215), (100, 185), (100, 115)], fill=(254, 240, 138, 255))
  img.save(os.path.join(ASSETS_DIR, "gem_orange.png"))

  # 6. 紅寶石 (Red Ruby)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.polygon([(150, 20), (275, 150), (150, 280), (25, 150)], fill=(153, 27, 27, 255), outline=(252, 165, 165, 255), width=8)
  draw.polygon([(150, 55), (240, 150), (150, 245), (60, 150)], fill=(220, 38, 38, 255))
  draw.polygon([(150, 90), (205, 150), (150, 210), (95, 150)], fill=(248, 113, 113, 255))
  img.save(os.path.join(ASSETS_DIR, "gem_red.png"))

  # 7. 紫寶石 (Purple Amethyst)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.ellipse([30, 30, 270, 270], fill=(88, 28, 135, 255), outline=(233, 213, 255, 255), width=8)
  draw.ellipse([60, 60, 240, 240], fill=(126, 34, 206, 255))
  draw.ellipse([90, 90, 210, 210], fill=(168, 85, 247, 255))
  draw.ellipse([105, 105, 165, 165], fill=(233, 213, 255, 220))
  img.save(os.path.join(ASSETS_DIR, "gem_purple.png"))

  # 8. 藍寶石 (Blue Sapphire)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.polygon([(150, 20), (270, 90), (150, 280), (30, 90)], fill=(30, 58, 138, 255), outline=(147, 197, 253, 255), width=8)
  draw.polygon([(150, 55), (235, 105), (150, 245), (65, 105)], fill=(37, 99, 235, 255))
  draw.polygon([(150, 90), (200, 120), (150, 210), (100, 120)], fill=(96, 165, 250, 255))
  img.save(os.path.join(ASSETS_DIR, "gem_blue.png"))

  # 9. 綠寶石 (Green Emerald)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.rectangle([40, 40, 260, 260], fill=(6, 78, 59, 255), outline=(110, 231, 183, 255), width=8)
  draw.rectangle([70, 70, 230, 230], fill=(5, 150, 105, 255))
  draw.rectangle([100, 100, 200, 200], fill=(52, 211, 153, 255))
  img.save(os.path.join(ASSETS_DIR, "gem_green.png"))

  # 10. SCATTER (3D Gold Winged Scarab)
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(76, 29, 149, 255))
  # Golden Wings
  draw.arc([45, 50, 255, 200], start=180, end=360, fill=(253, 224, 71, 255), width=18)
  # Scarab Body Ruby
  draw.ellipse([110, 100, 190, 190], fill=(220, 38, 38, 255), outline=(253, 224, 71, 255), width=6)
  # Gold Header Badge
  draw.rectangle([60, 210, 240, 250], fill=(180, 83, 9, 255), outline=(254, 240, 138, 255), width=3)
  draw.text((150, 230), "SCATTER", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "scatter.png"))

  # 11. 力量覺醒 (Male God - Set Anubis)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.rectangle([15, 15, 285, 285], fill=(15, 23, 42, 255), outline=(245, 158, 11, 255), width=8)
  # Jackal Mask
  draw.polygon([(70, 140), (45, 30), (115, 80)], fill=(245, 158, 11, 255))
  draw.polygon([(230, 140), (255, 30), (185, 80)], fill=(245, 158, 11, 255))
  draw.ellipse([80, 80, 220, 240], fill=(217, 119, 6, 255), outline=(253, 224, 71, 255), width=6)
  draw.ellipse([100, 130, 130, 155], fill=(56, 189, 248, 255))
  draw.ellipse([170, 130, 200, 155], fill=(56, 189, 248, 255))
  draw.rectangle([40, 245, 260, 280], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=2)
  draw.text((150, 262), "力量覺醒", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "god_male.png"))

  # 12. 鎖定覺醒 (Female Goddess - Sekhmet)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.rectangle([15, 15, 285, 285], fill=(44, 19, 56, 255), outline=(245, 158, 11, 255), width=8)
  draw.polygon([(150, 25), (80, 90), (220, 90)], fill=(234, 179, 8, 255))
  draw.ellipse([80, 80, 220, 240], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=6)
  draw.ellipse([100, 135, 128, 155], fill=(236, 72, 153, 255))
  draw.ellipse([172, 135, 200, 155], fill=(236, 72, 153, 255))
  draw.rectangle([40, 245, 260, 280], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=2)
  draw.text((150, 262), "鎖定覺醒", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "god_female.png"))

  # 13. Multiplier Orb
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(217, 119, 6, 255))
  draw.ellipse([50, 50, 250, 250], fill=(245, 158, 11, 255))
  draw.ellipse([80, 80, 220, 220], fill=(253, 224, 71, 255))
  draw.text((150, 150), "25x", fill=(120, 53, 15, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "multiplier.png"))

  # 14. Background Gods Wallpaper
  bg = Image.new("RGB", (1920, 1080), (8, 5, 14))
  bg_draw = ImageDraw.Draw(bg)
  bg_draw.rectangle([0, 0, 1920, 1080], fill=(12, 9, 20))
  bg_draw.rectangle([120, 0, 320, 1080], fill=(22, 17, 34))
  bg_draw.rectangle([1600, 0, 1800, 1080], fill=(22, 17, 34))
  bg.save(os.path.join(ASSETS_DIR, "bg_gods.png"))

  print("AAA HD Assets regenerated with rich 3D gold & gemstone bevels!")

if __name__ == "__main__":
  generate_aaa_assets()

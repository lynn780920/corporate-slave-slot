#!/usr/bin/env python3
"""
社畜變賭徒 (Corporate Slave to Gambler) - Humorous Corporate Asset Generator
Generates HD 300x300 3D assets:
- Coffee Mug, Alarm Clock, ID Badge, Energy Drink Can, Office Chair, Cup Noodles, Stapler, RGB Keyboard, Water Bottle
- SCATTER Overtime Laptop, Devil Boss Awakening, Strict HR Awakening
- Multiplier Orbs (Green, Blue, Purple, Flaming Gold Fire)
"""

import os
import sys
import math

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "public", "assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_corporate_assets():
  try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
  except ImportError:
    print("[PIL] Installing Pillow...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont, ImageFilter

  def create_base(size=300):
    return Image.new("RGBA", (size, size), (0, 0, 0, 0))

  def add_gold_rim(draw, size=300):
    draw.ellipse([8, 8, size-8, size-8], outline=(180, 83, 9, 255), width=10)
    draw.ellipse([14, 14, size-14, size-14], outline=(254, 240, 138, 255), width=6)

  # 1. 續命咖啡 (Coffee Mug) - Replacing eye
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(20, 15, 30, 230))
  # Coffee Cup Body
  draw.rectangle([90, 80, 210, 220], fill=(245, 158, 11, 255), outline=(254, 240, 138, 255), width=5)
  # Cup Handle
  draw.arc([180, 100, 250, 180], start=270, end=90, fill=(245, 158, 11, 255), width=12)
  # Steam Waves
  draw.arc([110, 40, 140, 75], start=0, end=180, fill=(255, 255, 255, 200), width=4)
  draw.arc([160, 40, 190, 75], start=0, end=180, fill=(255, 255, 255, 200), width=4)
  draw.text((150, 150), "續命咖啡", fill=(120, 53, 15, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "eye.png"))

  # 2. 毀滅鬧鐘 (Alarm Clock) - Replacing scepter
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(20, 15, 30, 230))
  # Alarm Clock Body
  draw.ellipse([70, 70, 230, 230], fill=(220, 38, 38, 255), outline=(254, 240, 138, 255), width=6)
  # Clock Bells
  draw.ellipse([50, 40, 100, 90], fill=(245, 158, 11, 255))
  draw.ellipse([200, 40, 250, 90], fill=(245, 158, 11, 255))
  # Clock Hands (08:00 AM Overtime)
  draw.line([150, 150, 150, 100], fill=(255, 255, 255, 255), width=6)
  draw.line([150, 150, 190, 150], fill=(255, 255, 255, 255), width=6)
  draw.text((150, 185), "08:00", fill=(254, 240, 138, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "scepter.png"))

  # 3. 社畜識別證 (ID Badge) - Replacing bow
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(20, 15, 30, 230))
  # Lanyard Ribbon
  draw.line([150, 30, 150, 80], fill=(59, 130, 246, 255), width=10)
  # ID Card Frame
  draw.rectangle([80, 80, 220, 240], fill=(241, 245, 249, 255), outline=(245, 158, 11, 255), width=6)
  # Card Photo Head
  draw.ellipse([120, 100, 180, 160], fill=(59, 130, 246, 255))
  draw.text((150, 200), "社畜證", fill=(15, 23, 42, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "bow.png"))

  # 4. 爆汗蠻牛飲料 (Energy Drink) - Replacing sword
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(20, 15, 30, 230))
  # Energy Can
  draw.rectangle([100, 60, 200, 240], fill=(37, 99, 235, 255), outline=(254, 240, 138, 255), width=6)
  # Lightning Bolt Symbol
  draw.polygon([(150, 80), (120, 150), (160, 150), (140, 220), (180, 140), (140, 140)], fill=(253, 224, 71, 255))
  img.save(os.path.join(ASSETS_DIR, "sword.png"))

  # 5. 人體工學椅 (Office Chair) - Replacing gem_orange
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.polygon([(150, 25), (260, 85), (260, 215), (150, 275), (40, 215), (40, 85)], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=8)
  draw.rectangle([100, 70, 200, 180], fill=(245, 158, 11, 255))
  draw.line([150, 180, 150, 230], fill=(15, 23, 42, 255), width=10)
  draw.text((150, 125), "工學椅", fill=(15, 23, 42, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_orange.png"))

  # 6. 加班泡麵 (Cup Noodles) - Replacing gem_red
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.polygon([(150, 20), (275, 150), (150, 280), (25, 150)], fill=(153, 27, 27, 255), outline=(252, 165, 165, 255), width=8)
  draw.polygon([(90, 80), (210, 80), (180, 220), (120, 220)], fill=(220, 38, 38, 255))
  draw.text((150, 150), "加班泡麵", fill=(254, 240, 138, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_red.png"))

  # 7. 辦公訂書機 (Stapler) - Replacing gem_purple
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.ellipse([30, 30, 270, 270], fill=(88, 28, 135, 255), outline=(233, 213, 255, 255), width=8)
  draw.rectangle([80, 120, 220, 170], fill=(168, 85, 247, 255), outline=(255, 255, 255, 255), width=4)
  draw.text((150, 145), "訂書機", fill=(255, 255, 255, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_purple.png"))

  # 8. RGB 鍵盤 (Mechanical Keyboard) - Replacing gem_blue
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.polygon([(150, 20), (270, 90), (150, 280), (30, 90)], fill=(30, 58, 138, 255), outline=(147, 197, 253, 255), width=8)
  draw.rectangle([70, 110, 230, 190], fill=(37, 99, 235, 255), outline=(56, 189, 248, 255), width=4)
  draw.text((150, 150), "RGB鍵盤", fill=(254, 240, 138, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_blue.png"))

  # 9. 辦公水壺 (Water Bottle) - Replacing gem_green
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.rectangle([40, 40, 260, 260], fill=(6, 78, 59, 255), outline=(110, 231, 183, 255), width=8)
  draw.rectangle([110, 80, 190, 220], fill=(16, 185, 129, 255))
  draw.text((150, 150), "續水壺", fill=(255, 255, 255, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_green.png"))

  # 10. SCATTER (爆肝筆電 SCATTER)
  img = create_base()
  draw = ImageDraw.Draw(img)
  add_gold_rim(draw)
  draw.ellipse([30, 30, 270, 270], fill=(76, 29, 149, 255))
  # Laptop Screen
  draw.rectangle([70, 70, 230, 170], fill=(15, 23, 42, 255), outline=(253, 224, 71, 255), width=4)
  draw.rectangle([50, 170, 250, 190], fill=(217, 119, 6, 255))
  draw.text((150, 120), "特休批准", fill=(56, 189, 248, 255), anchor="mm")
  draw.rectangle([50, 210, 250, 250], fill=(180, 83, 9, 255), outline=(254, 240, 138, 255), width=3)
  draw.text((150, 230), "SCATTER", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "scatter.png"))

  # 11. 魔鬼老闆 (Devil Boss Head) - Replacing god_male
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.rectangle([15, 15, 285, 285], fill=(153, 27, 27, 255), outline=(245, 158, 11, 255), width=8)
  draw.polygon([(80, 30), (50, 90), (100, 90)], fill=(220, 38, 38, 255))
  draw.polygon([(220, 30), (200, 90), (250, 90)], fill=(220, 38, 38, 255))
  draw.ellipse([80, 80, 220, 220], fill=(217, 119, 6, 255), outline=(253, 224, 71, 255), width=6)
  draw.rectangle([40, 240, 260, 275], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=2)
  draw.text((150, 150), "魔鬼老闆", fill=(255, 255, 255, 255), anchor="mm")
  draw.text((150, 258), "老闆覺醒", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "god_male.png"))

  # 12. 嚴厲 HR (Strict HR Goddess) - Replacing god_female
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.rectangle([15, 15, 285, 285], fill=(44, 19, 56, 255), outline=(245, 158, 11, 255), width=8)
  draw.ellipse([80, 80, 220, 220], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=6)
  # Glasses
  draw.rectangle([90, 120, 140, 145], outline=(253, 224, 71, 255), width=4)
  draw.rectangle([160, 120, 210, 145], outline=(253, 224, 71, 255), width=4)
  draw.rectangle([40, 240, 260, 275], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=2)
  draw.text((150, 175), "嚴厲 HR", fill=(255, 255, 255, 255), anchor="mm")
  draw.text((150, 258), "HR覺醒", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "god_female.png"))

  # 13. MULTIPLIER ORBS (Green, Blue, Purple, Gold Fire)
  def create_orb(color_bg, color_rim, filename):
    img = create_base()
    draw = ImageDraw.Draw(img)
    draw.ellipse([10, 10, 290, 290], fill=color_bg, outline=color_rim, width=12)
    draw.ellipse([40, 40, 260, 260], fill=color_rim, outline=(255, 255, 255, 255), width=4)
    img.save(os.path.join(ASSETS_DIR, filename))

  create_orb((6, 78, 59, 255), (16, 185, 129, 255), "mult_green.png")
  create_orb((30, 58, 138, 255), (59, 130, 246, 255), "mult_blue.png")
  create_orb((88, 28, 135, 255), (168, 85, 247, 255), "mult_purple.png")
  create_orb((180, 83, 9, 255), (253, 224, 71, 255), "multiplier.png")

  print("Corporate Slave 3D PNG Symbol Assets generated cleanly!")

if __name__ == "__main__":
  generate_corporate_assets()

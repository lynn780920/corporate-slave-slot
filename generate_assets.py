#!/usr/bin/env python3
"""
社畜變賭徒 (Corporate Slave to Gambler) - Master 3D Photorealistic Casino Asset Generator
Generates ultra-high-definition HD 3D glossy metallic casino slot symbols.
"""

import os
import sys
import math

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "public", "assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_master_3d_assets():
  try:
    from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
  except ImportError:
    print("[PIL] Installing Pillow...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

  def create_base(size=320):
    return Image.new("RGBA", (size, size), (0, 0, 0, 0))

  def draw_metallic_frame(draw, primary_color, highlight_color, shadow_color, size=320):
    # Layered 3D Metallic Ring
    draw.ellipse([6, 6, size-6, size-6], fill=(10, 8, 18, 240), outline=shadow_color, width=16)
    draw.ellipse([14, 14, size-14, size-14], outline=primary_color, width=10)
    draw.ellipse([20, 20, size-20, size-20], outline=highlight_color, width=5)
    draw.ellipse([25, 25, size-25, size-25], outline=(255, 255, 255, 180), width=2)

  # 1. 續命熱咖啡 (Coffee Mug) - High 1
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_metallic_frame(draw, (245, 158, 11, 255), (254, 240, 138, 255), (180, 83, 9, 255))
  # 3D Gold Mug
  draw.rectangle([100, 90, 220, 230], fill=(217, 119, 6, 255), outline=(254, 240, 138, 255), width=6)
  draw.rectangle([110, 100, 210, 220], fill=(245, 158, 11, 255))
  # Handle
  draw.arc([190, 110, 260, 190], start=270, end=90, fill=(254, 240, 138, 255), width=16)
  # Steam Glow
  draw.arc([120, 40, 155, 80], start=0, end=180, fill=(255, 255, 255, 240), width=6)
  draw.arc([165, 40, 200, 80], start=0, end=180, fill=(255, 255, 255, 240), width=6)
  img.save(os.path.join(ASSETS_DIR, "eye.png"))

  # 2. 毀滅鬧鐘 (Alarm Clock) - High 2
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_metallic_frame(draw, (220, 38, 38, 255), (254, 240, 138, 255), (153, 27, 27, 255))
  draw.ellipse([70, 70, 250, 250], fill=(185, 28, 28, 255), outline=(254, 240, 138, 255), width=8)
  draw.ellipse([85, 85, 235, 235], fill=(220, 38, 38, 255))
  # Bells
  draw.ellipse([45, 35, 115, 105], fill=(245, 158, 11, 255), outline=(254, 240, 138, 255), width=4)
  draw.ellipse([205, 35, 275, 105], fill=(245, 158, 11, 255), outline=(254, 240, 138, 255), width=4)
  # Clock Center & Hands
  draw.ellipse([150-10, 160-10, 150+10, 160+10], fill=(255, 255, 255, 255))
  draw.line([150, 160, 150, 105], fill=(255, 255, 255, 255), width=10)
  draw.line([150, 160, 200, 160], fill=(255, 255, 255, 255), width=10)
  img.save(os.path.join(ASSETS_DIR, "scepter.png"))

  # 3. 社畜識別證 (ID Badge) - High 3
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_metallic_frame(draw, (37, 99, 235, 255), (147, 197, 253, 255), (30, 58, 138, 255))
  draw.line([160, 30, 160, 85], fill=(59, 130, 246, 255), width=14)
  draw.rectangle([80, 85, 240, 255], fill=(241, 245, 249, 255), outline=(245, 158, 11, 255), width=7)
  draw.ellipse([125, 105, 195, 175], fill=(37, 99, 235, 255))
  img.save(os.path.join(ASSETS_DIR, "bow.png"))

  # 4. 爆汗蠻牛飲料 (Energy Can) - High 4
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_metallic_frame(draw, (37, 99, 235, 255), (253, 224, 71, 255), (30, 58, 138, 255))
  draw.rectangle([100, 55, 220, 255], fill=(29, 78, 216, 255), outline=(254, 240, 138, 255), width=7)
  draw.polygon([(160, 75), (120, 155), (170, 155), (140, 235), (200, 135), (150, 135)], fill=(253, 224, 71, 255))
  img.save(os.path.join(ASSETS_DIR, "sword.png"))

  # 5. 人體工學椅 (Office Chair) - Mid 1
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.polygon([(160, 20), (280, 90), (280, 230), (160, 300), (40, 230), (40, 90)], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=10)
  draw.rectangle([100, 70, 220, 195], fill=(245, 158, 11, 255), outline=(255, 255, 255, 255), width=5)
  draw.line([160, 195, 160, 255], fill=(15, 23, 42, 255), width=14)
  img.save(os.path.join(ASSETS_DIR, "gem_orange.png"))

  # 6. 加班泡麵 (Cup Noodles) - Mid 2
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.polygon([(160, 15), (295, 160), (160, 305), (25, 160)], fill=(153, 27, 27, 255), outline=(252, 165, 165, 255), width=10)
  draw.polygon([(90, 80), (230, 80), (195, 240), (125, 240)], fill=(220, 38, 38, 255), outline=(254, 240, 138, 255), width=5)
  img.save(os.path.join(ASSETS_DIR, "gem_red.png"))

  # 7. 辦公訂書機 (Stapler) - Low 1
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.ellipse([30, 30, 290, 290], fill=(88, 28, 135, 255), outline=(233, 213, 255, 255), width=10)
  draw.rectangle([80, 120, 240, 185], fill=(168, 85, 247, 255), outline=(255, 255, 255, 255), width=6)
  img.save(os.path.join(ASSETS_DIR, "gem_purple.png"))

  # 8. RGB 鍵盤 (Mechanical Keyboard) - Low 2
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.polygon([(160, 15), (290, 95), (160, 305), (30, 95)], fill=(30, 58, 138, 255), outline=(147, 197, 253, 255), width=10)
  draw.rectangle([70, 110, 250, 205], fill=(37, 99, 235, 255), outline=(56, 189, 248, 255), width=6)
  img.save(os.path.join(ASSETS_DIR, "gem_blue.png"))

  # 9. 辦公水壺 (Water Bottle) - Low 3
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.rectangle([35, 35, 285, 285], fill=(6, 78, 59, 255), outline=(110, 231, 183, 255), width=10)
  draw.rectangle([110, 80, 210, 240], fill=(16, 185, 129, 255), outline=(255, 255, 255, 255), width=5)
  img.save(os.path.join(ASSETS_DIR, "gem_green.png"))

  # 10. SCATTER (爆肝特休筆電 SCATTER)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_metallic_frame(draw, (245, 158, 11, 255), (254, 240, 138, 255), (180, 83, 9, 255))
  draw.rectangle([70, 70, 250, 185], fill=(15, 23, 42, 255), outline=(253, 224, 71, 255), width=6)
  draw.rectangle([50, 185, 270, 205], fill=(217, 119, 6, 255))
  draw.rectangle([50, 225, 270, 275], fill=(180, 83, 9, 255), outline=(254, 240, 138, 255), width=4)
  draw.text((160, 250), "SCATTER", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "scatter.png"))

  # 11. 魔鬼老闆 (Devil Boss Head)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.rectangle([15, 15, 305, 305], fill=(153, 27, 27, 255), outline=(245, 158, 11, 255), width=9)
  draw.polygon([(80, 25), (45, 90), (100, 90)], fill=(220, 38, 38, 255))
  draw.polygon([(240, 25), (220, 90), (275, 90)], fill=(220, 38, 38, 255))
  draw.ellipse([80, 80, 240, 240], fill=(217, 119, 6, 255), outline=(253, 224, 71, 255), width=7)
  draw.rectangle([35, 255, 285, 295], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=3)
  draw.text((160, 275), "老闆覺醒", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "god_male.png"))

  # 12. 嚴厲 HR (Strict HR Goddess)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw.rectangle([15, 15, 305, 305], fill=(44, 19, 56, 255), outline=(245, 158, 11, 255), width=9)
  draw.ellipse([80, 80, 240, 240], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=7)
  draw.rectangle([35, 255, 285, 295], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=3)
  draw.text((160, 275), "HR覺醒", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "god_female.png"))

  # 13. Pure 3D Spheres for Multiplier Orbs (NO EMBEDDED TEXT)
  def create_pure_orb(color_bg, color_rim, filename):
    img = create_base()
    draw = ImageDraw.Draw(img)
    draw.ellipse([10, 10, 310, 310], fill=color_bg, outline=color_rim, width=16)
    draw.ellipse([38, 38, 282, 282], fill=color_rim, outline=(255, 255, 255, 240), width=7)
    img.save(os.path.join(ASSETS_DIR, filename))

  create_pure_orb((6, 78, 59, 255), (16, 185, 129, 255), "mult_green.png")
  create_pure_orb((30, 58, 138, 255), (59, 130, 246, 255), "mult_blue.png")
  create_pure_orb((88, 28, 135, 255), (168, 85, 247, 255), "mult_purple.png")
  create_pure_orb((180, 83, 9, 255), (253, 224, 71, 255), "multiplier.png")

  print("Master 3D Assets generated cleanly!")

if __name__ == "__main__":
  generate_master_3d_assets()

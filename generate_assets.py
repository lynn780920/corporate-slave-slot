#!/usr/bin/env python3
"""
社畜變賭徒 (Working Pets Edition) - Cute Working Cats & Dogs 3D Asset Generator
Generates adorable 3D Working Office Pet slot symbols:
- Cat CEO, Shiba HR, Corgi Accountant, Frenchie Dev, Golden Sales, Pug Overtime, Calico Intern, Blue Cat Designer, Tabby Customer Service
- Cat Paw Overtime Laptop SCATTER, Golden Cat God Boss, Golden Dog Goddess HR
- Cute Cat Paw Multiplier Orbs
"""

import os
import sys

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "public", "assets")
os.makedirs(ASSETS_DIR, exist_ok=True)

def generate_working_pet_assets():
  try:
    from PIL import Image, ImageDraw, ImageFilter
  except ImportError:
    print("[PIL] Installing Pillow...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFilter

  def create_base(size=320):
    return Image.new("RGBA", (size, size), (0, 0, 0, 0))

  def draw_3d_pet_card(draw, frame_color, bg_color, size=320):
    draw.ellipse([8, 8, size-8, size-8], fill=bg_color, outline=frame_color, width=14)
    draw.ellipse([20, 20, size-20, size-20], outline=(255, 255, 255, 200), width=4)

  # Draw Cute Cat Face
  def draw_cat_head(draw, cx, cy, head_color, ear_color):
    # Cat Ears
    draw.polygon([(cx-60, cy-40), (cx-90, cy-110), (cx-20, cy-70)], fill=head_color, outline=(255, 255, 255, 200), width=3)
    draw.polygon([(cx+60, cy-40), (cx+90, cy-110), (cx+20, cy-70)], fill=head_color, outline=(255, 255, 255, 200), width=3)
    draw.polygon([(cx-55, cy-45), (cx-80, cy-95), (cx-25, cy-68)], fill=ear_color)
    draw.polygon([(cx+55, cy-45), (cx+80, cy-95), (cx+25, cy-68)], fill=ear_color)
    # Head Base
    draw.ellipse([cx-75, cy-60, cx+75, cy+70], fill=head_color, outline=(255, 255, 255, 200), width=4)
    # Cute Eyes
    draw.ellipse([cx-45, cy-20, cx-15, cy+20], fill=(15, 23, 42, 255))
    draw.ellipse([cx+15, cy-20, cx+45, cy+20], fill=(15, 23, 42, 255))
    draw.ellipse([cx-38, cy-12, cx-24, cy+2], fill=(255, 255, 255, 255))
    draw.ellipse([cx+22, cy-12, cx+36, cy+2], fill=(255, 255, 255, 255))
    # Nose & Mouth
    draw.polygon([(cx-8, cy+15), (cx+8, cy+15), (cx, cy+25)], fill=(244, 114, 182, 255))
    draw.arc([cx-18, cy+22, cx, cy+38], start=0, end=180, fill=(15, 23, 42, 255), width=3)
    draw.arc([cx, cy+22, cx+18, cy+38], start=0, end=180, fill=(15, 23, 42, 255), width=3)

  # Draw Cute Dog Face (Shiba / Corgi)
  def draw_dog_head(draw, cx, cy, head_color, muzzle_color):
    # Dog Ears
    draw.polygon([(cx-50, cy-50), (cx-80, cy-115), (cx-10, cy-75)], fill=head_color, outline=(255, 255, 255, 200), width=3)
    draw.polygon([(cx+50, cy-50), (cx+80, cy-115), (cx+10, cy-75)], fill=head_color, outline=(255, 255, 255, 200), width=3)
    # Head Base
    draw.ellipse([cx-75, cy-65, cx+75, cy+65], fill=head_color, outline=(255, 255, 255, 200), width=4)
    # White Muzzle
    draw.ellipse([cx-40, cy, cx+40, cy+55], fill=muzzle_color)
    # Cute Eyes
    draw.ellipse([cx-45, cy-25, cx-20, cy], fill=(15, 23, 42, 255))
    draw.ellipse([cx+20, cy-25, cx+45, cy], fill=(15, 23, 42, 255))
    draw.ellipse([cx-38, cy-20, cx-28, cy-10], fill=(255, 255, 255, 255))
    draw.ellipse([cx+27, cy-20, cx+37, cy-10], fill=(255, 255, 255, 255))
    # Nose
    draw.ellipse([cx-12, cy+8, cx+12, cy+26], fill=(15, 23, 42, 255))

  # 1. 貓貓總裁 (Cat CEO) - High 1
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (245, 158, 11, 255), (30, 20, 45, 255))
  draw_cat_head(draw, 160, 160, (245, 158, 11, 255), (244, 114, 182, 255))
  # Gold Crown
  draw.polygon([(110, 75), (130, 35), (160, 65), (190, 35), (210, 75)], fill=(253, 224, 71, 255), outline=(180, 83, 9, 255), width=3)
  draw.text((160, 265), "貓總裁", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "eye.png"))

  # 2. 柴犬 HR (Shiba HR) - High 2
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (220, 38, 38, 255), (45, 20, 30, 255))
  draw_dog_head(draw, 160, 160, (217, 119, 6, 255), (254, 240, 138, 255))
  # Red Tie
  draw.polygon([(145, 215), (175, 215), (180, 260), (160, 280), (140, 260)], fill=(220, 38, 38, 255))
  draw.text((160, 265), "柴犬HR", fill=(254, 240, 138, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "scepter.png"))

  # 3. 柯基會計 (Corgi Accountant) - High 3
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (59, 130, 246, 255), (20, 30, 55, 255))
  draw_dog_head(draw, 160, 160, (245, 158, 11, 255), (255, 255, 255, 255))
  # Glasses
  draw.ellipse([100, 130, 145, 170], outline=(253, 224, 71, 255), width=5)
  draw.ellipse([175, 130, 220, 170], outline=(253, 224, 71, 255), width=5)
  draw.line([145, 150, 175, 150], fill=(253, 224, 71, 255), width=4)
  draw.text((160, 265), "柯基會計", fill=(147, 197, 253, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "bow.png"))

  # 4. 法鬥工程師 (Frenchie Dev) - High 4
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (168, 85, 247, 255), (35, 20, 55, 255))
  draw_dog_head(draw, 160, 160, (100, 116, 139, 255), (241, 245, 249, 255))
  # Headphones
  draw.arc([80, 80, 240, 220], start=180, end=360, fill=(236, 72, 153, 255), width=12)
  draw.ellipse([70, 130, 105, 180], fill=(236, 72, 153, 255))
  draw.ellipse([215, 130, 250, 180], fill=(236, 72, 153, 255))
  draw.text((160, 265), "法鬥碼農", fill=(233, 213, 255, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "sword.png"))

  # 5. 金毛業務 (Golden Sales) - Mid 1
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (245, 158, 11, 255), (45, 30, 20, 255))
  draw_dog_head(draw, 160, 160, (234, 179, 8, 255), (254, 243, 199, 255))
  draw.text((160, 265), "金毛業務", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_orange.png"))

  # 6. 巴哥加班犬 (Pug Overtime) - Mid 2
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (239, 68, 68, 255), (55, 20, 20, 255))
  draw_dog_head(draw, 160, 160, (180, 83, 9, 255), (120, 53, 15, 255))
  draw.text((160, 265), "巴哥加班犬", fill=(252, 165, 165, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_red.png"))

  # 7. 花貓實習生 (Calico Intern) - Low 1
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (168, 85, 247, 255), (40, 20, 50, 255))
  draw_cat_head(draw, 160, 160, (251, 146, 60, 255), (244, 114, 182, 255))
  draw.text((160, 265), "花貓實習生", fill=(233, 213, 255, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_purple.png"))

  # 8. 英短設計師 (Blue Cat Designer) - Low 2
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (59, 130, 246, 255), (20, 35, 60, 255))
  draw_cat_head(draw, 160, 160, (148, 163, 184, 255), (244, 114, 182, 255))
  draw.text((160, 265), "英短設計", fill=(147, 197, 253, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_blue.png"))

  # 9. 橘貓客服 (Tabby CS) - Low 3
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (16, 185, 129, 255), (15, 45, 35, 255))
  draw_cat_head(draw, 160, 160, (249, 115, 22, 255), (244, 114, 182, 255))
  draw.text((160, 265), "橘貓客服", fill=(110, 231, 183, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "gem_green.png"))

  # 10. SCATTER (貓狗特休筆電 SCATTER)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (245, 158, 11, 255), (60, 20, 80, 255))
  # Laptop Screen with Paw Print
  draw.rectangle([70, 70, 250, 180], fill=(15, 23, 42, 255), outline=(253, 224, 71, 255), width=5)
  draw.ellipse([140, 105, 180, 145], fill=(244, 114, 182, 255))
  draw.ellipse([125, 95, 145, 115], fill=(244, 114, 182, 255))
  draw.ellipse([175, 95, 195, 115], fill=(244, 114, 182, 255))
  draw.rectangle([45, 215, 275, 270], fill=(180, 83, 9, 255), outline=(254, 240, 138, 255), width=4)
  draw.text((160, 242), "特休 SCATTER", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "scatter.png"))

  # 11. 貓神總裁 (God Cat Boss)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (245, 158, 11, 255), (70, 20, 20, 255))
  draw_cat_head(draw, 160, 150, (253, 224, 71, 255), (220, 38, 38, 255))
  draw.rectangle([35, 245, 285, 285], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=3)
  draw.text((160, 265), "貓神覺醒", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "god_male.png"))

  # 12. 犬神 HR (God Dog HR)
  img = create_base()
  draw = ImageDraw.Draw(img)
  draw_3d_pet_card(draw, (245, 158, 11, 255), (45, 20, 60, 255))
  draw_dog_head(draw, 160, 150, (253, 224, 71, 255), (255, 255, 255, 255))
  draw.rectangle([35, 245, 285, 285], fill=(180, 83, 9, 255), outline=(253, 224, 71, 255), width=3)
  draw.text((160, 265), "犬神覺醒", fill=(253, 224, 71, 255), anchor="mm")
  img.save(os.path.join(ASSETS_DIR, "god_female.png"))

  # 13. Cute Cat Paw Multiplier Orbs (Pure 3D Spheres with Paw Prints)
  def create_paw_orb(color_bg, color_rim, filename):
    img = create_base()
    draw = ImageDraw.Draw(img)
    draw.ellipse([10, 10, 310, 310], fill=color_bg, outline=color_rim, width=16)
    draw.ellipse([38, 38, 282, 282], fill=color_rim, outline=(255, 255, 255, 240), width=7)
    # Paw Print Shadow
    draw.ellipse([135, 150, 185, 195], fill=(255, 255, 255, 120))
    draw.ellipse([120, 135, 140, 155], fill=(255, 255, 255, 120))
    draw.ellipse([180, 135, 200, 155], fill=(255, 255, 255, 120))
    img.save(os.path.join(ASSETS_DIR, filename))

  create_paw_orb((6, 78, 59, 255), (16, 185, 129, 255), "mult_green.png")
  create_paw_orb((30, 58, 138, 255), (59, 130, 246, 255), "mult_blue.png")
  create_paw_orb((88, 28, 135, 255), (168, 85, 247, 255), "mult_purple.png")
  create_paw_orb((180, 83, 9, 255), (253, 224, 71, 255), "multiplier.png")

  print("Working Pets 3D Symbol assets generated cleanly!")

if __name__ == "__main__":
  generate_working_pet_assets()

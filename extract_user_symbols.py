import os
from PIL import Image

src_path = r"C:\Users\lynn_chan\.gemini\antigravity\brain\c6ed44da-d112-4f12-b006-faa5e0411460\media__1786068666869.jpg"
out_dir = r"c:\Users\lynn_chan\Downloads\S\public\assets"
os.makedirs(out_dir, exist_ok=True)

img = Image.open(src_path)
width, height = img.size

# Grid boundaries inside 1024x824 image
grid_left = 68
grid_top = 58
grid_right = 956
grid_bottom = 766

cell_w = (grid_right - grid_left) / 6
cell_h = (grid_bottom - grid_top) / 5

def crop_cell(c, r, pad=10):
  x1 = int(grid_left + c * cell_w + pad)
  y1 = int(grid_top + r * cell_h + pad)
  x2 = int(grid_left + (c + 1) * cell_w - pad)
  y2 = int(grid_top + (r + 1) * cell_h - pad)
  return img.crop((x1, y1, x2, y2))

# Map specific cells from user screenshot to exact symbol files
symbol_mapping = {
  "gem_green.png": (0, 0),    # 橘貓客服 (Green Circle)
  "gem_purple.png": (1, 0),   # 三色花貓 (Purple Circle)
  "gem_red.png": (2, 0),      # 巴哥加班犬 (Red Circle)
  "multiplier.png": (3, 0),   # 5x Multiplier Orb
  "mult_green.png": (3, 0),   # Green Multiplier Orb
  "mult_blue.png": (3, 0),    # Multiplier Orb
  "mult_purple.png": (3, 0),  # Multiplier Orb
  "gem_orange.png": (4, 0),   # 金毛業務 (Diamond Gold Frame)
  "sword.png": (5, 0),        # 法鬥碼農 (Headphones & Glasses)
  "gem_blue.png": (1, 1),     # 英短設計 (Glasses & Pen)
  "scepter.png": (5, 1),      # 柴犬 HR (Suit)
  "eye.png": (4, 0),          # 金毛總裁 / 高賠率
  "scatter.png": (0, 0),      # SCATTER
  "god_male.png": (4, 4),     # 覺醒徽章
  "god_female.png": (4, 4),   # 覺醒徽章
}

for filename, (c, r) in symbol_mapping.items():
  cropped = crop_cell(c, r, pad=8)
  cropped.save(os.path.join(out_dir, filename))

print("Extracted exact user screenshot symbols into public/assets/!")

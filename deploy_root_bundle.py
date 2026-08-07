import os
import shutil

repo_dir = r"c:\Users\lynn_chan\Downloads\S"
dist_dir = os.path.join(repo_dir, "dist")
public_assets_dir = os.path.join(repo_dir, "public", "assets")
root_assets_dir = os.path.join(repo_dir, "assets")

os.makedirs(root_assets_dir, exist_ok=True)

# 1. Copy dist/index.html to root index.html
shutil.copy(os.path.join(dist_dir, "index.html"), os.path.join(repo_dir, "index.html"))

# 2. Copy dist/assets/* to root assets/
dist_assets_dir = os.path.join(dist_dir, "assets")
if os.path.exists(dist_assets_dir):
  for f in os.listdir(dist_assets_dir):
    shutil.copy(os.path.join(dist_assets_dir, f), os.path.join(root_assets_dir, f))

# 3. Copy public/assets/* to root assets/
if os.path.exists(public_assets_dir):
  for f in os.listdir(public_assets_dir):
    shutil.copy(os.path.join(public_assets_dir, f), os.path.join(root_assets_dir, f))

print("Successfully deployed bundled production files to repository root for GitHub Pages!")

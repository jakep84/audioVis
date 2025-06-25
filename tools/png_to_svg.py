import subprocess
from PIL import Image
from pathlib import Path

def convert_png_to_svg(png_path, svg_output_path):
    # Step 1: Convert PNG to PBM (bitmap)
    pbm_path = Path(png_path).with_suffix(".pbm")
    img = Image.open(png_path).convert("L").point(lambda x: 0 if x < 128 else 255, mode='1')
    img.save(pbm_path)
    print(f"Converted PNG to PBM: {pbm_path}")

    # Step 2: Call potrace to convert PBM to SVG
    subprocess.run(["potrace", str(pbm_path), "-s", "-o", str(svg_output_path)], check=True)
    print(f"Generated SVG: {svg_output_path}")

# Example usage
convert_png_to_svg("napster-logo.png", "napster-logo-from-png.svg")

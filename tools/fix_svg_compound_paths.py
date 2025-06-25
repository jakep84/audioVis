import svgwrite
from svgpathtools import svg2paths2
from pathlib import Path

def fix_svg_for_three(input_path, output_path):
    paths, attributes, svg_attr = svg2paths2(str(input_path))

    # Generate base SVG content
    dwg = svgwrite.Drawing(str(output_path), size=(svg_attr['width'], svg_attr['height']))
    dwg.attribs['viewBox'] = svg_attr['viewBox']
    dwg.attribs['xmlns'] = "http://www.w3.org/2000/svg"

    combined_path_data = " ".join(attr['d'] for attr in attributes)
    combined = dwg.path(
        d=combined_path_data,
        fill="black",
        fill_rule="evenodd"
    )
    dwg.add(combined)
    dwg.save()

    # ✂ Post-process: Remove xmlns:ev and xmlns:xlink (React-safe)
    with open(output_path, "r", encoding="utf-8") as f:
        svg_text = f.read()

    # Remove namespace tags that React/JSX can't parse
    svg_text = svg_text.replace('xmlns:ev="http://www.w3.org/2001/xml-events"', '')
    svg_text = svg_text.replace('xmlns:xlink="http://www.w3.org/1999/xlink"', '')
    svg_text = svg_text.replace('  ', ' ')  # clean extra whitespace

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(svg_text)

    print(f"Cleaned & JSX-safe SVG saved to: {output_path}")

# Usage
input_svg = Path("../src/assets/napster.svg")
output_svg = Path("../src/assets/napster-fixed.svg")
fix_svg_for_three(input_svg, output_svg)

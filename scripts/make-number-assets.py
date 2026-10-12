"""Create outlined, transparent 3D digits from the site's own Figtree font.

Run: python scripts/make-number-assets.py
Tooling dependencies only: python -m pip install fonttools brotli
The site serves the SVGs directly and needs neither Python nor a font to render them.
"""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public" / "numbers"
OUTPUT.mkdir(parents=True, exist_ok=True)

font = instantiateVariableFont(
    TTFont(ROOT / "public" / "fonts" / "figtree-latin.woff2"), {"wght": 800}
)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()

for digit in "0123456789":
    glyph = glyphs[cmap[ord(digit)]]
    bounds = BoundsPen(glyphs)
    glyph.draw(bounds)
    x_min, y_min, x_max, y_max = bounds.bounds
    scale = 68 / (y_max - y_min)
    width = (x_max - x_min) * scale
    # Every digit has the same optical height and centred, tabular frame.
    outline = SVGPathPen(glyphs, ntos=lambda value: f"{value:.2f}".rstrip("0").rstrip("."))
    glyph.draw(TransformPen(outline, (
        scale, 0, 0, -scale,
        (80 - width) / 2 - x_min * scale,
        12 + y_max * scale,
    )))
    path = outline.getCommands()
    # Closely spaced copies form a continuous short extrusion, without a font.
    depth = "\n".join(
        f'    <use href="#digit" transform="translate({i * 0.04:.2f} {i * 0.25:.2f})"/>'
        for i in range(18, 0, -1)
    )
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="80" height="100" viewBox="0 0 80 100" fill="none">
  <title>{digit}</title>
  <defs>
    <path id="digit" d="{path}"/>
    <!-- Matches the primary button gradient in src/index.css. -->
    <linearGradient id="face" x1="40" y1="12" x2="40" y2="80" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6294F8"/>
      <stop offset=".46" stop-color="#4580F7"/>
      <stop offset="1" stop-color="#286CF6"/>
    </linearGradient>
    <linearGradient id="edge" x1="40" y1="12" x2="40" y2="85" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4580F7"/>
      <stop offset=".5" stop-color="#2463D3"/>
      <stop offset="1" stop-color="#174CAB"/>
    </linearGradient>
    <filter id="shadow" x="0" y="0" width="80" height="100" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#4580F7" flood-opacity=".2"/>
    </filter>
    <filter id="bevel" x="0" y="0" width="80" height="100" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation=".45" result="soft"/>
      <feOffset in="soft" dy="1.15" result="down"/>
      <feComposite in="SourceAlpha" in2="down" operator="out" result="top-rim"/>
      <feFlood flood-color="#FFFFFF" flood-opacity=".78"/>
      <feComposite in2="top-rim" operator="in" result="highlight"/>
      <feOffset in="soft" dy="-1.1" result="up"/>
      <feComposite in="SourceAlpha" in2="up" operator="out" result="bottom-rim"/>
      <feFlood flood-color="#1245A1" flood-opacity=".42"/>
      <feComposite in2="bottom-rim" operator="in" result="shade"/>
      <feMerge>
        <feMergeNode in="SourceGraphic"/>
        <feMergeNode in="shade"/>
        <feMergeNode in="highlight"/>
      </feMerge>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <g fill="url(#edge)">
{depth}
    </g>
    <use href="#digit" fill="url(#face)" filter="url(#bevel)"/>
  </g>
</svg>
'''
    (OUTPUT / f"{digit}.svg").write_text(svg, encoding="utf-8")

print("Created public/numbers/0.svg through 9.svg (outlined Figtree, transparent).")

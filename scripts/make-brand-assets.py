"""Build favicon, apple touch icon, and Open Graph card from existing photos.

Run from the repo root: python3 scripts/make-brand-assets.py
Requires Pillow. Outputs are committed; CI does not regenerate them.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
LOGO = SITE / "assets" / "logo.png"
PORTRAIT = SITE / "assets" / "portrait.png"
SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

INK = (18, 22, 28)
PAPER = (244, 240, 230)
GOLD = (232, 200, 114)
MINT = (159, 208, 195)


def square_logo(size: int) -> Image.Image:
    logo = Image.open(LOGO).convert("RGBA")
    canvas = Image.new("RGBA", (size, size), (244, 240, 230, 255))
    pad = int(size * 0.08)
    box = size - pad * 2
    scale = min(box / logo.width, box / logo.height)
    resized = logo.resize((max(1, int(logo.width * scale)), max(1, int(logo.height * scale))), Image.Resampling.LANCZOS)
    x = (size - resized.width) // 2
    y = (size - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    return canvas


def cover(image: Image.Image, width: int, height: int) -> Image.Image:
    scale = max(width / image.width, height / image.height)
    resized = image.resize((int(image.width * scale), int(image.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - width) // 2
    top = max(0, int((resized.height - height) * 0.18))
    return resized.crop((left, top, left + width, top + height))


def rounded(image: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, image.width, image.height), radius=radius, fill=255)
    out = image.convert("RGBA")
    out.putalpha(mask)
    return out


def og_card() -> Image.Image:
    card = Image.new("RGB", (1200, 630), INK)
    draw = ImageDraw.Draw(card)
    draw.rectangle((0, 0, 14, 630), fill=GOLD)

    portrait = cover(Image.open(PORTRAIT).convert("RGB"), 460, 540)
    card.paste(rounded(portrait, 28), (64, 45))

    title = ImageFont.truetype(SERIF, 68)
    line = ImageFont.truetype(SANS, 32)
    small = ImageFont.truetype(SANS_BOLD, 26)
    draw.text((580, 150), "Arnold Rurangwa", font=title, fill=PAPER)
    draw.text((580, 260), "Software development", font=line, fill=PAPER)
    draw.text((580, 310), "Linux / sysadmin  ·  IT support", font=line, fill=PAPER)
    draw.text((580, 400), "Kraków, Poland", font=small, fill=GOLD)
    draw.text((580, 470), "arnold-rg.github.io", font=small, fill=MINT)
    return card


def main() -> None:
    icon = square_logo(512)
    icon.resize((32, 32), Image.Resampling.LANCZOS).save(SITE / "assets" / "favicon-32.png")
    icon.resize((180, 180), Image.Resampling.LANCZOS).save(SITE / "apple-touch-icon.png")
    icon.save(
        SITE / "favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    og_card().save(SITE / "assets" / "og.png", optimize=True)
    print("wrote favicon.ico, apple-touch-icon.png, assets/favicon-32.png, assets/og.png")


if __name__ == "__main__":
    main()

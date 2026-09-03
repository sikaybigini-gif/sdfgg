#!/usr/bin/env python3
"""
YAYIN 08 — tek dosyalık (standalone) HTML üreteci.

Kaynak dosyalara (index.html, style.css, i18n.js, game.js, images/, audio/)
DOKUNMAZ. Bunları okuyup tek bir taşınabilir `yayin08-standalone.html`
dosyasına gömer:

  - style.css  -> <style> içine
  - i18n.js + game.js -> <script> içine
  - images/*.png -> küçültülmüş JPEG data-URI (ImageMagick 'convert' varsa)
  - audio/*.mp3  -> data-URI

game.js'teki `url(images/X)` ve `"audio/" + file` referansları,
gömülü asset sözlüğünden okuyan bir yardımcıya çevrilir. Böylece dosya
çift tıklanarak (file://) internet olmadan çalışır.

Kullanım:  python3 build-standalone.py
"""
import base64
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "yayin08-standalone.html")

# ------- ayarlar -------
IMG_MAX_WIDTH = 900     # CRT arka planı için yeterli
IMG_QUALITY = 70        # JPEG kalitesi (boyut/kalite dengesi)


def read(path):
    with open(os.path.join(ROOT, path), "r", encoding="utf-8") as f:
        return f.read()


def b64_file(path, mime):
    with open(path, "rb") as f:
        return "data:%s;base64,%s" % (mime, base64.b64encode(f.read()).decode("ascii"))


def encode_images():
    """images/*.png -> {dosyaadı(.png dahil): data-uri}. ImageMagick ile JPEG'e küçültür."""
    have_convert = shutil.which("convert") is not None
    tmp = os.path.join(ROOT, ".embed_tmp")
    os.makedirs(tmp, exist_ok=True)
    out = {}
    img_dir = os.path.join(ROOT, "images")
    for name in sorted(os.listdir(img_dir)):
        if not name.lower().endswith(".png"):
            continue
        src = os.path.join(img_dir, name)
        if have_convert:
            jpg = os.path.join(tmp, name[:-4] + ".jpg")
            subprocess.run(
                ["convert", src, "-resize", "%dx" % IMG_MAX_WIDTH,
                 "-quality", str(IMG_QUALITY), "-sampling-factor", "4:2:0",
                 "-strip", jpg],
                check=True,
            )
            out[name] = b64_file(jpg, "image/jpeg")
        else:
            out[name] = b64_file(src, "image/png")
    shutil.rmtree(tmp, ignore_errors=True)
    return out


def encode_audio():
    out = {}
    aud_dir = os.path.join(ROOT, "audio")
    if not os.path.isdir(aud_dir):
        return out
    for name in sorted(os.listdir(aud_dir)):
        if name.lower().endswith(".mp3"):
            out[name] = b64_file(os.path.join(aud_dir, name), "audio/mpeg")
    return out


def main():
    css = read("style.css")
    i18n = read("i18n.js")
    game = read("game.js")

    print("Görseller kodlanıyor (küçültme + base64)...")
    imgs = encode_images()
    print("  %d görsel gömüldü" % len(imgs))
    print("Sesler kodlanıyor...")
    auds = encode_audio()
    print("  %d ses gömüldü" % len(auds))

    # gömülü asset sözlüğü + referans çözümleyiciler
    assets_js = (
        "  /* ===== gömülü assetler (standalone) ===== */\n"
        "  const __IMG = %s;\n"
        "  const __AUD = %s;\n"
        "  window.__asset = (n) => __IMG[n] || (\"images/\" + n);\n"
        "  window.__audio = (n) => __AUD[n] || (\"audio/\" + n);\n"
    ) % (
        _js_obj(imgs),
        _js_obj(auds),
    )

    # game.js içindeki asset referanslarını gömülü sözlüğe yönlendir
    g = game
    # `url(images/${img})` ve `url(images/${image})` -> `url(${window.__asset(img)})`
    g = g.replace("url(images/${img})", "url(${window.__asset(img)})")
    g = g.replace("url(images/${image})", "url(${window.__asset(image)})")
    # voAudio.src = "audio/" + file;  -> gömülü
    g = g.replace('voAudio.src = "audio/" + file;',
                  'voAudio.src = window.__audio(file);')

    # IIFE'nin başına asset sözlüğünü enjekte et: "(() => {\n  \"use strict\";"
    marker = '(() => {\n  "use strict";'
    if marker in g:
        g = g.replace(marker, marker + "\n" + assets_js, 1)
    else:
        # yedek: dosya başına koy
        g = assets_js + "\n" + g

    # index.html'i temel al, <link>/<script> yerlerine gömme yap
    html = read("index.html")
    # harici stylesheet linkini kaldır
    html = re.sub(r'\s*<link rel="stylesheet" href="style\.css" />', "", html)
    # og:image data-uri (attic) -> paylaşımda kırık kalmasın diye gömülü küçük sürüm
    if "bg_attic.png" in imgs:
        html = html.replace('content="images/bg_attic.png"',
                            'content="%s"' % imgs["bg_attic.png"])
    # </head>'ten önce <style> ekle
    style_block = "<style>\n%s\n</style>\n" % css
    html = html.replace("</head>", style_block + "</head>", 1)
    # <script src="i18n.js"></script> ve game.js -> gömülü scriptler
    html = html.replace('  <script src="i18n.js"></script>\n  <script src="game.js"></script>',
                        "  <script>\n%s\n</script>\n  <script>\n%s\n</script>" % (i18n, g))

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(html)

    size = os.path.getsize(OUT)
    print("\nOK -> %s" % OUT)
    print("Boyut: %.2f MB" % (size / 1024 / 1024))


def _js_obj(d):
    """Python dict -> tek satır JS nesnesi (değerler zaten güvenli base64/uri)."""
    parts = []
    for k, v in d.items():
        parts.append('"%s":"%s"' % (k, v))
    return "{" + ",".join(parts) + "}"


if __name__ == "__main__":
    main()

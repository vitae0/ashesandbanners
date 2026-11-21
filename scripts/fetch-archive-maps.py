#!/usr/bin/env python3
"""Fetch authentic public-domain map scans into the repository.

This is a *download* of scans, never a redraw or generation of borders.
The primary source / catalogue entry is saved in each metadata record.
Runs on CI because model container has no general internet access.
"""
import json
import pathlib
import urllib.parse
import urllib.request
from datetime import datetime, timezone

OUT = pathlib.Path("assets/maps")
OUT.mkdir(parents=True, exist_ok=True)
SOURCE = [
    ("polen-1939.jpg", "Polen 1939.jpg", 1600,
     "https://commons.wikimedia.org/wiki/File:Polen_1939.jpg", "Public domain"),
    ("warszawa-1935.png", "Warszawa 1935.png", 1600,
     "https://commons.wikimedia.org/wiki/File:Warszawa_1935.png", "Public domain"),
    ("lodz-1938.jpg", "Plan wojewodzkiego miasta Lodzi. ca 1938 (35842453).jpg", 1280,
     "https://commons.wikimedia.org/wiki/File:Plan_wojewodzkiego_miasta_Lodzi._ca_1938_(35842453).jpg", "Public domain"),
]


REGIONAL = [
 ("pomorskie", "WIG Mapa Operacyjna Polski - 44 Toruń 1933.jpg",1933),
 ("poznanskie", "WIG Mapa Operacyjna Polski - 53 Poznań 1935.jpg",1935),
 ("warszawskie", "WIG Mapa Operacyjna Polski - 55 Warszawa 1933.jpg",1933),
 ("lodzkie", "WIG Mapa Operacyjna Polski - 64 Łódź 1936.jpg",1936),
 ("kieleckie", "WIG Mapa Operacyjna Polski - 75 Kielce 1928.jpg",1928),
 ("slaskie", "WIG Mapa Operacyjna Polski - 84 Cieszyn 1934.jpg",1934),
 ("krakowskie", "WIG Mapa Operacyjna Polski - 74 Kraków 1925.jpg",1925),
 ("lubelskie", "WIG Mapa Operacyjna Polski - 66 Lublin 1932.jpg",1932),
 ("bialostockie", "WIG Mapa Operacyjna Polski - 46 Białystok 1929.jpg",1929),
 ("nowogrodzkie", "WIG Mapa Operacyjna Polski - 47 Nowogródek 1928 1931.jpg",1931),
 ("wilenskie", "WIG Mapa Operacyjna Polski - 37 Wilno 1930.jpg",1930),
 ("poleskie", "WIG Mapa Operacyjna Polski - 57 Pińsk 1933.jpg",1933),
 ("wolynskie", "WIG Mapa Operacyjna Polski - 77 Łuck 1928.jpg",1928),
 ("lwowskie", "WIG Mapa Operacyjna Polski - 86 Lwów 1928.jpg",1928),
 ("stanislawowskie", "WIG Mapa Operacyjna Polski - 97 Stanisławów-Czerniowce (Cernauti) 1930.jpg",1930)
]
for region, title, year in REGIONAL:
    SOURCE.append(("wig-"+region+".jpg",title,1600,
                   "https://commons.wikimedia.org/wiki/File:"+urllib.parse.quote(title), 
                   "Public domain; WIG original operational chart "+str(year)))
def download(target, original, width):
    # Commons thumbnail redirect. Avoid 40+ MB originals; request a modest preview.
    candidates=[
        "https://commons.wikimedia.org/wiki/Special:FilePath/"+urllib.parse.quote(original)+"?width="+str(width),
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/"+urllib.parse.quote(original)+"?width="+str(width),
    ]
    errors=[]
    for url in candidates:
        try:
            request=urllib.request.Request(url,headers={
                "User-Agent":"AshesAndBannersHistoricalAtlas/1.0 (historical maps; GitHub project vitae0/ashesandbanners)",
                "Accept":"image/avif,image/webp,image/*;q=0.8",
            })
            with urllib.request.urlopen(request,timeout=35) as rsp:
                data=rsp.read(8_000_001)
                ctype=rsp.headers.get("Content-Type","")
            if len(data)<20_000 or len(data)>8_000_000:
                raise RuntimeError("Unexpected downloaded file size: "+str(len(data)))
            if not (data[:3]==bytes([255,216,255]) or data[:8]==bytes([137,80,78,71,13,10,26,10])):
                raise RuntimeError("Downloaded content not JPG/PNG ("+ctype+")")
            target.write_bytes(data)
            return len(data)
        except Exception as exc:
            errors.append(str(exc))
    raise RuntimeError(" / ".join(errors))

metadata=[]
failures=[]
for target, original, width, source, rights in SOURCE:
    file=OUT/target
    try:
        size=file.stat().st_size if file.exists() and file.stat().st_size>20_000 else download(file,original,width)
        print(f"{target}: {size:,} bytes")
        metadata.append({"filename":target,"title":original,"source":source,"license":rights,"size":size})
    except Exception as exc:
        failures.append(f"{target}: {exc}")
(OUT/"SOURCES.json").write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
if failures:
    for msg in failures:print("Warning:",msg)
if not metadata:raise SystemExit("No historical maps could be downloaded")

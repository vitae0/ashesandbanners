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
            if not (data.startswith(b"\\xff\\xd8\\xff") or data.startswith(b"\\x89PNG\\r\\n\\x1a\\n")):
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

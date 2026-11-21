#!/usr/bin/env python3
"""Bundle public-domain historical city plan previews; never synthesize roads.

Wikimedia Commons file pages and license records are curated in
src/historical-city-plans.js. Restrict pixel dimensions for GitHub Pages.
Existing Warsaw (1935) and Łódź (1938) files are already bundled separately.
"""
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
import json

SOURCES = [
    ("city-katowice-1939.jpg", "Plan przewodnik na miasto Katowice 1939 (1430909).jpg", 1800, 1939),
    ("city-lwow-1938.jpg", "Horbaya Plan orientacyjny Wielkiego Lwowa. 1938.jpg", 1200, 1938),
    ("city-torun-1921.jpg", "Map of Torun 1921.jpg", 1800, 1921),
]
ROOT = Path("assets/maps")
ROOT.mkdir(parents=True, exist_ok=True)


def fetch(name: str, width: int):
    stems = [
      "https://commons.wikimedia.org/wiki/Special:FilePath/"+quote(name)+"?width="+str(width),
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/"+quote(name)+"?width="+str(width)
    ]
    failures=[]
    for url in stems:
        try:
            request=Request(url,headers={
                "User-Agent":"AshesAndBannersHistoricalCityPlans/1.0 (https://github.com/vitae0/ashesandbanners)",
                "Accept":"image/jpeg,image/png,image/*",
            })
            with urlopen(request,timeout=50) as response:
                body=response.read(9_000_001)
            if len(body)>9_000_000 or len(body)<12_000 or body[:3]!=b"\xff\xd8\xff":
                raise ValueError("Expected a reasonable JPEG archival thumbnail")
            return body
        except Exception as e:
            failures.append(str(e))
    raise RuntimeError(" ; ".join(failures))


missing=[]
manifest=[]
for file,commons_name,width,year in SOURCES:
    output=ROOT/file
    if output.exists() and output.stat().st_size>12_000:
        print("Cached:",file,output.stat().st_size)
    else:
        try:
            image=fetch(commons_name,width)
            output.write_bytes(image)
            print("Downloaded:",file,len(image))
        except Exception as e:
            print("WARNING:",file,e)
            missing.append(file)
            continue
    manifest.append({
        "file":file,"year":year,"original":commons_name,
        "source":"https://commons.wikimedia.org/wiki/File:"+quote(commons_name),
        "license":"Public domain; consult source for detailed rights"
    })
(ROOT/"CITY-SOURCES.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
if len(manifest)==0:
    raise SystemExit("Could not bundle any new public-domain city map")
if missing:
    print("Unbundled maps may still use existing source URL fallback:",missing)

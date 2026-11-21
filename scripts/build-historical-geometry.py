#!/usr/bin/env python3
"""Extract bounded 1938 Central Europe boundary polygons from Seshat Cliopatria.

The upstream geometry is academic reconstructed geographic data (CC BY 4.0).
Do not confuse the 1938 political reference layer with 1940 occupation zones.
Output is geographic coordinate geometry only, never any image or map tile.
"""
import io
import json
import re
import urllib.request
import zipfile
from pathlib import Path

from shapely.geometry import box, shape
from shapely.geometry.base import BaseGeometry

UPSTREAM = "https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/main/cliopatria.geojson.zip"
OUT = Path("src/historical-geometry.js")
BBOX = box(6.0, 45.0, 37.7, 59.5)
YEAR = 1938
MATCH = re.compile(
    r"poland|polish|german|reich|soviet|russia|roman|hungar|czechoslovak|czech|slovak|"
    r"lithuan|latvia|eston|denmark|swed|finland|austria|yugoslav|switzerland|"
    r"italy|danzi|free city|bohemia|prussia",
    re.I,
)


def rings_from(geometry: BaseGeometry):
    """Serialize visible, simplified, clipped polygon exteriors (no fake joins)."""
    if geometry.is_empty:
        return []
    simplified = geometry.intersection(BBOX).simplify(0.014, preserve_topology=True)
    if simplified.is_empty:
        return []
    shapes = [simplified] if simplified.geom_type == "Polygon" else list(getattr(simplified, "geoms", []))
    output = []
    for part in shapes:
        if part.geom_type == "Polygon":
            if part.area > 0.002:
                ring = [[round(x, 4), round(y, 4)] for x, y in part.exterior.coords]
                if len(ring) > 3:
                    output.append(ring)
        elif part.geom_type == "MultiPolygon":
            output.extend(rings_from(part))
    return output


def main():
    request = urllib.request.Request(UPSTREAM, headers={"User-Agent": "AshesAndBanners-HistoricalVectorBuild/1.0"})
    with urllib.request.urlopen(request, timeout=180) as res:
        archive = res.read()
    with zipfile.ZipFile(io.BytesIO(archive)) as zf:
        geojson_name = next(name for name in zf.namelist() if name.lower().endswith(".geojson"))
        data = json.loads(zf.read(geojson_name))
    features = data["features"] if isinstance(data, dict) else data
    countries = []
    candidates = {}
    for f in features:
        props = f.get("properties") or {}
        name = str(props.get("Name") or props.get("NAME") or "")
        if not name or not MATCH.search(name):
            continue
        try:
            from_year = int(props.get("FromYear", -5000))
            to_year = int(props.get("ToYear", 3000))
        except (ValueError, TypeError):
            continue
        if not (from_year <= YEAR <= to_year):
            continue
        if str(props.get("Type", "POLITY")).upper() != "POLITY":
            continue
        try:
            geom = shape(f["geometry"])
            if not geom.intersects(BBOX):
                continue
            rings = rings_from(geom)
        except Exception as exc:
            print("Skipping malformed geometry:", name, str(exc)[:200])
            continue
        if not rings:
            continue
        candidates.setdefault(name, []).extend(rings)
    for name, rings in sorted(candidates.items()):
        countries.append({"name": name, "rings": rings})
    country_names = [c["name"] for c in countries]
    print("Year:", YEAR, "country polygons:", len(countries), "names:", country_names)
    if not any(("poland" in n.lower() or "polish" in n.lower()) for n in country_names):
        raise RuntimeError("A Poland polygon was not found for 1938. Refusing to publish bad data.")
    output = (
        "// Generated from Seshat Global History Databank Cliopatria, 1938. CC BY 4.0.\n"
        "// https://github.com/Seshat-Global-History-Databank/cliopatria\n"
        "// Borders are historical reconstructions, not surveyed cadastral boundaries.\n"
        "export const HISTORICAL_YEAR = 1938;\n"
        "export const HISTORICAL_COUNTRIES = "
        + json.dumps(countries, ensure_ascii=False, separators=(",", ":")) + ";\n"
    )
    OUT.write_text(output, encoding="utf-8")
    print("Wrote", OUT, len(output), "bytes; rings:", sum(len(c["rings"]) for c in countries))


if __name__ == "__main__":
    main()

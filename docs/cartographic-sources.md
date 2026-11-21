# Cartographic sources and verification policy

## Rule: no invented geography

**Historical authenticity overrides feature completeness.** The game is set in occupied Poland from 1 January 1940, but the underlying reference atlas comes from the late **Second Polish Republic in 1939**. This is a cartographic reference showing the shape of Poland and its neighboring countries *before* partition, **not** a claim that a sovereign Republic of Poland still existed in January 1940.

What the game currently has:

| Layer | Authentic original | Coverage | Geometry confidence |
|---|---|---|---|
| National archive | **1939 German military map, *POLEN*** | Poland and its neighbors | Real period map scan; interactive region markers are approximate calibrated points, **not boundary polygons** |
| Warsaw city | **1935 Warsaw municipal planning map** | Warsaw city and suburbs | Real prewar city street map; selected historical landmark **point coordinates**, not surveyed building footprints |
| Łódź city | **c. 1938 city plan of Łódź** | Łódź and suburbs | Real prewar city plan; selected historical landmark **point coordinates**, not surveyed building footprints |
| Remaining cities | 1939 national map only | 16 1939-era regions; named towns | **No fake city blocks / fabricated parcels**; full city GIS not yet available |

## Original historical imagery

**National map**
- Title: *Polen* (German military print, 1939).
- Original printed map, with surrounding countries and prewar Polish frontiers.
- Commons original: https://commons.wikimedia.org/wiki/File:Polen_1939.jpg
- Commons page labels work as public-domain; verify jurisdiction for redistribution outside the EU.
- Cached file (when bundle workflow succeeds): `assets/maps/polen-1939.jpg`.

**Warsaw**
- Title: `Warszawa 1935.png`.
- 1935 municipal map issued by Dział Regulacji i Pomiarów, Warszawa city government; original scale 1:100,000 (note source legend).
- Commons: https://commons.wikimedia.org/wiki/File:Warszawa_1935.png
- Public domain, anonymous historical published work (per Commons).
- Cached file: `assets/maps/warszawa-1935.png`.
- Additional detailed source for later GIS digitization: `Plan miasta stołecznego Warszawy` (1935), scale 1:20,000, Warsaw municipal surveying office, held by RCIN: https://rcin.org.pl/igipz/dlibra/publication/25139/edition/13420
- Authentic 1935 georeferenced aerial imagery: `Fotoplan Warszawa 1935` (ArcGIS, municipal collection): https://tiles.arcgis.com/tiles/nUcjrqWsFQHuJZnu/arcgis/rest/services/Fotoplan_1935/MapServer . This is **raster**, not a vector set of surveyed 1939 footprints.

**Łódź**
- Title: `Plan wojewódzkiego miasta Łodzi` (circa 1938).
- Publisher: Główna Księgarnia Wojskowa; digitized by Polona / National Library of Poland.
- Commons: https://commons.wikimedia.org/wiki/File:Plan_wojewodzkiego_miasta_Lodzi._ca_1938_(35842453).jpg
- Public domain (per Commons).
- Cached file: `assets/maps/lodz-1938.jpg`.

**Broader source for authentic local plans**
- [Mapster / WIG original 1:25,000 and 1:100,000 topographical maps](https://igrek.amzp.pl/) for other towns and rural settlements.
- [Polish Academy of Sciences Atlas Fontium](https://atlasfontium.pl/en/maps-of-the-past/), georeferenced early historical maps. Terms **CC BY-NC 4.0**; check license before reuse or bundling.
- [Warszawa1939.pl 1935 photographic plan](https://www.warszawa1939.pl/fotoplan), specialized building-history annotations and 1935 images. Third-party maps have their own terms.

## Current selectable geographic objects

The map currently exposes **up to 15 historically named urban landmarks and five surrounding real settlements** for Warsaw, and **12 urban places and five surrounding settlements** for Łódź. Their entries are in `src/archival-atlas-data.js`.

Each includes an approximate latitude and longitude to help developers align **future** verified polygons. These coordinates are NOT sources of a verified building footprint, not guaranteed surveying-grade, and no visible vector polygons have been synthesized from them. A settlement is a single gameplay destination, not a fake 1940 settlement boundary.

For other cities no historically verified building-level vector dataset has yet been incorporated. Therefore they show genuine archival maps without fake selectable buildings. This is intentional, not a broken missing-feature fallback.

## What is necessary for real polygons

1. Acquire a legally reusable 1930–1940 source map for the city/village with enough precision to resolve parcel outlines (ideally 1:2,500–1:10,000). Note some maps show blocks, not individual parcels.
2. **Georeference** it against identifiable historical controls, with residual error measured and recorded.
3. Digitize or acquire an independent surveyed vector polygon only when the boundary is actually visible in the original. **Do not buffer a coordinate into an invented rectangle or draw a road grid**.
4. For each building/polygon save `source_id`, `source_year`, `original_scale`, `geometry`, `crs`, `georeference_error_m`, `name_confidence` and `historically_verified`.
5. Create 10–15 *sourced* central lots per city, plus 4–5 real rural settlement extents where the source permits. Mark incomplete towns as incomplete rather than guessing.
6. Validate historical date and site status independently: a building that exists now may not have existed in 1940.
7. Use region-specific occupation control **dated** to 1940–45, separate from the 1939 prewar boundary reference.

## Bundling

The repository has `scripts/fetch-archive-maps.py` and `.github/workflows/bundle-archival-maps.yml`. The GitHub workflow attempts to bundle downsampled public-domain original scans with a `SOURCES.json` provenance manifest. If a file is not yet bundled, the viewer falls back to Commons automatically.

**There is no claim that the exact 1939 city parcel polygon requirement is finished.** It cannot be made truthful by drawing arbitrary colored shapes over a photograph.

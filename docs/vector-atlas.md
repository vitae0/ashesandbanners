# Historical Vector Geography, Zoom and City Plans

## Sources and rights

The live country layer uses geographical polygons from **Cliopatria (Seshat Global History Databank)**, accessed from `https://github.com/Seshat-Global-History-Databank/cliopatria`. The data are offered under **CC BY 4.0** and are credited here and in the generated module. Citation: Bennett, J. S., Mutch, E., Tollefson, A., et al. (2025), *Cliopatria: A geospatial database of world-wide political entities from 3400 BCE to 2024 CE*, *Scientific Data* 12, 247. DOI: https://doi.org/10.1038/s41597-025-04516-9.

`scripts/build-historical-geometry.py` extracts **1938** polygon rows for the Second Polish Republic and surrounding states and clips them to a Central-European bounding box. The script simplifies line geometry to roughly **0.014 geographic degrees** using Shapely in CI. `.github/workflows/historical-geometry.yml` bundles the generated `src/historical-geometry.js` locally. The web app has **no runtime dependence on geographic services, image files or map tiles**.

This dataset is a published historical reconstruction, **not an exact official September 1939 survey**. We use 1938 boundaries because they are close to the start-of-war layout while freely redistributable. Corrections made during 1938 and early 1939 and small border enclaves may be absent. Some neighboring polities are smoothed more strongly in the upstream dataset. Never claim this is an exact cadastral or treaty-line copy.

Useful external comparisons, **not incorporated or redistributed**:
- *Rzeczpospolita Polska, Mapa administracyjna, 1 April 1939*, Polish Central Statistical Office, public-domain scan via https://maproom.geshergalicia.org/galicia/poland-interwar-1939-1/
- Polish Institute of National Remembrance, *The Occupation of Poland from 1939 to 1941*, which distinguishes annexed zones, General Government and Soviet territories: https://eng.ipn.gov.pl/download/2/49758/WalczacaRzeczpospolitaEN.pdf
- *Poland (1938) location map with voivodeships.svg*, author Obivan Kenobi, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Poland_(1938)_location_map_with_voivodeships.svg (reference only, not copied).

The University of Minnesota **1939 national border service was not incorporated**, because its documented terms restrict redistribution or commercial products without additional permission.

## Geographic layers and accuracy

The polygon geometry from `HISTORICAL_COUNTRIES` supplies the visible national outline, coastline and surrounding state shapes. The **strong gold Polish frontier** follows the geographic Polish polygon where available. The hand-written fallback polygon is retained only as protection if the data build has not been run.

The **January 1940 occupation overlays** (Germany-annexed west, General Government, Soviet-occupied east) remain lower-fidelity schematic shapes, clipped within the source-based Polish outline. The fixed internal voivodeship guides are *schematic*. These are different temporal and accuracy levels and are not suited for territorial statistics or legal/administrative boundary analysis. The 1940 reference does **not** automatically evolve with wartime gameplay.

## Pan / zoom interaction

- Wheel up/down: magnify or reduce the strategy map about the cursor.
- Drag with primary pointer (including touch): pan inside the map.
- Toolbar `+` and `−`: zoom with increment factor 1.25.
- `⤢ Tümü`: reset zoom/pan and return to strategic view.
- Strategic camera is clamped from **1× to 4×**; it cannot leave the map canvas. The city window has its own independent **1× to 2.5×** zoom, drag-pan and reset buttons.
- Region markers are still selectable by click, Enter and Space. The camera state remains when switching panels.

## Period city maps drawn exclusively with SVG polygons

The **active city viewer displays no photos, archival bitmaps, raster tiles or SVG `<image>` elements**. It does not make up streets or individual houses.

Historical **source maps**, retained only as build inputs, are processed offline by `scripts/vectorize-historic-city-scans.py`. OpenCV extracts historical cartographic ink areas at reduced display resolution and simplifies each outline into an **ordered SVG `<polygon>` contour**. The generated `src/historical-city-vectors.js` is a static, self-contained JavaScript coordinate dataset. GitHub Actions workflow `city-vectors.yml` regenerates and commits it when the extraction script changes. The actual source photographs/scans are **never inserted into the playable city view**.

### Existing vector-traced city maps

| City | Historical source year | Origin | Digitized output |
| --- | --- | --- | --- |
| Warszawa | 1935 | Municipal street plan | 6,910 source polygons |
| Łódź | c.1938 | Voivodeship street plan | 5,850 source polygons |
| Katowice | 1939 | Contemporary guide plan | 5,409 source polygons |
| Lwów | 1938 | Horbaya orientation plan | 6,184 source polygons |
| Toruń | 1921 | Contemporary town plan | 7,163 source polygons |

Total **31,516 polygons**, extracted from original inked period maps. The colorized area geometry follows the shape and placement of source map markings. Lines, printed labels, and other map graphics are part of the tracing. **These polygons are not verified individual building footprints and are not georeferenced OSM parcels or structured roads.** Digitizing a printed map's ink is not equivalent to independently identifying each historical structure or road type.

The visual layer is styled into parchment, low-saturation ink and dark cartographic lines. Existing **2.5×** zoom and pan still operate through SVG `viewBox`.

### Coverage limitations

The nine WIG military regional map references are **1:300,000 regional sheets** and therefore do not establish individual street plans. They are offered as research links and *not* rendered as city geometry. Brześć and Tarnopol have no approved period street plan. All eleven regions without source-derived city polygons show an explicit **missing historical city polygons** state, rather than invented buildings, falsely verified village landmarks or a photo.

Additional **not embedded** primary-source references:

- [1938 Kraków street plan](https://dawnemapykrakowa.pl/map/1938-plan-miasta-krakowa/) (digital-rights restrictions)
- [1937 Wilno street plan](https://pbc.biaman.pl/dlibra/publication/12353/edition/11784) (PDF format, not yet digitized into verified polygon coordinates)
- [1939 Białystok development project](https://commons.wikimedia.org/wiki/File:Bia%C5%82ystok_general_city_plan_1939_01.jpg) (planning proposal, not as-built streets)
- [1937 Łuck city planning proposal](https://jbc.bj.uj.edu.pl/Content/369036/PDF/NDIGCZAS016782_1937_008_009.pdf) (not an as-built record)

The **15 Warszawa and 10 Łódź individually verified site records** remain separately accessible. They are **not** spatially pinned to uncalibrated scans, and the game's rules do not assume ink polygons equal exact historical buildings.

### Data reproducibility

Execute `python -m pip install numpy opencv-python-headless`, then `python scripts/vectorize-historic-city-scans.py` with the five archival build inputs in `assets/maps/`. Re-running deterministically produces the country-independent `src/historical-city-vectors.js`. The origin and archival-rights references remain in `src/historical-city-plans.js` and `assets/maps/CITY-SOURCES.json`.

## Tests

Run `npm test` in the repository. Tests check source-border polygons, five historical ink-contour data sets, **zero image elements in active map markup**, valid traced polygons, honest missing-city states, bounded zoom and unchanged verified-building restrictions.

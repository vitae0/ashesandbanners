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

## Orthographic city maps

Cities **no longer show perspective cityscapes**. Clicking any one of the 16 voivodeship centres opens a top-down SVG map with streets, cadastral-*style* blocks, road intersections, colored roof footprint polygons, industrial lots, railway, plazas, green spaces and peripheral villages. Roofs are deliberately top-down: no building facades, horizons or sky gradients.

**Caution:** city street networks and symbolic rooftops are **procedural game graphics**, not precise 1939 street surveys. The villages named `KÖY 1–3` are symbolic and not verified individual settlements. Verified 1940-era buildings in Warsaw (15) and Łódź (10) are separately listed and preserve source links and eligibility rules. Other city portraits do not enable undocumented building actions.

## Tests

Run `npm test` in the repository. Tests check source-derived national geometry and licensing notice, 16 selectable region/city windows, deterministic top-down building layers, no runtime image references, bounded camera zoom and preserved historic building whitelist.

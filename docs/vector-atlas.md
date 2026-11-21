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

## Authentic bird's-eye period maps

The old **procedurally invented streets, houses, city blocks and villages** were removed from the active city viewer. The interactive city window now presents **original map facsimiles**, not a modern basemap and not a fictional illustration. Separate source records live in `src/historical-city-plans.js`.

### City-scale scanned plans

| City | Historic record | Year | Source resolution |
| --- | --- | --- | --- |
| Warszawa | Municipal street plan | 1935 | ~1:20,000, bundled locally |
| Łódź | Voivodeship city street plan | c.1938 | ~1:20,000, bundled locally |
| Katowice | `Plan przewodnik na miasto Katowice` | 1939 | City guide map; locally bundled |
| Lwów | Horbaya orientation plan | 1938 | 670×573 original; locally bundled |
| Toruń | Original town street plan | 1921 | Document predates 1939 by 18 years; locally bundled |

All five scans have Wikimedia Commons file-page sources, identified and dated in the source registry. Their original scanned content is used: **not auto-reshaped into invented property footprints**. The city window keeps the previously implemented 2.5× pan/zoom controls.

### Other locations and uncertainty

Where an authentic downloadable city plan has not been integrated, the game uses an **interwar Polish Military Geographical Institute (WIG) 1:300,000 regional sheet**, clearly labelled as such. These WIG sheets give genuine area geography but **cannot show street-by-street city blocks or individual buildings**. In particular, the Pińsk sheet is not presented as a map of Brześć, nor is the Lwów sheet presented as a map of Tarnopol. For these cities the UI shows a missing-plan state rather than a false street network.

Further documented maps are cited but deliberately **not** bundled without fully cleared reproduction rights or compatible formats:

- [1938 Kraków street plan, Adam Launer / Cartographia Cracoviana](https://dawnemapykrakowa.pl/map/1938-plan-miasta-krakowa/) (1:10,000; the digital copy is marked © Jakub Wojkowski).
- [1937 Wilno street plan, Podlaska Digital Library](https://pbc.biaman.pl/dlibra/publication/12353/edition/11784) (1:12,500; downloadable PDF, not yet repackaged as a city image).
- [1939 Białystok city development plan](https://commons.wikimedia.org/wiki/File:Bia%C5%82ystok_general_city_plan_1939_01.jpg) (a proposal, **not proof that all depicted roads and buildings existed**).
- [1937 Łuck urban planning project](https://jbc.bj.uj.edu.pl/Content/369036/PDF/NDIGCZAS016782_1937_008_009.pdf) (proposed extensions are not historical fact).

Every scanned city map retains its original publication year. An older street plan is never labelled an exact 1940 survey. The existing 15 Warszawa and 10 Łódź individual historical building records remain separately linked and date-restricted. **Those place records are not spatially overlaid over uncalibrated scans**, because their pixel-to-geo alignment has not been verified.

### Packaging

Run `python scripts/fetch-city-plans.py` or the `Bundle historic city plans` GitHub Actions workflow to cache the additional Commons public-domain scans into `assets/maps/city-*.jpg`. `assets/maps/CITY-SOURCES.json` records their original URLs and attribution. The original 1935 Warszawa and c.1938 Łódź files are already in `assets/maps/`.

## Tests

Run `npm test` in the repository. Tests check original-source country polygons, the five verified city scan records, a valid city-map or explicitly absent state for all sixteen centres, no synthetic road/building generation in the active city viewer, bounded camera zoom and the preserved building whitelist.

# Ashes and Banners

A browser-based, 2D historical resistance-management strategy game. **The player commands a clandestine organization, not a state.**

## First scenario: Occupied Poland, January 1940

The game is a browser-based 2D resistance-management strategy game. The command UI is organized like a grand-strategy game: **top command menu**, **left-side management panels**, and **full-screen views** for political and military systems. The playable undercover network remains limited to Warsaw and Łódź, but all 16 interwar Polish voivodeships can be opened for a symbolic illustrated city view.

- **Source-based vector political map:** `src/polygon-board.js` renders a cached **1938 Polish national frontier** and surrounding states extracted from the **Cliopatria Seshat historical atlas (CC BY 4.0)**, alongside approximate **January 1940** occupation partitions. The interface uses inline SVG only; **no bitmap or network-fetched imagery is used at runtime**.
- **16 selectable provincial centres:** Toruń, Poznań, Warszawa, Łódź, Kielce, Katowice, Kraków, Lublin, Białystok, Nowogródek, Wilno, Brześć, Łuck, Lwów, Tarnopol and Stanisławów. Dots open a city window.
- **Bird’s-eye polygon city plans:** Clicking a city shows deterministic **top-down** SVG streets, rooftops, blocks, plazas, factories, parks, railways and peripheral symbolic villages, not a landscape illustration. These buildings are game graphics, not real surveyed village or building geometry.
- **Historical honesty:** The imported **1938 borders are historical reconstructions**, not an exact 1 September 1939 official survey. The 1940 occupation polygons and intra-Poland administrative dividers remain schematic. City buildings/villages are symbolic, not true historical building footprints. The sector layer is a **fixed January 1940 reference even as gameplay time advances**.
- **Verified building interactions remain separate:** Warsaw has 15 documented pre-1940 sites and Łódź 10. Only these documented records offer building/organization actions. Restricted, requisitioned and destroyed historical sites obey date-dependent access rules. A viewable synthetic polygon does not turn into a fictional historical building or safehouse. See `docs/verified-buildings.md`.
- Gameplay: difficulty, alternate history, seeded RNG, cell recruitment and hierarchy, commanders and standing orders, abstract operations, political contacts, conditional milestones, external war simulation, save/import/export and alternate endings.
- The old archival raster map assets and `src/period-board.js` are retained as **legacy research references only**. The live map imports `cityBuildings` for documented-site records but never renders historical scans. Strategy map pan and zoom are capped at **4×** with wheel, drag, and toolbar controls.

For implementation and accuracy limits, see [Vector atlas documentation](docs/vector-atlas.md).

### Important historical distinction

The game begins as a *fictional local ZWZ-associated resistance network* in January 1940. The ZWZ was renamed **Armia Krajowa** in February 1942; **Gwardia Ludowa** formed in 1942 and **Armia Ludowa** in 1944. Four political paths, including independent AK and AL variants, are explicitly *alternative-history branches*, not claims that all four existed in 1940.

The current cartographic UI uses **bundled Seshat/Cliopatria 1938 geographic border polygons in SVG**, with simplified occupation zone overlays for January 1940. These are different historical moments, deliberately labelled as such. All 16 provinces provide city portraits; **only Warszawskie and Łódzkie accept new clandestine cells or documented building connections**. See [vector atlas limitations](docs/vector-atlas.md) and [archival research sources](docs/cartographic-sources.md).

### Run locally

No bundler needed. Serve the repo as a static site:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080/
```

The current map requires no map library, raster image or network connection at runtime. Country polygon assets are compiled once by GitHub Actions from CC BY 4.0 Cliopatria GeoJSON and committed locally. GitHub Pages can publish the repository root.

### Test

```sh
npm test
```

Node.js 20+ recommended. Pure simulation logic is in `src/engine.js`, command UI in `src/app.js`, and credited country polygons in `src/historical-geometry.js`, with pan/zoom and overhead city drawings in `src/polygon-board.js`.

### Archived cartographic research (not loaded by the live map)
- [1939 German military chart *Polen* (public domain)](https://commons.wikimedia.org/wiki/File:Polen_1939.jpg)
- [1935 Warsaw municipal map (public domain)](https://commons.wikimedia.org/wiki/File:Warszawa_1935.png)
- [ca. 1938 Łódź city plan, Polona (public domain)](https://commons.wikimedia.org/wiki/File:Plan_wojewodzkiego_miasta_Lodzi._ca_1938_(35842453).jpg)
- [Full inventory, coverage/accuracy warnings and license verification](docs/cartographic-sources.md).

### Engineering principles

No state-administration economy; no unconditional +300 rewards masquerading as political events; no uncapped institutional stacking; no deterministic early German defeat; no modern administrative boundaries masquerading as 1940; no generated street grids or fake 1939 building polygons; archival source attribution required. Source code is separated into data, simulation and UI. All random outcomes use the saved seed.

Licence: project code MIT (see LICENSE). Legacy public-domain archive sources retain their applicable provenance requirements; no external map tiles or images are loaded by the live UI.

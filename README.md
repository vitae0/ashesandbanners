# Ashes and Banners

A browser-based, 2D historical resistance-management strategy game. **The player commands a clandestine organization, not a state.**

## First scenario: Occupied Poland, January 1940

The game is a browser-based 2D resistance-management strategy game. The command UI is organized like a grand-strategy game: **top command menu**, **left-side management panels**, and **full-screen views** for political and military systems. The playable undercover network remains limited to Warsaw and Łódź, but all 16 interwar Polish voivodeships can be opened for a symbolic illustrated city view.

- **Entirely vector-rendered political map:** `src/polygon-board.js` renders a manually authored approximate **1939 Polish external frontier**, nearby states and the **January 1940** administrative/occupation partitions: German-annexed territories, the General Government and Soviet-occupied eastern Poland. All territory, labels, city points and borders are SVG shapes; **no bitmap or network-fetched imagery is used in the current map**.
- **16 selectable provincial centres:** Toruń, Poznań, Warszawa, Łódź, Kielce, Katowice, Kraków, Lublin, Białystok, Nowogródek, Wilno, Brześć, Łuck, Lwów, Tarnopol and Stanisławów. Dots open a city window.
- **Polygon city scenes:** Each city view contains deterministic SVG silhouettes with stylized row houses, apartments, public buildings, churches, factories and surrounding rural settlements. The village houses are each a single symbolic building, not real surveyed village geometry.
- **Historical honesty:** **1939 borders and 1940 occupation sectors are approximate hand-drawn display geometry**, not exact geographic/cadastral datasets. Buildings and villages inside city drawings are fictionalized icons, not historical footprint polygons or named actual sites. The sector layer is a **fixed January 1940 reference even as gameplay time advances**.
- **Verified building interactions remain separate:** Warsaw has 15 documented pre-1940 sites and Łódź 10. Only these documented records offer building/organization actions. Restricted, requisitioned and destroyed historical sites obey date-dependent access rules. A viewable synthetic polygon does not turn into a fictional historical building or safehouse. See `docs/verified-buildings.md`.
- Gameplay: difficulty, alternate history, seeded RNG, cell recruitment and hierarchy, commanders and standing orders, abstract operations, political contacts, conditional milestones, external war simulation, save/import/export and alternate endings.
- The old archival raster map assets and `src/period-board.js` are retained as **legacy research references only**. They are not imported by the live atlas except for `cityBuildings` data mapping, which does not render or fetch images.

For implementation and accuracy limits, see [Vector atlas documentation](docs/vector-atlas.md).

### Important historical distinction

The game begins as a *fictional local ZWZ-associated resistance network* in January 1940. The ZWZ was renamed **Armia Krajowa** in February 1942; **Gwardia Ludowa** formed in 1942 and **Armia Ludowa** in 1944. Four political paths, including independent AK and AL variants, are explicitly *alternative-history branches*, not claims that all four existed in 1940.

The current cartographic UI is a **manually constructed SVG approximation**. The thick border depicts prewar 1939 Poland; the internal shaded sectors depict a simplified occupation reference for January 1940. These are different historical moments, deliberately labelled as such. All 16 provinces provide city portraits; **only Warszawskie and Łódzkie accept new clandestine cells or documented building connections**. See [vector atlas limitations](docs/vector-atlas.md) and [archival research sources](docs/cartographic-sources.md).

### Run locally

No bundler needed. Serve the repo as a static site:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080/
```

The current map requires no map library, raster image or network connection. It uses inline SVG drawn from JavaScript point arrays and polygons. GitHub Pages can publish the repository root.

### Test

```sh
npm test
```

Node.js 20+ recommended. Pure simulation logic is in `src/engine.js`, command UI in `src/app.js`, and polygon geography and city scenes in `src/polygon-board.js`.

### Archived cartographic research (not loaded by the live map)
- [1939 German military chart *Polen* (public domain)](https://commons.wikimedia.org/wiki/File:Polen_1939.jpg)
- [1935 Warsaw municipal map (public domain)](https://commons.wikimedia.org/wiki/File:Warszawa_1935.png)
- [ca. 1938 Łódź city plan, Polona (public domain)](https://commons.wikimedia.org/wiki/File:Plan_wojewodzkiego_miasta_Lodzi._ca_1938_(35842453).jpg)
- [Full inventory, coverage/accuracy warnings and license verification](docs/cartographic-sources.md).

### Engineering principles

No state-administration economy; no unconditional +300 rewards masquerading as political events; no uncapped institutional stacking; no deterministic early German defeat; no modern administrative boundaries masquerading as 1940; no generated street grids or fake 1939 building polygons; archival source attribution required. Source code is separated into data, simulation and UI. All random outcomes use the saved seed.

Licence: project code MIT (see LICENSE). Legacy public-domain archive sources retain their applicable provenance requirements; no external map tiles or images are loaded by the live UI.

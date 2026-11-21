# Ashes and Banners

A browser-based, 2D historical resistance-management strategy game. **The player commands a clandestine organization, not a state.**

## First scenario: Occupied Poland, January 1940

The first playable tactical geography is deliberately limited to **Warsaw and Łódź**, the cities for which building-by-building prewar source records have been added. The 1939 map still shows Poland and surrounding countries. You start with seven cells in these two verified regions; the rest of the country participates only in the *abstract background war simulation* until individually documented buildings are available.

- Playable scenario setup: difficulty, historical/alternate history, randomness, event frequency, starting resources, simulation speed, and theme.
- **Original, source-backed map:** The primary strategic view displays the **1939 historic German military chart of Poland**, with neighboring countries and the historical Polish territory visible. This is a real archived map scan, not hand-drawn geography.
- **Real city plans:** Warsaw uses the **1935 Warsaw municipal plan**, Łódź uses the **circa-1938 Łódź plan**. Both originate from archival public-domain scans.
- **Source whitelist:** Exactly **9 Warsaw and 5 Łódź pre-1940 documented buildings** are selectable. The original 15+5 and 12+5 unverified site/village catalogues, parks, city squares, rural settlement placeholders, and clickable unsupported towns have been deleted. Each retained building has an explicit historical reference URL and address. See `docs/verified-buildings.md`.
- **No fictitious historical parcels:** Buildings appear as source-linked name entries with **approximate reference coordinates**, not invented building polygons; authentic city maps are shown beside these entries. Historic cadastral polygons remain unavailable/unimplemented.
- **No invented shapes:** The old fake province Voronoi polygons, fake 24-building grids, geometric city blocks and uncited village points were deleted. Accurate historical *building footprint polygons* remain pending source-by-source historical digitization; the game does not pretend modern OSM buildings are 1940 buildings.
- **Archive assets:** The repository includes a downloader workflow for source-credited map scans under `assets/maps/`. Until cached assets exist, image requests fall back to Wikimedia Commons.
- Cells, personnel, specialization, fatigue, secrecy, operations, commanders, standing orders, automation and five centralization levels.
- Sabotage/operations management with suitability-based automatic cell selection, consequences, risk, and resources; a strategic simulation, not a real-world operational guide.
- Conditional, player-confirmed milestones focused on political organization and narrative unlocks, four alternate-history pathways, dynamic historical events and decisions.
- External war simulation beginning 22 June 1941, historically bounded alternate outcomes, multiple possible endings, suppression and a 4–18-month reorganization option.
- Saves in localStorage plus JSON export/import, deterministic seeded simulation, and Node test runner.

### Important historical distinction

The game begins as a *fictional local ZWZ-associated resistance network* in January 1940. The ZWZ was renamed **Armia Krajowa** in February 1942; **Gwardia Ludowa** formed in 1942 and **Armia Ludowa** in 1944. Four political paths, including independent AK and AL variants, are explicitly *alternative-history branches*, not claims that all four existed in 1940.

The cartographic base is a **genuine historical printed map**, not a synthetic outline. **Only Warszawa/Warszawskie and Łódź/Łódzkie accept new cells or building connections.** The displayed national map is a **1939 prewar** chart and thus **does not directly describe January 1940 sovereignty**: by that date the Polish territory had been partitioned and occupied. Political occupation is modeled separately. Local site coordinates and selectable names are references, not surveyed wartime parcel boundaries. Historical polygonal cadastral information is not yet available for every city. See [cartographic source register](docs/cartographic-sources.md).

### Run locally

No bundler needed. Serve the repo as a static site:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080/
```

Simulation runs locally with no map libraries. The browser reads archived raster files from `assets/maps/` if the bundling workflow has committed them; otherwise it loads genuine maps from Wikimedia Commons, requiring network access. GitHub Pages can publish from the repository root once Pages is configured.

### Test

```sh
npm test
```

Node.js 20+ recommended. Pure simulation logic is in `src/engine.js`, UI and map in `src/app.js`.

### Cartographic provenance
- [1939 German military chart *Polen* (public domain)](https://commons.wikimedia.org/wiki/File:Polen_1939.jpg)
- [1935 Warsaw municipal map (public domain)](https://commons.wikimedia.org/wiki/File:Warszawa_1935.png)
- [ca. 1938 Łódź city plan, Polona (public domain)](https://commons.wikimedia.org/wiki/File:Plan_wojewodzkiego_miasta_Lodzi._ca_1938_(35842453).jpg)
- [Full inventory, coverage/accuracy warnings and license verification](docs/cartographic-sources.md).

### Engineering principles

No state-administration economy; no unconditional +300 rewards masquerading as political events; no uncapped institutional stacking; no deterministic early German defeat; no modern administrative boundaries masquerading as 1940; no generated street grids or fake 1939 building polygons; archival source attribution required. Source code is separated into data, simulation and UI. All random outcomes use the saved seed.

Licence: project code MIT (see LICENSE). External geo/OSM datasets retain their respective licenses.

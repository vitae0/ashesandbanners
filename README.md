# Ashes and Banners

A browser-based, 2D historical resistance-management strategy game. **The player commands a clandestine organization, not a state.**

## First scenario: Occupied Poland, January 1940

A substantial opening campaign around Warsaw, Łódź, Kraków, Lublin and surrounding Polish regions. You start with seven independent cells and can grow into a decentralized network or a command hierarchy.

- Playable scenario setup: difficulty, historical/alternate history, randomness, event frequency, starting resources, simulation speed, and theme.
- Interactive OpenStreetMap map with real geographic coordinates, administrative region/county boundaries, and city-scale OpenStreetMap building footprints when available.
- Province and county influence heatmaps; clickable regions and real map features; asset/safehouse placement and bounded, diminishing-return institutional effects.
- Cells, personnel, specialization, fatigue, secrecy, operations, commanders, standing orders, automation and five centralization levels.
- Sabotage/operations management with suitability-based automatic cell selection, consequences, risk, and resources; a strategic simulation, not a real-world operational guide.
- Conditional, player-confirmed milestones focused on political organization and narrative unlocks, four alternate-history pathways, dynamic historical events and decisions.
- External war simulation beginning 22 June 1941, historically bounded alternate outcomes, multiple possible endings, suppression and a 4–18-month reorganization option.
- Saves in localStorage plus JSON export/import, deterministic seeded simulation, and Node test runner.

### Important historical distinction

The game begins as a *fictional local ZWZ-associated resistance network* in January 1940. The ZWZ was renamed **Armia Krajowa** in February 1942; **Gwardia Ludowa** formed in 1942 and **Armia Ludowa** in 1944. Four political paths, including independent AK and AL variants, are explicitly *alternative-history branches*, not claims that all four existed in 1940.

The present proof-of-concept uses **present-day administrative boundaries** (geoBoundaries; Poland ADM1/ADM2) and OpenStreetMap building data as an interactive geographic scaffold. They are **not 1939–1945 historical administrative borders or building records**. A future historical GIS layer must replace them for historically exact province/district polygons and demolished/rebuilt structures. This limitation is shown in-game.

### Run locally

No bundler needed. Serve the repo as a static site:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080/
```

Requires internet access for Leaflet, OpenStreetMap tiles, geoBoundaries boundary files, and Overpass building outlines. Without those services the simulation remains playable, but the live geographic layers are unavailable. GitHub Pages can publish from the repository root.

### Test

```sh
npm test
```

Node.js 20+ recommended. Pure simulation logic is in `src/engine.js`, UI and map in `src/app.js`.

### Provenance

- Historical groundwork: Institute of National Remembrance, [From the Union of Armed Struggle to the Home Army](https://eng.ipn.gov.pl/en/digital-resources/articles/9247,From-the-Union-of-Armed-Struggle-to-the-Home-Army.html).
- Modern boundaries: [geoBoundaries API](https://www.geoboundaries.org/api/), cited in the application with its data metadata.
- Map: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), ODbL. Live building outlines are from OSM via the community Overpass API.
- Map client: [Leaflet](https://leafletjs.com/), BSD-2-Clause.
- The scenario is fiction informed by history. Statistics, probabilities, and outcomes are gameplay models, not historical measurements or predictions.

### Engineering principles

No state-administration economy; no unconditional +300 rewards masquerading as political events; no uncapped institutional stacking; no deterministic early German defeat; no bogus 1940 administrative boundaries; no fake building footprints. Source code is separated into data, simulation and UI. All random outcomes use the saved seed.

Licence: project code MIT (see LICENSE). External geo/OSM datasets retain their respective licenses.

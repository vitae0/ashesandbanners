# Ashes and Banners

A browser-based, 2D historical resistance-management strategy game. **The player commands a clandestine organization, not a state.**

## First scenario: Occupied Poland, January 1940

A substantial opening campaign around Warsaw, Łódź, Kraków, Lublin and surrounding Polish regions. You start with seven independent cells and can grow into a decentralized network or a command hierarchy.

- Playable scenario setup: difficulty, historical/alternate history, randomness, event frequency, starting resources, simulation speed, and theme.
- **Offline, self-contained static 1939 Poland strategy map.** Period-style paper atlas of the 16 prewar voivodeships (including Wilno, Polesie, Wołyń, Lwów, Tarnopol and Stanisławów). No modern basemap, tiles, Leaflet or OSM requests.
- Three deliberate map levels: a largely fixed country view → selected historical locality cards (not surveyed county polygons) → a schematic town block with 24 selectable fictional building slots. No uncontrolled zoom/pan.
- Themed organizational influence shading, institution types, building visibility, safehouses, raids, and bounded diminishing-return institutional effects.
- Cells, personnel, specialization, fatigue, secrecy, operations, commanders, standing orders, automation and five centralization levels.
- Sabotage/operations management with suitability-based automatic cell selection, consequences, risk, and resources; a strategic simulation, not a real-world operational guide.
- Conditional, player-confirmed milestones focused on political organization and narrative unlocks, four alternate-history pathways, dynamic historical events and decisions.
- External war simulation beginning 22 June 1941, historically bounded alternate outcomes, multiple possible endings, suppression and a 4–18-month reorganization option.
- Saves in localStorage plus JSON export/import, deterministic seeded simulation, and Node test runner.

### Important historical distinction

The game begins as a *fictional local ZWZ-associated resistance network* in January 1940. The ZWZ was renamed **Armia Krajowa** in February 1942; **Gwardia Ludowa** formed in 1942 and **Armia Ludowa** in 1944. Four political paths, including independent AK and AL variants, are explicitly *alternative-history branches*, not claims that all four existed in 1940.

The current board is an **original schematic illustration** informed by interwar Poland's borders and the 1939 voivodeship layout. It is **not** a metrically accurate tracing or real historical GIS. The country outline and voivodeship divisions are simplified on purpose; city lists represent important period localities, while the town layout and selectable buildings are **fictional gameplay abstractions**. The game itself labels these distinctions. An exact 1939 administrative atlas would require a properly licensed, surveyed historical source. A pre-existing save using the previous modern map is migrated to the period-region IDs.

### Run locally

No bundler needed. Serve the repo as a static site:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080/
```

**No internet access is required for the map or simulation.** Static hosting or a local HTTP server is sufficient. GitHub Pages can publish from the repository root once Pages is configured.

### Test

```sh
npm test
```

Node.js 20+ recommended. Pure simulation logic is in `src/engine.js`, UI and map in `src/app.js`.

### Provenance

- Historical groundwork: Institute of National Remembrance, [From the Union of Armed Struggle to the Home Army](https://eng.ipn.gov.pl/en/digital-resources/articles/9247,From-the-Union-of-Armed-Struggle-to-the-Home-Army.html).
- Period geography reference: [Administrative Map of Interwar Poland, 1 April 1939 (Polish Central Statistical Office / Gesher Galicia)](https://maps2.geshergalicia.org/galicia/poland-interwar-1939-1/).
- Occupation-zone reference: [Polish Institute of National Remembrance, guide to the occupation of Poland, 1939–1941](https://ipn.gov.pl/download/2/49339/AguidetothehistoryofPoland.pdf).
- The map drawing in `src/period-map-data.js` is a newly drawn approximation, **not** a reproduction or downloaded GIS dataset. District and street outlines are not historical maps.
- The scenario is fiction informed by history. Statistics, probabilities, and outcomes are gameplay models, not historical measurements or predictions.

### Engineering principles

No state-administration economy; no unconditional +300 rewards masquerading as political events; no uncapped institutional stacking; no deterministic early German defeat; no modern administrative boundaries masquerading as 1940; fictional town parcels clearly labeled as schematic; no third-party map services. Source code is separated into data, simulation and UI. All random outcomes use the saved seed.

Licence: project code MIT (see LICENSE). External geo/OSM datasets retain their respective licenses.

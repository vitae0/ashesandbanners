# Vector atlas and city scenes

## Scope

This project deliberately uses an **illustrated** 1939/1940 map instead of a scanned map, tiled basemap, or an external drawing service. The active gameplay path is `index.html` → `src/app.js` → `src/polygon-board.js`, styled by `vector-ui.css`. `src/period-board.js` remains only for the existing site-to-city conversion function `cityBuildings`; it never mounts the old raster atlas. No live map view requests an online image.

## Two historical layers, different dates

- Thick golden line: schematic border of the **Second Polish Republic in 1939, before partition**.
- Colored zones: **approximate January 1940 occupation reference** clipped to that prewar outline; German annexations, the *Generalgouvernement*, and Soviet-occupied eastern territories.
- Surrounding approximate country silhouettes include Germany, East Prussia, Free City of Danzig, Lithuania, Latvia, USSR, Romania, Hungary, Slovakia and the Protectorate of Bohemia and Moravia, plus wider-context states.
- Dashed thin lines inside Poland are **schematic voivodeship dividers**, not faithful historical administrative boundaries. Sixteen clickable markers use historical voivodeship central cities and approximate coordinates.

The 1940 occupation overlay is a **fixed reference layer**. It does not automatically update to the 1941–1945 front changes; it must **not** be read as a real-time sovereignty map. Borders, coastline, the Danzig corridor, Eastern Prussia and interwar Polish eastern possessions are generalized to reduce geometry complexity. Historical details such as border settlements, Lithuanian control of Vilnius and wartime administrative changes are not depicted with cadastral accuracy. Do not use this atlas for historical boundary-area calculations.

## City panel

Click a province marker to open a city window with a deterministic, hand-coded SVG illustration. Every façade, roof, window, church, chimney, road, field, river and village building is a polygon or line; there are no external images or background maps.

Scene styles change according to urban/historic/industrial/rural characteristics. Three rural labels use *KÖY 1–3* on purpose. They are **not** claims about individual real villages. Their single house stands for one abstract settlement. The buildings do not correspond to actual coordinates or 1940 cadastral geometry.

Warsaw and Łódź offer separate links to the existing individual historically documented buildings, including their real source references and temporal access restrictions. All other province views are **visual only**. Merely drawing a building does not add a recruitable institution to the simulation.

## UI

The command navigation is at the top. General HQ, network and operations use a narrow panel on the left. Politics, milestones, war, log and settings use expanded central views. The Map button collapses the left panel, displaying the atlas at full available width. Repeat-clicking a current command tab returns to the map. The layout compresses to a vertical map/panel arrangement at small viewports.

## Verification

Run `npm test`. `tests/polygon-board.test.js` checks that all sixteen provinces have markers and interactive city scenes, the polygonized atlas has no image dependencies, output is deterministic, and that only historically whitelisted Warsaw/Łódź buildings get action records.

## Why archival references still exist

`assets/maps`, `docs/cartographic-sources.md`, and the old research modules record the previous archival-map implementation. They are not loaded by the new atlas. This preserves provenance for future research without violating the current all-polygon visual requirement.

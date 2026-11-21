# Political timeline: Occupied Poland, 1940–1944

This is a scenario designer's chronology, separating events of historical record from **player-dependent alternative history**. The date for month-only events is an internal simulation trigger at the **beginning of the month**, not a claim that an organization was founded on the first day.

| Start | Historical institution or change | Implementation |
|---|---|---|
| Sep–Nov 1939 | SZP → ZWZ on 13 Nov 1939 | Player commands a fictional local network related to the ZWZ, **not Poland as a state**. |
| Oct–Nov 1939 | PPS–WRN socialism; its *Gwardia Ludowa* (a different group from 1942's GL/PPR) | Socialists exist immediately, do not get renamed to PPR. |
| Early 1940 | SL ‘Roch’ peasant movement, NOW nationalist underground, scattered communist circles | Available as separate local contacts, not unified communist command. |
| Feb 1940 | Polityczny Komitet Porozumiewawczy (PKP) | Siyasi/representation event, not an unconditional buff. |
| Aug 1940 | Chłopska Straż/Chłostra | Opens historical peasant armed-network context. |
| Dec 1940 | Delegatura Rządu na Kraj | Government Delegation event. |
| 22 June 1941 | German invasion of the USSR | Eastern Front begins in external war model. |
| 5 Jan 1942 | PPR founded | Communist political organization becomes historically active. |
| 14 Feb 1942 | ZWZ renamed Armia Krajowa | The AK appears; it did not exist as *AK* in January 1940. |
| 28 Mar 1942 | PPR's Gwardia Ludowa founded | Separate communist armed branch appears. |
| Sep 1942 | NSZ emerged | Nationalist armed group appears. |
| Night of 31 Dec 1943 to 1 Jan 1944 | KRN and Armia Ludowa formed | Historical formation; distinct from 1942 GL and 1939 GL-PPS. |

## Four possible political routes

1. **AK tied to the Government-in-Exile (London).** Available once the 1942 historical formation exists and the player's political council is established.
2. **Independent AK (alternate).** An ahistorical break from London, not available in the historical campaign mode.
3. **Independent AL (alternate).** An ahistorical independence from Moscow; normally after 1944, **or early in 1942** if a special political event is unlocked.
4. **Soviet-integrated AL.** A plausible historical political orientation for a left-wing network, available after 1944, **or early in 1942** if the special alternate-history event is unlocked.

**Early AL is not history.** In an alternate-history campaign only, the player must build communist political support to ≥65, convene the left congress and field ≥10 active cells. After 28 March 1942, the player may *approve* the "Early AL Founding Congress" milestone, making AL paths available. A special narrative event labels this as an ahistorical acceleration. This is deliberately a 1942 alternate-history branch; the real AL was established in 1944.

## Important design rule

Players are **not controlling SZP, ZWZ, AK, GL or AL as sovereign states**. They manage a fictional seven-cell resistance network that must decide what relationship to form with these real outside entities. Political contacts use resources and cooldowns. The game's ideological positions and percentages are fictional gameplay values, not historical polling data.

## Sources

- [Polish Institute of National Remembrance: From ZWZ to AK](https://eng.ipn.gov.pl/en/digital-resources/articles/9247,From-the-Union-of-Armed-Struggle-to-the-Home-Army.html).
- [Polish Institute of National Remembrance: Gwardia Ludowa as the armed wing of PPR](https://archiwum.ipn.gov.pl/pl/historia-z-ipn/181630,Ryszard-Sodel-Gwardia-Ludowa-Zbrojne-ramie-PPR.html).
- [Polish Institute of National Remembrance: Polish socialists and PPS–WRN](https://przystanekhistoria.pl/pa2/teksty/53434,Socjalisci-polscy-w-wojnie-o-cale-jutro-swiata.html).
- [Polish government: Peasant Battalions and their formation](https://www.gov.pl/web/uw-mazowiecki/84-rocznica-powolania-batalionow-chlopskich).
- [Polish education resources: Government Delegation in December 1940](https://zpe.gov.pl/a/polskie-panstwo-podziemne-komunisci-w-czasie-okupacji/DqEzrlI4a).

## Historical map system

The country map now uses the **original 1939 German military survey** of Poland and its neighboring countries, sourced from Wikimedia Commons. Province and city screens display authentic **WIG 1:300,000 map sheets** from the 1920s and 1930s. **Warsaw** has a 1935 municipal plan and **Łódź** a 1938 city map.

The previous synthetic SVG country shape, Voronoi province polygons, and 24-square fake city blocks were removed. The player may select historic named sites in Warsaw and Łódź, but the game does **not** misrepresent them as digitized 1939 building footprints. A strict data provenance policy is in `docs/cartographic-sources.md`.

The **1939** atlas is a prewar reference, **not** a claim that an independent Poland remained in January 1940. Occupation/war politics are modeled separately. For authentic parcels and period-specific occupier boundaries, the project needs a sourced historical georeferencing and vectorization project; this remains incomplete.

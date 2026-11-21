import test from "node:test";
import assert from "node:assert/strict";
import {createGame,REGION_DATA} from "../src/engine.js";
import {cityBuildings} from "../src/period-board.js";
import {POLAND_1939,SECTORS,CAPITALS,countrySvg,historicalCitySvg,PolygonBoard} from "../src/polygon-board.js";
import {HISTORICAL_COUNTRIES} from "../src/historical-geometry.js";
import {HISTORICAL_CITY_VECTORS} from "../src/historical-city-vectors.js";
import {CITY_PLANS,HISTORICAL_CITY_REFERENCES,VERIFIED_SHEET_REGIONS,cityMapRecord,cityMapUrl} from "../src/historical-city-plans.js";

const state=()=>createGame({seed:1940});

test("16 prewar voivodeships still have click targets and named city centres",()=>{
 const svg=countrySvg(state(),"warszawskie");
 assert.equal(Object.keys(CAPITALS).length,REGION_DATA.length);
 for(const [id] of REGION_DATA){
  assert.ok(CAPITALS[id],id);
  assert.ok(svg.includes('data-region="'+id+'"'),id);
  assert.ok(svg.includes(CAPITALS[id][0]),id);
 }
 assert.equal((svg.match(/class="v-marker/g)||[]).length,16);
});

test("published country atlas uses historic source polygons and labels estimated 1940 divisions",()=>{
 const pl=HISTORICAL_COUNTRIES.find(c=>/poland|polish/i.test(c.name));
 assert.ok(pl);
 assert.ok(pl.rings[0].length>=100);
 assert.ok(HISTORICAL_COUNTRIES.length>=10);
 assert.ok(POLAND_1939.length>=40);
 assert.deepEqual(SECTORS.map(z=>z.id),["reich","general","soviet"]);
 const svg=countrySvg(state(),"warszawskie");
 assert.match(svg,/Cliopatria 1938/);
 assert.match(svg,/GENERALGOUVERNEMENT/);
 assert.match(svg,/Ocak 1940/);
 assert.match(svg,/clipPath id="v-poland-clip"/);
 assert.doesNotMatch(svg,/<(?:img|image|foreignObject)\b/i);
});

test("Warsaw, Łódź, Katowice, Lwów and Toruń use named original street-plan documents",()=>{
 assert.deepEqual(Object.keys(CITY_PLANS).sort(),["warszawskie","lodzkie","slaskie","lwowskie","pomorskie"].sort());
 const years={warszawskie:1935,lodzkie:1938,slaskie:1939,lwowskie:1938,pomorskie:1921};
 for(const [id,year] of Object.entries(years)){
  const record=cityMapRecord(id);
  assert.equal(record.kind,"city");
  assert.equal(record.year,year);
  assert.ok(record.source.startsWith("https://commons.wikimedia.org/wiki/File:"),id);
  assert.ok(record.local.startsWith("assets/maps/"),id);
  const trace=HISTORICAL_CITY_VECTORS[id];
  assert.ok(trace, id);
  assert.equal(trace.year,year);
  assert.ok(trace.layers.reduce((n,layer)=>n+layer.polygons.length,0)>=1000);
  const svg=historicalCitySvg(id,CAPITALS[id][0]);
  assert.match(svg,/v-city-ink-map/);
  assert.match(svg,/<polygon class="v-city-trace"/);
  assert.doesNotMatch(svg,/<(?:image|img|foreignObject)\\b/i);
 }
});

test("unsupported city layouts never generate imaginary roads, houses or villages",()=>{
 for(const [id,[name]] of Object.entries(CAPITALS)){
  const record=cityMapRecord(id);
  const map=historicalCitySvg(id,name);
  assert.match(map,/<svg[\s\S]*<\/svg>/);
  assert.match(map,/v-city-historical/);
  assert.doesNotMatch(map,/<(?:image|img|foreignObject)\\b/i);
  assert.doesNotMatch(map,/v-road|v-building|v-roof-plane|v-field|v-village-label/);
  if(record.kind==="city"){
   assert.ok((map.match(/class="v-city-trace"/g)||[]).length>=1000,id);
   assert.match(map,/TARİHÎ HARİTADAN ÇIKARILMIŞ POLİGONLAR/);
  }
  if(record.kind==="unavailable"){
   assert.equal(cityMapUrl(id),null);
   assert.doesNotMatch(map,/<polygon class="v-city-trace"/);
   assert.match(map,/DOĞRULANMIŞ ŞEHİR POLİGONLARI YOK/);
  }
  if(record.kind==="regional"){
   assert.ok(VERIFIED_SHEET_REGIONS.includes(id));
   assert.match(record.notes,/1:300.000/);
   assert.match(map,/BÖLGE PAFTASI VAR/);
   assert.doesNotMatch(map,/<polygon class="v-city-trace"/);
  }
 }
 assert.equal(cityMapRecord("poleskie").kind,"unavailable");
 assert.equal(cityMapRecord("tarnopolskie").kind,"unavailable");
 assert.match(HISTORICAL_CITY_REFERENCES.krakowskie.source,/dawnemapykrakowa/);
 assert.match(HISTORICAL_CITY_REFERENCES.wilenskie.source,/pbc.biaman/);
});

test("16 cities all open source-labelled periods or honest missing-plan view",()=>{
 const s=state(),host={innerHTML:"",addEventListener(){}};
 const events=[],board=new PolygonBoard(host,(_,e)=>events.push(e.type));
 board.mount(s);
 for(const id of Object.keys(CAPITALS)){
  board.focusRegion(id);
  assert.equal(board.view,"town");
  assert.equal(s.selectedRegion,id);
  assert.match(host.innerHTML,/v-city-window/);
  assert.match(host.innerHTML,/v-city-historical/);
  assert.match(host.innerHTML,/TARİHSEL KAYNAK/);
  assert.doesNotMatch(host.innerHTML,/KUŞBAKIŞI ŞEHİR PLANI · TEMSİLÎ/);
  if(cityMapRecord(id).kind==="unavailable")
    assert.match(host.innerHTML,/DOĞRULANMIŞ ŞEHİR POLİGONU YOK/);
  board.home();
  assert.equal(board.view,"country");
 }
 assert.equal(events.filter(e=>e==="town").length,16);
 assert.equal(cityBuildings("warszawskie","Warszawa").length,15);
 assert.equal(cityBuildings("lodzkie","Łódź").length,10);
 assert.equal(cityBuildings("poleskie","Brześć").length,0);
});

test("historical maps preserve the geographic pan-zoom limit 4x",()=>{
 const s=state(),host={innerHTML:"",addEventListener(){}};
 const board=new PolygonBoard(host,()=>{});
 board.mount(s);
 board.zoomAt(2);
 assert.ok(board.camera.w<1350);
 board.panBy(100,100);
 assert.ok(board.camera.x>=0);
 for(let i=0;i<50;i++)board.zoomAt(2);
 assert.equal(board.camera.w,1350/4);
 for(let i=0;i<50;i++)board.zoomAt(.5);
 assert.equal(board.camera.w,1350);
 board.home();
 assert.equal(board.camera.x,0);
});

test("source-traced polygon city camera supports zoom 2.5x and reset",()=>{
 const s=state(),host={innerHTML:"",addEventListener(){}};
 const board=new PolygonBoard(host,()=>{});
 board.mount(s);
 board.focusTown("Warszawa","warszawskie");
 board.zoomActive(10);
 assert.equal(board.cityCamera.w,900/2.5);
 board.panCityBy(-100,-100);
 assert.ok(board.cityCamera.x>=0&&board.cityCamera.x<=900-board.cityCamera.w);
 for(let i=0;i<20;i++)board.zoomCityAt(.5);
 assert.equal(board.cityCamera.w,900);
 board.resetCityCamera();
 assert.deepEqual(board.cityCamera,{x:0,y:0,w:900,h:560});
 assert.match(host.innerHTML,/data-map-zoom="1.25"/);
 assert.match(host.innerHTML,/data-map-fit="1"/);
});

test("source geometries contain valid integer polygon rings, not embedded bitmap payloads",()=>{
 const original = Object.entries(HISTORICAL_CITY_VECTORS);
 assert.equal(original.length,5);
 for(const [region,v] of original){
  assert.equal(v.layers.length,3);
  assert.ok(v.sourceSize[0]>400&&v.sourceSize[1]>400,region);
  for(const layer of v.layers){
   assert.match(layer.ink,/^#[a-fA-F0-9]{6}$/);
   for(const item of layer.polygons.slice(0,100)){
    assert.ok(item.p.length>=3,region);
    assert.ok(item.p.every(([x,y])=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0),region);
   }
  }
 }
});

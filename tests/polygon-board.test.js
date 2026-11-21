import test from "node:test";
import assert from "node:assert/strict";
import {createGame,REGION_DATA} from "../src/engine.js";
import {cityBuildings} from "../src/period-board.js";
import {POLAND_1939,SECTORS,CAPITALS,countrySvg,cityPortrait,PolygonBoard} from "../src/polygon-board.js";
import {HISTORICAL_COUNTRIES} from "../src/historical-geometry.js";

const state=()=>createGame({seed:1940});

test("all 16 prewar voivodeships have clickable map centres and city names",()=>{
 const svg=countrySvg(state(),"warszawskie");
 assert.equal(Object.keys(CAPITALS).length,REGION_DATA.length);
 for(const [id] of REGION_DATA){
  assert.ok(CAPITALS[id],id);
  assert.ok(svg.includes('data-region="'+id+'"'),id);
  assert.ok(svg.includes(CAPITALS[id][0]),id);
 }
 assert.equal((svg.match(/class="v-marker/g)||[]).length,16);
});

test("hand-built 1939 national outline and 1940 sectors are explicit and labelled as approximations",()=>{
 assert.ok(POLAND_1939.length>40);
 assert.equal(SECTORS.length,3);
 assert.deepEqual(SECTORS.map(x=>x.id),["reich","general","soviet"]);
 const svg=countrySvg(state(),"warszawskie");
 assert.match(svg,/GENERALGOUVERNEMENT/);
 assert.match(svg,/POLSKA 1939/);
 assert.match(svg,/Ocak 1940/);
 assert.match(svg,/clipPath id="v-poland-clip"/);
 assert.match(svg,/CC BY 4\.0|Temsilî sınır/);
});

test("political atlas and 16 polygon city scenes are image-free",()=>{
 const svg=countrySvg(state(),"warszawskie");
 assert.doesNotMatch(svg,/<(?:img|image|foreignObject)\b/i);
 assert.doesNotMatch(svg,/https?:\/\//);
 for(const [id,[name]] of Object.entries(CAPITALS)){
  const art=cityPortrait(id,name);
  assert.match(art,/<svg[\s\S]*<\/svg>/);
  assert.match(art,/v-building/);
  assert.match(art,/v-rural/);
  assert.doesNotMatch(art,/<(?:img|image|foreignObject)\b/i,id);
  assert.equal(art,cityPortrait(id,name),"deterministic polygon city: "+id);
 }
});

test("all provinces open illustrated city windows without inventing verified building records",()=>{
 const s=state(),host={innerHTML:"",addEventListener(){}};
 const events=[],board=new PolygonBoard(host,(_,e)=>events.push(e.type));
 board.mount(s);
 for(const id of Object.keys(CAPITALS)){
  board.focusRegion(id);
  assert.equal(board.view,"town");
  assert.equal(s.selectedRegion,id);
  assert.ok(host.innerHTML.includes("v-city-window"),id);
  assert.ok(host.innerHTML.includes("v-city-scene"),id);
  if(!["warszawskie","lodzkie"].includes(id))
    assert.match(host.innerHTML,/temsili görselleştirmedir/i);
  board.home();
  assert.equal(board.view,"country");
 }
 assert.equal(events.filter(e=>e==="town").length,16);
 assert.equal(cityBuildings("warszawskie","Warszawa").length,15);
 assert.equal(cityBuildings("lodzkie","Łódź").length,10);
 assert.equal(cityBuildings("poleskie","Brześć").length,0);
});

test("published map uses actual attributed source polygons for Poland and neighboring countries",()=>{
 const pl=HISTORICAL_COUNTRIES.find(c=>/poland|polish/i.test(c.name));
 assert.ok(pl,"Poland must be available as local vector dataset");
 assert.ok(pl.rings[0].length>=100,"the supplied Polish border should exceed hand-drawn fidelity");
 assert.ok(HISTORICAL_COUNTRIES.length>=10);
 const svg=countrySvg(state(),"warszawskie");
 assert.match(svg,/Cliopatria 1938/);
 assert.ok(svg.includes("v-country"));
});

test("bounded map camera zooms and pans, never allowing unlimited zoom",()=>{
 const s=state(),host={innerHTML:"",addEventListener(){}};
 const board=new PolygonBoard(host,()=>{});
 board.mount(s);
 const first=board.camera.w;
 board.zoomAt(2);
 assert.ok(board.camera.w<first);
 board.panBy(100,100);
 assert.ok(board.camera.x>=0);
 for(let i=0;i<50;i++)board.zoomAt(2);
 assert.equal(board.camera.w,1350/4);
 for(let i=0;i<50;i++)board.zoomAt(.5);
 assert.equal(board.camera.w,1350);
 board.home();
 assert.equal(board.camera.x,0);
});

test("city portraits are orthographic roof plans, never horizon skylines",()=>{
 for(const [id,[name]] of Object.entries(CAPITALS)){
  const art=cityPortrait(id,name);
  assert.match(art,/v-city-overhead/);
  assert.match(art,/v-road/);
  assert.match(art,/v-roof-/);
  assert.match(art,/KUŞBAKIŞI ŞEHİR PLANI/);
  assert.doesNotMatch(art,/v-sky|v-building-hit|skyline|horizon/i);
 }
});

import test from "node:test";
import assert from "node:assert/strict";
import {createGame,REGION_DATA} from "../src/engine.js";
import {cityBuildings} from "../src/period-board.js";
import {POLAND_1939,SECTORS,CAPITALS,countrySvg,cityPortrait,PolygonBoard} from "../src/polygon-board.js";

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
 assert.match(svg,/TEMSİL|temsili/);
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

import test from "node:test";
import assert from "node:assert/strict";
import {
 createGame,advanceDays,after,activeCells,members,MILESTONES,PATHS,
 canMilestone,approveMilestone,pathAvailable,setPath,scheduleOperation,bestCell,
 assetEffects,INSTITUTIONS,institutionRaidRisk,regroup,validateSave,setCentralization,assignCommander,migrateSave,REGION_DATA
} from "../src/engine.js";
import {currentOrganizations,contactFaction,politicalIdentity,earlyALStatus} from "../src/politics.js";
import {MAP_POINTS,CELLS,HISTORIC_LOCATIONS,periodOccupation} from "../src/period-map-data.js";
import {cityBuildings,PeriodBoard} from "../src/period-board.js";
const setup=(x={})=>createGame({seed:123456,...x});
test("1940 does not contain AK, PPR, PPR GL or AL",()=>{
 const s=setup();const ids=currentOrganizations(s).map(x=>x.id);
 for(const id of ["ak","ppr","gl_ppr","al","krn"])assert.equal(ids.includes(id),false);
 for(const id of ["zwz","pps_wrn","roch","left_small"])assert.equal(ids.includes(id),true);
 assert.match(politicalIdentity(s),/ZWZ/);
 assert.equal(activeCells(s).length,7);
});
test("organizations appear on their actual dates",()=>{
 const s=setup();
 s.date="1942-01-05";assert.ok(currentOrganizations(s).some(x=>x.id==="ppr"));
 assert.ok(!currentOrganizations(s).some(x=>x.id==="gl_ppr"));
 s.date="1942-02-14";assert.ok(currentOrganizations(s).some(x=>x.id==="ak"));
 assert.ok(!currentOrganizations(s).some(x=>x.id==="zwz"));
 s.date="1942-03-28";assert.ok(currentOrganizations(s).some(x=>x.id==="gl_ppr"));
 s.date="1944-01-01";assert.ok(currentOrganizations(s).some(x=>x.id==="al"));
 assert.ok(!currentOrganizations(s).some(x=>x.id==="gl_ppr"));
});
test("no AL or AK path in January 1940",()=>{
 const s=setup();s.milestones=["council","left_network"];
 for(const p of PATHS)assert.equal(pathAvailable(s,p),false);
});
test("historical campaign forbids fictional independent military branches",()=>{
 const s=setup({history:"historical"});s.date="1944-05-01";s.milestones=["founding","council","left_network"];
 s.politics.left=90;
 assert.equal(pathAvailable(s,PATHS.find(x=>x.id==="ak_independent")),false);
 assert.equal(pathAvailable(s,PATHS.find(x=>x.id==="al_independent")),false);
 assert.equal(pathAvailable(s,PATHS.find(x=>x.id==="ak_london")),true);
 assert.equal(pathAvailable(s,PATHS.find(x=>x.id==="al_soviet")),true);
});
test("alternate early AL available in 1942 only with strong communist network",()=>{
 const s=setup({history:"alternate"});s.date="1942-04-01";
 s.milestones=["founding","council","left_network"];s.politics.left=70;
 for(let i=0;i<3;i++)s.cells.push({...s.cells[0],id:"extra"+i,name:"Test cell "+i,busyUntil:null});
 const m=MILESTONES.find(x=>x.id==="early_al");
 assert.equal(canMilestone(s,m),true);
 assert.equal(approveMilestone(s,"early_al").ok,true);
 assert.equal(pathAvailable(s,PATHS.find(x=>x.id==="al_independent")),true);
 assert.equal(setPath(s,"al_independent").ok,true);
 assert.match(politicalIdentity(s),/alternatif/);
});
test("historical early AL milestone impossible",()=>{
 const s=setup({history:"historical"});s.date="1942-04-01";s.milestones=["founding","council","left_network"];
 s.politics.left=99;for(let i=0;i<3;i++)s.cells.push({...s.cells[0],id:"e"+i});
 assert.equal(canMilestone(s,MILESTONES.find(x=>x.id==="early_al")),false);
});
test("political contact has cost and 28 day cooldown",()=>{
 const s=setup();const funds=s.funds;
 assert.equal(contactFaction(s,"left").ok,true);
 assert.ok(s.politics.left>15);assert.ok(s.funds<funds);
 assert.equal(contactFaction(s,"left").ok,false);
 s.ticks+=28;s.date="1940-01-29";assert.equal(contactFaction(s,"left").ok,true);
});
test("church institution boosts are bounded by diminishing returns",()=>{
 const s=setup(),r="warszawskie",base=assetEffects(s,r).support;
 for(let i=0;i<100;i++)s.assets.push({id:"a"+i,osmId:"way/"+i,region:r,type:"church",visibility:60});
 const full=assetEffects(s,r).support;
 assert.ok(full>base);assert.ok(full<2);
});
test("more visible institutions face higher raid risk",()=>{
 const state=setup();
 const base={id:"a",region:"warszawskie",visibility:10,type:"safehouse"};
 const low=institutionRaidRisk(state,base);
 const high=institutionRaidRisk(state,{...base,visibility:90});
 assert.ok(high>low);
 state.centralization=5;
 assert.ok(institutionRaidRisk(state,{...base,visibility:90})>high);
});
test("cells can be dispatched automatically to suitable work",()=>{
 const s=setup();const c=bestCell(s,"intelligence");assert.ok(c);
 const x=scheduleOperation(s,"intelligence","auto");assert.equal(x.ok,true);
 assert.ok(s.cells.find(c=>c.id===x.item.cell).busyUntil>0);
 assert.equal(setCentralization(s,5),true);assert.equal(setCentralization(s,0),false);
});
test("regroup offers a fresh reduced cell network after suppression",()=>{
 const s=setup();s.status="suppressed";
 const result=regroup(s);
 assert.equal(result.ok,true);assert.ok(result.months>=4&&result.months<=18);
 assert.equal(result.state.status,"running");assert.equal(activeCells(result.state).length,3);
});
test("saving schema validates",()=>{
 const s=setup();assert.equal(validateSave(s),true);
 assert.equal(validateSave({version:1,date:"bad"}),false);
});

test("period atlas lists historical provinces including former eastern Poland",()=>{
 const ids=REGION_DATA.map(r=>r[0]);
 assert.equal(ids.length,16);
 for(const id of ["warszawskie","wilenskie","wolynskie","poleskie","lwowskie","tarnopolskie"]){
  assert.ok(ids.includes(id));assert.ok(CELLS.some(c=>c.id===id&&c.vertices.length>=3));
  assert.ok(HISTORIC_LOCATIONS[id].length>=4);
 }
 for(const id of ["mazowieckie","malopolskie","podkarpackie"])assert.ok(!ids.includes(id));
});
test("schematic city blocks have stable building identifiers and bounded visibility",()=>{
 const a=cityBuildings("warszawskie","Warszawa"),b=cityBuildings("warszawskie","Warszawa");
 assert.equal(a.length,24);
 assert.equal(JSON.stringify(a),JSON.stringify(b));
 for(const site of a){assert.ok(site.osmId.startsWith("period/"));assert.ok(site.visibility>=0&&site.visibility<=1)}
 assert.ok(a.some(site=>site.allowed.includes("safehouse")));
 assert.ok(a.some(site=>site.allowed.includes("school")));
});
test("legacy 2017-style saves migrate to historical province identifiers",()=>{
 const legacy=setup();legacy.version=1;
 legacy.regions.mazowieckie={...legacy.regions.warszawskie};
 delete legacy.regions.warszawskie;
 legacy.cells[0].region="mazowieckie";
 legacy.selectedRegion="mazowieckie";
 const migrated=migrateSave(legacy);
 assert.equal(migrated.version,2);
 assert.equal(migrated.selectedRegion,"warszawskie");
 assert.equal(migrated.cells[0].region,"warszawskie");
 assert.equal(migrated.assets.length,0);
 assert.equal(validateSave(migrated),true);
});

test("occupied interwar East changes status in June 1941 without losing the 1939 provinces",()=>{
 assert.equal(periodOccupation("1940-01-01","wilenskie"),"soviet");
 assert.equal(periodOccupation("1942-01-01","wilenskie"),"german");
 assert.equal(periodOccupation("1942-01-01","poznanskie"),"annexed");
});
test("static board renders without external map libraries or data requests",()=>{
 const callbacks=[];
 const host={innerHTML:"",addEventListener(){}};
 const board=new PeriodBoard(host,(_s,e)=>callbacks.push(e.type));
 const game=setup();board.mount(game);
 assert.ok(host.innerHTML.includes("<svg"));
 assert.ok(host.innerHTML.includes("WILNO"));
 assert.ok(!host.innerHTML.includes("tile.openstreetmap"));
 board.focusRegion("warszawskie");
 assert.ok(host.innerHTML.includes("Warszawa"));
 board.focusTown("Warszawa");
 assert.equal(game.selectedDistrict,"Warszawa");
 assert.equal((host.innerHTML.match(/data-building=/g)||[]).length,24);
 board.back();assert.equal(board.view,"province");
 board.home();assert.equal(board.view,"country");
 assert.ok(callbacks.length>=3);
});

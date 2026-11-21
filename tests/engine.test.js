import test from "node:test";
import assert from "node:assert/strict";
import {
 createGame,advanceDays,after,activeCells,members,MILESTONES,PATHS,
 canMilestone,approveMilestone,pathAvailable,setPath,scheduleOperation,bestCell,
 assetEffects,INSTITUTIONS,regroup,validateSave,setCentralization,assignCommander
} from "../src/engine.js";
import {currentOrganizations,contactFaction,politicalIdentity,earlyALStatus} from "../src/politics.js";
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
 const s=setup(),r="mazowieckie",base=assetEffects(s,r).support;
 for(let i=0;i<100;i++)s.assets.push({id:"a"+i,osmId:"way/"+i,region:r,type:"church",visibility:60});
 const full=assetEffects(s,r).support;
 assert.ok(full>base);assert.ok(full<2);
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

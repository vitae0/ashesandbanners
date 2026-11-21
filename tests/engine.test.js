import test from "node:test";
import assert from "node:assert/strict";
import {
 createGame,advanceDays,after,activeCells,members,MILESTONES,PATHS,
 canMilestone,approveMilestone,pathAvailable,setPath,scheduleOperation,bestCell,
 assetEffects,INSTITUTIONS,institutionRaidRisk,syncHistoricalAssets,regroup,validateSave,setCentralization,assignCommander,migrateSave,REGION_DATA,recruitCell,acquireAsset
} from "../src/engine.js";
import {currentOrganizations,contactFaction,politicalIdentity,earlyALStatus} from "../src/politics.js";
import {ARCHIVE,COORDINATES,validatedSiteList} from "../src/archival-atlas-data.js";
import {cityBuildings,PeriodBoard} from "../src/period-board.js";
import {PLAYABLE_REGIONS,VERIFIED_BUILDING_MAP,getVerifiedSite,verifiedSiteCount,buildingStatusAt} from "../src/verified-sites.js";
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
test("religious connections are source-approved and bounded, duplicates do not stack",()=>{
 const s=setup(),r="warszawskie",base=assetEffects(s,r).support;
 const sites=cityBuildings(r,"Warszawa").filter(x=>x.kind==="church");
 assert.ok(sites.length>=2);
 assert.equal(acquireAsset(s,sites[0],"church").ok,true);
 const first=assetEffects(s,r).support;assert.ok(first>base);
 const duplicate={...s.assets[0],id:"duplicate"};
 s.assets.push(duplicate,duplicate);
 assert.equal(assetEffects(s,r).support,first);
 s.assets=s.assets.slice(0,1);
 assert.equal(acquireAsset(s,sites[1],"church").ok,true);
 const second=assetEffects(s,r).support;
 assert.ok(second>first&&second<3);
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
  assert.ok(ids.includes(id));
 }
 for(const id of ["mazowieckie","malopolskie","podkarpackie"])assert.ok(!ids.includes(id));
});
test("archival city map features reference stable names and coordinates, not generated cadastral lots",()=>{
 const a=cityBuildings("warszawskie","Warszawa"),b=cityBuildings("warszawskie","Warszawa");
 assert.equal(a.length,15);
 assert.equal(JSON.stringify(a),JSON.stringify(b));
 for(const site of a){assert.ok(site.osmId.startsWith("archival/"));assert.ok(site.visibility>=0&&site.visibility<=1)}
 assert.ok(a.some(site=>site.allowed.includes("church")));
 assert.ok(a.some(site=>site.allowed.includes("cultural")));
});
test("legacy 2017-style saves migrate to historical province identifiers",()=>{
 const legacy=setup();legacy.version=1;
 legacy.regions.mazowieckie={...legacy.regions.warszawskie};
 delete legacy.regions.warszawskie;
 legacy.cells[0].region="mazowieckie";
 legacy.selectedRegion="mazowieckie";
 const migrated=migrateSave(legacy);
 assert.equal(migrated.version,3);
 assert.equal(migrated.selectedRegion,"warszawskie");
 assert.equal(migrated.cells[0].region,"warszawskie");
 assert.equal(migrated.assets.length,0);
 assert.equal(validateSave(migrated),true);
});

test("static board renders without external map libraries or data requests",()=>{
 const callbacks=[];
 const host={innerHTML:"",addEventListener(){}};
 const board=new PeriodBoard(host,(_s,e)=>callbacks.push(e.type));
 const game=setup();board.mount(game);
 assert.ok(host.innerHTML.includes("<svg"));
 assert.ok(host.innerHTML.includes("Polen_1939.jpg"));
 assert.ok(!host.innerHTML.includes("tile.openstreetmap"));
 board.focusRegion("warszawskie");
 assert.ok(host.innerHTML.includes("Warszawa"));
 board.focusTown("Warszawa");
 assert.equal(game.selectedDistrict,"Warszawa");
 assert.equal((host.innerHTML.match(/data-building=/g)||[]).length,15);
 board.back();assert.equal(board.view,"province");
 board.home();assert.equal(board.view,"country");
 assert.ok(callbacks.length>=3);
});

test("historical maps are attributed original scans, not hand-drawn shapes",()=>{
 assert.equal(ARCHIVE.country.year,1939);
 assert.ok(ARCHIVE.country.file.endsWith(".jpg"));
 assert.equal(ARCHIVE.warszawa.year,1935);
 assert.equal(ARCHIVE.lodz.year,1938);
 assert.equal(validatedSiteList("Warszawa").length,15);
 assert.equal(validatedSiteList("Łódź").length,10);
 assert.ok(!JSON.stringify(ARCHIVE).includes("geoBoundaries"));
});

test("only two regions with sourced historic buildings are playable",()=>{
 const state=setup();
 assert.deepEqual(PLAYABLE_REGIONS.slice().sort(),["lodzkie","warszawskie"].sort());
 assert.ok(state.cells.every(c=>PLAYABLE_REGIONS.includes(c.region)));
 assert.equal(recruitCell(state,"krakowskie").ok,false);
 assert.equal(recruitCell(state,"lubelskie").ok,false);
 assert.equal(recruitCell(state,"warszawskie").ok,true);
 assert.equal(cityBuildings("krakowskie","Kraków").length,0);
});
test("no unverified park, plaza, village, or free-form building is accepted",()=>{
 const s=setup();
 const list=cityBuildings("warszawskie","Warszawa");
 assert.equal(verifiedSiteCount(),25);
 assert.ok(list.every(b=>b.verifiedPrewar&&!b.polygonVerified&&!!b.source&&b.source.startsWith("https://")));
 assert.ok(list.every(b=>!["Rynek Starego Miasta","Łomianki","Park Źródliska","Plac Wolności"].includes(b.name)));
 assert.equal(acquireAsset(s,{osmId:"custom-building",region:"warszawskie",lat:52.2,lon:21}, "safehouse").ok,false);
 const trueSite=list.find(b=>b.kind==="cultural");
 assert.ok(trueSite);
 assert.equal(acquireAsset(s,trueSite,"safehouse").ok,false);
 assert.equal(acquireAsset(s,trueSite,"cultural").ok,true);
 assert.ok(s.assets[0].source.includes("warszawa1939.pl"));
 assert.equal(s.assets[0].polygonVerified,false);
});
test("old saves discard unsourced building links and inaccessible regions",()=>{
 const state=setup();state.version=2;
 state.assets=[{osmId:"way/999",region:"warszawskie",type:"church"}];
 state.cells.push({...state.cells[0],id:"z",region:"krakowskie",name:"Old unsupported cell"});
 const migrated=migrateSave(state);
 assert.equal(migrated.version,3);
 assert.equal(migrated.assets.length,0);
 assert.equal(migrated.cells.some(c=>c.region==="krakowskie"),false);
 assert.ok(migrated.cells.every(c=>PLAYABLE_REGIONS.includes(c.region)));
});
test("map never provides clickable places in undocumented regions",()=>{
 const host={innerHTML:"",addEventListener(){}};
 const board=new PeriodBoard(host,()=>{}),s=setup();
 board.mount(s);
 assert.ok(!host.innerHTML.includes('data-region="krakowskie"'));
 board.focusRegion("krakowskie");
 assert.equal(board.view,"country");
 board.focusRegion("warszawskie");
 assert.ok(host.innerHTML.includes("Warszawa"));
 assert.ok(!host.innerHTML.includes('data-town="Płock"'));
 board.focusTown("Płock","warszawskie");
 assert.equal(board.view,"province");
 board.focusTown("Warszawa","warszawskie");
 assert.ok(!host.innerHTML.includes("ÇEVRE YERLEŞİMLER"));
 assert.equal((host.innerHTML.match(/data-building=/g)||[]).length,15);
});

test("Nozyk Synagogue closure and reopening are strictly tied to historical dates",()=>{
 const site=getVerifiedSite("archival/Warszawa/verified/synagoga-nozykow");
 assert.ok(site&&site.source.includes("warszawa1939.pl"));
 assert.equal(buildingStatusAt(site,"1940-01-01").state,"closed");
 assert.equal(buildingStatusAt(site,"1941-08-31").claimable,false);
 assert.equal(buildingStatusAt(site,"1941-09-01").claimable,true);
 assert.equal(buildingStatusAt(site,"1942-07-01").state,"occupied");
 const state=setup();
 assert.equal(acquireAsset(state,cityBuildings("warszawskie","Warszawa").find(x=>x.osmId===site.siteId),"synagogue").ok,false);
 state.date="1941-09-01";
 const b=cityBuildings("warszawskie","Warszawa").find(x=>x.osmId===site.siteId);
 assert.equal(acquireAsset(state,b,"synagogue").ok,true);
 const before=assetEffects(state,"warszawskie").support;
 assert.ok(before>0);
 state.date="1942-07-01";syncHistoricalAssets(state);
 assert.equal(state.assets.length,0);
});
test("war-damaged palace and castle never become fictional safehouses",()=>{
 const s=setup();
 for(const id of ["palac-saski","zamek-krolewski"]){
  const site=getVerifiedSite("archival/Warszawa/verified/"+id);
  assert.equal(buildingStatusAt(site,"1940-01-01").claimable,false);
  assert.equal(acquireAsset(s,cityBuildings("warszawskie","Warszawa").find(b=>b.osmId===site.siteId),site.type).ok,false);
 }
 assert.equal(buildingStatusAt(getVerifiedSite("archival/Warszawa/verified/zamek-krolewski"),"1944-09-01").state,"destroyed");
 assert.equal(buildingStatusAt(getVerifiedSite("archival/Warszawa/verified/palac-saski"),"1944-12-01").state,"destroyed");
});
test("Łódź Cathedral military seizure after November 1941 removes prior connection",()=>{
 const s=setup();s.date="1941-11-08";
 const b=cityBuildings("lodzkie","Łódź").find(x=>x.osmId.endsWith("katedra-sw-stanislawa"));
 assert.ok(b);
 assert.equal(acquireAsset(s,b,"church").ok,true);
 s.date="1941-11-09";syncHistoricalAssets(s);
 assert.equal(s.assets.length,0);
 assert.equal(acquireAsset(s,b,"church").ok,false);
});
test("both society and political milestones remain feasible with corrected real sites",()=>{
 const s=setup();s.date="1940-07-01";
 const b=cityBuildings("warszawskie","Warszawa").find(x=>x.kind==="cultural");
 assert.equal(acquireAsset(s,b,"cultural").ok,true);
 s.cells[0].members+=30;
 assert.equal(canMilestone(s,MILESTONES.find(x=>x.id==="schools")),true);
 s.date="1943-06-01";s.milestones=["uprising"];
 s.war.started=true;s.war.germanAdvance=30;
 for(const id of PLAYABLE_REGIONS)s.regions[id].influence=75;
 s.cells[0].members=605;
 assert.equal(canMilestone(s,MILESTONES.find(x=>x.id==="liberation")),true);
});
test("imported v3 saves cannot resurrect forged or closed sites and duplicate holdings",()=>{
 const s=setup(),b=cityBuildings("warszawskie","Warszawa").find(x=>x.kind==="cultural");
 s.version=3;s.assets=[
  {id:"a1",osmId:b.osmId,region:b.region,type:b.kind},
  {id:"a2",osmId:b.osmId,region:b.region,type:b.kind},
  {id:"a3",osmId:"archival/Warszawa/verified/synagoga-nozykow",region:"warszawskie",type:"synagogue"},
  {id:"a4",osmId:"way/unsigned",region:"warszawskie",type:"factory"}
 ];
 const m=migrateSave(s);
 assert.equal(m.assets.length,1);
 assert.equal(m.assets[0].osmId,b.osmId);
});

test("new documented homes, hotels, commercial offices, factory and 1910 school are individually sourced",()=>{
 const w=cityBuildings("warszawskie","Warszawa"),l=cityBuildings("lodzkie","Łódź");
 assert.equal(w.length,15);assert.equal(l.length,10);
 for(const id of ["kamienica-grodzickiego","kamienica-camponiego","hotel-europejski","prudential","nowy-swiat-72","bank-polski"]){
  const site=getVerifiedSite("archival/Warszawa/verified/"+id);assert.ok(site);
  assert.ok(site.source.startsWith("https://"));assert.ok(site.built);
 }
 for(const id of ["palac-heinzla","willa-kindermanna","hotel-savoy","ec1-hala-maszyn","i-lo-kopernika"]){
  const site=getVerifiedSite("archival/Łódź/verified/"+id);assert.ok(site);
  assert.ok(site.source.startsWith("https://"));assert.ok(site.built);
 }
 const lschool=l.find(x=>x.kind==="school");assert.ok(lschool);
 const state=setup();assert.equal(acquireAsset(state,lschool,"school").ok,true);
 const historicalBank=w.find(x=>x.osmId.endsWith("bank-polski"));
 assert.ok(historicalBank);
 assert.equal(acquireAsset(state,historicalBank,"historic").ok,false);
});
test("a documented residential building gets its own high visibility rate",()=>{
 const state=setup(),villa=cityBuildings("lodzkie","Łódź").find(x=>x.osmId.endsWith("willa-kindermanna"));
 assert.ok(villa);
 assert.ok(villa.visibility>.7);
 assert.equal(acquireAsset(state,villa,"safehouse").ok,true);
 assert.ok(state.assets[0].visibility>=70);
});

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
const app=readFileSync(new URL("../src/app.js",import.meta.url),"utf8");
const css=readFileSync(new URL("../vector-ui.css",import.meta.url),"utf8");
const polygon=readFileSync(new URL("../src/polygon-board.js",import.meta.url),"utf8");

test("all static DOM identifiers required by the game controller are present",()=>{
 const dynamic=new Set(["asset-kind","recruit-region","op-type","op-cell"]);
 const used=[...new Set([...app.matchAll(/\$\("([^"]+)"\)/g)].map(m=>m[1]))];
 for(const id of used.filter(x=>!dynamic.has(x)))
   assert.ok(html.includes('id="'+id+'"'),"missing id: "+id);
});

test("topbar navigation has the map action and six management modes",()=>{
 const tabs=["map","overview","network","operations","politics","milestones","war","archive","settings"];
 for(const t of tabs)assert.ok(html.includes('data-tab="'+t+'"'),"missing tab "+t);
 assert.ok(html.indexOf('class="topnav"')<html.indexOf('class="layout"'));
 assert.ok(html.indexOf('id="content"')<html.indexOf('class="map-panel"'),"command panel should be to left of map");
 assert.match(app,/new PolygonBoard/);
 assert.match(app,/full-panel/);
 assert.match(app,/map-only/);
 assert.match(css,/\.game\.full-panel/);
 assert.match(css,/\.game\.map-only/);
});

test("the active UI and atlas do not load archival image URLs",()=>{
 assert.match(html,/vector-ui\.css/);
 assert.doesNotMatch(html,/<img\b/i);
 assert.doesNotMatch(polygon,/<(?:img|image)\b/i);
 assert.doesNotMatch(polygon,/archiveUrl|archiveFallbackUrl|fetch\(/);
});

// Real Chromium smoke check. Run with `node tests/browser-smoke.mjs` after
// `npm install --no-save playwright` and starting a static server on port 8080.
// This file is intentionally excluded from the unit-test glob (*.test.js).
import assert from "node:assert/strict";
import {mkdir} from "node:fs/promises";
import {chromium} from "playwright";

const base = process.env.APP_URL || "http://127.0.0.1:8080/";
const browser = await chromium.launch({headless:true});
const errors=[];
const renders=[];
try{
 const page = await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 page.on("pageerror",err=>errors.push(String(err)));
 page.on("console",message=>{if(message.type()==="error")errors.push("console: "+message.text())});
 const response=await page.goto(base,{waitUntil:"networkidle",timeout:40000});
 assert.equal(response.status(),200,"site must be served successfully");
 await page.locator("#new-game").click();
 await page.locator("svg.v-world").waitFor({state:"visible",timeout:30000});
 assert.equal(await page.locator(".v-world .v-marker").count(),16,"all provincial city markers exist");
 assert.equal(await page.locator("#game").isVisible(),true);
 assert.equal(await page.locator("#map").locator("image,img,foreignObject").count(),0,"no image tags in map");

 const cities=[
  ["warszawskie","Warszawa",1935],["lodzkie","Łódź",1938],
  ["slaskie","Katowice",1939],["lwowskie","Lwów",1938],
  ["pomorskie","Toruń",1921]
 ];
 await mkdir("browser-artifacts",{recursive:true});
 for(const [region,name,year] of cities){
  const start=Date.now();
  const marker=page.locator('.v-marker[data-region="'+region+'"]');
  await marker.click({force:true,timeout:15000});
  await page.locator(".v-city-window").waitFor({state:"visible",timeout:30000});
  const polygons=await page.locator(".v-city-ink-map .v-city-trace").count();
  assert.ok(polygons>1000,region+" has no real traced polygons: "+polygons);
  assert.equal(await page.locator(".v-city-window image, .v-city-window img, .v-city-window foreignObject").count(),0,region+" must be raster-free");
  assert.match(await page.locator(".v-city-head").innerText(),new RegExp(String(year)));
  const city=page.locator("svg.v-city-scene");
  const rect=await city.boundingBox();
  assert.ok(rect && rect.width>150 && rect.height>150,region+" has no visible city SVG");
  const before=await city.getAttribute("viewBox");
  await page.locator('.v-city-zoom [data-map-zoom="1.25"]').click();
  const after=await city.getAttribute("viewBox");
  assert.notEqual(before,after,"city zoom did not update viewBox "+region);
  await page.locator('.v-city-zoom [data-map-fit="1"]').click();
  assert.equal(await city.getAttribute("viewBox"),"0.000 0.000 900.000 560.000");
  if(region==="warszawskie"||region==="lwowskie")
   await page.locator(".v-city-window").screenshot({path:"browser-artifacts/"+region+".png"});
  renders.push({region,name,year,polygons,renderMs:Date.now()-start,box:rect});
  await page.locator(".v-city-window [data-map-home]").click();
  await page.locator(".v-city-window").waitFor({state:"detached",timeout:10000});
 }
 await page.locator('.v-marker[data-region="poleskie"]').click({force:true});
 await page.locator(".v-city-window").waitFor({state:"visible"});
 assert.equal(await page.locator(".v-city-ink-map .v-city-trace").count(),0,"Brześć cannot pretend to have source-derived polygons");
 assert.match(await page.locator(".v-city-window").innerText(),/DOĞRULANMIŞ ŞEHİR POLİGONU YOK/);
 await page.locator(".v-city-window [data-map-home]").click();
 await page.locator("#map-zoom-in").click();
 assert.notEqual(await page.locator("svg.v-world").getAttribute("viewBox"),"0.00 0.00 1350.00 780.00","world zoom is inactive");

 assert.deepEqual(errors,[],"browser JavaScript errors");
 console.log("CHROMIUM RESULT: PASS");
 console.log(JSON.stringify({renders,errors,mapElementImages:0},null,2));
}finally{
 await browser.close();
}

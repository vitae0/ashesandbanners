
/*
 * Archival CARTOGRAPHY, not reconstructed geometry.
 * All map backgrounds are original historical printed maps hosted on Wikimedia Commons.
 * UI marks are approximate location annotations, NEVER asserted cadastral polygons.
 *
 * See docs/cartographic-sources.md for primary source provenance and limitations.
 */
export const ARCHIVE={
 country:{
  title:"POLEN — Deutsches Militärkartenwerk",year:1939,
  file:"Polen 1939.jpg",width:960,height:1008,
  source:"https://commons.wikimedia.org/wiki/File:Polen_1939.jpg",
  rights:"Public domain, 1939 historical scan"
 },
 warszawa:{
  title:"Plan miasta stołecznego Warszawy",year:1935,
  file:"Warszawa 1935.png",width:960,height:1192,
  source:"https://commons.wikimedia.org/wiki/File:Warszawa_1935.png",
  rights:"Public domain; Warszawa municipal planning and survey department, 1935"
 },
 lodz:{
  title:"Plan wojewódzkiego miasta Łodzi",year:1938,
  file:"Plan wojewodzkiego miasta Lodzi. ca 1938 (35842453).jpg",width:960,height:1147,
  source:"https://commons.wikimedia.org/wiki/File:Plan_wojewodzkiego_miasta_Lodzi._ca_1938_(35842453).jpg",
  rights:"Public domain; Polona / National Library of Poland"
 }
};
export const ARCHIVE_PATH={
 "Polen 1939.jpg":"assets/maps/polen-1939.jpg",
 "Warszawa 1935.png":"assets/maps/warszawa-1935.png",
 "Plan wojewodzkiego miasta Lodzi. ca 1938 (35842453).jpg":"assets/maps/lodz-1938.jpg"
};
export const archiveUrl=file=>ARCHIVE_PATH[file]||("https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width=1600");
export const archiveFallbackUrl=file=>"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width=1600";

import {VERIFIED_SITES,verifiedBuildingList,PLAYABLE_CITIES} from "./verified-sites.js";

// Only sites that have individually cited pre-1940 building records may appear.
export const COORDINATES=Object.fromEntries(Object.entries(VERIFIED_SITES).map(([city,data])=>
 [city,{region:data.region,archive:data.archive,landmarks:data.buildings,center:null,villages:[]}]
));
export function atlasKey(name){return PLAYABLE_CITIES.find(x=>x.toLocaleLowerCase("pl-PL")===String(name).toLocaleLowerCase("pl-PL"))||null;}
export function validatedSiteList(city){
 return verifiedBuildingList(city).map(site=>({
  id:site.siteId,name:site.name,lat:site.lat,lon:site.lon,type:site.type,kind:"urban",region:site.region,
  source:site.source,address:site.address,verifiedPrewar:true,polygonVerified:false,
  coordinateAccuracy:site.coordinateAccuracy,note:site.note
 }));
}
export const CENTERED_TOWNS=PLAYABLE_CITIES;

/* Genuine WIG operational map sheets, 1:300,000, from the interwar period.
   These are regional maps (NOT building parcel geometry). Original period varies by sheet. */
export const REGIONAL_SHEETS={
 pomorskie:["Toruń",1933,"WIG Mapa Operacyjna Polski - 44 Toruń 1933.jpg"],
 poznanskie:["Poznań",1935,"WIG Mapa Operacyjna Polski - 53 Poznań 1935.jpg"],
 warszawskie:["Warszawa",1933,"WIG Mapa Operacyjna Polski - 55 Warszawa 1933.jpg"],
 lodzkie:["Łódź",1936,"WIG Mapa Operacyjna Polski - 64 Łódź 1936.jpg"],
 kieleckie:["Kielce",1928,"WIG Mapa Operacyjna Polski - 75 Kielce 1928.jpg"],
 slaskie:["Cieszyn",1934,"WIG Mapa Operacyjna Polski - 84 Cieszyn 1934.jpg"],
 krakowskie:["Kraków",1925,"WIG Mapa Operacyjna Polski - 74 Kraków 1925.jpg"],
 lubelskie:["Lublin",1932,"WIG Mapa Operacyjna Polski - 66 Lublin 1932.jpg"],
 bialostockie:["Białystok",1929,"WIG Mapa Operacyjna Polski - 46 Białystok 1929.jpg"],
 nowogrodzkie:["Nowogródek",1931,"WIG Mapa Operacyjna Polski - 47 Nowogródek 1928 1931.jpg"],
 wilenskie:["Wilno",1930,"WIG Mapa Operacyjna Polski - 37 Wilno 1930.jpg"],
 poleskie:["Pińsk",1933,"WIG Mapa Operacyjna Polski - 57 Pińsk 1933.jpg"],
 wolynskie:["Łuck",1928,"WIG Mapa Operacyjna Polski - 77 Łuck 1928.jpg"],
 lwowskie:["Lwów",1928,"WIG Mapa Operacyjna Polski - 86 Lwów 1928.jpg"],
 tarnopolskie:["Lwów / Tarnopol çevresi",1928,"WIG Mapa Operacyjna Polski - 86 Lwów 1928.jpg"],
 stanislawowskie:["Stanisławów / Czerniowce",1930,"WIG Mapa Operacyjna Polski - 97 Stanisławów-Czerniowce (Cernauti) 1930.jpg"]
};
// Local copies from the Commons-sourced WIG bundling workflow. Shared Lwów sheet also covers Tarnopol context.
for(const [region,row] of Object.entries(REGIONAL_SHEETS)){
 const file=row[2];
 if(!ARCHIVE_PATH[file])ARCHIVE_PATH[file]="assets/maps/wig-"+(region==="tarnopolskie"?"lwowskie":region)+".jpg";
}
export function regionalArchive(id){
 const row=REGIONAL_SHEETS[id];if(!row)return ARCHIVE.country;
 return {title:"WIG, arkusz "+row[0],year:row[1],file:row[2],source:"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(row[2]),rights:"Historical military cartographic sheet"};
}

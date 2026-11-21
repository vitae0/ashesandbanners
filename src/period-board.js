
import {REGION_DATA,INSTITUTIONS} from "./engine.js";
import {PLAYABLE_REGIONS,PLAYABLE_CITIES,getVerifiedSite} from "./verified-sites.js";
import {ARCHIVE,archiveUrl,archiveFallbackUrl,COORDINATES,atlasKey,validatedSiteList,regionalArchive} from "./archival-atlas-data.js";

const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const places=Object.fromEntries(REGION_DATA.map(r=>[r[0],r]));
const cnum=n=>Math.max(0,Math.min(100,Number(n)||0));
const COUNTRY_X=(lon)=>45+(lon-14)*61; // approximate printed-map graticule alignment, not surveyed geometry
const COUNTRY_Y=(lat)=>65+(56-lat)*106;
const RURAL_SUFFIX=" • çevre yerleşim";
function archivalImg(src,width,height,extra=""){
 return '<image x="0" y="0" width="'+width+'" height="'+height+'" href="'+escape(archiveUrl(src.file))+'" data-archive-file="'+escape(src.file)+'" preserveAspectRatio="xMidYMid meet" '+extra+'/>';
}
export function cityBuildings(region,city){
 const key=atlasKey(city);if(!key||COORDINATES[key].region!==region)return [];
 return validatedSiteList(key).filter(site=>site.verifiedPrewar&&getVerifiedSite(site.id)).map((site,i)=>({
  osmId:site.id,name:site.name,lat:site.lat,lon:site.lon,region:site.region,
  city:key,kind:site.type,allowed:[site.type],
  visibility:site.kind==="rural"?.21:(INSTITUTIONS[site.type]?.visibility||.35),
  source:site.source,sourceAddress:site.address,verifiedPrewar:true,polygonVerified:false,zone:"urban",index:i
 }));
}
export class PeriodBoard {
 constructor(host,notify){
  this.host=host;this.notify=notify;this.state=null;this.view="country";this.region="warszawskie";this.town="Warszawa";
  const onActivate=e=>{
   if(e.type==="keydown"&&!["Enter"," "].includes(e.key))return;
   const n=e.target.closest("[data-region],[data-town],[data-building],[data-back]");
   if(!n||!this.state)return;
   if(e.type==="keydown")e.preventDefault();
   if(n.dataset.back){this.back();return}
   if(n.dataset.region){this.focusRegion(n.dataset.region);return}
   if(n.dataset.town){this.focusTown(n.dataset.town,this.region);return}
   if(n.dataset.building!==undefined){
    const site=cityBuildings(this.region,this.town)[Number(n.dataset.building)];
    if(site){this.state.selectedBuilding=site;this.notify(this.state,{type:"building",building:site})}
   }
  };
  this.host.addEventListener("click",onActivate);
  this.host.addEventListener("keydown",onActivate);
 }
 mount(s){this.state=s;this.region=s.selectedRegion||"warszawskie";this.town="Warszawa";this.view="country";this.lastSignature=null;this.draw()}
 update(s){this.state=s;this.region=s.selectedRegion||this.region;this.draw()}
 home(){this.view="country";this.state.selectedBuilding=null;this.state.selectedDistrict="";this.draw();this.notify(this.state,{type:"home"})}
 back(){this.view=this.view==="town"?"province":"country";this.state.selectedBuilding=null;this.state.selectedDistrict="";this.draw();this.notify(this.state,{type:"back"})}
 focusRegion(id){
  if(!PLAYABLE_REGIONS.includes(id))return;
  this.region=id;this.state.selectedRegion=id;this.state.selectedDistrict="";this.state.selectedBuilding=null;
  this.view="province";this.draw();this.notify(this.state,{type:"region",id});
 }
 focusTown(name,id=this.region){
  if(!PLAYABLE_REGIONS.includes(id)||!atlasKey(name)||COORDINATES[name].region!==id)return;
  this.town=name;this.region=id;this.state.selectedRegion=id;this.state.selectedDistrict=name;this.state.selectedBuilding=null;
  this.view="town";this.draw();this.notify(this.state,{type:"town",name});
 }
 focusCapital(){this.focusTown("Warszawa","warszawskie")}
 level(){return {country:"1939 tarihî atlas",province:"Tarihsel kentler",town:"Arşiv şehir planı"}[this.view]}
 draw(){
  if(!this.state)return;
  // Avoid reloading large original scans on every simulation frame.
  const state=this.state,base=[this.view,this.region,this.town,state.selectedRegion,state.selectedDistrict,
    state.selectedBuilding?.osmId||"",state.settings.showInfluence?"heat":"plain",
    (state.assets||[]).map(a=>a.osmId).join(",")];
  if(this.view==="country")base.push(...Object.values(state.regions).map(r=>Math.round(r.influence||0)));
  const signature=base.join("|");
  if(signature===this.lastSignature)return;
  this.lastSignature=signature;
  this.host.innerHTML=this.view==="country"?this.country():this.view==="province"?this.province():this.city();
  // Cache real historical scans locally when available, fallback to Commons.
  for(const el of this.host.querySelectorAll?.("[data-archive-file]")||[]){
   const file=el.dataset.archiveFile,local=archiveUrl(file),fallback=archiveFallbackUrl(file);
   let used=false;
   const setFallback=()=>{
    if(used)return;
    used=true;
    if(el.tagName.toLowerCase()==="image")el.setAttribute("href",fallback);
    else el.src=fallback;
   };
   el.addEventListener("error",setFallback,{once:true});
   if(typeof fetch==="function"&&local!==fallback)
    fetch(local,{method:"HEAD"}).then(r=>{if(!r.ok)setFallback()}).catch(setFallback);
  }
 }
 source(src,limit="1600"){
  return '<a class="board-source" target="_blank" rel="noreferrer" href="'+escape(src.source)+'">'+escape(src.title)+' ('+src.year+') • arşiv kaynağı ↗</a>';
 }
 country(){
  const src=ARCHIVE.country;
  // The scanned 1939 atlas has NOT been georeferenced; placing latitude-derived
  // dots over pixel positions would invent precision and mislocate regions.
  const selectors=PLAYABLE_REGIONS.map(id=>
   '<button class="atlas-site" data-region="'+escape(id)+'">'+escape(places[id][1])+' → '+(id==="warszawskie"?"Warszawa":"Łódź")+'</button>'
  ).join("");
  return '<div class="atlas-sheet"><svg viewBox="0 0 960 1008" class="atlas-image" role="img" aria-label="1939 tarihli gerçek askerî Polonya ve komşu ülke haritası">'+
   archivalImg(src,960,1008)+'</svg></div>'+
   '<div class="atlas-caption"><b>1939 ÖZGÜN ASKERÎ HARİTA</b> · Polonya ve çevre ülkeler. Kaynağı doğrulanmamış yerler açılmaz; arşiv taramasının üzerine uydurma koordinat işaretleri eklenmedi.'+
   this.source(src)+'</div><div class="atlas-settlement-list">'+selectors+'</div>';
 }
 province(){
  const data=places[this.region],towns=PLAYABLE_CITIES.filter(t=>COORDINATES[t].region===this.region);
  const src=ARCHIVE[COORDINATES[towns[0]].archive];
  return '<div class="atlas-subhead"><button data-back="1">← Polonya</button><b>'+escape(data[1])+'</b><small>'+src.year+' özgün kent planı</small></div>'+
   '<div class="atlas-province"><img class="atlas-province-image" loading="lazy" decoding="async" data-archive-file="'+escape(src.file)+'" src="'+escape(archiveUrl(src.file))+'" alt="'+escape(src.title)+' tarihsel harita"/></div>'+
   '<div class="atlas-settlement-list">'+towns.map(t=>'<button data-town="'+escape(t)+'">'+escape(t)+'</button>').join("")+'</div>'+
   '<p class="atlas-note">Yalnızca kaynakla doğrulanmış binaları olan şehirler açılır. Dönemin özgün kent planı gösterilir; kadastro poligonları doğrulanmadığından üretilmez.</p>'+this.source(src);
 }
 city(){
  const key=atlasKey(this.town),record=key?COORDINATES[key]:null;
  const src=record?ARCHIVE[record.archive]:regionalArchive(this.region);
  const sites=record?cityBuildings(this.region,this.town):[];
  const townCount=sites.length;
  const name='<div class="atlas-subhead"><button data-back="1">← Bölge</button><b>'+escape(this.town)+'</b><small>'+src.year+' tarihli özgün harita</small></div>';
  let overlays="";
  // Historical scans are authentic, but *uncalibrated*. Do not pretend approximate annotations are parcel polygons.
  // In particular, NO fabricated square building footprints or false clickable cadastral shapes.
  const urban=sites.filter(x=>x.zone==="urban").map(site=>{
   const idx=site.index,owned=this.state.assets.some(a=>a.osmId===site.osmId);
   return '<button data-building="'+idx+'" class="atlas-site '+(owned?"is-owned":"")+'">'+escape(site.name)+
    '<small>'+escape(INSTITUTIONS[site.kind]?.name||"Kurum")+' • '+escape(site.sourceAddress||"Belge")+'</small></button>';
  }).join("");
  const rural="";
  let warning='Yalnızca 1940 öncesi varlığı kaynakla belgelenmiş binalar listelenir. Harita taraması özgündür; bina koordinatları yaklaşık referans noktalarıdır, doğrulanmış parsel poligonu değildir. Köy, meydan, park ve kaynaksız alanlar oyundan çıkarılmıştır.';
  const sources=sites.map(site=>'<a href="'+escape(site.source)+'" class="board-source" target="_blank" rel="noreferrer">'+escape(site.name)+' ↗</a>').join("");
  return name+'<div class="atlas-city-layout"><div class="atlas-city-scan"><img loading="lazy" decoding="async" data-archive-file="'+escape(src.file)+'" src="'+escape(archiveUrl(src.file))+'" alt="'+escape(src.title)+' '+src.year+' tarihli özgün harita"/>'+
   '<div class="atlas-scanlabel">'+escape(src.title)+' · '+src.year+'</div></div>'+
   '<div class="atlas-sites"><div class="atlas-section-title">KAYNAKLI TARİHSEL BİNALAR <small>'+townCount+'</small></div>'+
   (urban||'<div class="atlas-warning">Bu yerleşim için doğrulanmış bina envanteri yok.</div>')+
   rural+
   '</div></div><p class="atlas-note">'+escape(warning)+'</p>'+this.source(src)+'<div class="atlas-evidence">'+sources+'</div>';
 }
}

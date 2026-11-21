
import {REGION_DATA,INSTITUTIONS} from "./engine.js";
import {HISTORIC_LOCATIONS} from "./period-map-data.js";
import {ARCHIVE,archiveUrl,COORDINATES,atlasKey,validatedSiteList} from "./archival-atlas-data.js";

const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const places=Object.fromEntries(REGION_DATA.map(r=>[r[0],r]));
const cnum=n=>Math.max(0,Math.min(100,Number(n)||0));
const COUNTRY_X=(lon)=>45+(lon-14)*61; // approximate printed-map graticule alignment, not surveyed geometry
const COUNTRY_Y=(lat)=>65+(56-lat)*106;
const RURAL_SUFFIX=" • çevre yerleşim";
function archivalImg(src,width,height,extra=""){
 return '<image x="0" y="0" width="'+width+'" height="'+height+'" href="'+escape(archiveUrl(src.file))+'" preserveAspectRatio="xMidYMid meet" '+extra+'/>';
}
export function cityBuildings(region,city){
 const key=atlasKey(city);if(!key||COORDINATES[key].region!==region)return [];
 return validatedSiteList(key).map((site,i)=>({
  osmId:site.id,name:site.name,lat:site.lat,lon:site.lon,region:site.region,
  city:key,kind:site.type,allowed:site.kind==="rural"?["safehouse"]:["safehouse",site.type],
  visibility:site.kind==="rural"?.21:(INSTITUTIONS[site.type]?.visibility||.35),
  source:"archival gazetteer",zone:site.kind,index:i
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
 mount(s){this.state=s;this.region=s.selectedRegion||"warszawskie";this.town="Warszawa";this.view="country";this.draw()}
 update(s){this.state=s;this.region=s.selectedRegion||this.region;this.draw()}
 home(){this.view="country";this.state.selectedBuilding=null;this.state.selectedDistrict="";this.draw();this.notify(this.state,{type:"home"})}
 back(){this.view=this.view==="town"?"province":"country";this.state.selectedBuilding=null;this.state.selectedDistrict="";this.draw();this.notify(this.state,{type:"back"})}
 focusRegion(id){
  if(!places[id])return;
  this.region=id;this.state.selectedRegion=id;this.state.selectedDistrict="";this.state.selectedBuilding=null;
  this.view="province";this.draw();this.notify(this.state,{type:"region",id});
 }
 focusTown(name,id=this.region){
  if(!places[id])return;
  this.town=name;this.region=id;this.state.selectedRegion=id;this.state.selectedDistrict=name;this.state.selectedBuilding=null;
  this.view="town";this.draw();this.notify(this.state,{type:"town",name});
 }
 focusCapital(){this.focusTown("Warszawa","warszawskie")}
 level(){return {country:"1939 tarihî atlas",province:"Tarihsel kentler",town:"Arşiv şehir planı"}[this.view]}
 draw(){
  if(!this.state)return;
  this.host.innerHTML=this.view==="country"?this.country():this.view==="province"?this.province():this.city();
 }
 source(src,limit="1600"){
  return '<a class="board-source" target="_blank" rel="noreferrer" href="'+escape(src.source)+'">'+escape(src.title)+' ('+src.year+') • arşiv kaynağı ↗</a>';
 }
 country(){
  const src=ARCHIVE.country,s=this.state;
  let markers="";
  for(const [id,name,lat,lon] of REGION_DATA){
   const x=COUNTRY_X(lon),y=COUNTRY_Y(lat),value=cnum(s.regions[id]?.influence||0);
   markers+='<g data-region="'+escape(id)+'" class="atlas-pin" role="button" tabindex="0" aria-label="'+escape(name)+' ilini seç">'+
    '<circle cx="'+x+'" cy="'+y+'" r="'+(s.selectedRegion===id?12:9)+'" fill="var(--theme)" fill-opacity="'+(s.settings.showInfluence?(0.3+value*.005):.05)+'" stroke="#fff8df" stroke-width="2"/>'+
    '<circle cx="'+x+'" cy="'+y+'" r="3" fill="#1c2830"/>'+
    '<title>'+escape(name)+' • örgüt etkisi '+Math.round(value)+'%</title></g>';
  }
  return '<div class="atlas-sheet"><svg viewBox="0 0 960 1008" class="atlas-image" role="img" aria-label="1939 tarihli gerçek askerî Polonya ve komşu ülke haritası">'+
   archivalImg(src,960,1008)+markers+'</svg></div>'+
   '<div class="atlas-caption"><b>1939 GERÇEK ASKERÎ HARİTA</b> · Komşular harita üzerinde. Bölgeler mevcut tarihsel merkez noktalarından seçilir; imleçler resmî idari poligonlar değildir.'+
   this.source(src)+'</div>';
 }
 province(){
  const data=places[this.region],cityList=HISTORIC_LOCATIONS[this.region]||[],src=ARCHIVE.country;
  const r=this.state.regions[this.region]||{};
  const center=[COUNTRY_X(data[3]),COUNTRY_Y(data[2])];
  // Show original archival raster. Avoid fake county outlines or fabricated road grids.
  return '<div class="atlas-subhead"><button data-back="1">← Polonya</button><b>'+escape(data[1])+'</b><small>Gerçek 1939 baskısı · yerleşim seçimi</small></div>'+
   '<div class="atlas-province"><svg viewBox="0 0 960 1008" class="atlas-image" role="img" aria-label="1939 haritasında seçilen bölge">'+
    archivalImg(src,960,1008)+
    '<circle cx="'+center[0]+'" cy="'+center[1]+'" r="19" fill="var(--theme)" fill-opacity=".15" stroke="var(--theme)" stroke-width="3"/>'+
    '</svg></div>'+
   '<div class="atlas-settlement-list">'+cityList.map(town=>'<button data-town="'+escape(town)+'">'+escape(town)+'</button>').join("")+'</div>'+
   '<p class="atlas-note">Dönem haritası gerçek, fakat 1939 ilçe poligonları henüz vektörleştirilip kaynaklarına göre doğrulanmadı. Uydurma sınır göstermiyorum.</p>'+this.source(src);
 }
 city(){
  const key=atlasKey(this.town),record=key?COORDINATES[key]:null;
  const src=record?ARCHIVE[record.archive]:ARCHIVE.country;
  const sites=record?cityBuildings(this.region,this.town):[];
  const townCount=sites.filter(x=>x.zone==="urban").length,ruralCount=sites.filter(x=>x.zone==="rural").length;
  const name='<div class="atlas-subhead"><button data-back="1">← Bölge</button><b>'+escape(this.town)+'</b><small>'+src.year+' tarihli özgün harita</small></div>';
  let overlays="";
  // Historical scans are authentic, but *uncalibrated*. Do not pretend approximate annotations are parcel polygons.
  // In particular, NO fabricated square building footprints or false clickable cadastral shapes.
  const urban=sites.filter(x=>x.zone==="urban").map(site=>{
   const idx=site.index,owned=this.state.assets.some(a=>a.osmId===site.osmId);
   return '<button data-building="'+idx+'" class="atlas-site '+(owned?"is-owned":"")+'">'+escape(site.name)+
    '<small>'+site.lat.toFixed(4)+'° K, '+site.lon.toFixed(4)+'° D • '+escape(INSTITUTIONS[site.kind]?.name||"Kurum")+'</small></button>';
  }).join("");
  const rural=sites.filter(x=>x.zone==="rural").map(site=>
   '<button data-building="'+site.index+'" class="atlas-site">'+escape(site.name)+'<small>Çevre yerleşim • '+site.lat.toFixed(4)+'° K / '+site.lon.toFixed(4)+'° D</small></button>').join("");
  let warning=record?'Arşiv görüntüsü tarihsel ve özgündür. Koordinatlar yerleşim/kurum noktalarıdır; tarihsel parsel sınırlarını göstermediği için sahte bina poligonları eklenmedi.':'Bu yerleşim için lisansı doğrulanmış, yapı düzeyinde tarihî plan henüz bulunamadı. Ülke atlası kullanılıyor; uydurma bina alanları açılmıyor.';
  return name+'<div class="atlas-city-layout"><div class="atlas-city-scan"><img loading="lazy" decoding="async" src="'+escape(archiveUrl(src.file))+'" alt="'+escape(src.title)+' '+src.year+' tarihli özgün harita"/>'+
   '<div class="atlas-scanlabel">'+escape(src.title)+' · '+src.year+'</div></div>'+
   '<div class="atlas-sites"><div class="atlas-section-title">MERKEZDEKİ BELGELİ YERLER <small>'+townCount+'/15</small></div>'+
   (urban||'<div class="atlas-warning">Bu yerleşim için doğrulanmış bina envanteri yok.</div>')+
   '<div class="atlas-section-title">ÇEVRE YERLEŞİMLER <small>'+ruralCount+'/5</small></div>'+rural+
   '</div></div><p class="atlas-note">'+escape(warning)+'</p>'+this.source(src);
 }
}

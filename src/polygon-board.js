
/**
 * Approximate, entirely hand-authored polygon atlas for the January 1940 scenario.
 * Not a georeferenced map. The 1939 frontier, 1940 occupation sectors, voivodeship
 * guides and symbolic city buildings have different historical accuracy levels.
 * All geometry is SVG built locally; no images, tiles, OSM or network requests.
 */
import {REGION_DATA,INSTITUTIONS} from "./engine.js";
import {cityBuildings} from "./period-board.js";
import {HISTORICAL_COUNTRIES,HISTORICAL_YEAR} from "./historical-geometry.js";
import {getVerifiedSite,buildingStatusAt} from "./verified-sites.js";

const esc = v => String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const x = lon => 54 + (lon-5)*38.7;
const y = lat => 36 + (58.2-lat)*57.1;
export const point = ([lon,lat]) => x(lon).toFixed(1)+","+y(lat).toFixed(1);
export const shape = coords => coords.map(point).join(" ");
const polygon = (coords,cls,extra="")=>'<polygon class="'+cls+'" points="'+shape(coords)+'" '+extra+'/>';
const txt = (lon,lat,label,cls,attrs="")=>'<text x="'+x(lon).toFixed(1)+'" y="'+y(lat).toFixed(1)+'" class="'+cls+'" '+attrs+'>'+esc(label)+'</text>';

/* Prewar national outline with the Baltic corridor and interwar eastern territory.
 * Anchors are approximate, hand-digitized from broad geographical knowledge;
 * do not use to calculate area, jurisdiction or exact border crossing. */
export const POLAND_1939 = [
 [14.17,53.90],[14.75,54.07],[15.40,54.28],[16.20,54.60],[17.02,54.79],[17.72,54.75],
 [18.22,54.83],[18.70,54.37],[19.25,54.42],[19.95,54.36],[20.85,54.42],[21.65,54.33],
 [22.55,54.47],[23.30,54.40],[23.95,54.43],[24.44,54.33],[25.20,54.65],[25.70,55.16],
 [26.58,55.47],[27.25,55.83],[27.90,55.22],[28.18,54.38],[28.38,53.52],[28.52,52.63],
 [29.05,51.62],[28.45,51.03],[27.38,50.12],[26.85,49.30],[26.31,48.57],[25.34,48.45],
 [24.45,48.58],[23.48,48.68],[22.70,49.07],[21.72,49.33],[20.92,49.29],[20.10,49.36],
 [19.26,49.43],[18.64,49.68],[18.52,50.13],[17.73,50.28],[17.06,50.46],[16.58,50.70],
 [16.05,50.99],[15.36,51.09],[14.70,51.63],[14.62,52.41],[14.45,53.13]
];

/* January 1940 reference overlays. Shapes are simplified approximations, clipped
 * inside the prewar Polish border. Łódź, Pomerania and Poznań: annexed to Reich;
 * Warsaw, Radom/Kielce, Lublin and Kraków: General Government; eastern areas: USSR. */
export const SECTORS = [
 {id:"reich",name:"ALMANYA'YA İLHAK",fill:"#55636c",points:[[13.5,55.6],[19.95,55.6],[19.75,53.35],[20.65,52.62],[20.32,51.45],[19.56,50.38],[18.67,49.45],[13.5,49.1]]},
 {id:"general",name:"GENERALGOUVERNEMENT",fill:"#9d8263",points:[[19.70,53.35],[22.40,53.54],[23.24,53.22],[23.55,52.40],[23.52,51.22],[24.03,50.47],[23.05,49.30],[21.72,48.97],[19.25,49.24],[18.52,49.80],[19.56,50.38],[20.32,51.45],[20.65,52.62]]},
 {id:"soviet",name:"SSCB İŞGALİ",fill:"#7a6b76",points:[[22.40,53.54],[22.47,54.30],[23.70,56.0],[30.6,56.0],[30.6,47.7],[23.05,47.7],[23.05,49.30],[24.03,50.47],[23.52,51.22],[23.55,52.40],[23.24,53.22]]}
];
/* Schematic inter-voivodeship divider polylines. Not exact administrative geometry. */
const PROVINCE_GUIDES = [
 [[17.1,54.65],[17.4,53.68],[18.0,53.1],[18.9,52.79],[19.6,52.55]],
 [[19.6,52.55],[19.2,51.85],[18.9,51.43],[18.8,50.60]],
 [[16.12,51.07],[17.48,51.40],[18.94,51.45],[20.13,51.50],[21.12,51.54]],
 [[20.02,54.38],[20.14,53.52],[20.94,52.87],[21.14,52.05]],
 [[21.12,51.54],[21.56,50.95],[21.11,50.12],[21.12,49.4]],
 [[18.70,50.21],[19.28,50.58],[20.05,50.62],[21.56,50.95]],
 [[21.14,52.05],[22.20,52.20],[23.15,52.50],[23.76,52.88]],
 [[22.20,52.20],[22.18,51.43],[22.38,50.65],[22.8,49.2]],
 [[22.55,54.47],[23.15,53.72],[23.76,52.88]],
 [[23.15,53.72],[24.5,53.53],[25.3,53.1],[26.3,52.7]],
 [[25.3,53.1],[25.1,54.1],[25.5,55.15]],
 [[23.76,52.88],[24.35,51.88],[24.25,51.2]],
 [[24.25,51.2],[25.6,51.3],[26.8,51.7],[28.5,52.6]],
 [[24.25,51.2],[24.22,50.45],[23.8,49.85],[23.1,49.12]],
 [[23.8,49.85],[25.35,50.08],[26.9,49.38]],
 [[25.35,50.08],[25.2,48.55]]
];
const NEIGHBORS = [
 ["ALMANYA", [[6,56.8],[13.9,56.8],[14.1,54.1],[14.5,53.1],[14.5,52.45],[14.7,51.64],[16.05,51.01],[16.45,50.68],[17.08,50.42],[16.5,49.67],[12.3,49.0],[9.1,47.3],[6,47.0]], "#425565", [10.1,52.45]],
 ["DOĞU PRUSYA",[[18.50,54.84],[19.2,54.42],[20.8,54.38],[22.52,54.44],[22.73,55.20],[20.50,55.38],[19.3,55.27]],"#465c69",[20.3,54.9]],
 ["DANZIG",[[18.25,54.90],[18.65,54.96],[18.92,54.56],[18.64,54.35],[18.24,54.41]],"#76725c",[18.54,54.75]],
 ["İSVEÇ",[[11,58.7],[20,58.7],[19.3,57.3],[17.0,56.3],[14.4,56.9],[12.5,57.6]],"#4a6770",[16.35,57.5]],
 ["DANİMARKA",[[7.3,57.2],[11.9,57.2],[12.8,55.4],[10.65,54.8],[8.3,54.9]],"#526870",[10.1,55.86]],
 ["LİTVANYA",[[22.55,56.0],[26.95,56.0],[26.58,55.47],[25.7,55.16],[25.2,54.65],[24.4,54.35],[23.4,54.4],[22.5,54.49]],"#516b68",[24.1,55.55]],
 ["LETONYA",[[20.9,58.22],[28.8,58.22],[28.17,56.14],[26.95,56.0],[22.55,56.0],[21.15,56.45]],"#4e626b",[24.8,57.15]],
 ["SSCB",[[28.1,58.7],[39.0,58.7],[39.0,46.7],[29.15,46.7],[27.1,48.3],[26.31,48.57],[26.9,49.3],[27.38,50.12],[28.45,51.03],[29.05,51.62],[28.52,52.63],[28.38,53.52],[28.18,54.38],[27.90,55.22],[27.25,55.83],[28.17,56.14]],"#5e5366",[32.0,53.9]],
 ["ROMANYA",[[24.0,48.52],[26.31,48.57],[27.1,48.3],[29.15,46.7],[29.1,45.2],[20.8,45.2],[21.6,47.4]],"#656c60",[26.5,47.15]],
 ["MACARİSTAN",[[16.5,48.0],[17.1,48.0],[19.3,48.2],[21.6,47.4],[24.0,48.52],[23.48,48.68],[22.7,49.07],[21.72,49.33],[20.1,49.36],[19.26,49.43],[18.6,49.68],[17.4,48.6]],"#736657",[19.1,48.35]],
 ["SLOVAKYA",[[16.9,49.56],[18.52,50.13],[18.64,49.68],[19.26,49.43],[20.1,49.36],[20.92,49.29],[21.72,49.33],[22.7,49.07],[23.48,48.68],[24.0,48.52],[22.8,48.4],[20.9,48.4],[18.45,48.6],[17.0,48.9]],"#61716c",[21.1,48.89]],
 ["BOHEMYA-MORAVYA",[[12.0,50.3],[14.62,52.41],[14.7,51.64],[15.36,51.09],[16.05,50.99],[16.58,50.7],[17.06,50.46],[17.73,50.28],[18.52,50.13],[16.9,49.56],[17.0,48.9],[15.0,48.8],[12.1,49.15]],"#64645b",[14.9,49.92]],
 ["İSVİÇRE",[[6.0,47.8],[10.5,47.8],[10.6,46.2],[6.0,46.2]],"#526e6a",[8.4,47.16]]
];
export const CAPITALS = Object.freeze({
 pomorskie:["Toruń",53.016,18.606],poznanskie:["Poznań",52.406,16.925],
 warszawskie:["Warszawa",52.230,21.012],lodzkie:["Łódź",51.759,19.456],
 kieleckie:["Kielce",50.866,20.629],slaskie:["Katowice",50.264,19.023],
 krakowskie:["Kraków",50.065,19.945],lubelskie:["Lublin",51.246,22.568],
 bialostockie:["Białystok",53.132,23.163],nowogrodzkie:["Nowogródek",53.592,25.824],
 wilenskie:["Wilno",54.687,25.280],poleskie:["Brześć",52.097,23.704],
 wolynskie:["Łuck",50.747,25.325],lwowskie:["Lwów",49.840,24.031],
 tarnopolskie:["Tarnopol",49.554,25.595],stanislawowskie:["Stanisławów",48.922,24.710]
});
const CITY_MODE = {
 lodzkie:"industrial",slaskie:"industrial",pomorskie:"port",poznanskie:"urban",
 warszawskie:"capital",krakowskie:"historic",wilenskie:"historic",lwowskie:"historic",
 kieleckie:"rural",lubelskie:"rural",bialostockie:"rural",poleskie:"rural",
 nowogrodzkie:"rural",wolynskie:"rural",tarnopolskie:"rural",stanislawowskie:"rural"
};
const regionById = Object.fromEntries(REGION_DATA.map(d=>[d[0],d]));
function polyPath(coords,cls,attrs=""){return '<polyline points="'+shape(coords)+'" class="'+cls+'" '+attrs+'/>'}
export function countrySvg(state,selected,camera={x:0,y:0,w:1350,h:780}){
 // Prefer documented 1938 EPSG:4326 country polygons, bundled locally from Cliopatria.
 // Fallback is the old hand-drawn atlas only when the optional data build is absent.
 const poland=HISTORICAL_COUNTRIES.find(c=>/^poland$/i.test(c.name))||
   HISTORICAL_COUNTRIES.find(c=>/poland|polish/i.test(c.name));
 const sourced=Boolean(poland?.rings?.length);
 const polandRings=sourced?poland.rings:[POLAND_1939];
 const countryColors=name=>/german|reich|prussia/i.test(name)?"#425565":
  /soviet|russia/i.test(name)?"#5e5366":/romania/i.test(name)?"#656c60":
  /hungary/i.test(name)?"#736657":/lithuania/i.test(name)?"#516b68":
  /latvia|estonia/i.test(name)?"#4e626b":/slovak|czecho/i.test(name)?"#61716c":"#576b70";
 const country=sourced?
   HISTORICAL_COUNTRIES.filter(c=>c!==poland).map(c=>c.rings.map(ring=>polygon(ring,"v-country",'fill="'+countryColors(c.name)+'"')).join("")).join("")+
   NEIGHBORS.map(([label,, ,anchor])=>txt(anchor[0],anchor[1],label,"v-country-label")).join(""):
   NEIGHBORS.map(([label,coords,color,anchor])=>polygon(coords,"v-country",'fill="'+color+'"')+txt(anchor[0],anchor[1],label,"v-country-label")).join("");
 const polandOutline=polandRings.map(ring=>polygon(ring,"v-poland-base")).join("");
 const polandFrontier=polandRings.map(ring=>polygon(ring,"v-frontier")).join("");
 const sourceLabel=sourced?"CC BY 4.0 · Cliopatria "+HISTORICAL_YEAR:"Temsilî sınır · tarihsel veri hazırlanıyor";
 const zones=SECTORS.map(z=>polygon(z.points,"v-zone",'fill="'+z.fill+'"')).join("");
 const guides=PROVINCE_GUIDES.map(coords=>polyPath(coords,"v-province-guide")).join("");
 const marker=REGION_DATA.map(([id,name])=>{
  const [city,lat,lon]=CAPITALS[id];
  const v=Number(state.regions?.[id]?.influence||0);
  const radius=id===selected?8.5:6.4;
  const position=x(lon).toFixed(1)+","+y(lat).toFixed(1);
  const dx= id==="lodzkie" || id==="tarnopolskie" ?-13:12;
  const anchor=dx<0?"end":"start";
  return '<g class="v-marker '+(id===selected?"is-selected":"")+'" role="button" tabindex="0" data-region="'+esc(id)+'" aria-label="'+esc(name)+', '+esc(city)+' şehrini aç">'+
   '<circle cx="'+x(lon).toFixed(1)+'" cy="'+y(lat).toFixed(1)+'" r="17" class="v-hit"/>'+
   '<circle cx="'+x(lon).toFixed(1)+'" cy="'+y(lat).toFixed(1)+'" r="'+radius+'" class="v-dot" style="--strength:'+(v/100).toFixed(2)+'"/>'+
   '<circle cx="'+x(lon).toFixed(1)+'" cy="'+y(lat).toFixed(1)+'" r="2" class="v-dot-core"/>'+
   '<text x="'+(x(lon)+dx).toFixed(1)+'" y="'+(y(lat)-10).toFixed(1)+'" text-anchor="'+anchor+'" class="v-city-name">'+esc(city)+'</text>'+
   '</g>';
 }).join("");
 return '<svg class="v-world" viewBox="'+[camera.x,camera.y,camera.w,camera.h].map(v=>Number(v).toFixed(2)).join(" ")+'" role="img" aria-label="1939 Polonya ve komşuları: tarihsel vektör sınırları">'+
  '<defs><pattern id="v-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity=".04"/></pattern>'+
  '<clipPath id="v-poland-clip">'+polandRings.map(ring=>polygon(ring,"")).join("")+'</clipPath></defs>'+
  '<rect width="1350" height="780" fill="#293b48"/><rect width="1350" height="780" fill="url(#v-grid)"/>'+
  country+polandOutline+
  '<g clip-path="url(#v-poland-clip)">'+zones+guides+'</g>'+
  polandFrontier+
  txt(21.7,51.4,"GENERALGOUVERNEMENT","v-zone-title",'text-anchor="middle"')+
  txt(25.9,52.15,"SSCB","v-zone-title",'text-anchor="middle"')+
  txt(17.3,52.15,"REICH","v-zone-title",'text-anchor="middle"')+
  txt(21.6,53.28,"POLSKA 1939","v-prewar-label",'text-anchor="middle"')+
  marker+
  '<g class="v-compass" transform="translate(1259 692)"><circle r="30"/><path d="M0-23L7 0 0 23 -7 0Z"/><text x="0" y="-39" text-anchor="middle">N</text></g>'+
  '<g class="v-map-note"><rect x="22" y="17" width="360" height="59" rx="6"/><text x="36" y="41">POLONYA VE ORTA AVRUPA</text><text x="36" y="61">'+esc(sourceLabel)+' / Ocak 1940 işgal katmanı</text></g>'+
  '</svg>';
}
function seedFor(str){let h=2166136261;for(const c of str){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0}
function randomFor(str){let v=seedFor(str);return ()=>{v=(Math.imul(v,1664525)+1013904223)>>>0;return v/4294967296}}
function house(x0,y0,w,h,tone,kind,idx){
 const dark="#3d4650",roof="#9a5d4c",roof2="#655668",cement="#b7aa90";
 const top=y0-h,edge= Math.max(6,w*.22);
 const face='<polygon points="'+[[x0,top],[x0+w,top],[x0+w,y0],[x0,y0]].map(p=>p.join(",")).join(" ")+'" fill="'+tone+'" stroke="#333b46" stroke-width="1.5"/>';
 const side='<polygon points="'+[[x0+w,top],[x0+w+edge,top-edge*.42],[x0+w+edge,y0-edge*.42],[x0+w,y0]].map(p=>p.join(",")).join(" ")+'" fill="#6a6870" stroke="#333b46" stroke-width="1.1"/>';
 let topShape='<polygon points="'+[[x0-4,top],[x0+w+1,top],[x0+w+edge+5,top-edge*.42],[x0+edge-2,top-edge*.42]].map(p=>p.join(",")).join(" ")+'" fill="'+(idx%3?roof:roof2)+'" stroke="#3d4245" stroke-width="1.6"/>';
 if(kind==="house"||kind==="farm")topShape='<polygon points="'+[[x0-5,top],[x0+w/2,top-20],[x0+w+5,top],[x0+w/2,top-5]].map(p=>p.join(",")).join(" ")+'" fill="'+roof+'" stroke="#3b3734" stroke-width="2"/>';
 let windows="";
 const n=Math.max(1,Math.floor(w/22));const levels=Math.max(1,Math.floor(h/25));
 for(let r=0;r<levels;r++)for(let c=0;c<n;c++){
  let wx=x0+(c+0.6)*w/(n+0.25),wy=top+(r+.55)*h/(levels+.25);
  windows+='<polygon points="'+wx.toFixed(1)+','+wy.toFixed(1)+' '+(wx+6).toFixed(1)+','+wy.toFixed(1)+' '+(wx+6).toFixed(1)+','+(wy+9).toFixed(1)+' '+wx.toFixed(1)+','+(wy+9).toFixed(1)+'" fill="'+(idx%4===0?"#d3ba81":dark)+'"/>';
 }
 let feature="";
 if(kind==="factory"){
   feature='<polygon points="'+(x0+w*.78)+','+(top-6)+' '+(x0+w*.91)+','+(top-6)+' '+(x0+w*.89)+','+(top-65)+' '+(x0+w*.81)+','+(top-65)+'" fill="#68565b" stroke="#333b46" stroke-width="2"/>';
 }
 if(kind==="church"){
   feature='<polygon points="'+(x0+w*.37)+','+top+' '+(x0+w*.63)+','+top+' '+(x0+w*.6)+','+(top-48)+' '+(x0+w*.5)+','+(top-77)+' '+(x0+w*.4)+','+(top-48)+'" fill="#b4a98e" stroke="#3b4546" stroke-width="2"/>'+
    '<path d="M'+(x0+w*.5)+' '+(top-81)+'v-12m-5 6h10" stroke="#ddd7be" stroke-width="2"/>';
 }
 if(kind==="municipal")feature='<polygon points="'+x0+','+(top-4)+' '+(x0+w)+','+(top-4)+' '+(x0+w-9)+','+(top-15)+' '+(x0+9)+','+(top-15)+'" fill="'+cement+'"/>';
 return '<g class="v-building">'+side+face+topShape+windows+feature+'</g>';
}
export function cityPortrait(region,name){
 const rand=randomFor(region+"|"+name);
 const type=CITY_MODE[region]||"rural";
 const skyline=[];
 const tones=["#a99d89","#908b83","#c4a987","#bcb09a","#827c7c","#a48e78"];
 skyline.push('<svg class="v-city-scene" viewBox="0 0 900 460" role="img" aria-label="'+esc(name)+' için sadece SVG poligonlarından oluşan temsili şehir illüstrasyonu">'+
 '<defs><linearGradient id="v-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a9199"/><stop offset="1" stop-color="#cad0b5"/></linearGradient></defs>'+
 '<rect width="900" height="460" fill="url(#v-sky)"/>'+
 '<polygon points="0,185 90,167 145,185 250,155 410,185 590,149 760,172 900,140 900,460 0,460" fill="#698277"/>'+
 '<polygon points="0,282 240,240 515,257 900,208 900,460 0,460" fill="#7b8b79"/>'+
 '<polygon points="0,365 320,302 620,330 900,275 900,460 0,460" fill="#6f7c70"/>'+
 '<polygon points="0,362 900,271 900,332 0,422" fill="#a49a85"/>'+
 '<polygon points="0,390 900,300 900,314 0,405" fill="#d6c9ae"/>'+
 '<polygon points="0,432 900,346 900,388 0,460" fill="#9d988b"/>');
 if(type==="port")skyline.push('<polygon points="0,290 150,275 370,289 510,268 540,322 0,355" fill="#7696a0"/>'+
 '<path d="M135 271L165 187L196 271M164 187L225 204" fill="none" stroke="#515866" stroke-width="5"/>');
 for(let row=0;row<3;row++){
  const yy=250+row*65;
  for(let j=0;j<11;j++){
   const xx=20+j*79+(row%2)*21;
   if(xx>865)continue;
   const w=35+rand()*34;
   const h=(type==="industrial"?40:32)+rand()*(type==="capital"||type==="urban"?105:type==="historic"?87:type==="industrial"?72:42);
   const isChurch=(j===5&&row===1&&type!=="industrial")||(j===7&&row===0&&type==="historic");
   const isFactory=type==="industrial"&&j%4===0;
   const kind=isChurch?"church":isFactory?"factory":j%7===3?"municipal":"house";
   skyline.push(house(xx,yy,w,h,tones[(j+row)%tones.length],kind,j+row*12));
  }
 }
 if(type==="capital"||type==="historic")skyline.push('<polygon points="392,166 422,116 455,166" fill="#6c5960" stroke="#303e43" stroke-width="2"/>'+
  house(400,230,46,73,"#bdb1a0","church",4));
 skyline.push('<g class="v-rural">');
 for(let v=0;v<3;v++){
  const vx=45+v*280+(v%2)*32,vy=392+v*10;
  skyline.push('<polygon points="'+(vx-18)+','+(vy+8)+' '+(vx+86)+','+(vy-6)+' '+(vx+106)+','+(vy+20)+' '+vx+','+(vy+40)+'" fill="#8a9b76" stroke="#5f795f" stroke-width="2"/>'+
  house(vx,vy+11,34,22,"#c4ac8d","farm",v)+
  '<text x="'+(vx+10)+'" y="'+(vy+58)+'" class="v-village-label">KÖY '+(v+1)+'</text>');
 }
 skyline.push('</g><text x="20" y="28" class="v-city-illustration-label">TEMSİLÎ ŞEHİR SİLÜETİ · GERÇEK BİNA YERLEŞİMİ DEĞİLDİR</text></svg>');
 return skyline.join("");
}
export class PolygonBoard {
 constructor(host,onChange){
  this.host=host;this.onChange=onChange;this.state=null;this.view="country";this.region="warszawskie";this.town="Warszawa";this.signature="";
  const activate=e=>{
   if(e.type==="keydown"&&!["Enter"," "].includes(e.key))return;
   const target=e.target.closest("[data-region],[data-town],[data-building],[data-map-back],[data-map-home]");
   if(!target||!this.state)return;
   if(e.type==="keydown")e.preventDefault();
   if(target.dataset.mapHome!==undefined){this.home();return}
   if(target.dataset.mapBack!==undefined){this.home();return}
   if(target.dataset.region){this.focusRegion(target.dataset.region);return}
   if(target.dataset.town){this.focusTown(target.dataset.town,target.dataset.province||this.region);return}
   if(target.dataset.building!==undefined){
    const site=cityBuildings(this.region,this.town)[Number(target.dataset.building)];
    if(site){this.state.selectedBuilding=site;this.view="country";this.draw();this.onChange(this.state,{type:"building",building:site})}
   }
  };
  host.addEventListener("click",activate);
  host.addEventListener("keydown",activate);
 }
 mount(state){this.state=state;this.region=state.selectedRegion||"warszawskie";this.view="country";this.signature="";this.draw()}
 update(state){this.state=state;this.draw()}
 home(){this.view="country";this.state.selectedBuilding=null;this.draw();this.onChange(this.state,{type:"home"})}
 back(){this.home()}
 focusRegion(id){if(!CAPITALS[id])return;this.focusTown(CAPITALS[id][0],id)}
 focusTown(name,id=this.region){
  if(!CAPITALS[id])return;
  this.region=id;this.town=name;this.view="town";
  this.state.selectedRegion=id;this.state.selectedDistrict=name;this.state.selectedBuilding=null;
  this.draw();this.onChange(this.state,{type:"town",name,id});
 }
 focusCapital(){this.focusTown("Warszawa","warszawskie")}
 level(){return this.view==="town"?"Şehir krokisi (SVG)":"1939 sınırları + 1940 işgal düzeni"}
 draw(){
  if(!this.state)return;
  const sig=[this.view,this.region,this.town,this.state.selectedRegion,Boolean(this.state.settings.showInfluence),this.state.date.slice(0,7),
   ...REGION_DATA.map(([id])=>Math.round(this.state.regions?.[id]?.influence||0)),
   this.state.assets.map(a=>a.osmId)].join("|");
  if(sig===this.signature)return;
  this.signature=sig;
  const showHeat=this.state.settings.showInfluence;
  this.host.innerHTML='<div class="v-map-root '+(showHeat?"show-influence":"no-influence")+'">'+countrySvg(this.state,this.state.selectedRegion)+
    '<div class="v-map-watermark">• İl merkezine tıklayın •</div>'+
    (this.view==="town"?this.cityWindow():"")+'</div>';
 }
 cityWindow(){
  const id=this.region,cap=CAPITALS[id],info=regionById[id];
  const sites=cityBuildings(id,this.town);
  const list=sites.length?sites.map(site=>{
   const i=site.index,rule=buildingStatusAt(getVerifiedSite(site.osmId),this.state.date);
   return '<button type="button" data-building="'+i+'" class="v-site '+(rule.claimable?"":"is-locked")+'"><b>'+esc(site.name)+'</b><small>'+
    esc(INSTITUTIONS[site.kind]?.name||site.kind)+' • '+(rule.claimable?"Belgelendi / oyun etkileşimi açık":"Tarihsel erişim kısıtlı")+'</small></button>';
  }).join(""):'<p class="v-symbolic-warning">Bu ildeki bina ve köy şekilleri temsili görselleştirmedir. Doğrulanmış tekil bina verisi bulunmadığından bina etkileşimi kapalıdır.</p>';
  return '<div class="v-city-backdrop" data-map-back="1"></div><section class="v-city-window" role="dialog" aria-label="'+esc(this.town)+' şehir görünümü">'+
   '<header class="v-city-head"><div><small>1939 / İL MERKEZİ · '+esc(info?.[1]||id)+'</small><h2>'+esc(this.town)+'</h2></div>'+
   '<button type="button" data-map-back="1" aria-label="Şehri kapat">✕ <span>Kapat</span></button></header>'+
   '<div class="v-city-body"><div class="v-city-art">'+cityPortrait(id,this.town)+'</div>'+
   '<div class="v-city-notes"><div class="v-miniheading">YERLEŞİM VE YAPILAR</div>'+
   '<p>Taş binalar, işyerleri, fabrikalar, dini yapılar, konutlar ve çevredeki köyler ayrı poligonlarla çizilmiştir. Biçimler şematiktir; tarihî parsel veya bina planı değildir.</p>'+
   '<div class="v-site-scroll">'+list+'</div></div></div>'+
   '<footer class="v-city-foot"><span>Özgün SVG çizimi · dış görsel yok · yaklaşık coğrafya</span>'+
   '<button type="button" data-map-home="1">← Stratejik harita</button></footer></section>';
 }
}

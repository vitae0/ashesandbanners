
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
/**
 * Procedural overhead city map. Roads, land parcels, roofs, factories, squares
 * and satellite villages are viewed from above, never as a perspective skyline.
 * The stylized blocks are not claims of historic cadastral footprints.
 */
export function cityPortrait(region,name){
 const rng=randomFor(region+"|"+name);
 const kind=CITY_MODE[region]||"rural";
 const industrial=kind==="industrial";
 const urban=["capital","urban","industrial","historic","port"].includes(kind);
 const roofColors=["#8c6655","#b78b65","#826b61","#9b7c69","#6f7775","#a59b89"];
 const p=(a,cl,fill,extra="")=>'<polygon class="'+cl+'" points="'+a.map(t=>t.join(",")).join(" ")+'" fill="'+fill+'" '+extra+'/>';
 const block=(xx,yy,w,h,fill,cls="v-building")=>p([[xx,yy],[xx+w,yy],[xx+w,yy+h],[xx,yy+h]],cls,fill,'stroke="#374b45" stroke-width="1.5"');
 const bldg=(bx,by,bw,bh,type,shade)=>{
  let parts='<g class="v-building v-roof-'+type+'">'+block(bx,by,bw,bh,shade);
  // Rectangular top-down roof ridges; no front or side facade is drawn.
  if(type==="house"){
   parts+=p([[bx,by],[bx+bw/2,by+bh/2],[bx,by+bh]],"v-roof-plane","#795c55",'opacity=".45"');
   parts+=p([[bx+bw,by],[bx+bw/2,by+bh/2],[bx+bw,by+bh]],"v-roof-plane","#f0cfa6",'opacity=".28"');
   parts+='<path d="M'+bx+' '+(by+bh/2)+'h'+bw+'" stroke="#ede0cb" stroke-opacity=".6" stroke-width="1"/>';
  } else if(type==="factory"){
   for(let k=5;k<bw-5;k+=11)
    parts+='<path d="M'+(bx+k)+' '+(by+2)+'v'+(bh-4)+'" stroke="#dad5c2" stroke-width="4" opacity=".48"/>';
   parts+=block(bx+bw*.7,by+bh*.24,Math.min(11,bw*.18),Math.min(11,bh*.32),"#4a5452","v-chimney");
  } else if(type==="church"){
   parts+=block(bx+bw*.34,by-9,bw*.32,bh+18,"#c4b99d","v-basilica");
   parts+='<path d="M'+(bx+bw/2)+' '+(by-8)+'v'+(bh+16)+'M'+(bx+2)+' '+(by+bh/2)+'h'+(bw-4)+'" stroke="#eee3c9" stroke-width="2"/>';
  } else if(type==="civic"){
   parts+='<path d="M'+(bx+7)+' '+(by+7)+'h'+(bw-14)+'v'+(bh-14)+'h-'+(bw-14)+'Z" fill="none" stroke="#e1d3b6" stroke-width="3"/>';
  }
  return parts+'</g>';
 };
 let art='<svg class="v-city-scene v-city-overhead" viewBox="0 0 900 560" role="img" aria-label="'+esc(name)+' kentinin kuşbakışı temsili sokak, ada, bina ve köy planı">'+
 '<rect x="0" y="0" width="900" height="560" fill="#93a68c"/>';
 // Agricultural landscape and fields outside the densest street blocks.
 for(let col=0;col<14;col++){
  const xx=(col*83+30)%950,yy=(col*129+70)%560;
  const hh=40+rng()*38,ww=57+rng()*36;
  art+=p([[xx,yy],[xx+ww,yy-7],[xx+ww+6,yy+hh],[xx+3,yy+hh+7]],"v-field",
   ["#a6b687","#84996f","#9cac78","#b2ae81"][col%4],'stroke="#7b8d69" stroke-width="1"');
 }
 // A river is an overhead flowing strip, not a skyline horizon.
 if(["capital","port","rural","historic"].includes(kind)){
  art+=p([[0,28],[90,43],[192,16],[314,26],[425,0],[470,0],[328,59],[204,51],[94,81],[0,70]],"v-water","#6b9aa3");
  art+='<path d="M0 48L90 63 200 33 316 41 430 8" fill="none" stroke="#a9ced0" stroke-width="2" opacity=".55"/>';
 }
 // Slightly rotated urban fabric keeps map readable and avoids fabricated cadastral exactness.
 art+='<g transform="rotate(-7 450 280)">';
 art+=block(84,55,745,460,"#a0aa8b","v-city-ground");
 for(const xx of [95,227,359,491,623,755,847]){
  art+=block(xx-12,34,24,506,"#777d78","v-road");
  art+=block(xx-1,34,2,506,"#aaae9c","v-road-line");
 }
 for(const yy of [65,167,269,371,473,526]){
  art+=block(72,yy-13,802,26,"#737e7b","v-road");
  art+=block(72,yy-1,802,2,"#aeb7a7","v-road-line");
 }
 // Build blocks: each roof has a polygon footprint, internal courtyards, green lots.
 for(let row=0;row<4;row++)for(let col=0;col<5;col++){
  const xx=110+col*132,yy=82+row*102;
  const edge=111;
  art+=block(xx-4,yy-4,edge+8,82,"#b7ba9f","v-lot");
  if((col===2&&row===1)||(col===3&&row===2&&kind==="historic")){
   art+=block(xx+11,yy+9,edge-20,65,"#c5baa0","v-plaza");
   art+=block(xx+37,yy+21,30,30,"#899e88","v-garden");
   art+='<text x="'+(xx+53)+'" y="'+(yy+61)+'" class="v-map-tiny" text-anchor="middle">MEYDAN</text>';
   continue;
  }
  const garden=(row+col)%6===3||(kind==="rural"&&(row+col)%4===1);
  if(garden){
   art+=block(xx+11,yy+7,90,59,"#8caa85","v-garden");
   art+=block(xx+14,yy+10,84,53,"#a2b592","v-garden");
   for(let t=0;t<6;t++){
    const cx=xx+22+(t%3)*25,cy=yy+23+Math.floor(t/3)*22;
    art+=p([[cx,cy-7],[cx+6,cy],[cx,cy+7],[cx-6,cy]],"v-tree",t%2?"#557d65":"#668b70");
   }
   continue;
  }
  const buildingCount=industrial?3:urban?4:3;
  for(let k=0;k<buildingCount;k++){
   const px=xx+4+(k%2)*53+Math.round(rng()*3),py=yy+5+Math.floor(k/2)*35;
   const wide=(industrial&&col%3===0&&k===0);
   const bw=wide?92:38+Math.round(rng()*7),bh=wide?58:23+Math.round(rng()*7);
   if(wide&&k>0)continue;
   const isFactory=industrial&&(col+row)%3===0&&k===0;
   const isChurch=!industrial&&(col===1&&row===1&&k===0||col===4&&row===0&&k===0);
   const isCivic=!isFactory&&!isChurch&&(row===0&&col===2&&k===0);
   const type=isFactory?"factory":isChurch?"church":isCivic?"civic":"house";
   art+=bldg(px,py,bw,bh,type,roofColors[(row*6+col+k)%roofColors.length]);
  }
 }
 if(kind==="port"){
  art+=block(72,67,156,20,"#4a7d87","v-water");
  art+='<path d="M120 88v66M158 88v65" stroke="#395f6b" stroke-width="6"/>';
 }
 art+='</g>';
 // Railway is a schematic top-down diagonal with sleepers, only for appropriate cities.
 if(industrial||kind==="capital"||kind==="urban"){
  art+='<path d="M0 514L900 436" fill="none" stroke="#494f52" stroke-width="13"/>'+
    '<path d="M0 510L900 432M0 518L900 440" fill="none" stroke="#b9b2a0" stroke-width="2"/>';
  for(let k=0;k<36;k++){
   const xx=k*27,yy=514-xx*78/900;
   art+='<path d="M'+xx+' '+(yy-10)+'v20" stroke="#c1a989" stroke-width="2"/>';
  }
 }
 // Each rural satellite settlement gets one explicit roof footprint.
 art+='<g class="v-rural">';
 for(const [v,[vx,vy]] of [[46,447],[820,85],[740,517]].entries()){
  const n=v+1;
  art+=p([[vx-16,vy-12],[vx+30,vy-18],[vx+38,vy+16],[vx-10,vy+22]],"v-village-plot","#b7bc90",'stroke="#657d65" stroke-width="2"');
  art+=bldg(vx-3,vy-6,24,17,"house","#a56e55");
  art+='<text x="'+(vx+10)+'" y="'+(vy+35)+'" text-anchor="middle" class="v-village-label">KÖY '+n+'</text>';
 }
 art+='</g>';
 art+='<g class="v-city-map-label"><rect x="12" y="10" width="485" height="28" rx="4" fill="#1e353a" opacity=".9"/>'+
 '<text x="24" y="29" class="v-city-illustration-label">KUŞBAKIŞI ŞEHİR PLANI · TEMSİLÎ ADA VE BİNALAR</text></g>'+
 '<g transform="translate(856 44)"><path d="M0 27V-14L-9 1 0-26 9 1 0-14" fill="none" stroke="#263c3d" stroke-width="3"/>'+
 '<text y="-30" text-anchor="middle" fill="#223738" font-size="13" font-weight="bold">K</text></g>'+
 '</svg>';
 return art;
}
export class PolygonBoard {
 constructor(host,onChange){
  this.host=host;this.onChange=onChange;this.state=null;this.view="country";this.region="warszawskie";this.town="Warszawa";this.signature="";
  this.camera={x:0,y:0,w:1350,h:780};this.cityCamera={x:0,y:0,w:900,h:560};this.drag=null;this.suppressClick=false;
  const activate=e=>{
   if(e.type==="keydown"&&!["Enter"," "].includes(e.key))return;
   const target=e.target.closest("[data-region],[data-town],[data-building],[data-map-back],[data-map-home],[data-map-zoom],[data-map-fit]");
   if(!target||!this.state)return;
   if(e.type==="click"&&this.suppressClick){this.suppressClick=false;return}
   if(e.type==="keydown")e.preventDefault();
   if(target.dataset.mapHome!==undefined){this.home();return}
   if(target.dataset.mapZoom!==undefined){this.zoomActive(Number(target.dataset.mapZoom));return}
   if(target.dataset.mapFit!==undefined){this.resetCityCamera();return}
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
  host.addEventListener("wheel",e=>{
   const onWorld=this.view==="country"&&e.target.closest?.(".v-world");
   const onCity=this.view==="town"&&e.target.closest?.(".v-city-scene");
   if(!onWorld&&!onCity)return;
   e.preventDefault();
   if(onWorld)this.zoomAt(e.deltaY<0?1.16:1/1.16,e.clientX,e.clientY);
   else this.zoomCityAt(e.deltaY<0?1.13:1/1.13,e.clientX,e.clientY);
  },{passive:false});
  host.addEventListener("pointerdown",e=>{
   const world=this.view==="country"&&e.target.closest?.(".v-world");
   const city=this.view==="town"&&e.target.closest?.(".v-city-scene");
   if((!world&&!city)||e.button!==0)return;
   this.drag={x:e.clientX,y:e.clientY,moved:0,kind:city?"city":"world"};
   e.target.setPointerCapture?.(e.pointerId);
  });
  host.addEventListener("pointermove",e=>{
   if(!this.drag)return;
   const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;
   this.drag.x=e.clientX;this.drag.y=e.clientY;this.drag.moved+=Math.abs(dx)+Math.abs(dy);
   if(this.drag.moved>6){this.suppressClick=true;if(this.drag.kind==="city")this.panCityBy(dx,dy);else this.panBy(dx,dy)}
  });
  const release=()=>{
   this.drag=null;
   if(this.suppressClick)setTimeout(()=>{this.suppressClick=false},110);
  };
  host.addEventListener("pointerup",release);
  host.addEventListener("pointercancel",release);
 }
 zoomActive(factor){return this.view==="town"?this.zoomCityAt(factor):this.zoomAt(factor)}
 resetCityCamera(){this.cityCamera={x:0,y:0,w:900,h:560};this.applyCityCamera()}
 applyCityCamera(){
  this.host.querySelector?.(".v-city-scene")?.setAttribute("viewBox",
   [this.cityCamera.x,this.cityCamera.y,this.cityCamera.w,this.cityCamera.h].map(n=>n.toFixed(3)).join(" "));
 }
 zoomCityAt(factor,clientX,clientY){
  if(!this.state)return;
  const old=this.cityCamera,scale=900/old.w;
  const next=Math.max(1,Math.min(2.5,scale*factor));
  if(Math.abs(next-scale)<1e-8)return;
  let px=old.x+old.w/2,py=old.y+old.h/2;
  const svg=this.host.querySelector?.(".v-city-scene"),ctm=svg?.getScreenCTM?.();
  if(ctm&&Number.isFinite(clientX)&&Number.isFinite(clientY)){
   const p=svg.createSVGPoint();p.x=clientX;p.y=clientY;
   const pos=p.matrixTransform(ctm.inverse());px=pos.x;py=pos.y;
  }
  const w=900/next,h=560/next;
  this.cityCamera={
   x:Math.max(0,Math.min(900-w,px-(px-old.x)/old.w*w)),
   y:Math.max(0,Math.min(560-h,py-(py-old.y)/old.h*h)),w,h
  };
  this.applyCityCamera();
 }
 panCityBy(dx,dy){
  const c=this.cityCamera;
  if(c.w>=900)return;
  const rect=this.host.querySelector?.(".v-city-scene")?.getBoundingClientRect?.();
  const scale=rect?Math.min(rect.width/c.w,rect.height/c.h):1;
  if(!Number.isFinite(scale)||!scale)return;
  c.x=Math.max(0,Math.min(900-c.w,c.x-dx/scale));
  c.y=Math.max(0,Math.min(560-c.h,c.y-dy/scale));
  this.applyCityCamera();
 }
 applyCamera(){
  const svg=this.host.querySelector?.(".v-world");
  svg?.setAttribute("viewBox",[this.camera.x,this.camera.y,this.camera.w,this.camera.h].map(n=>n.toFixed(3)).join(" "));
 }
 resetCamera(){this.camera={x:0,y:0,w:1350,h:780};this.applyCamera()}
 zoomAt(factor,clientX,clientY){
  if(!this.state)return;
  const old=this.camera,oldZoom=1350/old.w;
  const newZoom=Math.max(1,Math.min(4,oldZoom*factor));
  if(Math.abs(newZoom-oldZoom)<1e-6)return;
  const svg=this.host.querySelector?.(".v-world");
  let wx=old.x+old.w/2,wy=old.y+old.h/2;
  if(svg?.createSVGPoint&&svg.getScreenCTM?.()&&Number.isFinite(clientX)&&Number.isFinite(clientY)){
   const ctm=svg.getScreenCTM();
   if(ctm){
    const p=svg.createSVGPoint();p.x=clientX;p.y=clientY;
    const at=p.matrixTransform(ctm.inverse());wx=at.x;wy=at.y;
   }
  }
  const w=1350/newZoom,h=780/newZoom;
  const tx=(wx-old.x)/old.w,ty=(wy-old.y)/old.h;
  this.camera={
   x:Math.max(0,Math.min(1350-w,wx-tx*w)),
   y:Math.max(0,Math.min(780-h,wy-ty*h)),w,h
  };
  this.applyCamera();
 }
 panBy(dx,dy){
  if(!this.state||this.camera.w>=1350)return;
  const svg=this.host.querySelector?.(".v-world");
  const bounds=svg?.getBoundingClientRect?.();
  const scale=bounds?Math.min(bounds.width/this.camera.w,bounds.height/this.camera.h):1;
  if(!scale||!Number.isFinite(scale))return;
  const c=this.camera;
  c.x=Math.max(0,Math.min(1350-c.w,c.x-dx/scale));
  c.y=Math.max(0,Math.min(780-c.h,c.y-dy/scale));
  this.applyCamera();
 }
 mount(state){this.state=state;this.region=state.selectedRegion||"warszawskie";this.view="country";this.signature="";this.resetCamera();this.draw()}
 update(state){this.state=state;this.draw()}
 home(){this.view="country";this.state.selectedBuilding=null;this.resetCamera();this.draw();this.onChange(this.state,{type:"home"})}
 back(){this.home()}
 focusRegion(id){if(!CAPITALS[id])return;this.focusTown(CAPITALS[id][0],id)}
 focusTown(name,id=this.region){
  if(!CAPITALS[id])return;
  this.region=id;this.town=name;this.view="town";this.resetCityCamera();
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
  this.host.innerHTML='<div class="v-map-root '+(showHeat?"show-influence":"no-influence")+'">'+countrySvg(this.state,this.state.selectedRegion,this.camera)+
    '<div class="v-map-watermark">Fare tekerleği: yakınlaştır · sürükle: gezin · azami 4×</div>'+
    (this.view==="town"?this.cityWindow():"")+'</div>';
  if(this.view==="town")this.applyCityCamera();
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
   '<p>Kuşbakışı sokak ağı, bina çatıları, parklar, meydanlar, fabrikalar, demiryolu ve çevre köyler ayrı poligonlardan oluşur. Çizim tarihsel kadastro haritası değil, stilize bir şehir planıdır.</p>'+
   '<div class="v-site-scroll">'+list+'</div></div></div>'+
   '<footer class="v-city-foot"><span>KUŞBAKIŞI · Tekerlek veya +/− ile yakınlaştır, sürükle</span>'+
   '<div class="v-city-zoom"><button type="button" data-map-zoom=".8" aria-label="Şehirde uzaklaştır">−</button>'+
   '<button type="button" data-map-zoom="1.25" aria-label="Şehirde yakınlaştır">+</button>'+
   '<button type="button" data-map-fit="1">Sıfırla</button>'+
   '<button type="button" data-map-home="1">← Stratejik harita</button></div></footer></section>';
 }
}

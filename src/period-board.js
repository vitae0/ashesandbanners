
import {REGION_DATA,INSTITUTIONS,clamp} from "./engine.js";
import {MAP_POINTS,LABELS,HISTORIC_LOCATIONS,OUTLINE,CELLS,periodOccupation,hash} from "./period-map-data.js";

const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const REGIONS=Object.fromEntries(REGION_DATA.map(r=>[r[0],r[1]]));
const BASES={safehouse:"Konut",school:"Okul",hospital:"Sağlık yapısı",church:"İbadethane",factory:"Atölye",railway:"İstasyon",press:"Matbaa"};
const GLYPHS={safehouse:"⌂",school:"✎",hospital:"+",church:"✝",factory:"⚙",railway:"▥",press:"▤"};
export function cityBuildings(region,town){
 const kinds=["safehouse","school","safehouse","hospital","safehouse","factory","safehouse","church","press","railway","safehouse","school","safehouse","factory","safehouse","hospital","press","safehouse","church","safehouse","safehouse","railway","school","safehouse"];
 const center=REGION_DATA.find(r=>r[0]===region)||REGION_DATA[2],seed=hash(region+"|"+town);
 return kinds.map((_,i)=>{
  const col=i%6,row=Math.floor(i/6);
  const kind=kinds[(i+(seed%7))%kinds.length],visibility=clamp(INSTITUTIONS[kind].visibility+(hash(town+i)%21-10)/110,.08,.96);
  const x=72+col*104+(hash(seed+i)%15),y=151+row*89+(hash(i+seed)%9);
  return{osmId:"period/"+region+"/"+hash(town).toString(36)+"/"+i,name:BASES[kind]+" • "+String(i+1).padStart(2,"0"),
   region,city:town,lat:center[2]+(row-1.5)*.003,lon:center[3]+(col-2.5)*.003,
   visibility,kind,allowed:kind==="safehouse"?["safehouse"]:["safehouse",kind],x,y,w:55+(hash(i+town)%15),h:38+(hash(town+i*7)%16)};
 });
}
function root(content){
 return '<svg viewBox="0 0 760 620" class="period-svg" role="img" aria-label="1939 Polonya temalı şematik strateji haritası" xmlns="http://www.w3.org/2000/svg">'+
 '<defs><pattern id="paper-grid" width="27" height="27" patternUnits="userSpaceOnUse"><path d="M27 0H0V27" fill="none" stroke="#9c8c71" opacity=".25" stroke-width=".6"/></pattern>'+
 '<clipPath id="poland-1939-clip"><path d="'+OUTLINE+'"/></clipPath></defs>'+
 '<rect width="760" height="620" fill="#d7caac"/><rect width="760" height="620" fill="url(#paper-grid)"/>'+
 '<text x="25" y="22" class="paper-kicker">ASHES AND BANNERS  /  ATLAS 1940</text>'+content+'</svg>';
}
function occupationTint(id,date){
 const v=periodOccupation(date,id);
 return {annexed:"#b5a79b",general:"#cbbd9f",soviet:"#b9bba5",german:"#b8ab9e",contested:"#c6b8a1"}[v]||"#c6b8a1";
}
export class PeriodBoard {
 constructor(host,notify){
  this.host=host;this.notify=notify;this.view="country";this.region="warszawskie";this.town="Warszawa";this.state=null;
  const activate=e=>{
   if(e.type==="keydown"&&e.key!=="Enter"&&e.key!==" ")return;
   const el=e.target.closest("[data-region],[data-town],[data-building],[data-back]");
   if(!el||!this.state)return;if(e.type==="keydown")e.preventDefault();
   const d=el.dataset;
   if(d.back){this.back();return}
   if(d.region){this.focusRegion(d.region);return}
   if(d.town){this.focusTown(d.town,this.region);return}
   if(d.building!=null){
    const b=cityBuildings(this.region,this.town)[+d.building];
    if(b){this.state.selectedBuilding=b;this.notify(this.state,{type:"building",building:b})}
   }
  };
  this.host.addEventListener("click",activate);
  this.host.addEventListener("keydown",activate);
 }
 mount(s){this.state=s;this.region=s.selectedRegion||"warszawskie";this.town="Warszawa";this.view="country";this.draw()}
 update(s){this.state=s;this.region=s.selectedRegion||this.region;this.draw()}
 home(){this.view="country";this.state.selectedDistrict="";this.state.selectedBuilding=null;this.draw();this.notify(this.state,{type:"home"})}
 back(){this.view=this.view==="town"?"province":"country";this.state.selectedDistrict="";this.state.selectedBuilding=null;this.draw();this.notify(this.state,{type:"back"})}
 focusRegion(id){
  if(!REGIONS[id])return;
  this.region=id;this.state.selectedRegion=id;this.state.selectedDistrict="";this.state.selectedBuilding=null;
  this.view="province";this.draw();this.notify(this.state,{type:"province",id});
 }
 focusTown(name,id=this.region){
  if(!REGIONS[id])return;
  this.region=id;this.town=name;this.state.selectedRegion=id;this.state.selectedDistrict=name;this.state.selectedBuilding=null;
  this.view="town";this.draw();this.notify(this.state,{type:"town",name});
 }
 focusCapital(){this.focusTown("Warszawa","warszawskie")}
 level(){return this.view==="country"?"1939 illeri":this.view==="province"?"Yerleşim merkezleri":"Temsilî mahalle"}
 draw(){if(this.state)this.host.innerHTML=this.view==="country"?this.country():this.view==="province"?this.province():this.city()}
 country(){
  const s=this.state,selected=s.selectedRegion,enabled=s.settings.showInfluence;
  const provinces=CELLS.map(c=>{
   const r=s.regions[c.id]||{},value=clamp(r.influence||0);
   return '<g class="period-region" data-region="'+c.id+'" role="button" tabindex="0" aria-label="'+escape(REGIONS[c.id])+' bölgesini aç">'+
    '<polygon points="'+c.points+'" fill="'+occupationTint(c.id,s.date)+'" stroke="#6b5d47" stroke-width="1.35" vector-effect="non-scaling-stroke"/>'+
    '<polygon points="'+c.points+'" fill="var(--theme)" fill-opacity="'+(enabled?(value/100*.62+.055).toFixed(3):0)+'"/>'+
    (selected===c.id?'<polygon points="'+c.points+'" stroke="#faf0d5" stroke-width="3.1" fill="none" vector-effect="non-scaling-stroke"/>':"")+'</g>';
  }).join("");
  const labels=Object.entries(MAP_POINTS).map(([id,[x,y]])=>{
   const label=LABELS[id],font=label.length>9?"label-small":"";
   return '<g class="region-label" data-region="'+id+'" role="button" tabindex="0" aria-label="'+escape(REGIONS[id])+' bölgesi">'+
   '<circle cx="'+x+'" cy="'+(y-11)+'" r="2.5" fill="#3e3529"/>'+
   '<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" class="'+font+'">'+escape(label)+'</text></g>';
  }).join("");
  const legend='<rect x="567" y="107" width="168" height="153" rx="4" fill="#e8dcbf" stroke="#928164"/>'+
   '<text x="580" y="133" class="board-heading">POLSKA 1939</text>'+
   '<text x="580" y="153" class="board-small">16 dönem vilayeti</text>'+
   '<line x1="580" x2="718" y1="165" y2="165" stroke="#928164"/>'+
   '<text x="580" y="184" class="board-small">İşgal türleri (şematik)</text>'+
   '<rect x="580" y="193" width="10" height="10" fill="#b5a79b"/><text x="596" y="202" class="board-small">Alman ilhakı</text>'+
   '<rect x="580" y="210" width="10" height="10" fill="#cbbd9f"/><text x="596" y="219" class="board-small">Genel Hükümet</text>'+
   '<rect x="580" y="227" width="10" height="10" fill="#b9bba5"/><text x="596" y="236" class="board-small">SSCB (1940)</text>';
  return root('<text x="26" y="49" class="paper-title">Polonya • işgal yılları</text>'+
   '<text x="26" y="75" class="paper-subtitle">İl seç → yerleşim seç → bina seç</text>'+
   '<g transform="translate(17 53) scale(1.04)" clip-path="url(#poland-1939-clip)">'+provinces+'</g>'+
   '<g transform="translate(17 53) scale(1.04)"><path d="'+OUTLINE+'" fill="none" stroke="#493d30" stroke-width="3.7" vector-effect="non-scaling-stroke"/>'+labels+'</g>'+
   legend+
   '<text x="570" y="304" class="board-heading">İŞGAL ATL ASI</text>'.replace("ATL ASI","ATLASI")+
   '<text x="570" y="329" class="board-small">Tarih: '+escape(s.date.slice(0,4))+'</text>'+
   '<text x="570" y="350" class="board-small">Örgüt etkisi: '+(enabled?"açık":"kapalı")+'</text>'+
   '<text x="570" y="373" class="board-small">Dönem haritası</text><text x="570" y="389" class="board-small">temsili çizilmiştir.</text>'+
   '<text x="24" y="588" class="board-foot">1939 SINIR ESTETİĞİ  •  İDARİ ÇİZGİLER YAKLAŞIK  •  CANLI HARİTA YOK</text>');
 }
 province(){
  const s=this.state,r=s.regions[this.region],places=HISTORIC_LOCATIONS[this.region]||["Merkez"];
  const boxes=places.map((name,i)=>{
   const x=34+(i%3)*234,y=162+Math.floor(i/3)*166,opacity=(.14+clamp(r.influence||0)/220).toFixed(2);
   return '<g class="district-hit" data-town="'+escape(name)+'" role="button" tabindex="0" aria-label="'+escape(name)+' şehrini aç">'+
    '<rect x="'+x+'" y="'+y+'" width="220" height="149" rx="7" fill="#ddcfb0" stroke="#948467" stroke-width="1.8"/>'+
    '<path d="M'+(x+8)+' '+(y+68)+'H'+(x+211)+' M'+(x+112)+' '+(y+7)+'V'+(y+143)+'" stroke="#a99a7d" opacity=".6" fill="none" stroke-width="8"/>'+
    '<rect x="'+(x+23)+'" y="'+(y+23)+'" width="64" height="28" fill="var(--theme)" fill-opacity="'+opacity+'"/>'+
    '<rect x="'+(x+131)+'" y="'+(y+85)+'" width="65" height="37" fill="var(--theme)" fill-opacity="'+opacity+'"/>'+
    '<text x="'+(x+110)+'" y="'+(y+135)+'" text-anchor="middle" class="district-name">'+escape(name)+'</text></g>';
  }).join("");
  return root('<text x="29" y="51" class="paper-title">'+escape(REGIONS[this.region])+'</text>'+
   '<text x="29" y="77" class="paper-subtitle">Seçilmiş tarihsel yerleşimler; kutular idari ilçe hudutları değildir.</text>'+
   '<g class="back-hit" data-back="1" role="button" tabindex="0"><rect x="31" y="103" width="124" height="35" rx="5"/><text x="45" y="126">← Ülke haritası</text></g>'+
   boxes+
   '<text x="33" y="535" class="board-foot">MERKEZE TIKLA → ŞEMATİK MAHALLE VE YAPI GÖRÜNÜMÜ</text>'+
   '<text x="33" y="567" class="board-small">Bölgesel örgüt etkisi '+Math.round(r.influence)+'%  /  Halk desteği '+Math.round(r.support)+'%</text>');
 }
 city(){
  const items=cityBuildings(this.region,this.town),owned=new Set(this.state.assets.map(a=>a.osmId));
  let roads="",blocks="";
  for(let i=0;i<5;i++){const x=163+i*104;roads+='<path d="M'+x+' 143 V510" stroke="#b9ab90" stroke-width="15"/><path d="M'+x+' 143 V510" stroke="#e9ddc0" stroke-dasharray="6 12" stroke-width="1"/>'}
  for(let i=0;i<3;i++){const y=227+i*89;roads+='<path d="M68 '+y+'H694" stroke="#b9ab90" stroke-width="15"/><path d="M68 '+y+'H694" stroke="#e9ddc0" stroke-dasharray="6 12" stroke-width="1"/>'}
  for(const [i,b] of items.entries()){
   const selected=this.state.selectedBuilding?.osmId===b.osmId,active=owned.has(b.osmId);
   blocks+='<g class="building-hit" data-building="'+i+'" role="button" tabindex="0" aria-label="'+escape(b.name)+' seç">'+
    '<rect x="'+b.x+'" y="'+b.y+'" width="'+b.w+'" height="'+b.h+'" rx="2" fill="'+(active?"#b4916a":selected?"#deb76d":"#bcb098")+'" stroke="'+(selected?"#892f2a":"#63553f")+'" stroke-width="'+(selected?3:1.5)+'"/>'+
    '<path d="M'+(b.x+7)+' '+(b.y+7)+'h'+(b.w-14)+'" stroke="#ede2c9" opacity=".6"/>'+
    '<text x="'+(b.x+b.w/2)+'" y="'+(b.y+b.h/2+5)+'" class="building-icon" text-anchor="middle">'+GLYPHS[b.kind]+'</text>'+
    '<title>'+escape(b.name)+' • '+escape(INSTITUTIONS[b.kind].name)+' • Görünürlük '+Math.round(b.visibility*100)+'%</title></g>';
  }
  return root('<text x="31" y="51" class="paper-title">'+escape(this.town)+'  /  '+escape(REGIONS[this.region])+'</text>'+
   '<text x="31" y="78" class="paper-subtitle">Dönem atmosferli kurgu mahalle planı; gerçek tarihsel bina yerleri değil.</text>'+
   '<g class="back-hit" data-back="1" role="button" tabindex="0"><rect x="31" y="102" width="150" height="35" rx="5"/><text x="45" y="125">← Yerleşim listesi</text></g>'+
   '<rect x="64" y="143" width="640" height="371" fill="#d6c8a8" stroke="#86785f" stroke-width="2"/>'+
   roads+blocks+
   '<text x="69" y="558" class="board-foot">24 TEMSİLÎ YAPI  •  BİNAYA TIKLA, GENEL MERKEZDEN KURUM BAĞLANTISINI KUR</text>'+
   '<text x="69" y="580" class="board-small">Konut, kilise, okul, hastane, atölye ve matbaa için farklı oyun etkileri vardır.</text>');
 }
}

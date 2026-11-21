
import {
 REGION_DATA,THEMES,DIFFICULTIES,PATHS,MILESTONES,OPERATIONS,INSTITUTIONS,CENT_LEVELS,
 createGame,advanceDays,activeCells,members,influence,regionOf,canMilestone,approveMilestone,
 pathAvailable,setPath,setCentralization,assignCommander,setOrder,recruitCell,
 scoreCell,bestCell,scheduleOperation,acquireAsset,assetEffects,answerEvent,regroup,summary,validateSave,clamp,after
} from "./engine.js";
import {ORGANIZATIONS,CONTACTS,currentOrganizations,contactFaction,politicalIdentity,earlyALStatus} from "./politics.js";

const $=id=>document.getElementById(id);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>Math.round(Number(n)||0).toLocaleString("tr-TR");
const date=d=>new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(d+"T00:00:00Z"));
const cities=[["Varşova",52.2297,21.0122,"mazowieckie"],["Łódź",51.7592,19.4550,"lodzkie"],["Kraków",50.0647,19.9450,"malopolskie"],["Lublin",51.2465,22.5684,"lubelskie"],["Kielce",50.8661,20.6286,"swietokrzyskie"],["Poznań",52.4064,16.9252,"wielkopolskie"],["Gdańsk",54.352,18.6466,"pomorskie"]];
let s=null,tab="overview",running=false,map=null,provinces=null,districts=null,buildings=null,assetsLayer=null,provinceData=[],districtData=[],buildingKey="",buildingStamp=0;
const KEY="ashes-and-banners-save-v1";
const panel=(h,body)=>'<article class="panel"><h3>'+h+'</h3>'+body+'</article>';
const bar=(v)=>'<div class="bar"><div style="width:'+clamp(v)+'%"></div></div>';
const metric=(label,value,info="")=>'<div class="kpi"><small>'+esc(label)+'</small><b>'+esc(value)+'</b><small>'+esc(info)+'</small></div>';
const heading=(tag,name,sub)=>'<div class="kicker">'+esc(tag)+'</div><h2>'+esc(name)+'</h2><p class="muted smalltext">'+esc(sub)+'</p>';
const btn=(name,action,props="")=>'<button data-action="'+action+'" '+props+'>'+esc(name)+'</button>';
function notify(msg){const e=$("toast");e.textContent=msg;e.classList.add("show");clearTimeout(notify.id);notify.id=setTimeout(()=>e.classList.remove("show"),3200)}
function save(){if(s)try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){notify("Kayıt hatası: "+e.message)}}
function hasSave(){try{return validateSave(JSON.parse(localStorage.getItem(KEY)))}catch{return false}}
function setupSync(){$("start-resource-val").textContent=$("start-resources").value+"%";$("start-chaos-val").textContent=$("start-chaos").value+"%";$("resume-game").hidden=!hasSave()}
function theme(){const t=THEMES[s.settings.theme]||THEMES.ember;document.documentElement.style.setProperty("--theme",t.hex);document.documentElement.style.setProperty("--theme-rgb",t.rgb);$("map-legend-dot").style.background=t.hex}
function start(){
 const options={history:$("start-history").value,difficulty:$("start-difficulty").value,events:$("start-events").value,speed:+$("start-speed").value,resources:+$("start-resources").value,chaos:+$("start-chaos").value,theme:$("start-theme").value,seed:+$("start-seed").value||undefined};
 launch(createGame(options));
}
function launch(data){
 s=data;s.politics.contacts??={};s.politics.socialists??=28;s.politics.rural??=24;s.politics.nationalists??=18;
 s.settings.showInfluence??=true;s.settings.autoOrders??=true;
 $("setup").hidden=true;$("game").hidden=false;running=false;$("toggle-time").textContent="▶";
 $("time-speed").value=String(s.settings.speed);
 $("mode-label").textContent=s.settings.history==="historical"?"Tarihsel çizgi":"Alternatif tarih";
 theme();if(!map)initMap();else{setTimeout(()=>map.invalidateSize(),70);paintProvinces();paintDistricts();}
 tab="overview";render();save();
}
function selected(){return regionOf(s,s.selectedRegion)}
function switchTab(t){tab=t;document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===t));render()}
function render(){
 if(!s)return;
 $("org-name").textContent=politicalIdentity(s);
 $("date-label").textContent=date(s.date);
 $("stats").innerHTML=[["ÜYE",members(s)],["HÜCRE",activeCells(s).length],["PARA",fmt(s.funds)],["MALZEME",fmt(s.supplies)],["İSTİHBARAT",fmt(s.intel)],["MEŞRUİYET",fmt(s.legitimacy)+"%"],["ALARM",fmt(s.alert)+"%"]].map(x=>'<div class="stat"><small>'+x[0]+'</small><b>'+esc(x[1])+'</b></div>').join("");
 const templates={overview,network,operations,politics,milestones,war,archive,settings};
 $("content").innerHTML=(s.status==="running"?(templates[tab]||overview)():ending());
 $("event-mask").hidden=!s.pendingEvent||s.status!=="running";
 if(s.pendingEvent&&s.status==="running"){
  const e=s.pendingEvent;
  $("event-content").innerHTML='<div class="eyebrow">SİYASİ / TARİHSEL OLAY • '+date(s.date)+'</div><h2>'+esc(e.title)+'</h2><p>'+esc(e.text)+'</p>'+e.choices.map((c,i)=>'<button class="choice" data-action="event" data-index="'+i+'">'+esc(c.name)+'</button>').join("")+'<small>Karar verilene kadar zaman ilerlemez.</small>';
 }
 if(provinces)provinces.setStyle(provinceStyle);
 if(districts)districts.setStyle(districtStyle);
 paintAssets();
 $("map-scope").textContent=selected().name+" • "+(map&&map.getZoom()>=8?"İlçeler":"İller");
}
function overview(){
 const r=selected(),cs=activeCells(s).filter(c=>c.region===r.id),ef=assetEffects(s,r.id);
 const building=s.selectedBuilding;
 let bcontent='<p class="readout">Haritada bir şehre yakınlaşın ve gerçek OSM bina izine tıklayın. Konutlar hücre evi, kurumlar uygun bağlantılar olabilir.</p>';
 if(building){
  const claimed=s.assets.some(a=>a.osmId===building.osmId);
  bcontent='<div class="panel tight"><b>'+esc(building.name)+'</b><p class="smalltext">Güncel OSM yapısı • '+esc(building.osmId)+' • Görünürlük: '+fmt(building.visibility*100)+'%</p>'
   +(claimed?'<span class="badge good">Ağa katılmış</span>':'<div class="selectrow"><select id="asset-kind">'+building.allowed.map(v=>'<option value="'+v+'">'+esc(INSTITUTIONS[v].name)+' • '+INSTITUTIONS[v].price+' para</option>').join("")+'</select>'+btn("Bağlantı kur","claim")+'</div>')+'</div>';
 }
 return heading("ÖRGÜT RAPORU","Yeraltı Genel Merkezi","Örgüt devlet değil. Sivil destek, hücreler, gizlilik ve bağlantılarla güçlenirsiniz.")
 +'<div class="grid2">'+metric("Toplam üye",members(s),activeCells(s).length+" hücre")+metric("Ortalama etki",influence(s)+"%","Bölgesel")+metric("Başarılı operasyon",s.records.successful,"Başarısız: "+s.records.failed)+metric("Tutuklanan",s.records.arrests,"Toplam")+'</div>'
 +panel("Seçili bölge · "+esc(r.name),'<div class="grid2"><div><small>Halk desteği '+fmt(r.support)+'%</small>'+bar(r.support)+'</div><div><small>Örgüt etkisi '+fmt(r.influence)+'%</small>'+bar(r.influence)+'</div><div><small>İşgal baskısı '+fmt(r.heat)+'%</small>'+bar(r.heat)+'</div><div><small>Aktif hücre sayısı</small><b> '+cs.length+'</b></div></div><p class="smalltext">'+(s.selectedDistrict?"Seçili ilçe: "+esc(s.selectedDistrict)+". ":"")+'Kurumların haftalık destek katkısı: '+ef.support.toFixed(2)+' (azalan getirili).</p><div class="buttonline">'+btn("Bölgeye odaklan","region")+btn("Hücre kur • 65 para","new-cell")+btn("Operasyonlar →","operations-tab")+'</div>')
 +panel("Harita ve kurum bağlantıları",'<p class="smalltext">İl ve ilçe sınırları gerçek güncel GIS verilerinden gelir. Binalar güncel OSM nesneleridir. 1940 tarihsel kadastro verisi değildir.</p><div class="grid2">'+metric("Bağlı yapı",s.assets.filter(a=>a.region===r.id).length)+metric("Sığınma gizliliği",ef.secrecy.toFixed(1))+'</div><div class="buttonline">'+cities.slice(0,4).map(c=>'<button data-action="city" data-name="'+esc(c[0])+'">'+esc(c[0])+'</button>').join("")+btn("Binaları yükle","buildings")+'</div>'+bcontent)
 +panel("Son gelişmeler",s.log.slice(0,7).map(l=>'<div class="listitem smalltext"><small>'+date(l.date)+'</small><div>'+esc(l.message)+'</div></div>').join(""));
}
function network(){
 const founding=s.milestones.includes("founding");
 const command=panel("Merkezileşme • "+esc(CENT_LEVELS[s.centralization-1].name),'<div class="buttonline">'+CENT_LEVELS.map((l,i)=>'<button data-action="central" data-level="'+(i+1)+'" '+(s.centralization===i+1?'class="primary"':'')+'>'+(i+1)+'</button>').join("")+'</div><p class="smalltext">'+esc(CENT_LEVELS[s.centralization-1].desc)+'</p><p class="muted smalltext">Koordinasyon: '+CENT_LEVELS[s.centralization-1].coord+' • Zincirleme risk ×'+CENT_LEVELS[s.centralization-1].exposure+'</p><label class="selectrow smalltext"><input type="checkbox" data-setting="autoOrders" style="width:18px" '+(s.settings.autoOrders?"checked":"")+'> Komutanlar sürekli emir uygulasın</label>');
 const recruits=panel("Yeni hücre oluştur",'<div class="selectrow"><select id="recruit-region">'+REGION_DATA.map(([id,name])=>'<option value="'+id+'" '+(id===s.selectedRegion?"selected":"")+'>'+esc(name)+'</option>').join("")+'</select>'+btn("Kur • 65 para","recruit")+'</div>');
 const list=activeCells(s).map(c=>{
  const busy=c.busyUntil> s.ticks;
  return '<div class="panel tight"><div class="row"><h3>'+esc(c.name)+'</h3><span class="badge '+(!busy?"good":"")+'">'+(busy?(c.busyUntil-s.ticks)+" gün kaldı":"Müsait")+'</span></div><div class="smalltext muted">'+esc(regionOf(s,c.region).name)+' • '+c.members+' kişi • Teşhir '+fmt(c.exposure)+'% • Yorgunluk '+fmt(c.fatigue)+'%</div>'
   +'<div class="grid2 smalltext"><span>Gizlilik '+fmt(c.stealth)+'</span><span>İstihbarat '+fmt(c.intel)+'</span><span>Lojistik '+fmt(c.logistics)+'</span><span>Saha '+fmt(c.field)+'</span></div><div class="divider"></div>'
   +'<label class="smalltext">Atanmış komutan</label><div class="selectrow"><select id="cmd-'+c.id+'" '+(!founding?"disabled":"")+'><option value="none">Doğrudan merkez</option>'+["Yerel subay","Sivil koordinatör","Bağımsız saha lideri","İrtibat sorumlusu"].map(v=>'<option '+(c.commander===v?"selected":"")+'>'+esc(v)+'</option>').join("")+'</select><button data-action="commander" data-id="'+c.id+'" '+(!founding?"disabled":"")+'>Ata</button></div><label class="smalltext">Sürekli emir</label><select data-order="'+c.id+'" '+(!founding?"disabled":"")+'>'+OPERATIONS.map(o=>'<option value="'+o.id+'" '+(c.order===o.id?"selected":"")+'>'+esc(o.name)+'</option>').join("")+'</select></div>';
 }).join("");
 return heading("HİYERARŞİ","Hücreler ve Komuta","İlk hücreleri yönet; Bölgesel Konferans'tan sonra komutanlara görev devret.")
 +command+(!founding?'<div class="readout">Komutan atamak için ilk örgütsel dönüm noktasını tamamlayın.</div>':"")+recruits+list;
}
function operations(){
 const chosen=OPERATIONS.find(o=>o.id===(s.uiOp||"intelligence"))||OPERATIONS[1];const best=bestCell(s,chosen.id);
 const candidates=activeCells(s).filter(c=>!c.busyUntil);
 return heading("OPERASYON MASASI","Görevler ve Sabotaj","Bir hücre seçin veya istatistiklerine göre en uygun müsait hücreyi otomatik buldurun.")
 +panel("Yeni operasyon",'<label>Görev türü</label><select id="op-type">'+OPERATIONS.map(o=>'<option value="'+o.id+'" '+(o.id===chosen.id?"selected":"")+'>'+esc(o.name)+'</option>').join("")+'</select><p class="smalltext">'+esc(chosen.help)+'</p><div class="grid3">'+metric("Süre",chosen.duration+" gün","Yaklaşık")+metric("Para",chosen.cost)+metric("Risk",fmt(chosen.risk*100)+"%")+'</div><div class="divider"></div><label>Hücre</label><select id="op-cell"><option value="auto">★ Otomatik uygun hücre'+(best?" • "+esc(best.name):"")+'</option>'+candidates.map(c=>'<option value="'+c.id+'">'+esc(c.name)+' / puan '+fmt(scoreCell(c,chosen,s))+'</option>').join("")+'</select><div class="buttonline">'+btn("Görevi başlat","start-operation",'class="primary"')+'<span class="muted">Malzeme: '+chosen.supply+'</span></div>')
 +panel("Sürmekte olan görevler",s.operations.filter(o=>!o.result).map(o=>'<div class="listitem smalltext"><b>'+esc((OPERATIONS.find(x=>x.id===o.type)||{}).name)+'</b><div class="muted">'+esc((s.cells.find(c=>c.id===o.cell)||{}).name)+' • '+(o.completeAt-s.ticks)+' gün • '+(o.automated?"Komutan emri":"Merkez emri")+'</div></div>').join("")||'<p class="muted">Devam eden görev yok.</p>')
 +panel("Geçmiş sonuçlar",s.operations.filter(o=>o.result).slice(0,10).map(o=>'<div class="listitem smalltext">'+esc((OPERATIONS.find(x=>x.id===o.type)||{}).name)+' <span class="badge '+(o.result==="success"?"good":"bad")+'">'+(o.result==="success"?"Başarılı":"Başarısız")+'</span></div>').join("")||'<p class="muted">Henüz sonuçlanmış görev yok.</p>');
}
function politics(){
 const orgs=currentOrganizations(s),p=s.politics;
 const meter=[["Sürgün hükümeti / Londra",p.london],["Eski subaylar",p.officers],["Komünist çevreler",p.left],["Bağımsızlık kanadı",p.autonomy],["PPS–WRN sosyalistleri",p.socialists],["Köylü hareketi",p.rural],["Milliyetçi çevreler",p.nationalists]].map(([name,val])=>'<div class="listitem smalltext"><div class="row"><b>'+esc(name)+'</b><span>'+fmt(val)+'%</span></div>'+bar(val)+'</div>').join("");
 const contacts=CONTACTS.filter(x=>after(s,x.from)).map(c=>'<div class="listitem"><div class="row"><div><b>'+esc(c.name)+'</b><div class="muted smalltext">'+esc(c.hint)+'</div></div><button data-action="contact" data-id="'+c.id+'">Görüş • '+c.cost+'</button></div></div>').join("");
 // Future organizations never appear as if already in existence.
 const available=PATHS.filter(path=>path.id.startsWith("ak")?after(s,"1942-02-14"):(after(s,"1944-01-01")||s.milestones.includes("early_al")));
 const paths=available.length?available.map(v=>{
  const ready=pathAvailable(s,v);const isChosen=s.politics.path===v.id;
  const isEarly=v.id.startsWith("al")&&!after(s,"1944-01-01");
  return '<div class="tree-item '+(isChosen?"done":ready?"ready":"locked")+'"><div class="row"><b>'+esc(v.name)+'</b>'+(isChosen?'<span class="badge good">SEÇİLDİ</span>':ready?'<span class="badge good">AÇIK</span>':'<span class="badge">KİLİTLİ</span>')+'</div><p class="smalltext">'+esc(v.description)+'</p>'+(isEarly?'<span class="badge bad">1942 AL • ALTERNATİF TARİH</span>':"")+(!s.politics.path?'<div class="buttonline"><button data-action="path" data-id="'+v.id+'" '+(!ready?"disabled":"")+'>'+(ready?"Bu yönelimi seç":"Gereksinimler bekleniyor")+'</button></div>':"")+'</div>';
 }).join(""):'<p class="readout">1940: AK veya AL henüz kurulmadı. Önce ZWZ ve mevcut siyasi çevrelerle örgütlenin. İlerleyen yıllarda tarihsel kurumlar ve dallanmalar açılır.</p>';
 const early=earlyALStatus(s);
 return heading("İÇ SİYASET",politicalIdentity(s),"Tarihteki örgütler yalnızca kurulduktan sonra görünür. Bağlılık ve ayrışmalar oyuncu kararlarıyla şekillenir.")
 +panel("Bu tarihte mevcut örgütler",orgs.map(x=>'<div class="listitem"><b>'+esc(x.name)+'</b><span class="badge">'+esc(x.date.slice(0,7))+'</span><div class="smalltext muted">'+esc(x.note)+'</div></div>').join(""))
 +panel("Örgüt içindeki eğilimler",meter)
 +panel("Siyasi bağlantılar",'<p class="smalltext">Görüşmeler oyun kaynakları harcar, siyasi destek sağlar. Aynı çevreyle 28 gün arayla tekrar görüşülebilir.</p>'+contacts)
 +panel("Siyasi yollar",paths+'<p class="smalltext muted">Gerçek AL 1 Ocak 1944'te kurulmuştur. Alternatif tarih oyununda komünist ağlar güçlenirse 1942'de erken kuruluş mümkündür. PPR, AK veya GL tarihsel tarihlerinden önce mevcut sayılmaz.</p>')
 +(s.settings.history==="alternate"?panel("Erken AL durumu",'<div class="grid2">'+metric("Komünist etki",early.left+"%","Gereken: 65")+metric("Hücre",early.cells,"Gereken: 10")+'</div><p class="smalltext">'+(early.dateOK?"Tarih eşiği açıldı.":"Tarih eşiği: 28 Mart 1942.")+' Sol kongre: '+(early.network?"tamam":"beklemede")+'. Milestone onayına ihtiyaç var.</p>'):"");
}
function milestones(){
 const visible=MILESTONES.filter(m=>after(s,m.date)||s.milestones.includes(m.id)||m.id==="founding");
 return heading("DÖNÜM NOKTALARI","Örgüt ve Siyasi Yollar","Tarih, hazırlık ve siyasi koşullar tamamlandığında oyuncu kararı gerekir. Bonus değil, kurumsal değişim açılır.")
 +'<div class="grid2">'+metric("Onaylandı",s.milestones.length+"/"+MILESTONES.length)+metric("Uygun",MILESTONES.filter(m=>canMilestone(s,m)).length)+'</div>'
 +visible.map(m=>'<div class="tree-item '+(s.milestones.includes(m.id)?"done":canMilestone(s,m)?"ready":"locked")+'"><div class="row"><h3>'+esc(m.name)+'</h3><span class="badge '+(canMilestone(s,m)?"good":"")+'">'+(s.milestones.includes(m.id)?"TAMAMLANDI":canMilestone(s,m)?"ŞARTLAR TAMAM":"BEKLİYOR")+'</span></div><p class="smalltext">'+esc(m.description)+'</p><div class="smalltext muted">En erken '+m.date+' • '+esc(m.requires)+'</div><div class="readout" style="margin-top:9px">Açılan: '+esc(m.unlock)+'</div>'+(!s.milestones.includes(m.id)?'<div class="buttonline"><button data-action="milestone" data-id="'+m.id+'" '+(!canMilestone(s,m)?"disabled":"")+'>Onayla</button></div>':"")+'</div>').join("");
}
function war(){
 const w=s.war;
 return heading("DÜNYA SAVAŞI","Cephe ve Dış Gelişmeler","Oyuncu bir devlet yönetmiyor; cephe savaşı dışarıdan ilerler. Örgütün etkisi yerel ve sınırlıdır.")
 +panel(esc(w.phase),'<p class="smalltext">'+(w.started?"22 Haziran 1941 sonrası Alman-Sovyet savaşı sürüyor.":"Barbarossa öncesi. Doğu cephesi 22 Haziran 1941'de açılacak.")+'</p><div class="row smalltext"><span>Sovyet karşı taarruzu</span><span>Alman ilerleyişi</span></div><div class="bar"><div style="width:'+fmt(w.germanAdvance)+'%;background:#ae6965"></div></div><p class="smalltext">Alman ilerleme endeksi: '+w.germanAdvance.toFixed(1)+' • İkmal baskısı: '+fmt(w.sabotagePressure)+'</p>')
 +panel("Simülasyon modeli",'<p class="smalltext">'+(s.settings.history==="historical"?"Tarihsel ana akış korunur; mikro gelişmeler oynanışa bağlıdır.":"Alternatif tarih: savaş sonucu yaklaşık %80 Sovyet zaferi ihtimaliyle kurulumda belirlenir. Büyük sapmalar sınırlıdır.")+'</p><div class="grid2">'+metric("Demiryolu",s.successful.rail,"Başarılı görev")+metric("İstihbarat",s.successful.intelligence,"Başarılı görev")+'</div><p class="smalltext muted">İlerleme endeksi ve olasılıklar oyun modeli olup doğrulanmış tarihsel tahmin değildir.</p>');
}
function archive(){return heading("ARŞİV","Kampanya Günlüğü","Kararların sonuçları ve bütün önemli olaylar.")+panel("Kayıtlar",'<div class="buttonline">'+btn("JSON indir","export")+'</div>'+s.log.slice(0,110).map(l=>'<div class="listitem smalltext"><small>'+date(l.date)+'</small><div>'+esc(l.message)+'</div></div>').join(""))}
function settings(){
 const g=s.settings;
 const select=(key,options)=>'<label>'+esc(key)+'<select data-setting="'+key+'">'+options.map(([v,n])=>'<option value="'+v+'" '+(String(g[key])===String(v)?"selected":"")+'>'+esc(n)+'</option>').join("")+'</select></label>';
 return heading("SİSTEM","Oyun Ayarları","Oynanış, zorluk, otomasyon ve görsel tercihler oyun sırasında değiştirilebilir.")
 +'<div class="panel stack">'+select("difficulty",Object.entries(DIFFICULTIES).map(([id,v])=>[id,v.name]))+select("events",[["calm","Seyrek"],["normal","Dengeli"],["intense","Yoğun"]])+select("history",[["historical","Tarihsel"],["alternate","Alternatif"]])+select("theme",Object.entries(THEMES).map(([id,v])=>[id,v.name]))+'<label>Kaos / alternatif sapma <input type="range" min="0" max="100" data-setting="chaos" value="'+g.chaos+'"></label><label class="selectrow"><input type="checkbox" data-setting="autoOrders" style="width:18px" '+(g.autoOrders?"checked":"")+'> Otomatik komutan emirleri</label><label class="selectrow"><input type="checkbox" data-setting="showInfluence" style="width:18px" '+(g.showInfluence?"checked":"")+'> Etki haritası</label></div>'
 +panel("Kayıt",'<div class="buttonline">'+btn("Kaydet","save")+btn("JSON dışa aktar","export")+btn("JSON içe aktar","import")+btn("Yeni kampanya","new-game")+'</div><p class="smalltext muted">RNG tohumu: '+s.seed+' • Kayıt şeması: '+s.version+'</p>')
 +'<p class="readout">Gerçek OSM koordinatları ve güncel idari sınırlar kullanılır. Bunları 1940 sınırları veya dönemin gerçek bina envanteri sanmayın.</p>';
}
function ending(){
 const v=summary(s);
 const endings={independent:["Erken bağımsızlık","Alternatif tarihte bağımsızlık ilan edildi."],soviet_integrated:["Yeni düzene entegrasyon","Direniş yeni Sovyet destekli siyasi düzene katıldı."],left_independent:["Bağımsız sol hareket","Sol yeraltı özerkliğini korudu."],exile_conflict:["Kurtuluş ve siyasi gerilim","Alman yenilgisi siyasi çelişkileri bitirmedi."],ambiguous_liberation:["Belirsiz kurtuluş","Kurtuluş gerçekleşti, örgütün geleceği belirsiz."],survival:["Direniş sürdü","Alternatif savaşın sonunda hareket hayatta kaldı."]};
 const ed=s.status==="suppressed"?["Örgüt bastırıldı","Hücre ağı tasfiye edildi; yeniden örgütlenebilirsiniz."]:(endings[s.ending]||["Savaş sona erdi","Yeni siyasi düzen henüz şekilleniyor."]);
 return heading("SONUÇ",ed[0],ed[1])+'<div class="grid2">'+metric("Gün",v.days)+metric("Hücre",v.cells)+metric("Başarılı",v.successful)+metric("Tutuklama",v.arrests)+'</div>'
 +panel("Kampanya değerlendirmesi",'<p>Üye: '+v.members+' • Etki: '+v.influence+'% • Başarısız görev: '+v.failed+' • Yeniden kuruluş: '+v.restarts+'</p><div class="buttonline">'+(s.status==="suppressed"?btn("4–18 ay sonra yeniden kur","regroup",'class="primary"'):"")+btn("Raporu indir","export")+btn("Yeni oyun","new-game")+'</div>');
}
/* Geographic layers. Modern official-ish community geometry is used, never claimed to be 1940 borders. */
function normalize(str){return String(str||"").toLocaleLowerCase("pl-PL").replace(/ł/g,"l").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/wojewodztwo|voivodeship|powiat|county|province|miasto/g,"").replace(/[^a-z]/g,"")}
function closestRegion(lat,lng){let found=REGION_DATA[0],dist=Infinity;for(const r of REGION_DATA){const d=(r[2]-lat)**2+((r[3]-lng)*.64)**2;if(d<dist){dist=d;found=r}}return found[0]}
function pointInRing(point,ring){let inside=false;for(let a=0,b=ring.length-1;a<ring.length;b=a++){const x=ring[a][0],y=ring[a][1],u=ring[b][0],v=ring[b][1];if(((y>point[1])!==(v>point[1]))&&point[0]<(u-x)*(point[1]-y)/(v-y)+x)inside=!inside}return inside}
function insideFeature(p,f){const g=f.geometry;if(!g)return false;const poly=g.type==="Polygon"?[g.coordinates]:(g.type==="MultiPolygon"?g.coordinates:[]);return poly.some(parts=>parts[0]&&pointInRing(p,parts[0])&&!parts.slice(1).some(hole=>pointInRing(p,hole)))}
function featureRegion(f){
 const name=normalize(f.properties?.shapeName||f.properties?.name||"");
 const match=REGION_DATA.find(r=>normalize(r[1])===name||normalize(r[1]).includes(name)&&name.length>4);
 if(match)return match[0];
 const center=L.geoJSON(f).getBounds().getCenter();return closestRegion(center.lat,center.lng);
}
function regionAt(lat,lng){
 const hit=provinceData.find(f=>insideFeature([lng,lat],f));return hit?featureRegion(hit):closestRegion(lat,lng);
}
function provinceStyle(f){
 const id=featureRegion(f),r=regionOf(s,id),c=(THEMES[s.settings.theme]||THEMES.ember).hex;
 return {color:s.selectedRegion===id?"#f4e7c7":"#a4b5b3",weight:s.selectedRegion===id?2.2:.8,fillColor:c,fillOpacity:s.settings.showInfluence?clamp(r.influence*.008+.035,.045,.82):.012};
}
function districtStyle(f){
 const center=L.geoJSON(f).getBounds().getCenter(),id=regionAt(center.lat,center.lng),r=regionOf(s,id),c=(THEMES[s.settings.theme]||THEMES.ember).hex;
 return {color:"#d4dfd9",weight:.6,fillColor:c,fillOpacity:s.settings.showInfluence?clamp(r.influence*.007+.035,.04,.70):.01};
}
function featureName(f){return f.properties?.shapeName||f.properties?.name||"İsimsiz bölge"}
function paintProvinces(){
 if(!map||!provinceData.length)return;
 if(provinces)map.removeLayer(provinces);
 provinces=L.geoJSON(provinceData,{style:provinceStyle,onEachFeature:(f,layer)=>{
  const n=featureName(f),id=featureRegion(f);layer.bindTooltip(n,{sticky:true});
  layer.on("click",()=>{s.selectedRegion=id;s.selectedDistrict="";render();save()});
 }}).addTo(map);
}
function paintDistricts(){
 if(!map||!districtData.length)return;
 if(districts)map.removeLayer(districts);
 districts=L.geoJSON(districtData,{style:districtStyle,onEachFeature:(f,ly)=>{
  const n=featureName(f),mid=ly.getBounds().getCenter(),id=regionAt(mid.lat,mid.lng);
  ly.bindTooltip(n,{sticky:true});ly.on("click",()=>{s.selectedRegion=id;s.selectedDistrict=n;render();save()});
 }});
 toggleDistricts();
}
function toggleDistricts(){
 if(!map||!districts)return;
 if(map.getZoom()>=8&&!map.hasLayer(districts))districts.addTo(map);
 if(map.getZoom()<8&&map.hasLayer(districts))map.removeLayer(districts);
}
async function fetchJson(url){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),22000);
 try{const response=await fetch(url,{signal:controller.signal});if(!response.ok)throw Error("HTTP "+response.status);return response.json()}finally{clearTimeout(timer)}
}
async function boundary(level){
 const meta=await fetchJson("https://www.geoboundaries.org/api/current/gbOpen/POL/"+level+"/");
 const url=meta.simplifiedGeometryGeoJSON||meta.gjDownloadURL;
 if(!url)throw Error("Geometry URL missing");
 const geo=await fetchJson(url);if(!geo.features?.length)throw Error("Empty boundary");return geo.features;
}
async function loadBoundaries(){
 $("map-status").textContent="Gerçek, güncel il ve ilçe sınırları yükleniyor…";
 const a=await Promise.allSettled([boundary("ADM1"),boundary("ADM2")]);
 if(a[0].status==="fulfilled"){provinceData=a[0].value;paintProvinces();$("map-status").textContent=provinceData.length+" güncel il sınırı yüklendi."}
 else $("map-status").textContent="İl sınır servisi erişilemiyor; OSM taban haritası açık.";
 if(a[1].status==="fulfilled"){districtData=a[1].value;paintDistricts();$("map-status").textContent+=" "+districtData.length+" ilçe sınırı yüklendi."}
 else $("map-status").textContent+=" İlçe servisi erişilemiyor.";
}
function paintAssets(){
 if(!map||!assetsLayer)return;assetsLayer.clearLayers();
 const c=(THEMES[s.settings.theme]||THEMES.ember).hex;
 for(const [name,lat,lng,id] of cities){
  const mark=L.circleMarker([lat,lng],{radius:5,color:"#fff",fillColor:c,fillOpacity:.87});
  mark.bindTooltip(name);mark.on("click",()=>{s.selectedRegion=id;s.selectedDistrict="";render();map.setView([lat,lng],13)});mark.addTo(assetsLayer);
 }
 for(const a of s.assets){
  const mark=L.circleMarker([a.lat,a.lon],{radius:7,color:"#fff",fillColor:"#f5bc6c",fillOpacity:.95});
  mark.bindPopup("<b>"+esc(a.name)+"</b><br>"+esc(INSTITUTIONS[a.type]?.name||a.type)+"<br>Görünürlük "+fmt(a.visibility)+"%");
  mark.addTo(assetsLayer);
 }
}
function initMap(){
 if(!window.L){$("map-status").textContent="Harita kütüphanesi yüklenemedi (internet gerekli).";return}
 map=L.map("map",{preferCanvas:true,zoomControl:true}).setView([52.0,19.2],6);
 L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
 buildings=L.layerGroup().addTo(map);assetsLayer=L.layerGroup().addTo(map);
 map.on("zoomend",()=>{toggleDistricts();if(map.getZoom()>=15)loadBuildings()});
 map.on("moveend",()=>{if(map.getZoom()>=15)loadBuildings()});
 setTimeout(()=>map.invalidateSize(),80);paintAssets();loadBoundaries();
}
function buildingKind(tags){
 const a=tags.amenity||"",b=tags.building||"";
 if(a==="place_of_worship"||b==="church")return "church";
 if(a==="school"||a==="university"||b==="school")return "school";
 if(a==="hospital"||a==="clinic"||b==="hospital")return "hospital";
 if(b==="industrial"||b==="factory")return "factory";
 if(tags.railway||b==="train_station")return "railway";
 if(a==="library"||b==="commercial"||b==="office")return "press";
 return "safehouse";
}
async function loadBuildings(force=false){
 if(!map||!s||!buildings||map.getZoom()<14)return;
 const c=map.getCenter(),key=Math.floor(c.lat*180)+"."+Math.floor(c.lng*180);
 if(!force&&(key===buildingKey||Date.now()-buildingStamp<18000))return;
 buildingKey=key;buildingStamp=Date.now();
 $("map-status").textContent="OSM bina geometrileri sorgulanıyor…";
 const q='[out:json][timeout:20];way["building"]('+(c.lat-.006)+","+(c.lng-.009)+","+(c.lat+.006)+","+(c.lng+.009)+');out geom 130;';
 try{
  const data=await fetchJson("https://overpass.kumi.systems/api/interpreter?data="+encodeURIComponent(q));
  buildings.clearLayers();
  for(const o of (data.elements||[]).filter(o=>o.geometry?.length>=3).slice(0,130)){
   const points=o.geometry.map(x=>[x.lat,x.lon]),tags=o.tags||{},kind=buildingKind(tags),id="way/"+o.id;
   const center=L.polygon(points).getBounds().getCenter(),owned=s.assets.some(a=>a.osmId===id);
   const b={osmId:id,lat:center.lat,lon:center.lng,region:regionAt(center.lat,center.lng),kind,allowed:kind==="safehouse"?["safehouse"]:["safehouse",kind],name:tags.name||"OSM bina "+o.id,visibility:clamp((INSTITUTIONS[kind]?.visibility||.25)+(tags.name?.12:0),.08,.95)};
   const p=L.polygon(points,{color:owned?"#e0a86d":"#9fcfc4",weight:owned?2:1,fillOpacity:owned?.5:.16,fillColor:owned?"#edb376":"#70c3af"});
   p.bindTooltip(esc(b.name),{sticky:true});
   p.on("click",()=>{s.selectedBuilding=b;s.selectedRegion=b.region;render();p.bindPopup("<b>"+esc(b.name)+"</b><br>Güncel OSM bina izi").openPopup();});
   p.addTo(buildings);
  }
  $("map-status").textContent=buildings.getLayers().length+" bina yüklendi (güncel OSM, tarihsel değil).";
 }catch(e){$("map-status").textContent="Bina API erişilemedi: "+e.message}
}
function exportSave(){
 const blob=new Blob([JSON.stringify(s,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="ashesandbanners-"+s.date+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
async function importFile(file){
 if(!file)return;
 try{const data=JSON.parse(await file.text());if(!validateSave(data))throw Error("Geçersiz kayıt");launch(data);notify("Kayıt yüklendi.")}
 catch(e){notify("Kayıt okunamadı: "+e.message)}
}
function perform(b){
 const ac=b.dataset.action,id=b.dataset.id;let result=null;
 if(ac==="event")result=answerEvent(s,+b.dataset.index);
 if(ac==="milestone")result=approveMilestone(s,id);
 if(ac==="path")result=setPath(s,id);
 if(ac==="contact")result=contactFaction(s,id);
 if(ac==="central")result={ok:setCentralization(s,+b.dataset.level)};
 if(ac==="commander")result={ok:assignCommander(s,id,$("cmd-"+id).value)};
 if(ac==="recruit"||ac==="new-cell")result=recruitCell(s,ac==="recruit"?$("recruit-region").value:s.selectedRegion);
 if(ac==="start-operation")result=scheduleOperation(s,$("op-type").value,$("op-cell").value);
 if(ac==="claim"){result=acquireAsset(s,s.selectedBuilding,$("asset-kind").value);if(result.ok)s.selectedBuilding=null;}
 if(ac==="region"&&map){const r=selected();map.setView([r.lat,r.lon],10)}
 if(ac==="city"&&map){const c=cities.find(x=>x[0]===b.dataset.name);if(c){s.selectedRegion=c[3];map.setView([c[1],c[2]],15);loadBuildings(true)}}
 if(ac==="buildings"&&map){const r=selected();if(map.getZoom()<14)map.setView([r.lat,r.lon],15);loadBuildings(true)}
 if(ac==="operations-tab")switchTab("operations");
 if(ac==="save"){save();notify("Kaydedildi.")}
 if(ac==="export")exportSave();
 if(ac==="import")$("file-import").click();
 if(ac==="regroup"){result=regroup(s);if(result.ok)s=result.state}
 if(ac==="new-game"){running=false;$("game").hidden=true;$("setup").hidden=false;s=null;setupSync();return;}
 if(result)notify(result.ok?"İşlem kaydedildi.":result.why||"İşlem yapılamadı.");
 if(s){save();render()}
}
function bind(){
 document.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.tab){switchTab(b.dataset.tab);return}
  if(b.dataset.action)perform(b);
 });
 document.addEventListener("change",e=>{
  const el=e.target;
  if(!s)return;
  if(el.dataset.order){setOrder(s,el.dataset.order,el.value);save();notify("Sürekli emir değiştirildi.");return}
  if(el.id==="op-type"){s.uiOp=el.value;render();return}
  if(el.dataset.setting){
   const key=el.dataset.setting,value=el.type==="checkbox"?el.checked:el.value;
   s.settings[key]=key==="chaos"?Number(value):value;
   if(key==="history"&&value==="historical")s.war.sovietVictory=true;
   if(key==="history"&&value==="alternate")s.war.sovietVictory=((s.seed%100)<80);
   if(key==="theme")theme();
   if(key==="showInfluence"&&provinces)provinces.setStyle(provinceStyle);
   if(key==="showInfluence"&&districts)districts.setStyle(districtStyle);
   $("mode-label").textContent=s.settings.history==="historical"?"Tarihsel çizgi":"Alternatif tarih";
   save();render();
  }
 });
 $("new-game").addEventListener("click",start);
 $("resume-game").addEventListener("click",()=>{try{const loaded=JSON.parse(localStorage.getItem(KEY));if(!validateSave(loaded))throw Error("Kayıt bozuk");launch(loaded)}catch(e){notify(e.message)}});
 $("import-setup").addEventListener("click",()=>$("file-import").click());
 $("file-import").addEventListener("change",e=>{importFile(e.target.files?.[0]);e.target.value=""});
 $("start-resources").addEventListener("input",setupSync);$("start-chaos").addEventListener("input",setupSync);
 $("toggle-time").addEventListener("click",()=>{running=!running;$("toggle-time").textContent=running?"❚❚":"▶"});
 $("next-day").addEventListener("click",()=>{if(s){advanceDays(s,1);save();render()}});
 $("time-speed").addEventListener("change",e=>{if(s){s.settings.speed=+e.target.value;save()}});
 $("save-game").addEventListener("click",()=>{save();notify("Kaydedildi.")});
 $("map-home").addEventListener("click",()=>{if(map)map.setView([52,19.2],6)});
 $("map-city").addEventListener("click",()=>{if(map){map.setView([52.2297,21.0122],15);loadBuildings(true)}});
 $("map-layer").addEventListener("click",()=>{if(s){s.settings.showInfluence=!s.settings.showInfluence;$("map-layer").textContent="Etki katmanı: "+(s.settings.showInfluence?"Açık":"Kapalı");save();render()}});
 setInterval(()=>{if(!s||!running||s.pendingEvent||s.status!=="running"){if(s&&s.pendingEvent&&running){running=false;$("toggle-time").textContent="▶"}return}advanceDays(s,s.settings.speed||3);save();render()},1000);
}
bind();setupSync();


export const REGION_DATA = [
 ["pomorskie","Pomorskie",53.16,18.60,15,.83,1.9],
 ["poznanskie","Poznańskie",52.41,16.93,18,.83,2.3],
 ["warszawskie","Warszawskie",52.23,21.01,24,.86,3.6],
 ["lodzkie","Łódzkie",51.76,19.45,20,.75,2.6],
 ["kieleckie","Kieleckie",50.87,20.63,16,.92,2.7],
 ["slaskie","Śląskie",50.26,19.02,16,.80,1.5],
 ["krakowskie","Krakowskie",50.06,19.94,18,.91,2.3],
 ["lubelskie","Lubelskie",51.25,22.57,16,.92,2.1],
 ["bialostockie","Białostockie",53.13,23.17,13,.83,1.3],
 ["nowogrodzkie","Nowogródzkie",53.59,25.82,11,.80,1.1],
 ["wilenskie","Wileńskie",54.69,25.28,10,.75,1.3],
 ["poleskie","Poleskie",52.10,25.75,9,.77,1.1],
 ["wolynskie","Wołyńskie",50.75,25.30,10,.73,2.1],
 ["lwowskie","Lwowskie",49.84,24.03,14,.84,3.1],
 ["tarnopolskie","Tarnopolskie",49.55,25.60,11,.82,1.6],
 ["stanislawowskie","Stanisławowskie",48.92,24.72,11,.82,1.5]
];
export const THEMES = {
  ember:{name:"Kızıl Kül",hex:"#c95e54",rgb:"201,94,84"},
  forest:{name:"Orman",hex:"#669a75",rgb:"102,154,117"},
  indigo:{name:"Gece",hex:"#6b8fbd",rgb:"107,143,189"},
  gold:{name:"Amber",hex:"#d3a65d",rgb:"211,166,93"}
};
export const DIFFICULTIES = {
  recruit:{name:"Acemi",risk:.72,growth:1.3},
  regular:{name:"Direnişçi",risk:1,growth:1},
  veteran:{name:"Kıdemli",risk:1.22,growth:.85},
  nightmare:{name:"Kuşatma",risk:1.5,growth:.68}
};
export const PATHS = [
 {id:"ak_london",name:"Sürgün hükümetine bağlı AK",short:"Londra / AK",color:"#b87862",date:"1942-02-14",needs:"council",description:"Komuta zinciri sürgün hükümetine bağlı. Londra'yla temas güçlü; kendi karar alanın sınırlı."},
 {id:"ak_independent",name:"Bağımsız Armia Krajowa",short:"Bağımsız AK",color:"#7e9ac5",date:"1942-02-14",needs:"council",description:"Eski subaylar ağırlık kazanır. Özerk askerî komuta, daha zor dış destek."},
 {id:"al_independent",name:"Bağımsız Armia Ludowa",short:"Bağımsız AL",color:"#b96d72",date:"1944-01-01",needs:"left_network",description:"Sol direnişin bağımsız kolu. Sovyetlerle ilişkiler önemli ancak doğrudan emir zinciri yok."},
 {id:"al_soviet",name:"Sovyetlere entegre Armia Ludowa",short:"Sovyet / AL",color:"#b94c4c",date:"1944-01-01",needs:"left_network",description:"Sovyet askerî-siyasi kurumlarına bağlı örgütlenme; özerklikten taviz."}
];
export const MILESTONES = [
 {id:"founding",name:"Gizli Bölge Konferansı",date:"1940-02-01",requires:"En az 7 hücre, toplam 65 üye, meşruiyet ≥ 35",test:s=>activeCells(s).length>=7&&members(s)>=65&&s.legitimacy>=35,description:"Bölge temsilcileri ortak bir genel merkez kurulmasını müzakere ediyor.",unlock:"Bölgesel komuta sistemi ve siyasi müzakereler açılır."},
 {id:"schools",name:"Yeraltı Toplumsal Ağı",date:"1940-05-01",requires:"Toplam 90 üye, kontrol edilen en az bir okul veya hastane",test:s=>members(s)>=90&&s.assets.some(a=>a.type==="school"||a.type==="hospital"),description:"Sivil yardım ve eğitim grupları birbirine güvenmeye başlıyor.",unlock:"Yeni sivil dayanışma olayları ve yerel teşkilat kanalları açılır."},
 {id:"council",name:"Siyasi Temsil Konseyi",date:"1941-02-01",requires:"Bölge konferansı, ≥ 95 üye ve meşruiyet ≥ 45",test:s=>s.milestones.includes("founding")&&members(s)>=95&&s.legitimacy>=45,description:"Askerî ve sivil unsurların gelecek yönetimi üzerine anlaşması gerekir.",unlock:"Dört siyasi yolun tarihsel açılış tarihlerine göre adaylaşması mümkün olur."},
 {id:"liaison",name:"Dış Bağlantılar",date:"1941-04-01",requires:"≥ 8 hücre ve ≥ 38 istihbarat",test:s=>activeCells(s).length>=8&&s.intel>=38,description:"Dış merkezlerle sürekli haberleşme kanalları üzerine tartışma.",unlock:"Dış temas olayları ve haberleşme operasyonları açılır."},
 {id:"east",name:"Doğu Cephesinin Açılması",date:"1941-06-22",requires:"Barbarossa başlamış, 1 istihbarat operasyonu başarılı",test:s=>s.war.started&&s.successful.intelligence>=1,description:"Alman-Sovyet savaşı yeraltı politikasının bütün dengelerini değiştirdi.",unlock:"Doğu cephesine ilişkin olaylar ve cephe gerisi harekâtlar açılır."},
 {id:"left_network",name:"Bağımsız Sol Yeraltı Kongresi",date:"1942-01-05",requires:"Siyasi konsey ve sol kanat desteği ≥ 30",test:s=>s.milestones.includes("council")&&s.politics.left>=30,description:"1942'de Gwardia Ludowa çevresindeki yeni hareketlerle ilişkiler tartışılıyor.",unlock:"1944'ten itibaren iki alternatif Armia Ludowa yolu açılır."},
 {id:"early_al",name:"Erken Armia Ludowa Kongresi (ALTERNATİF TARİH)",date:"1942-03-28",requires:"Alternatif tarih; sol kongre; komünist destek ≥ 65; en az 10 hücre",test:s=>s.settings.history==="alternate"&&s.milestones.includes("left_network")&&s.politics.left>=65&&activeCells(s).length>=10,description:"Tarihte 1944'te kurulan AL, alternatif tarihte güçlü komünist çevrelerin erken kongresiyle 1942'de açılabilir.",unlock:"1942'de bağımsız ve Sovyet bağlantılı AL yolu açılır; bu açıkça tarihsel sapmadır."},
 {id:"uprising",name:"Genel Ayaklanma Tasarısı",date:"1943-01-01",requires:"≥ 350 üye, 4 bölgede etki ≥ 40, meşruiyet ≥ 65",test:s=>members(s)>=350&&Object.values(s.regions).filter(r=>r.influence>=40).length>=4&&s.legitimacy>=65,description:"Açık ayaklanmanın bedeli ve siyasi egemenlik ihtimali masada.",unlock:"Bağımsız kurtuluş için koşullu tarihsel sapma sonu mümkün."},
 {id:"liberation",name:"Bağımsızlık Beyanı",date:"1943-06-01",requires:"Ayaklanma tasarısı, ≥ 600 üye, 5 bölgede etki ≥ 70, Alman gerilemesi",test:s=>s.milestones.includes("uprising")&&members(s)>=600&&Object.values(s.regions).filter(r=>r.influence>=70).length>=5&&s.war.started&&s.war.germanAdvance<42,description:"Ülkenin geleceği artık yalnızca bir dış ordunun ilerleyişine bağlı olmayabilir.",unlock:"Beyan, alternatif tarih modunda erken bağımsızlık sonunu açar."}
];
export const OPERATIONS = [
 {id:"recruit",name:"Gizli örgütlenme",stat:"leadership",duration:13,cost:12,supply:0,risk:.11,difficulty:40,help:"Üye ağı oluşturur; tanınma riskini artırır."},
 {id:"intelligence",name:"İstihbarat toplama",stat:"intel",duration:11,cost:9,supply:0,risk:.16,difficulty:44,help:"Saha bilgisi edinir, diğer görevlerin başarısını etkiler."},
 {id:"aid",name:"Sivil yardım",stat:"logistics",duration:12,cost:19,supply:1,risk:.08,difficulty:34,help:"Halk desteğini ve örgütün meşruiyetini yükseltir."},
 {id:"press",name:"Yeraltı basını",stat:"leadership",duration:15,cost:17,supply:1,risk:.17,difficulty:47,help:"Siyasi etki yaratır, yerel bilinirliği artırır."},
 {id:"communications",name:"Haberleşme kesintisi",stat:"intel",duration:18,cost:21,supply:3,risk:.31,difficulty:59,help:"Alman kontrol sistemini geçici olarak zayıflatır."},
 {id:"rail",name:"Demiryolu sabotajı",stat:"field",duration:21,cost:30,supply:5,risk:.39,difficulty:66,help:"İkmal ağını stratejik düzeyde aksatır; yüksek risklidir."},
 {id:"rescue",name:"Tutuklu tahliyesi",stat:"field",duration:20,cost:28,supply:5,risk:.37,difficulty:64,help:"Tutukluların kurtarılması için riskli bir teşebbüs."}
];
export const INSTITUTIONS = {
 safehouse:{name:"Hücre evi",price:38,visibility:.18,help:"Hücrelerin sığınma kapasitesi; her ek ev azalan getiri sağlar."},
 church:{name:"Dini kurum ağı",price:65,visibility:.69,help:"Dindarlığın yüksek olduğu bölgelerde destek artar; birikim sınırlı."},
 school:{name:"Yeraltı eğitim ağı",price:56,visibility:.54,help:"Uzun vadeli örgütlenme ve yerel meşruiyet."},
 hospital:{name:"Sivil sağlık ağı",price:74,visibility:.48,help:"Sivil güven, moral ve tutuklama sonrasındaki toparlanma."},
 factory:{name:"İşçi bağlantısı",price:69,visibility:.62,help:"Kaynaklar ve emekçi desteği."},
 railway:{name:"Ulaştırma bağlantısı",price:72,visibility:.8,help:"Ulaşım istihbaratı, daha yüksek baskın riski."},
 press:{name:"Basın ağı",price:55,visibility:.65,help:"Yeraltı basını ve siyasi meşruiyet."}
};
export const CENT_LEVELS = [
 {name:"Tam özerk",coord:-10,exposure:.68,delegate:1.4,desc:"Az ortak koordinasyon, düşük zincirleme açığa çıkma, komutanların geniş serbestliği."},
 {name:"Dağıtık",coord:-5,exposure:.83,delegate:1.2,desc:"Bölgesel sorumluluk ve sınırlı merkez kontrolü."},
 {name:"Dengeli",coord:0,exposure:1,delegate:1,desc:"Saha girişimleri ile merkezi disiplin arasında denge."},
 {name:"Merkezi",coord:7,exposure:1.22,delegate:.85,desc:"Koordineli operasyonlar daha etkili, baskınların örgüte yayılma riski artar."},
 {name:"Sıkı komuta",coord:12,exposure:1.52,delegate:.7,desc:"Yüksek koordinasyon ve güçlü emir zinciri, ciddi karşı istihbarat zaafı."}
];
const CELL_TEMPLATE = [
 ["c1","Varşova Merkez","warszawskie",16,61,58,45,43],
 ["c2","Praga Hattı","warszawskie",12,69,42,44,54],
 ["c3","Varşova Öğrenci Ağı","warszawskie",9,58,68,36,32],
 ["c4","Łódź İşçi Çevresi","lodzkie",12,55,38,69,41],
 ["c5","Kraków Saha Birimi","krakowskie",10,62,53,43,59],
 ["c6","Lublin Bağlantısı","lubelskie",9,72,48,56,40],
 ["c7","Kielce Orman Hücresi","kieleckie",10,65,35,50,64]
];
export function clamp(n,min=0,max=100){return Math.max(min,Math.min(max,Number.isFinite(n)?n:min))}
export function day(s){return new Date(s.date+"T00:00:00Z")}
export function after(s,d){return day(s)>=new Date(d+"T00:00:00Z")}
function addDay(s,n=1){let d=day(s);d.setUTCDate(d.getUTCDate()+n);s.date=d.toISOString().slice(0,10)}
export function rand(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296}
export function pick(s,arr){return arr[Math.floor(rand(s)*arr.length)]}
export function activeCells(s){return s.cells.filter(c=>!c.destroyed)}
export function members(s){return activeCells(s).reduce((n,c)=>n+c.members,0)}
export function influence(s){return Math.round(Object.values(s.regions).reduce((n,r)=>n+r.influence,0)/REGION_DATA.length)}
export function regionOf(s,id){return s.regions[id]||s.regions.warszawskie}
export function entry(s,message,type="info"){s.log.unshift({date:s.date,message,type});if(s.log.length>240)s.log.length=240}
export function createGame(config={}){
 const settings={history:"historical",difficulty:"regular",events:"normal",speed:3,resources:100,chaos:35,theme:"ember",autoOrders:true,showInfluence:true,...config};
 settings.speed=clamp(Number(settings.speed),1,14);
 settings.resources=clamp(Number(settings.resources),50,200);
 settings.chaos=clamp(Number(settings.chaos),0,100);
 if(!DIFFICULTIES[settings.difficulty])settings.difficulty="regular";
 if(!THEMES[settings.theme])settings.theme="ember";
 const seed=((Number(settings.seed)||Math.floor(Math.random()*2147483646))>>>0)||1;
 const regions=Object.fromEntries(REGION_DATA.map(([id,name,lat,lon,support,religion,pop])=>[id,{id,name,lat,lon,support,influence:clamp(support*.56),heat:12,security:55,religion,pop,occupied:"Axis"}]));
 const cells=CELL_TEMPLATE.map(([id,name,region,members,stealth,intel,logistics,field])=>({id,name,region,members,stealth,intel,logistics,field,leadership:42,exposure:8,fatigue:0,commander:null,order:"recruit",busyUntil:null,destroyed:false}));
 const s={version:2,date:"1940-01-01",ticks:0,seed,settings,regions,cells,assets:[],operations:[],funds:Math.round(200*settings.resources/100),supplies:Math.round(25*settings.resources/100),intel:28,legitimacy:40,morale:65,alert:12,politics:{left:15,london:34,officers:32,autonomy:19,socialists:28,rural:24,nationalists:18,contacts:{},path:null},centralization:3,milestones:[],eventsSeen:[],pendingEvent:null,nextEvent:12,war:{started:false,germanAdvance:0,phase:"Savaş öncesi",sovietVictory:null,sabotagePressure:0,armyMomentum:0},successful:{intelligence:0,rail:0,total:0},records:{successful:0,failed:0,arrests:0,days:0,restarts:0},status:"running",ending:null,selectedRegion:"warszawskie",selectedDistrict:"",selectedBuilding:null,log:[]};
 s.war.sovietVictory= settings.history==="historical" ? true : rand(s)<.8;
 entry(s,"Yedi hücre örgütlendi. Varşova merkezli yeraltı ağı faaliyete başladı.","story");
 entry(s,"Not: Bölge ve bina coğrafyası güncel OSM/modern idari harita altlığıdır; 1940 hudutları değildir.","info");
 return s;
}
export function canMilestone(s,m){
 return !s.milestones.includes(m.id) && after(s,m.date) && m.test(s);
}
export function approveMilestone(s,id){
 const m=MILESTONES.find(x=>x.id===id);
 if(!m||!canMilestone(s,m)||s.status!=="running")return {ok:false,why:"Koşullar henüz tamamlanmadı."};
 s.milestones.push(id);entry(s,"Dönüm noktası onaylandı: "+m.name+". "+m.unlock,"story");
 if(id==="founding")s.legitimacy=clamp(s.legitimacy+3);
 if(id==="council")s.pendingEvent={id:"council_debate",title:"Gizli Siyasi Konsey",text:"Komutanlar, subaylar ve sivil temsilciler örgütün dış merkezlere bağlılığı üzerine açıkça ayrışıyor.",choices:[{name:"Askerî koordinasyonu koru",effect:"officers"},{name:"Sivil katılımı genişlet",effect:"left"}]};
 if(id==="early_al")s.pendingEvent={id:"early_al_debate",title:"1942: Erken Armia Ludowa (alternatif tarih)",text:"Tarihsel AL 1944'te kuruldu. Bu oyun dünyasında güçlenen komünist ağlar 1942'de yeni bir örgütün ilanını mümkün kıldı.",choices:[{name:"Erken AL kongresini destekle",effect:"left"},{name:"Müzakereleri sürdür",effect:"caution"}]};
 if(id==="liberation"&&s.settings.history==="alternate")s.pendingEvent={id:"liberation_plebiscite",title:"Bağımsızlık eşiği",text:"Geniş bir yeraltı tabanı, silahlı ayaklanmadan önce siyasal meşruiyet ve sivil kayıp riskinin değerlendirilmesini istiyor.",choices:[{name:"Bağımsızlık bildirisi yayımla",effect:"independence"},{name:"Şimdi değil, örgütü koru",effect:"restraint"}]};
 return {ok:true};
}
export function pathAvailable(s,p){
 if(!s.milestones.includes(p.needs))return false;
 if(s.settings.history==="historical"&&(p.id==="ak_independent"||p.id==="al_independent"))return false;
 if(p.id.startsWith("al")){
   if(s.settings.history==="alternate"&&s.milestones.includes("early_al")&&after(s,"1942-03-28"))return true;
   return after(s,"1944-01-01")&&s.politics.left>=40;
 }
 return after(s,p.date);
}
export function setPath(s,id){
 const p=PATHS.find(x=>x.id===id);
 if(!p||!pathAvailable(s,p)||s.politics.path||s.status!=="running")return {ok:false,why:"Siyasi yol henüz açılmadı veya daha önce seçildi."};
 s.politics.path=id;
 if(id==="ak_london")s.politics.london=clamp(s.politics.london+16);
 if(id==="ak_independent")s.politics.officers=clamp(s.politics.officers+18);
 if(id.startsWith("al"))s.politics.left=clamp(s.politics.left+25);
 entry(s,"Yeni siyasi yönelim: "+p.name+". Bu seçim geri alınamaz.","story");
 return {ok:true};
}
export function setCentralization(s,level){
 const val=Number(level);if(!Number.isInteger(val)||val<1||val>5)return false;
 s.centralization=val;entry(s,"Komuta yapısı: "+CENT_LEVELS[val-1].name);return true;
}
export function assignCommander(s,id,commander){
 const c=s.cells.find(x=>x.id===id&&!x.destroyed);
 if(!c||!s.milestones.includes("founding"))return false;
 c.commander=commander==="none"?null:String(commander).slice(0,45);
 entry(s,c.name+": "+(c.commander?"Komutan atandı ("+c.commander+").":"Doğrudan genel merkeze bağlandı."));return true;
}
export function setOrder(s,id,order){
 const c=s.cells.find(x=>x.id===id&&!x.destroyed);
 if(!c||!OPERATIONS.some(x=>x.id===order))return false;c.order=order;return true;
}
export function recruitCell(s,regionId){
 const r=regionOf(s,regionId);if(!r||s.funds<65||activeCells(s).length>=150||s.status!=="running")return {ok:false,why:"Yeterli kaynak veya kapasite yok."};
 const id="c"+(s.cells.length+1),name=r.name+" / Hücre "+id.toUpperCase();
 s.cells.push({id,name,region:r.id,members:5,stealth:45,intel:38,logistics:44,field:40,leadership:35,exposure:11,fatigue:0,commander:null,order:"recruit",busyUntil:null,destroyed:false});
 s.funds-=65;r.heat=clamp(r.heat+3);entry(s,r.name+" bölgesinde yeni bir hücre kuruldu.");return {ok:true};
}
export function scoreCell(c,op,s){
 if(!c||c.destroyed||c.busyUntil||c.members<4)return -Infinity;
 const specialty=c[op.stat]||35;
 return specialty*.56+c.stealth*.21+c.leadership*.12+(100-c.fatigue)*.11-c.exposure*.33+(c.region===s.selectedRegion?4:0);
}
export function bestCell(s,opId){
 const op=OPERATIONS.find(x=>x.id===opId);if(!op)return null;
 return activeCells(s).filter(c=>!c.busyUntil).sort((a,b)=>scoreCell(b,op,s)-scoreCell(a,op,s))[0]||null;
}
export function scheduleOperation(s,opId,cellId="auto"){
 const op=OPERATIONS.find(x=>x.id===opId),c=cellId==="auto"?bestCell(s,opId):s.cells.find(x=>x.id===cellId);
 if(!op||!c||scoreCell(c,op,s)===-Infinity||s.status!=="running")return {ok:false,why:"Uygun ve boşta bir hücre yok."};
 if(s.funds<op.cost||s.supplies<op.supply)return {ok:false,why:"Para veya malzeme yetersiz."};
 if(op.id==="rail"&&!s.war.started)return {ok:false,why:"İkmal sabotajı harekâtı doğu cephesi açılınca kullanılabilir."};
 s.funds-=op.cost;s.supplies-=op.supply;
 const days=Math.max(4,Math.round(op.duration*(.85+rand(s)*.3)));
 c.busyUntil=s.ticks+days;
 const item={id:"op"+(s.operations.length+1),type:opId,cell:c.id,region:c.region,completeAt:c.busyUntil,start:s.date,result:null,automated:false};
 s.operations.unshift(item);c.fatigue=clamp(c.fatigue+10);entry(s,c.name+" / "+op.name+" operasyonu başladı.");return {ok:true,item};
}
export function acquireAsset(s,building,type){
 const def=INSTITUTIONS[type],r=regionOf(s,building&&building.region);
 if(!def||!building||!r||s.status!=="running")return {ok:false,why:"Bina ve bölge seçilmedi."};
 if(s.funds<def.price)return {ok:false,why:"Yeterli kaynak yok."};
 if(s.assets.some(a=>a.osmId===building.osmId))return {ok:false,why:"Bu bina zaten örgüt ağında."};
 const lat=Number(building.lat),lon=Number(building.lon);
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<48||lat>56||lon<14||lon>30)return {ok:false,why:"Harita konumu geçersiz."};
 s.funds-=def.price;
 s.assets.push({id:"a"+(s.assets.length+1),osmId:String(building.osmId).slice(0,64),name:String(building.name||"İsimsiz yapı").slice(0,100),region:r.id,type,lat,lon,visibility:clamp(Number(building.visibility??def.visibility)*100,5,100),raids:0});
 entry(s,r.name+": "+def.name+" bağlantısı kuruldu.");return {ok:true};
}
export function assetEffects(s,regionId){
 const r=regionOf(s,regionId);
 const list=s.assets.filter(a=>a.region===r.id);
 const counts={};
 for(const a of list)counts[a.type]=(counts[a.type]||0)+1;
 const fall=(key,cap,scale=4)=>cap*(1-Math.exp(-(counts[key]||0)/scale));
 return {
  support:fall("church",1.6*r.religion,5)+fall("school",.7,4)+fall("hospital",.8,4)+fall("press",.6,4),
  recruitment:fall("school",1.2,4)+fall("factory",1.1,5)+fall("safehouse",.8,7),
  supplies:fall("factory",2.7,5)+fall("railway",1.2,5),
  secrecy:fall("safehouse",7,6)+fall("hospital",1.4,4),
  intel:fall("railway",2,5)+fall("press",.5,5)
 };
}
export function institutionRaidRisk(s,a){
 const r=regionOf(s,a.region);
 const factor=DIFFICULTIES[s.settings.difficulty].risk*CENT_LEVELS[s.centralization-1].exposure;
 return clamp((.001+.000075*clamp(a.visibility)+.000035*r.heat)*factor,0,.9);
}
export function resolveOperation(s,o){
 const op=OPERATIONS.find(x=>x.id===o.type),c=s.cells.find(x=>x.id===o.cell);
 if(!op||!c||o.result)return;
 const r=regionOf(s,c.region),central=CENT_LEVELS[s.centralization-1];
 const riskFactor=DIFFICULTIES[s.settings.difficulty].risk;
 const institutional=assetEffects(s,r.id);
 const score=(c[op.stat]||40)*.55+c.stealth*.18+c.leadership*.13+s.intel*.13+central.coord+institutional.secrecy-r.heat*.22-c.exposure*.2-c.fatigue*.16;
 const probability=clamp(50+(score-op.difficulty)*.85,12,89)/100;
 const success=rand(s)<probability;
 o.result=success?"success":"fail";c.busyUntil=null;c.fatigue=clamp(c.fatigue+6);
 const risk=clamp((op.risk+.012*r.heat+.008*c.exposure)*riskFactor*central.exposure,0,.92);
 const detected=rand(s)<risk;
 if(success){
  s.records.successful++;s.successful.total++;
  switch(o.type){
   case "recruit":c.members+=3+Math.floor(rand(s)*7);r.influence=clamp(r.influence+2);break;
   case "intelligence":s.intel=clamp(s.intel+8);s.successful.intelligence++;break;
   case "aid":r.support=clamp(r.support+4);s.legitimacy=clamp(s.legitimacy+2);break;
   case "press":r.influence=clamp(r.influence+5);s.legitimacy=clamp(s.legitimacy+1);break;
   case "communications":r.security=clamp(r.security-7,12,100);s.war.sabotagePressure=clamp(s.war.sabotagePressure+2);break;
   case "rail":s.successful.rail++;s.war.sabotagePressure=clamp(s.war.sabotagePressure+7);r.heat=clamp(r.heat+6);break;
   case "rescue":c.members+=2;s.legitimacy=clamp(s.legitimacy+2);break;
  }
  entry(s,c.name+": "+op.name+" başarıyla sonuçlandı.","success");
 }else{
  s.records.failed++;s.morale=clamp(s.morale-1);r.heat=clamp(r.heat+3);
  entry(s,c.name+": "+op.name+" başarısız.","danger");
 }
 if(detected){
  c.exposure=clamp(c.exposure+8+rand(s)*11);
  r.heat=clamp(r.heat+4);s.alert=clamp(s.alert+3);
  if(rand(s)<.2+.002*c.exposure){
   let lost=Math.max(1,Math.round(c.members*(.12+rand(s)*.19)));c.members=Math.max(0,c.members-lost);
   s.records.arrests+=lost;entry(s,c.name+" bağlantısı açığa çıktı; "+lost+" kişi tutuklandı.","danger");
   if(c.members===0){c.destroyed=true;entry(s,c.name+" dağıtıldı.","danger")}
  }
 }
}
const EVENTS = [
 {id:"occupation",title:"İşgal idaresinden yeni emirler",text:"İşgal makamlarının denetimi sıkılaşıyor. Sivil toplum ve yeraltı örgütü arasında kaynak paylaşımı tartışma konusu.",choices:[{name:"Örgütü koru, görünürlüğü azalt",effect:"caution"},{name:"Yerel yardım ağlarını genişlet",effect:"aid"}]},
 {id:"informant",title:"Muhbir söylentisi",text:"İki hücrenin çevresinde şüpheli haberler dolaşıyor. Kanıt yok, fakat paniğin de bir bedeli var.",choices:[{name:"Soruşturma ve sabır",effect:"investigate"},{name:"Hücre temaslarını geçici durdur",effect:"caution"}]},
 {id:"students",title:"Üniversite çevrelerinden çağrı",text:"Öğrenciler yasaklanan yayın ve eğitime karşı yeraltında çalışmak istiyor.",choices:[{name:"Eğitim ve basın ağını destekle",effect:"students"},{name:"Kaynakları sakla",effect:"funds"}]},
 {id:"london",title:"Londra'dan haber",text:"Sürgün yönetimine bağlı kalmanın diplomatik yararı ile yerel serbestlik arasında görüş ayrılıkları büyüyor.",choices:[{name:"Londra temsilcileriyle yakınlaş",effect:"london"},{name:"Yerel komutanların ağırlığını artır",effect:"officers"}]},
 {id:"workers",title:"İşçi gruplarının temsil talebi",text:"Fabrika çevreleri örgütün yalnızca eski subaylarca yönetilmesine itiraz ediyor.",choices:[{name:"Sol sivil ağları kabul et",effect:"left"},{name:"Birleşik komuta öncelikli",effect:"officers"}]},
 {id:"reprisal",title:"Misilleme tehdidi",text:"Bir garnizon, yerel sivillere yönelik cezalandırma duyuruları yayımlıyor. Açık eylem sivil riski artıracak.",choices:[{name:"Sivil koruma örgütle",effect:"aid"},{name:"Geçici olarak geri çekil",effect:"caution"}]}
];
const HISTORICAL = [
 ["pkp","1940-02-01","PKP: Gizli Siyasi Temsil","Şubat 1940'ta Polityczny Komitet Porozumiewawczy siyasi koordinasyon için oluştu.",[{name:"Temsil görüşmelerine katıl",effect:"london"},{name:"Yerel özerkliği koru",effect:"officers"}]],
 ["chlostra","1940-08-01","Köylü hareketinde silahlı örgütlenme","Ağustos 1940'ta Chłopska Straż çevreleri güçleniyor. Bataliony Chłopskie adı daha sonra yaygınlaşır.",[{name:"Köylü ağıyla dayanış",effect:"aid"},{name:"Askerî disipline odaklan",effect:"officers"}]],
 ["delegatura","1940-12-01","Hükümet Delegasyonu","Delegatura Rządu na Kraj işgal altındaki ülkede sivil siyasi temsil için kuruluyor.",[{name:"Bağ kur",effect:"london"},{name:"Özerk kal",effect:"caution"}]],
 ["barbarossa","1941-06-22","Barbarossa Harekâtı","Almanya Sovyetler Birliği'ne saldırdı. Doğu Cephesi açılıyor. Sovyet yanlısı ve Londra yanlısı kanatlar karşılıklı kuşku içinde.",[{name:"Cephe istihbaratı kur",effect:"investigate"},{name:"Sivil kayıplara odaklan",effect:"aid"}]],
 ["homearmy","1942-02-14","ZWZ'den Armia Krajowa'ya","Sürgün hükümeti ZWZ adının Armia Krajowa olarak değiştirilmesini ilan etti. Bu, örgüt içi ilişkilerde yeni tartışmalar yaratıyor.",[{name:"Haberleşme ve koordinasyon kur",effect:"london"},{name:"Yerel komuta özerkliğini savun",effect:"officers"}]],
 ["ppr","1942-01-05","Polska Partia Robotnicza kuruldu","PPR şimdi kuruldu. Komünist Gwardia Ludowa 28 Mart 1942'den önce mevcut değildi; 1939'daki GL PPS–WRN ise farklıdır.",[{name:"Diyalog kanalı aç",effect:"left"},{name:"Örgütsel bağımsızlıkta ısrar et",effect:"officers"}]],
 ["gl_ppr","1942-03-28","Gwardia Ludowa (PPR) kuruldu","Komünist PPR'nin Gwardia Ludowa'sı oluştu. 1939'daki PPS–WRN'nin aynı isimli örgütüyle karıştırılmamalı.",[{name:"Sol direnişle görüş",effect:"left"},{name:"Yerel komutayı koru",effect:"officers"}]],
 ["katyn","1943-04-13","Katyn katliamının duyurulması","1943'te Katyn katliamına ilişkin açıklamalar Polonya-Sovyet ilişkilerini derinden sarsıyor. Bu, siyasi kanatlar arasında güven krizini büyütüyor.",[{name:"Bağımsız inceleme ve açık tartışma iste",effect:"officers"},{name:"İttifak görüşmelerini sürdür",effect:"caution"}]],
 ["tempest","1944-01-04","Burza (Fırtına) Harekâtı","Kızıl Ordu batı yönünde ilerlerken AK'nin yerel ayaklanmalarla siyasi iradesini gösterme planları tartışılıyor.",[{name:"Yerel siyasi temsil üzerinde dur",effect:"officers"},{name:"Sivil güvenliği önceliklendir",effect:"aid"}]],
 ["al","1944-01-01","Armia Ludowa'nın kuruluşu","Gwardia Ludowa, Armia Ludowa adı altında yeniden örgütleniyor. Dört yol ancak alternatif tarih siyasetinde birer seçim olabilir.",[{name:"Sol direnişle görüş",effect:"left"},{name:"Mevcut bağları koru",effect:"caution"}]],
 ["pkw","1944-07-22","PKWN ilanı","Sovyet desteğiyle Polonya Ulusal Kurtuluş Komitesi ilan edildi. Londra'ya bağlı çevrelerle Sovyet yanlısı örgütlerin siyasi gerilimi keskinleşiyor.",[{name:"Sovyet yanlısı temsilcilerle görüş",effect:"left"},{name:"Londra ile bağı koru",effect:"london"}]],
 ["uprising1944","1944-08-01","Varşova Ayaklanması","Varşova'da büyük ayaklanma başladı. Oyunun alternatif tarihi bu olayı ve sonuçlarını değiştirebilir.",[{name:"Sivil halkı korumayı önceliklendir",effect:"aid"},{name:"Siyasi temsil konseyini topla",effect:"officers"}]]
];
function applyEffect(s,e){
 const p=s.politics;
 switch(e){
  case "caution":s.alert=clamp(s.alert-4);for(const c of activeCells(s))c.exposure=clamp(c.exposure-3);break;
  case "aid":s.funds=Math.max(0,s.funds-20);s.legitimacy=clamp(s.legitimacy+5);regionOf(s,s.selectedRegion).support=clamp(regionOf(s,s.selectedRegion).support+3);break;
  case "investigate":s.intel=clamp(s.intel+9);s.funds=Math.max(0,s.funds-7);break;
  case "students":p.left=clamp(p.left+4);s.legitimacy=clamp(s.legitimacy+3);break;
  case "funds":s.funds+=25;s.legitimacy=clamp(s.legitimacy-2);break;
  case "london":p.london=clamp(p.london+8);s.funds+=15;break;
  case "officers":p.officers=clamp(p.officers+8);p.autonomy=clamp(p.autonomy+2);break;
  case "left":p.left=clamp(p.left+10);p.autonomy=clamp(p.autonomy+3);break;
  case "independence":s.status="won";s.ending="independent";break;
  case "restraint":s.legitimacy=clamp(s.legitimacy+4);break;
 }
}
export function answerEvent(s,index){
 if(!s.pendingEvent)return {ok:false};
 const ev=s.pendingEvent,choice=ev.choices[index];
 if(!choice)return {ok:false};
 s.eventsSeen.push(ev.id);s.pendingEvent=null;applyEffect(s,choice.effect);entry(s,ev.title+": "+choice.name,"story");
 s.nextEvent=s.ticks+(s.settings.events==="calm"?32:s.settings.events==="intense"?12:21)+Math.floor(rand(s)*9);
 return {ok:true};
}
function eventCheck(s){
 if(s.pendingEvent||s.status!=="running")return;
 for(const [id,date,title,text,choices] of [...HISTORICAL].sort((a,b)=>a[1].localeCompare(b[1]))){
  if(after(s,date)&&!s.eventsSeen.includes(id)){
   s.pendingEvent={id,title,text,choices};return;
  }
 }
 if(s.ticks>=s.nextEvent){
  const pool=EVENTS.filter(e=>e.id!=="london"||after(s,"1940-03-01"));
  const ev=pick(s,pool);s.pendingEvent={...ev};return;
 }
}
function warWeek(s){
 if(!s.war.started)return;
 const year=Number(s.date.slice(0,4));
 const historicTarget=year<=1941?54:year===1942?75:year===1943?51:year===1944?20:-6;
 const alternativeTarget=s.war.sovietVictory?historicTarget:(year>=1943?78:historicTarget);
 const deviation=(s.settings.history==="historical"?0:s.settings.chaos/100);
 const noise=(rand(s)-.5)*7*deviation;
 const localImpact=s.war.sabotagePressure*.035+Math.max(0,influence(s)-35)*.012;
 s.war.germanAdvance=clamp(s.war.germanAdvance+(alternativeTarget-s.war.germanAdvance)*.045+noise-localImpact,0,100);
 s.war.sabotagePressure=clamp(s.war.sabotagePressure-2);
 s.war.phase=s.war.germanAdvance>66?"Alman ilerleyişi":s.war.germanAdvance>35?"Cephe dengesi":s.war.germanAdvance>8?"Sovyet karşı taarruzu":"Alman geri çekilişi";
 if(s.settings.history==="alternate"&&s.war.sovietVictory===false&&year>=1944&&s.war.germanAdvance>60){
  s.war.phase="Doğu cephesinde Alman üstünlüğü";
 }
}
function week(s){
 const active=activeCells(s),diff=DIFFICULTIES[s.settings.difficulty];
 const factories=s.assets.filter(a=>a.type==="factory").length;
 // Diminishing returns prevent unlimited resource production by adding buildings.
 const factoryIncome=Math.floor(14*(1-Math.exp(-factories/6)));
 const factorySupply=Math.floor(8*(1-Math.exp(-factories/6)));
 s.funds+=Math.floor(9+active.length*1.7)+factoryIncome;
 s.supplies=clamp(s.supplies+2+factorySupply,0,1000);
 if(s.politics.path==="ak_london"){s.funds+=3;s.intel=clamp(s.intel+2);}
 if(s.politics.path==="ak_independent"){s.morale=clamp(s.morale+1);}
 if(s.politics.path==="al_independent"){s.legitimacy=clamp(s.legitimacy+.3);}
 if(s.politics.path==="al_soviet"){s.supplies=clamp(s.supplies+2,0,1000);s.intel=clamp(s.intel+1);}
 s.intel=clamp(s.intel-1,0,100);
 s.alert=clamp(s.alert-1);
 let support=0;
 for(const r of Object.values(s.regions)){
  const effects=assetEffects(s,r.id);
  const membersHere=active.filter(c=>c.region===r.id).reduce((n,c)=>n+c.members,0);
  r.support=clamp(r.support+effects.support*.20+(membersHere>0?.12:0)-r.heat*.004);
  r.influence=clamp(r.influence+(r.support-r.influence)*.016+Math.min(1,membersHere/70)*.14+effects.recruitment*.06);
  r.heat=clamp(r.heat-1+Math.max(0,r.influence-50)*.012);
  support+=r.support;
 }
 s.legitimacy=clamp(s.legitimacy+(support/Object.keys(s.regions).length-28)*.011);
 // Occupation authorities periodically uncover institutions. Visibility has real effects.
 for(const a of [...s.assets]){
  const r=regionOf(s,a.region);
  const raidChance=institutionRaidRisk(s,a);
  if(rand(s)<raidChance){
    a.raids=(a.raids||0)+1;r.heat=clamp(r.heat+5);s.alert=clamp(s.alert+3);
    for(const c of active.filter(c=>c.region===r.id))c.exposure=clamp(c.exposure+4);
    if(rand(s)<.35){
      s.assets=s.assets.filter(x=>x.id!==a.id);
      entry(s,r.name+": "+INSTITUTIONS[a.type].name+" bağlantısı baskında kaybedildi.","danger");
    }else entry(s,r.name+": "+INSTITUTIONS[a.type].name+" bağlantısına yönelik baskın atlatıldı.","danger");
  }
 }
 for(const c of active){
  c.fatigue=clamp(c.fatigue-5);
  c.exposure=clamp(c.exposure-3+Math.max(0,regionOf(s,c.region).heat-50)*.06);
  // Weekly recruit trickle from regional support and social institutions (bounded).
  const eff=assetEffects(s,c.region);
  if(rand(s)<(regionOf(s,c.region).support/180+eff.recruitment*.07)*diff.growth)c.members+=1;
  const crackdown=.008+(.00026*regionOf(s,c.region).heat)+(.00024*c.exposure);
  if(rand(s)<crackdown*diff.risk*CENT_LEVELS[s.centralization-1].exposure){
    const losses=Math.max(1,Math.floor(c.members*(.05+rand(s)*.12)));
    c.members=Math.max(0,c.members-losses);s.records.arrests+=losses;s.alert=clamp(s.alert+2);
    entry(s,c.name+" hücresine baskın: "+losses+" tutuklama.","danger");
    if(c.members===0){c.destroyed=true;entry(s,c.name+" tasfiye edildi.","danger")}
  }
 }
 if(s.settings.autoOrders&&s.milestones.includes("founding")){
  const delegated=active.filter(c=>c.commander&&!c.busyUntil);
  const limit=Math.floor(Math.min(8,delegated.length)*CENT_LEVELS[s.centralization-1].delegate);
  for(const c of delegated.slice(0,limit)){
   const op=OPERATIONS.find(o=>o.id===c.order);
   if(op&&s.funds>op.cost+30&&s.supplies>=op.supply&&(!s.pendingEvent||rand(s)>.4)){
    const r=scheduleOperation(s,op.id,c.id);if(r.ok)r.item.automated=true;
   }
  }
 }
 warWeek(s);
}
function checkEnding(s){
 if(s.status!=="running")return;
 if(activeCells(s).length===0||s.legitimacy<=0){
  s.status="suppressed";entry(s,"Yeraltı örgütünün kalan ağı tasfiye edildi. Yeniden yapılanma seçeneği açık.","danger");
  return;
 }
 if(s.war.started&&after(s,"1945-05-09")&&s.war.sovietVictory){
  s.status="won";s.ending=s.politics.path==="al_soviet"?"soviet_integrated":s.politics.path==="al_independent"?"left_independent":s.politics.path==="ak_london"?"exile_conflict":"ambiguous_liberation";
  entry(s,"Avrupa savaşı sona erdi; örgütün siyasi geleceği seçtiği yola bağlı.","story");
 }
 if(s.war.started&&after(s,"1946-01-01")&&!s.war.sovietVictory){
  s.status="won";s.ending="survival";
  entry(s,"Doğu cephesinin farklı sonucu, direnişi yeni bir döneme taşıdı.","story");
 }
}
export function advanceDays(s,count=1){
 if(s.status!=="running")return;
 for(let i=0;i<Math.max(1,Math.min(365,Math.floor(count)));i++){
  if(s.pendingEvent||s.status!=="running")break;
  addDay(s);s.ticks++;s.records.days++;
  if(!s.war.started&&after(s,"1941-06-22")){s.war.started=true;s.war.phase="Barbarossa";s.war.germanAdvance=4;entry(s,"22 Haziran 1941: Almanya SSCB'ye saldırdı.","story")}
  for(const o of s.operations){if(!o.result&&o.completeAt<=s.ticks)resolveOperation(s,o)}
  if(s.ticks%7===0)week(s);
  if(s.ticks%365===0)entry(s,"Örgüt varlığını bir yıl daha sürdürdü.","story");
  eventCheck(s);checkEnding(s);
 }
}
export function regroup(s){
 if(s.status!=="suppressed")return {ok:false};
 const months=4+Math.floor(rand(s)*15),old=s.records.restarts;
 const retained=JSON.parse(JSON.stringify(s.settings));retained.seed=s.seed;
 const fresh=createGame(retained);
 const d=day(s);d.setUTCMonth(d.getUTCMonth()+months);
 fresh.date=d.toISOString().slice(0,10);
 fresh.ticks=s.ticks+months*30;fresh.records={...s.records,restarts:old+1};
 fresh.funds=Math.max(75,Math.round(s.funds*.35)+80);
 fresh.cells=fresh.cells.slice(0,3).map(c=>({...c,members:5+Math.floor(rand(fresh)*5),exposure:17}));
 fresh.legitimacy=22;fresh.alert=30;
 fresh.milestones=[];fresh.eventsSeen=[...new Set(s.eventsSeen)];
 fresh.war={...s.war};
 if(after(fresh,"1941-06-22"))fresh.war.started=true;
 entry(fresh,months+" aylık gizlilik döneminin ardından örgüt yeniden kuruldu.","story");
 return {ok:true,state:fresh,months};
}
export function summary(s){return {date:s.date,days:s.records.days,cells:activeCells(s).length,members:members(s),influence:influence(s),successful:s.records.successful,failed:s.records.failed,arrests:s.records.arrests,restarts:s.records.restarts,path:s.politics.path,ending:s.ending}}
export const LEGACY_REGION_IDS={
 mazowieckie:"warszawskie",lodzkie:"lodzkie",malopolskie:"krakowskie",lubelskie:"lubelskie",
 swietokrzyskie:"kieleckie",podkarpackie:"lwowskie",slaskie:"slaskie",
 wielkopolskie:"poznanskie","kujawsko-pomorskie":"pomorskie",pomorskie:"pomorskie",
 "warminsko-mazurskie":"bialostockie",podlaskie:"bialostockie",
 lubuskie:"poznanskie",dolnoslaskie:"slaskie",opolskie:"slaskie","zachodniopomorskie":"pomorskie"
};
export function migrateSave(old){
 if(!old||!old.regions||!old.settings||!Array.isArray(old.cells))return null;
 if(old.version===2&&old.regions.warszawskie)return old;
 if(old.version!==1)return null;
 const fresh=createGame({...old.settings,seed:old.seed||1});
 const regions=fresh.regions,ids=new Set(Object.keys(regions));
 const convert=id=>ids.has(id)?id:LEGACY_REGION_IDS[id]||"warszawskie";
 const seen=new Set();
 for(const [id,r] of Object.entries(old.regions)){
  const key=convert(id);
  if(!seen.has(key)){
   regions[key]={...regions[key],influence:clamp(r.influence),support:clamp(r.support),heat:clamp(r.heat),security:clamp(r.security)};
   seen.add(key);
  }
 }
 const v={...fresh,...old,version:2,regions,selectedRegion:convert(old.selectedRegion),
 selectedDistrict:"",selectedBuilding:null,
 cells:old.cells.map(c=>({...c,region:convert(c.region)})),
 assets:(old.assets||[]).map(a=>({...a,region:convert(a.region),legacy:true})),
 operations:(old.operations||[]).map(o=>({...o,region:convert(o.region)})),
 settings:{...fresh.settings,...old.settings},log:(old.log||[]).slice(0,240)};
 entry(v,"Önceki kayıt, 1939 dönemi şematik haritasına taşındı. Eski OSM yapıları şematik kurumlar olarak korundu.");
 return v;
}
export function validateSave(v){
 return !!(v&&(v.version===1||v.version===2)&&typeof v.date==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v.date)&&Array.isArray(v.cells)&&Array.isArray(v.assets)&&v.regions&&v.settings&&v.war&&v.records&&v.politics&&Array.isArray(v.operations)&&Array.isArray(v.milestones));
}

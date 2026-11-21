
import {after,clamp,activeCells,entry} from "./engine.js";
/* Dated organizations, not anachronistic selectable states. Dates denote first established existence. */
export const ORGANIZATIONS=[
 {id:"pps_wrn",name:"PPS–WRN / Gwardia Ludowa WRN",date:"1939-10-01",side:"socialists",note:"Komünist GL (PPR) ile karıştırmayın. 1939'daki sosyalist örgüt."},
 {id:"zwz",name:"Związek Walki Zbrojnej (ZWZ)",date:"1939-11-13",side:"london",note:"Sürgün hükümetine bağlı ve SZP'nin mirasını devralan askerî örgüt."},
 {id:"now",name:"Narodowa Organizacja Wojskowa (NOW)",date:"1939-10-13",side:"nationalists",note:"Milliyetçi askerî yeraltı örgütü."},
 {id:"roch",name:"Stronnictwo Ludowe ‘Roch’",date:"1940-01-01",side:"rural",note:"Köylü hareketinin gizli siyasi ağı."},
 {id:"left_small",name:"Dağınık komünist çevreler",date:"1939-12-01",side:"left",note:"1940'ta PPR değil, küçük ve dağınık komünist çevreler."},
 {id:"pkp",name:"Polityczny Komitet Porozumiewawczy (PKP)",date:"1940-02-01",side:"london",note:"Şubat 1940'tan itibaren partiler arası siyasi eşgüdüm."},
 {id:"chlostra",name:"Chłopska Straż (Chłostra)",date:"1940-08-01",side:"rural",note:"Köylü hareketinin silahlı yapısı; sonradan BCh adı."},
 {id:"delegatura",name:"Delegatura Rządu na Kraj",date:"1940-12-01",side:"london",note:"İşgal altındaki ülkeye yönelik sürgün hükümeti temsilciliği."},
 {id:"ppr",name:"Polska Partia Robotnicza (PPR)",date:"1942-01-05",side:"left",note:"5 Ocak 1942'de kurulan komünist parti."},
 {id:"ak",name:"Armia Krajowa (AK)",date:"1942-02-14",side:"london",note:"14 Şubat 1942'de ZWZ yeniden adlandırıldı."},
 {id:"gl_ppr",name:"Gwardia Ludowa (PPR)",date:"1942-03-28",side:"left",note:"28 Mart 1942'de kurulan PPR silahlı örgütü; GL WRN değil."},
 {id:"nsz",name:"Narodowe Siły Zbrojne (NSZ)",date:"1942-09-20",side:"nationalists",note:"1942 sonbaharından itibaren milliyetçi silahlı yeraltı oluşumu."},
 {id:"krn",name:"Krajowa Rada Narodowa (KRN)",date:"1944-01-01",side:"left",note:"1944 başında kurulan rakip siyasi konsey."},
 {id:"al",name:"Armia Ludowa (AL)",date:"1944-01-01",side:"left",note:"Tarihsel kuruluş. 1942'de çıkarsa açıkça alternatif tarih olarak gösterilir."}
];
export const CONTACTS=[
 {id:"left",name:"Komünist çevreler",field:"left",boost:10,cost:15,from:"1939-12-01",hint:"1940'ta PPR adı yoktur. 1942'de erken AL seçeneğini hazırlayabilir."},
 {id:"london",name:"Sürgün hükümeti temsilcileri",field:"london",boost:9,cost:12,from:"1940-01-01",hint:"Hükümete bağlılığı ve dış temasları güçlendirir."},
 {id:"officers",name:"Eski ordu komutanları",field:"officers",boost:9,cost:12,from:"1940-01-01",hint:"Özerk askerî komutayı güçlendirir."},
 {id:"socialists",name:"PPS–WRN sosyalistleri",field:"socialists",boost:9,cost:12,from:"1940-01-01",hint:"Komünist PPR'den ayrı sosyalist yeraltı ağı."},
 {id:"rural",name:"SL ‘Roch’ köylü çevreleri",field:"rural",boost:9,cost:12,from:"1940-01-01",hint:"Kırsal örgütlenme ile sivil dayanışma."},
 {id:"nationalists",name:"NOW ve milliyetçi çevreler",field:"nationalists",boost:9,cost:12,from:"1940-01-01",hint:"Milliyetçi yeraltı temsilcileri."}
];
export function currentOrganizations(s){
 return ORGANIZATIONS.filter(o=>after(s,o.date)).filter(o=>o.id!=="zwz"||!after(s,"1942-02-14")).filter(o=>o.id!=="gl_ppr"||!after(s,"1944-01-01")).filter(o=>o.id!=="left_small"||!after(s,"1942-01-05"));
}
export function contactFaction(s,id){
 const f=CONTACTS.find(x=>x.id===id);
 if(!f||!after(s,f.from)||s.status!=="running")return {ok:false,why:"Bu çevre bu tarihte aktif değil."};
 if(s.funds<f.cost)return {ok:false,why:"Yeterli kaynak yok."};
 s.politics.contacts??={};
 if(s.ticks-(s.politics.contacts[id]??-999)<28)return {ok:false,why:"Aynı çevreyle görüşmek için 28 gün geçmeli."};
 s.politics.contacts[id]=s.ticks;s.funds-=f.cost;
 s.politics[f.field]=clamp((s.politics[f.field]||0)+f.boost);
 if(id==="left"){s.politics.london=clamp(s.politics.london-2);s.politics.officers=clamp(s.politics.officers-2);}
 if(id==="officers")s.politics.autonomy=clamp(s.politics.autonomy+2);
 if(id==="london")s.politics.autonomy=clamp(s.politics.autonomy-2);
 if(id==="rural")s.legitimacy=clamp(s.legitimacy+1);
 entry(s,"Siyasi görüşme: "+f.name);return {ok:true};
}
export function politicalIdentity(s){
 if(s.politics.path){
  const labels={ak_london:"Londra'ya bağlı Armia Krajowa",ak_independent:"Bağımsız Armia Krajowa (alternatif)",al_independent:"Bağımsız Armia Ludowa (alternatif)",al_soviet:"Sovyetlerle bütünleşik Armia Ludowa"};
  return labels[s.politics.path]||"Yeraltı direnişi";
 }
 return after(s,"1942-02-14")?"AK bağlantılı yerel ağ":"ZWZ bağlantılı yerel ağ";
}
export function earlyALStatus(s){
 return {dateOK:after(s,"1942-03-28"),alternate:s.settings.history==="alternate",left:s.politics.left,network:s.milestones.includes("left_network"),cells:activeCells(s).length,unlocked:s.milestones.includes("early_al")};
}

/**
 * Historic building registry. Every entry has a source linking a specific
 * building and its pre-1940 existence. These are NOT verified cadastral polygons.
 *
 * A verified old building is not automatically an accessible clandestine asset.
 * Restricted, requisitioned and destroyed sites are not usable. Date-based
 * restrictions below follow referenced museum / archive documentation.
 * All gameplay costs, effects and accessibility for other sites are fictional.
 */
export const VERIFIED_SITES={
 Warszawa:{region:"warszawskie",archive:"warszawa",buildings:[
  {id:"teatr-wielki",name:"Teatr Wielki",address:"pl. Teatralny 1/3",lat:52.2436,lon:21.0108,type:"cultural",built:"1825–1833",source:"https://www.warszawa1939.pl/obiekt/teatr-wielki",note:"1833'te tamamlandı; savaş sırasında yıkıma uğradı."},
  {id:"palac-staszica",name:"Pałac Staszica",address:"Nowy Świat 72",lat:52.2382,lon:21.0197,type:"cultural",built:"1820–1823",source:"https://www.warszawa1939.pl/obiekt/palac-staszica",note:"Savaş öncesinde bilim ve araştırma kurumları barındırıyordu."},
  {id:"palac-saski",name:"Pałac Saski",address:"pl. Piłsudskiego 3/5/7",lat:52.2412,lon:21.0102,type:"historic",built:"17. yy; 19. yy yeniden yapım",source:"https://www.warszawa1939.pl/obiekt/palac-saski",note:"Savaş öncesi Polonya Genelkurmay karargâhı; Aralık 1944'te yıkıldı.",claimable:false,statusPeriods:[{from:"1940-01-01",state:"restricted",reason:"Tarihî askerî karargâh, rastgele hücre evine dönüştürülemez."},{from:"1944-12-01",state:"destroyed",reason:"Aralık 1944'te yıkıldı."}],statusSource:"https://www.warszawa1939.pl/obiekt/palac-saski"},
  {id:"synagoga-nozykow",name:"Synagoga Nożyków",address:"Twarda 6",lat:52.2350,lon:21.0010,type:"synagogue",built:"1898–1902",source:"https://www.warszawa1939.pl/obiekt/grzybowski-synagoga",note:"Ocak 1940'ta kapatıldı, Eylül 1941'de yeniden açıldı, Temmuz 1942'de tekrar kapatıldı.",statusPeriods:[{from:"1940-01-01",state:"closed",reason:"Ocak 1940: işgal makamlarınca kapatıldı."},{from:"1941-09-01",state:"open",reason:"Eylül 1941: ibadete yeniden açıldı."},{from:"1942-07-01",state:"occupied",reason:"Temmuz 1942: kapatıldı; daha sonra Almanlar ahır/yem deposu olarak kullandı."}],statusSource:"https://www.jhi.pl/en/articles/three-synagogues%2C13"},
  {id:"kosciol-sw-anny",name:"Kościół św. Anny",address:"Krakowskie Przedmieście 68",lat:52.2460,lon:21.0143,type:"church",built:"15. yy, sonraki rekonstrüksiyonlar",source:"https://www.warszawa1939.pl/obiekt/krakowskie-68",note:"Savaş öncesi tarihsel kilise ve Bernardinler manastır kompleksi."},
  {id:"archikatedra-sw-jana",name:"Archikatedra św. Jana",address:"Świętojańska 8",lat:52.2489,lon:21.0125,type:"church",built:"Ortaçağ; sonraki yeniden yapımlar",source:"https://www.warszawa1939.pl/obiekt/swietojanska-8",note:"Savaş öncesi katedral; savaşın sonlarında ağır hasar gördü."},
  {id:"muzeum-narodowe",name:"Muzeum Narodowe",address:"al. 3 Maja 13",lat:52.2315,lon:21.0244,type:"cultural",built:"1927–1938",source:"https://www.warszawa1939.pl/obiekt/3maja-13",note:"Yeni müze binası 18 Haziran 1938'de resmen açıldı."},
  {id:"zamek-krolewski",name:"Zamek Królewski",address:"pl. Zamkowy",lat:52.2477,lon:21.0148,type:"historic",built:"Tarihsel saray kompleksi",source:"https://www.warszawa1939.pl/obiekt/zamek-krolewski",note:"17 Eylül 1939 yangını; Eylül 1944'te tamamen yıkıldı.",claimable:false,statusPeriods:[{from:"1940-01-01",state:"restricted",reason:"Eylül 1939'daki ağır hasar nedeniyle kullanılabilir bir hücre evi sayılamaz."},{from:"1944-09-01",state:"destroyed",reason:"Eylül 1944'te yıkıldı."}],statusSource:"https://zamek-krolewski.pl/en/strona/your-visit/1212-royal-castle-destruction-reconstruction"},
  {id:"kosciol-sw-krzyza",name:"Kościół św. Krzyża",address:"Krakowskie Przedmieście 1",lat:52.2395,lon:21.0177,type:"church",built:"1682–1696",source:"https://www.warszawa1939.pl/obiekt/krakowskie-1",note:"Savaş öncesinde mevcut; 17. yy taş kilisesi."}
 ]},
 "Łódź":{region:"lodzkie",archive:"lodz",buildings:[
  {id:"palac-poznanskiego",name:"Pałac Izraela Poznańskiego",address:"Ogrodowa 15",lat:51.779,lon:19.452,type:"cultural",built:"1888–1903",source:"https://www.ikw.uni.lodz.pl/strefa-pracownika/badania/nowe-media-prl/lodz-sladami-dedeciusa",note:"1888–1903 inşa edildi; dönem fabrika ailesi sarayı."},
  {id:"biala-fabryka",name:"Biała Fabryka Ludwika Geyera",address:"Piotrkowska 282",lat:51.750,lon:19.460,type:"factory",built:"1835–1838",source:"https://www.cmwl.pl/public/informacje/biala-fabryka%2C27",note:"1835–1838 tarihli sanayi kompleksi; II. Dünya Savaşı'nda Alman yönetimine geçti."},
  {id:"grand-hotel",name:"Grand Hotel",address:"Piotrkowska 72",lat:51.767,lon:19.457,type:"hotel",built:"1872 yapı, 1888 otel",source:"https://lodz.pl/artykul/kartka-z-kalendarza-dzisiejsza-moniuszki-to-dawny-pasaz-meyera-czyli-wlasciwie-kogo-50131/",note:"1888'de otele dönüştürüldü."},
  {id:"katedra-sw-stanislawa",name:"Katedra św. Stanisława Kostki",address:"Piotrkowska 265",lat:51.750,lon:19.457,type:"church",built:"1901–1912, kule 1927",source:"https://www.katedra.lodz.pl/historia/",note:"9 Kasım 1941: Gestapo değerli eşyalara el koydu, askerî depo olarak kullanıldı.",statusPeriods:[{from:"1941-11-09",state:"occupied",reason:"Gestapo tarafından askerî depoya dönüştürüldü."}],statusSource:"https://www.archidiecezja.lodz.pl/parafia/swietego-stanislawa-kostki"},
  {id:"palac-scheiblera",name:"Pałac Karola Scheiblera",address:"pl. Zwycięstwa 1",lat:51.757,lon:19.481,type:"cultural",built:"1856; 1884–1887 tadilatı",source:"https://storymaps.arcgis.com/stories/4b018ba67f0c4c45a10b18c88dcbc417",note:"1856 inşa; 19. yüzyıl endüstri sarayı."}
 ]}
};
const key=(name,id)=>"archival/"+name+"/verified/"+id;
export function verifiedBuildingList(town){
 const city=VERIFIED_SITES[town];if(!city)return[];
 return city.buildings.map(b=>({...b,siteId:key(town,b.id),city:town,region:city.region,verifiedPrewar:true,polygonVerified:false,coordinateAccuracy:"approximate address-based point",kind:"urban"}));
}
export const PLAYABLE_REGIONS=Object.freeze([...new Set(Object.values(VERIFIED_SITES).map(v=>v.region))]);
export const PLAYABLE_CITIES=Object.freeze(Object.keys(VERIFIED_SITES));
export const VERIFIED_BUILDING_MAP=new Map(PLAYABLE_CITIES.flatMap(city=>verifiedBuildingList(city).map(site=>[site.siteId,site])));
export function getVerifiedSite(id){return VERIFIED_BUILDING_MAP.get(id)||null}
export function isPlayRegion(id){return PLAYABLE_REGIONS.includes(id)}
export function verifiedSiteCount(){return VERIFIED_BUILDING_MAP.size}
/**
 * Existence and accessibility are different. Date-limited closures only use
 * explicitly sourced historical changes; source dates are month-level where
 * exact day unknown. Other open/closed access is a gameplay abstraction.
 */
export function buildingStatusAt(site,date){
 if(!site||!site.verifiedPrewar)return{state:"unverified",claimable:false,reason:"Doğrulanmış tarihsel bina yok."};
 const periods=(site.statusPeriods||[]).filter(p=>date>=p.from).sort((a,b)=>a.from.localeCompare(b.from));
 const latest=periods.at(-1);
 if(site.claimable===false)return{state:latest?.state||"restricted",claimable:false,reason:latest?.reason||"Doğrulanmış yapı; operasyonel erişim kanıtlanmadı.",source:site.statusSource||site.source};
 if(!latest)return{state:"open",claimable:true,reason:"1940 öncesi varlığı doğrulanmış yapıda oyun amaçlı temsili kurumsal bağlantı.",source:site.source};
 return{state:latest.state,claimable:latest.state==="open",reason:latest.reason,source:site.statusSource||site.source};
}

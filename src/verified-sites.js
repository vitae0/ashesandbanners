/**
 * Pre-war existence register. All playable locations are individual historically
 * documented BUILDINGS (not parks, squares, neighborhoods, or entire villages).
 *
 * IMPORTANT: Coordinates are approximate modern reference POINTS, not cadastral
 * 1939 polygon geometry. No fabricated building shape is licensed from these points.
 *
 * The linked source establishes existence before January 1940 at the named address.
 * No record claims a real resistance cell actually occupied the building.
 */
export const VERIFIED_SITES={
 Warszawa:{
  region:"warszawskie",archive:"warszawa",
  buildings:[
   {id:"teatr-wielki",name:"Teatr Wielki",address:"pl. Teatralny 1/3",lat:52.2436,lon:21.0108,type:"press",source:"https://www.warszawa1939.pl/obiekt/teatr-wielki",note:"1833 yapımı; savaşta hasar gördü."},
   {id:"palac-staszica",name:"Pałac Staszica",address:"Nowy Świat 72",lat:52.2382,lon:21.0197,type:"school",source:"https://www.warszawa1939.pl/obiekt/palac-staszica",note:"1820–23 inşası ve savaş öncesi bilim kurumları belgeli."},
   {id:"palac-saski",name:"Pałac Saski",address:"pl. Piłsudskiego 3/5/7",lat:52.2412,lon:21.0102,type:"safehouse",source:"https://www.warszawa1939.pl/obiekt/palac-saski",note:"1939'da ordu karargâhı; Aralık 1944'te yıkıldı. Oyun temsili bağlantı tarihiyle değişmeli."},
   {id:"synagoga-nozykow",name:"Synagoga Nożyków",address:"Twarda 6",lat:52.2350,lon:21.0010,type:"church",source:"https://www.warszawa1939.pl/obiekt/grzybowski-synagoga",note:"1940 öncesi ibadethane. Oyun dinî kurum bağlantısıdır."},
   {id:"kosciol-sw-anny",name:"Kościół św. Anny",address:"Krakowskie Przedmieście 68",lat:52.2460,lon:21.0143,type:"church",source:"https://www.warszawa1939.pl/architektura/typ-obiektu",note:"Dönemin Varsova yapı kataloğunda belgeli."},
   {id:"archikatedra-sw-jana",name:"Archikatedra św. Jana",address:"Świętojańska 8",lat:52.2489,lon:21.0125,type:"church",source:"https://www.warszawa1939.pl/architektura/typ-obiektu",note:"Savaş öncesi katedral yapısı katalogda."},
   {id:"muzeum-narodowe",name:"Muzeum Narodowe",address:"al. 3 Maja 13",lat:52.2315,lon:21.0244,type:"school",source:"https://www.warszawa1939.pl/node/97627",note:"Günümüzdeki yapı 1938'de tamamlandı; 1940'da ayaktaydı."},
   {id:"zamek-krolewski",name:"Zamek Królewski",address:"pl. Zamkowy",lat:52.2477,lon:21.0148,type:"safehouse",source:"https://www.warszawa1939.pl/obiekt/zamek-krolewski",note:"1939 saldırısında ağır zarar gördü; yıkımdan önceki durumu ayrıca tarihsel olaylarla değişmeli."},
   {id:"kosciol-sw-krzyza",name:"Kościół św. Krzyża",address:"Krakowskie Przedmieście 1",lat:52.2395,lon:21.0177,type:"church",source:"https://www.warszawa1939.pl/architektura/typ-obiektu",note:"Dönem yapı kataloğunda mevcut."}
  ]
 },
 "Łódź":{
  region:"lodzkie",archive:"lodz",
  buildings:[
   {id:"palac-poznanskiego",name:"Pałac Izraela Poznańskiego",address:"Ogrodowa 15",lat:51.779,lon:19.452,type:"safehouse",source:"https://www.lodzkie.pl/%C5%82%C3%B3d%C5%BA_zabytki",note:"19. yüzyıldan kalma tarihsel saray; tarihî kültür varlığı olarak belgeli."},
   {id:"biala-fabryka",name:"Biała Fabryka Ludwika Geyera",address:"Piotrkowska 282",lat:51.750,lon:19.460,type:"factory",source:"https://www.lodzkie.pl/%C5%82%C3%B3d%C5%BA_zabytki",note:"19. yüzyıl dokuma fabrikası; 1940 öncesi endüstriyel tesis."},
   {id:"grand-hotel",name:"Grand Hotel",address:"Piotrkowska 72",lat:51.767,lon:19.457,type:"safehouse",source:"https://www.ighp.pl/katalog/szczegoly-obiektu?RecordID=126763",note:"1888'den beri faaliyet gösteren tarihsel otel."},
   {id:"katedra-sw-stanislawa",name:"Katedra św. Stanisława Kostki",address:"Piotrkowska 265",lat:51.750,lon:19.457,type:"church",source:"https://lodz-polesie.pttk.pl/wp-content/uploads/2025/01/Regulamin-odznaki-krajoznawczej-Lodz-Ziemia-Obiecana.pdf",note:"Kentin 20. yüzyıl başı katedral binası; adresi tarihî eser listesinde."},
   {id:"palac-scheiblera",name:"Pałac Karola Scheiblera",address:"pl. Zwycięstwa 1",lat:51.757,lon:19.481,type:"safehouse",source:"https://www.lodzkie.pl/%C5%82%C3%B3d%C5%BA_zabytki",note:"19. yüzyıl sanayici sarayı; dönem yapısı."}
  ]
 }
};
const key = (name,id)=>"archival/"+name+"/verified/"+id;
export function verifiedBuildingList(town){
 const city=VERIFIED_SITES[town];
 if(!city)return [];
 return city.buildings.map(b=>({...b,siteId:key(town,b.id),city:town,region:city.region,verifiedPrewar:true,polygonVerified:false,coordinateAccuracy:"approximate address-based point",kind:"urban"}));
}
export const PLAYABLE_REGIONS=Object.freeze([...new Set(Object.values(VERIFIED_SITES).map(v=>v.region))]);
export const PLAYABLE_CITIES=Object.freeze(Object.keys(VERIFIED_SITES));
export const VERIFIED_BUILDING_MAP=new Map(PLAYABLE_CITIES.flatMap(city=>verifiedBuildingList(city).map(site=>[site.siteId,site])));
export function getVerifiedSite(id){return VERIFIED_BUILDING_MAP.get(id)||null}
export function isPlayRegion(id){return PLAYABLE_REGIONS.includes(id)}
export function verifiedSiteCount(){return VERIFIED_BUILDING_MAP.size}

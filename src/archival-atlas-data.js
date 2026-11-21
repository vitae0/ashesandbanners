
/*
 * Archival CARTOGRAPHY, not reconstructed geometry.
 * All map backgrounds are original historical printed maps hosted on Wikimedia Commons.
 * UI marks are approximate location annotations, NEVER asserted cadastral polygons.
 *
 * See docs/cartographic-sources.md for primary source provenance and limitations.
 */
export const ARCHIVE={
 country:{
  title:"POLEN — Deutsches Militärkartenwerk",year:1939,
  file:"Polen 1939.jpg",width:960,height:1008,
  source:"https://commons.wikimedia.org/wiki/File:Polen_1939.jpg",
  rights:"Public domain, 1939 historical scan"
 },
 warszawa:{
  title:"Plan miasta stołecznego Warszawy",year:1935,
  file:"Warszawa 1935.png",width:960,height:1192,
  source:"https://commons.wikimedia.org/wiki/File:Warszawa_1935.png",
  rights:"Public domain; Warszawa municipal planning and survey department, 1935"
 },
 lodz:{
  title:"Plan wojewódzkiego miasta Łodzi",year:1938,
  file:"Plan wojewodzkiego miasta Lodzi. ca 1938 (35842453).jpg",width:960,height:1147,
  source:"https://commons.wikimedia.org/wiki/File:Plan_wojewodzkiego_miasta_Lodzi._ca_1938_(35842453).jpg",
  rights:"Public domain; Polona / National Library of Poland"
 }
};
export const ARCHIVE_PATH={
 "Polen 1939.jpg":"assets/maps/polen-1939.jpg",
 "Warszawa 1935.png":"assets/maps/warszawa-1935.png",
 "Plan wojewodzkiego miasta Lodzi. ca 1938 (35842453).jpg":"assets/maps/lodz-1938.jpg"
};
export const archiveUrl=file=>ARCHIVE_PATH[file]||("https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width=1600");
export const archiveFallbackUrl=file=>"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width=1600";

export const COORDINATES={
 // Verified geographic location names, not historical parcel footprints.
 Warszawa:{
  region:"warszawskie",archive:"warszawa",center:[52.237,21.011],
  landmarks:[
   ["Zamek Królewski",52.2477,21.0148,"safehouse"],
   ["Archikatedra św. Jana",52.2489,21.0125,"church"],
   ["Rynek Starego Miasta",52.2498,21.0123,"press"],
   ["Kościół św. Anny",52.2460,21.0143,"church"],
   ["Teatr Wielki",52.2436,21.0108,"press"],
   ["Pałac Saski",52.2412,21.0102,"safehouse"],
   ["Uniwersytet Warszawski",52.2400,21.0196,"school"],
   ["Kościół Świętego Krzyża",52.2395,21.0177,"church"],
   ["Pałac Staszica",52.2382,21.0197,"school"],
   ["Synagoga Nożyków",52.2350,21.0010,"church"],
   ["Bank Polski",52.2472,21.0062,"press"],
   ["Muzeum Narodowe",52.2315,21.0244,"school"],
   ["Kościół św. Aleksandra",52.2297,21.0230,"church"],
   ["Dworzec Warszawa Główna",52.2287,21.0025,"railway"],
   ["Szpital Dzieciątka Jezus",52.2268,21.0014,"hospital"]
  ],
  villages:[
   ["Łomianki",52.337,20.895],["Marki",52.322,21.105],
   ["Ząbki",52.293,21.105],["Piaseczno",52.081,21.023],
   ["Otwock",52.108,21.262]
  ]
 },
 Łódź:{
  region:"lodzkie",archive:"lodz",center:[51.759,19.457],
  landmarks:[
   ["Pałac Izraela Poznańskiego",51.779,19.452,"safehouse"],
   ["Łódź Fabryczna (dworzec przedwojenny)",51.769,19.472,"railway"],
   ["Łódź Kaliska",51.758,19.429,"railway"],
   ["Grand Hotel (Piotrkowska 72)",51.767,19.457,"safehouse"],
   ["Pałac Juliusza Heinzla",51.762,19.457,"safehouse"],
   ["Katedra św. Stanisława Kostki",51.750,19.457,"church"],
   ["Biała Fabryka",51.750,19.460,"factory"],
   ["Księży Młyn",51.756,19.486,"factory"],
   ["Szpital im. Karola Jonschera",51.744,19.486,"hospital"],
   ["Park Źródliska",51.758,19.479,"safehouse"],
   ["Plac Wolności",51.775,19.455,"press"],
   ["Cmentarz Żydowski",51.801,19.476,"church"]
  ],
  villages:[
   ["Pabianice",51.664,19.354],["Zgierz",51.855,19.406],
   ["Aleksandrów Łódzki",51.819,19.304],["Ksawerów",51.682,19.403],
   ["Rzgów",51.662,19.491]
  ]
 }
};
export function atlasKey(name){
 const k=Object.keys(COORDINATES).find(x=>x.toLocaleLowerCase("pl-PL")===String(name).toLocaleLowerCase("pl-PL"));
 return k||null;
}
export function validatedSiteList(city){
 const town=COORDINATES[city];if(!town)return [];
 return [
  ...town.landmarks.map(([name,lat,lon,type],i)=>({id:"archival/"+city+"/core/"+i,name,lat,lon,type,kind:"urban",region:town.region})),
  ...town.villages.map(([name,lat,lon],i)=>({id:"archival/"+city+"/rural/"+i,name,lat,lon,type:"safehouse",kind:"rural",region:town.region}))
 ];
}
export const CENTERED_TOWNS=Object.keys(COORDINATES);

/* Genuine WIG operational map sheets, 1:300,000, from the interwar period.
   These are regional maps (NOT building parcel geometry). Original period varies by sheet. */
export const REGIONAL_SHEETS={
 pomorskie:["Toruń",1933,"WIG Mapa Operacyjna Polski - 44 Toruń 1933.jpg"],
 poznanskie:["Poznań",1935,"WIG Mapa Operacyjna Polski - 53 Poznań 1935.jpg"],
 warszawskie:["Warszawa",1933,"WIG Mapa Operacyjna Polski - 55 Warszawa 1933.jpg"],
 lodzkie:["Łódź",1936,"WIG Mapa Operacyjna Polski - 64 Łódź 1936.jpg"],
 kieleckie:["Kielce",1928,"WIG Mapa Operacyjna Polski - 75 Kielce 1928.jpg"],
 slaskie:["Cieszyn",1934,"WIG Mapa Operacyjna Polski - 84 Cieszyn 1934.jpg"],
 krakowskie:["Kraków",1925,"WIG Mapa Operacyjna Polski - 74 Kraków 1925.jpg"],
 lubelskie:["Lublin",1932,"WIG Mapa Operacyjna Polski - 66 Lublin 1932.jpg"],
 bialostockie:["Białystok",1929,"WIG Mapa Operacyjna Polski - 46 Białystok 1929.jpg"],
 nowogrodzkie:["Nowogródek",1931,"WIG Mapa Operacyjna Polski - 47 Nowogródek 1928 1931.jpg"],
 wilenskie:["Wilno",1930,"WIG Mapa Operacyjna Polski - 37 Wilno 1930.jpg"],
 poleskie:["Pińsk",1933,"WIG Mapa Operacyjna Polski - 57 Pińsk 1933.jpg"],
 wolynskie:["Łuck",1928,"WIG Mapa Operacyjna Polski - 77 Łuck 1928.jpg"],
 lwowskie:["Lwów",1928,"WIG Mapa Operacyjna Polski - 86 Lwów 1928.jpg"],
 tarnopolskie:["Lwów / Tarnopol çevresi",1928,"WIG Mapa Operacyjna Polski - 86 Lwów 1928.jpg"],
 stanislawowskie:["Stanisławów / Czerniowce",1930,"WIG Mapa Operacyjna Polski - 97 Stanisławów-Czerniowce (Cernauti) 1930.jpg"]
};
export function regionalArchive(id){
 const row=REGIONAL_SHEETS[id];if(!row)return ARCHIVE.country;
 return {title:"WIG, arkusz "+row[0],year:row[1],file:row[2],source:"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(row[2]),rights:"Historical military cartographic sheet"};
}


/* Interwar Poland 1939. Hand-traced schematic, NOT surveyed administrative geometry.
 * Districts and buildings are representative game spaces, not cadastral records.
 */
export const MAP_POINTS={
 pomorskie:[122,142],poznanskie:[91,261],warszawskie:[243,240],
 lodzkie:[171,314],kieleckie:[245,365],slaskie:[145,405],
 krakowskie:[219,437],lubelskie:[315,310],bialostockie:[347,191],
 nowogrodzkie:[435,145],wilenskie:[426,51],poleskie:[433,270],
 wolynskie:[430,346],lwowskie:[344,414],tarnopolskie:[422,429],
 stanislawowskie:[412,474]
};
export const LABELS={
 pomorskie:"POMORZE",poznanskie:"POZNAŃ",warszawskie:"WARSZAWA",
 lodzkie:"ŁÓDŹ",kieleckie:"KIELCE",slaskie:"ŚLĄSK",
 krakowskie:"KRAKÓW",lubelskie:"LUBLIN",bialostockie:"BIAŁYSTOK",
 nowogrodzkie:"NOWOGRÓDEK",wilenskie:"WILNO",poleskie:"POLESIE",
 wolynskie:"WOŁYŃ",lwowskie:"LWÓW",tarnopolskie:"TARNOPOL",stanislawowskie:"STANISŁAWÓW"
};
export const HISTORIC_LOCATIONS={
 pomorskie:["Toruń","Bydgoszcz","Grudziądz","Tczew","Chojnice","Gdynia"],
 poznanskie:["Poznań","Gniezno","Leszno","Kalisz","Śrem","Środa"],
 warszawskie:["Warszawa","Płock","Siedlce","Pułtusk","Radzymin","Sochaczew"],
 lodzkie:["Łódź","Piotrków","Sieradz","Łask","Zgierz","Brzeziny"],
 kieleckie:["Kielce","Radom","Częstochowa","Sandomierz","Opatów","Ostrowiec"],
 slaskie:["Katowice","Chorzów","Pszczyna","Rybnik","Bielsko","Cieszyn"],
 krakowskie:["Kraków","Tarnów","Nowy Sącz","Wadowice","Bochnia","Żywiec"],
 lubelskie:["Lublin","Zamość","Chełm","Puławy","Kraśnik","Biała Podlaska"],
 bialostockie:["Białystok","Grodno","Łomża","Suwałki","Augustów","Sokółka"],
 nowogrodzkie:["Nowogródek","Baranowicze","Lida","Słonim","Nieśwież","Stołpce"],
 wilenskie:["Wilno","Oszmiana","Święciany","Brasław","Postawy","Mołodeczno"],
 poleskie:["Brześć nad Bugiem","Pińsk","Kobryń","Drohiczyn","Łuniniec","Stolin"],
 wolynskie:["Łuck","Równe","Kowel","Dubno","Krzemieniec","Włodzimierz"],
 lwowskie:["Lwów","Przemyśl","Sambor","Drohobycz","Rzeszów","Jarosław"],
 tarnopolskie:["Tarnopol","Złoczów","Buczacz","Brody","Czortków","Zaleszczyki"],
 stanislawowskie:["Stanisławów","Kołomyja","Stryj","Kałusz","Nadwórna","Horodenka"]
};
export const OUTLINE="M14 200 L30 178 52 173 49 150 82 124 95 89 115 74 119 45 132 40 143 55 148 94 163 105 193 109 216 105 227 71 240 70 259 84 284 57 303 75 323 80 337 52 354 21 376 27 400 14 423 5 458 8 490 14 491 38 480 56 463 66 456 93 466 125 461 145 478 170 488 193 481 217 499 248 487 273 505 310 497 333 492 357 489 390 505 434 490 445 472 465 470 493 451 500 420 488 401 473 384 483 350 466 323 476 302 454 289 458 265 441 252 450 233 423 214 425 202 408 187 415 172 392 157 392 145 371 132 382 116 376 99 366 84 372 69 346 58 350 51 326 39 318 40 295 26 283 33 259 17 247 22 222 11 211 Z";
const OCCUPATION_1940={
 pomorskie:"annexed",poznanskie:"annexed",warszawskie:"general",
 lodzkie:"annexed",kieleckie:"general",slaskie:"annexed",
 krakowskie:"general",lubelskie:"general",bialostockie:"soviet",
 nowogrodzkie:"soviet",wilenskie:"soviet",poleskie:"soviet",
 wolynskie:"soviet",lwowskie:"soviet",tarnopolskie:"soviet",stanislawowskie:"soviet"
};
export function periodOccupation(date,id){
 const original=OCCUPATION_1940[id]||"general";
 if(date<"1941-06-22")return original;
 if(date<"1944-01-01")return original==="soviet"?"german":original;
 return "contested";
}
function halfPlane(poly,p,q){
 const nx=q[0]-p[0],ny=q[1]-p[1],cut=(q[0]**2+q[1]**2-p[0]**2-p[1]**2)/2;
 const value=v=>nx*v[0]+ny*v[1]-cut,inside=v=>value(v)<=1e-7;
 let out=[];
 for(let i=0;i<poly.length;i++){
  const a=poly[i],b=poly[(i+1)%poly.length],va=value(a),vb=value(b);
  const intersection=()=>{const t=va/(va-vb||1);return[a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]};
  if(inside(a)&&inside(b))out.push(b);
  else if(inside(a)&&!inside(b))out.push(intersection());
  else if(!inside(a)&&inside(b))out.push(intersection(),b);
 }
 return out;
}
export function provinceCells(){
 return Object.entries(MAP_POINTS).map(([id,p])=>{
  let vertices=[[0,0],[512,0],[512,512],[0,512]];
  for(const [other,q] of Object.entries(MAP_POINTS))if(other!==id)vertices=halfPlane(vertices,p,q);
  return{id,vertices,points:vertices.map(v=>v.map(x=>x.toFixed(2)).join(",")).join(" ")};
 });
}
export const CELLS=provinceCells();
export function hash(str){
 let h=2166136261;for(const c of String(str)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return h>>>0;
}

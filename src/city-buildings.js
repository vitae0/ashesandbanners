/**
 * Verified city-site model for the live polygon map. No raster-map imports.
 * These points are source-cited address positions, NOT building footprints.
 */
import {INSTITUTIONS} from "./engine.js";
import {VERIFIED_SITES,PLAYABLE_CITIES,verifiedBuildingList,getVerifiedSite} from "./verified-sites.js";

export function cityBuildings(region,city){
 const key=PLAYABLE_CITIES.find(n=>n.toLocaleLowerCase("pl-PL")===String(city).toLocaleLowerCase("pl-PL"));
 if(!key||VERIFIED_SITES[key]?.region!==region)return [];
 return verifiedBuildingList(key).filter(site=>site.verifiedPrewar&&getVerifiedSite(site.siteId)).map((site,i)=>({
  osmId:site.siteId,name:site.name,lat:site.lat,lon:site.lon,region:site.region,
  city:key,kind:site.type,allowed:[site.type],
  visibility:getVerifiedSite(site.siteId)?.visibilityOverride??(INSTITUTIONS[site.type]?.visibility||.35),
  source:site.source,sourceAddress:site.address,verifiedPrewar:true,polygonVerified:false,
  zone:"urban",index:i
 }));
}

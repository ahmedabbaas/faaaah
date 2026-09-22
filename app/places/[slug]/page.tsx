"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageChrome from "../../components/PageChrome";
import LiveNewsFeed from "../../components/LiveNewsFeed";

const PLACE_DATA:Record<string,{name:string;country:string;region:string;tagline:string;lat:number;lng:number;facts:string[];topics:string[]}> = {
 karachi:{name:"Karachi",country:"Pakistan",region:"Sindh",tagline:"A major coastal metropolis on the Arabian Sea.",lat:24.86,lng:67.01,facts:["Pakistan's largest city by population in common contemporary references.","Major port, commercial and cultural center.","Gateway to southern Pakistan."],topics:["History","Culture","Business","Sports"]},
 lahore:{name:"Lahore",country:"Pakistan",region:"Punjab",tagline:"A historic city shaped by architecture, scholarship and culture.",lat:31.52,lng:74.35,facts:["Major cultural and educational center.","Historic Lahore Fort and Walled City define part of its heritage.","Large metropolitan center in Punjab."],topics:["History","Culture","Arts","Education"]},
 islamabad:{name:"Islamabad",country:"Pakistan",region:"Islamabad Capital Territory",tagline:"A planned capital framed by the Margalla Hills.",lat:33.69,lng:73.06,facts:["Capital city of Pakistan.","Planned urban layout with large green spaces.","Located near the Margalla Hills."],topics:["Government","Nature","Geography","Culture"]},
 london:{name:"London",country:"United Kingdom",region:"England",tagline:"A historic global city on the River Thames.",lat:51.51,lng:-0.13,facts:["Capital of the United Kingdom.","Major global cultural and financial center.","Historic landmarks span many centuries."],topics:["History","Culture","Business","Arts"]},
 "new-york":{name:"New York",country:"United States",region:"New York",tagline:"A dense global metropolis on the Atlantic coast.",lat:40.71,lng:-74.01,facts:["Major global city in the United States.","Known for finance, media, arts and diverse neighborhoods.","Includes five boroughs."],topics:["Business","Culture","Arts","Technology"]},
 tokyo:{name:"Tokyo",country:"Japan",region:"Kanto",tagline:"A highly connected megacity and major economic center.",lat:35.68,lng:139.69,facts:["Capital of Japan.","One of the world's major metropolitan areas.","Known for dense rail networks and technology."],topics:["Technology","Culture","Business","Food"]},
 paris:{name:"Paris",country:"France",region:"Île-de-France",tagline:"A historic capital known for art, architecture and culture.",lat:48.86,lng:2.35,facts:["Capital of France.","Major center for art, fashion and culture.","Historic urban core along the Seine."],topics:["Arts","History","Culture","Food"]},
 dubai:{name:"Dubai",country:"United Arab Emirates",region:"Dubai",tagline:"A Gulf metropolis shaped by trade, transport and rapid urban development.",lat:25.20,lng:55.27,facts:["Major city in the United Arab Emirates.","Important global aviation and business hub.","Rapid urban growth transformed its skyline."],topics:["Business","Technology","Architecture","Travel"]},
};

export default function PlacePage(){
 const params=useParams<{slug:string}>();
 const place=PLACE_DATA[params.slug];
 const [saved,setSaved]=useState(false);
 useEffect(()=>{setSaved(localStorage.getItem("globalpedia_places")?.split("|").includes(params.slug)||false)},[params.slug]);
 const save=()=>{const current=(localStorage.getItem("globalpedia_places")||"").split("|").filter(Boolean);const next=saved?current.filter(x=>x!==params.slug):[...new Set([...current,params.slug])];localStorage.setItem("globalpedia_places",next.join("|"));setSaved(!saved);};
 if(!place) return <PageChrome><section className="pageHero compactHero"><h1>Place not found.</h1><p>Try the World Atlas directory.</p><Link href="/atlas">Back to Atlas ↗</Link></section></PageChrome>;
 return <PageChrome>
  <section className="pageHero placeHero"><span className="heroTag">GLOBALPEDIA · PLACE PROFILE</span><h1>{place.name}, <em>{place.country}</em></h1><p>{place.tagline}</p><div className="placeHeroActions"><Link href={"/earth?city="+encodeURIComponent(place.name)}>Open on Earth ↗</Link><button onClick={save}>{saved?"Saved to My Places":"Save place"}</button></div></section>
  <section className="placePage sectionWrap">
   <div className="placeFacts">{place.facts.map((f,i)=><article key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{f}</p></article>)}</div>
   <div className="placeTopics"><span>CONNECTED TOPICS</span>{place.topics.map(t=><Link key={t} href={"/explore?category="+encodeURIComponent(t)}>{t} ↗</Link>)}</div>
   <div className="placeLower"><div><h2>Explore the context</h2><p>Use GlobalPedia's Earth, graph and data layers to move beyond a single city summary.</p><div className="placeLinks"><Link href="/graph">Knowledge Graph ↗</Link><Link href="/data">World Data ↗</Link><Link href="/timeline">Timeline ↗</Link></div></div><div className="placeCoords"><span>COORDINATES</span><strong>{place.lat.toFixed(2)}°, {place.lng.toFixed(2)}°</strong><small>{place.region}</small></div></div>
  </section>
  <LiveNewsFeed mode="countries" title={place.name+" context feed"} subtitle="Current country and regional headlines. Open the publisher source for full reporting." limit={6}/>
 </PageChrome>;
}
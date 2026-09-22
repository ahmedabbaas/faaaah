"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

const places=[
  ["karachi","Karachi","Pakistan","Sindh","Arabian Sea megacity"],
  ["lahore","Lahore","Pakistan","Punjab","Historic cultural center"],
  ["islamabad","Islamabad","Pakistan","Islamabad Capital Territory","Planned capital city"],
  ["london","London","United Kingdom","England","Global cultural and financial city"],
  ["new-york","New York","United States","New York","Major Atlantic metropolis"],
  ["tokyo","Tokyo","Japan","Kanto","Highly connected megacity"],
  ["paris","Paris","France","Île-de-France","Historic European capital"],
  ["dubai","Dubai","United Arab Emirates","Dubai","Global transport and business hub"],
];

export default function AtlasPage(){
 const [q,setQ]=useState("");
 const filtered=useMemo(()=>places.filter(p=>p.join(" ").toLowerCase().includes(q.toLowerCase())),[q]);
 return <PageChrome>
  <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · WORLD ATLAS</span><h1>Go from <em>planet to place.</em></h1><p>Use the 3D Earth for geography, then jump into a place profile for history, people, culture and live context.</p></section>
  <section className="atlasPage sectionWrap">
    <div className="atlasHeroGrid">
      <Link href="/earth" className="atlasFeature"><span>03D EARTH</span><h2>Rotate the planet.</h2><p>Country and city exploration with a dedicated interactive globe.</p><b>Open Earth ↗</b></Link>
      <Link href="/data" className="atlasFeature"><span>WORLD DATA</span><h2>Compare places.</h2><p>Population and area context across country profiles.</p><b>Open Data ↗</b></Link>
      <Link href="/graph" className="atlasFeature"><span>KNOWLEDGE GRAPH</span><h2>Follow the connections.</h2><p>Move from a place to topics, people and events.</p><b>Open Graph ↗</b></Link>
    </div>
    <div className="atlasSearch"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a city or place…" /></div>
    <div className="placeGrid">{filtered.map(p=><Link href={"/places/"+p[0]} key={p[0]} className="placeCard"><span>{p[2]} · {p[3]}</span><h2>{p[1]}</h2><p>{p[4]}</p><b>Explore place ↗</b></Link>)}</div>
  </section>
 </PageChrome>
}
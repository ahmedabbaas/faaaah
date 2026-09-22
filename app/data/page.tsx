"use client";

import { useEffect, useMemo, useState } from "react";
import PageChrome from "../components/PageChrome";
import Link from "next/link";

type Country={code:string;name:string;capital:string;region:string;population:number;area:number;currency?:string;continent?:string;timezone?:string};
const fmt=(n:number)=>new Intl.NumberFormat("en",{notation:"compact",maximumFractionDigits:1}).format(n);

export default function DataPage(){
  const [countries,setCountries]=useState<Country[]>([]);
  const [q,setQ]=useState("");
  const [sort,setSort]=useState<"population"|"area"|"name">("population");
  const [selected,setSelected]=useState<string[]>(["PK","US"]);
  useEffect(()=>{fetch("/api/countries",{cache:"no-store"}).then(r=>r.json()).then(d=>setCountries(Array.isArray(d.countries)?d.countries:[])).catch(()=>setCountries([]));},[]);
  const filtered=useMemo(()=>countries.filter(c=>!q||c.name.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):(b[sort]||0)-(a[sort]||0)).slice(0,24),[countries,q,sort]);
  const toggle=(code:string)=>setSelected(s=>s.includes(code)?s.filter(x=>x!==code):s.length<4?[...s,code]:s);
  const compare=countries.filter(c=>selected.includes(c.code));
  return <PageChrome>
    <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · WORLD DATA</span><h1>Compare the planet with <em>context.</em></h1><p>Search country indicators, sort them and build a side-by-side view without burying the useful numbers in a spreadsheet graveyard.</p></section>
    <section className="dataPage sectionWrap">
      <div className="dataToolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search countries…" /><select value={sort} onChange={e=>setSort(e.target.value as typeof sort)}><option value="population">Population</option><option value="area">Area</option><option value="name">Name</option></select></div>
      <div className="dataCompare">{compare.map(c=><button key={c.code} onClick={()=>toggle(c.code)}><span>{c.code}</span><strong>{c.name}</strong><small>{fmt(c.population)} people · {fmt(c.area)} km²</small></button>)}</div>
      <div className="dataGrid">{filtered.map(c=><button key={c.code} className={selected.includes(c.code)?"selected":""} onClick={()=>toggle(c.code)}><span>{c.code}</span><strong>{c.name}</strong><small>{c.region} · {c.capital}</small><em>{fmt(c.population)}</em></button>)}</div>
      <div className="dataLinks"><Link href="/compare">Open comparison workspace ↗</Link><Link href="/countries">Country Atlas ↗</Link><Link href="/earth">Explore the globe ↗</Link></div>
    </section>
  </PageChrome>
}
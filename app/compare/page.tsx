"use client";

import { useEffect, useMemo, useState } from "react";
import PageChrome from "../components/PageChrome";

type Country = {
  code:string; name:string; flag:string; capital:string; region:string; subregion:string;
  population:number; area:number; languages:string[]; currencies:string[]; timezones:string[];
};

const fmt = (n:number) => new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(n || 0);
const compact = (n:number) => n ? new Intl.NumberFormat("en", { notation:"compact", maximumFractionDigits:1 }).format(n) : "—";

export default function ComparePage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [a, setA] = useState("PK");
  const [b, setB] = useState("IN");

  useEffect(() => {
    fetch("/api/countries",{cache:"no-store"}).then(r=>r.json()).then(d=>setCountries(d.countries||[])).catch(()=>{});
  }, []);

  const left = useMemo(() => countries.find(x=>x.code===a), [countries,a]);
  const right = useMemo(() => countries.find(x=>x.code===b), [countries,b]);

  const rows = [
    ["Population", left ? fmt(left.population) : "—", right ? fmt(right.population) : "—"],
    ["Area", left ? fmt(left.area) + " km²" : "—", right ? fmt(right.area) + " km²" : "—"],
    ["Population density", left?.area && left.population ? (left.population / left.area).toFixed(1) + " / km²" : "—", right?.area && right.population ? (right.population / right.area).toFixed(1) + " / km²" : "—"],
    ["Capital", left?.capital || "—", right?.capital || "—"],
    ["Region", left?.region || "—", right?.region || "—"],
    ["Subregion", left?.subregion || "—", right?.subregion || "—"],
    ["Languages", left?.languages.join(" · ") || "—", right?.languages.join(" · ") || "—"],
    ["Currency", left?.currencies.join(" · ") || "—", right?.currencies.join(" · ") || "—"],
    ["Time zones", left?.timezones.length ? left.timezones.join(" · ") : "—", right?.timezones.length ? right.timezones.join(" · ") : "—"],
  ];

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · COMPARISON LAB</span>
        <h1>Put two countries <em>side by side.</em></h1>
        <p>Compare the same core facts without hunting through two separate profiles.</p>
      </section>

      <section className="comparePage sectionWrap">
        <div className="compareSelectors">
          <label><span>Country A</span><select value={a} onChange={e=>setA(e.target.value)}>{countries.map(c=><option value={c.code} key={c.code}>{c.name}</option>)}</select></label>
          <button className="compareSwap" onClick={() => { const next = a; setA(b); setB(next); }} aria-label="Swap countries">⇄</button>
          <label><span>Country B</span><select value={b} onChange={e=>setB(e.target.value)}>{countries.map(c=><option value={c.code} key={c.code}>{c.name}</option>)}</select></label>
        </div>

        <div className="compareHero">
          <div>{left && <><img src={left.flag} alt="" /><h2>{left.name}</h2><span>{left.region}</span></>}</div>
          <b>VS</b>
          <div>{right && <><img src={right.flag} alt="" /><h2>{right.name}</h2><span>{right.region}</span></>}</div>
        </div>

        <div className="compareTable">
          <div className="compareHeader"><span>Metric</span><strong>{left?.name || "Country A"}</strong><strong>{right?.name || "Country B"}</strong></div>
          {rows.map(([label,l,r]) => <div className="compareRow" key={label}><span>{label}</span><strong>{l}</strong><strong>{r}</strong></div>)}
        </div>

        <div className="comparePopulation">
          <div><span>{left?.name || "A"}</span><strong>{compact(left?.population || 0)}</strong><small>population</small></div>
          <div className="compareDelta"><span>Population gap</span><strong>{left && right ? compact(Math.abs(left.population - right.population)) : "—"}</strong><small>absolute difference</small></div>
          <div><span>{right?.name || "B"}</span><strong>{compact(right?.population || 0)}</strong><small>population</small></div>
        </div>
      </section>
    </PageChrome>
  );
}

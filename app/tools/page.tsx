"use client";

import { useEffect, useMemo, useState } from "react";
import PageChrome from "../components/PageChrome";

const zones = [
  ["Karachi","Asia/Karachi"],["London","Europe/London"],["New York","America/New_York"],
  ["Dubai","Asia/Dubai"],["Tokyo","Asia/Tokyo"],["Sydney","Australia/Sydney"]
];

export default function ToolsPage() {
  const [now, setNow] = useState(new Date());
  const [km, setKm] = useState("10");
  const [usd, setUsd] = useState("100");
  const [ageDate, setAgeDate] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => { const id=setInterval(()=>setNow(new Date()),1000); return()=>clearInterval(id); },[]);
  useEffect(() => {
    fetch("https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,PKR,JPY").then(r=>r.json()).then(d=>setRate(d?.rates?.PKR || null)).catch(()=>setRate(null));
  },[]);

  const miles=(Number(km)||0)*0.621371;
  const age=useMemo(()=>{
    if(!ageDate) return null;
    const birth=new Date(ageDate); if(Number.isNaN(birth.getTime())) return null;
    const diff=now.getTime()-birth.getTime();
    return diff>0 ? Math.floor(diff/(365.2425*24*3600*1000)) : null;
  },[ageDate,now]);

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · TOOLS</span>
        <h1>Small tools. <em>Useful every day.</em></h1>
        <p>World clocks, unit conversion, age calculation and quick-reference utilities in one place.</p>
      </section>

      <section className="toolsGrid sectionWrap">
        <div className="toolPanel wideTool">
          <div className="toolKicker">WORLD CLOCK</div><h2>What time is it around the world?</h2>
          <div className="clockGrid">{zones.map(([name,tz])=><div className="clockCard" key={tz}><span>{name}</span><strong>{new Intl.DateTimeFormat("en-US",{timeZone:tz,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now)}</strong><small>{tz}</small></div>)}</div>
        </div>
        <div className="toolPanel">
          <div className="toolKicker">UNIT CONVERTER</div><h2>Distance</h2>
          <label className="toolInput"><span>Kilometres</span><input value={km} onChange={e=>setKm(e.target.value)} inputMode="decimal" /></label>
          <div className="toolResult"><strong>{miles.toFixed(2)}</strong><span>miles</span></div>
        </div>
        <div className="toolPanel">
          <div className="toolKicker">AGE CALCULATOR</div><h2>How old are you?</h2>
          <input className="dateInput" type="date" value={ageDate} onChange={e=>setAgeDate(e.target.value)} />
          {age !== null && <div className="toolResult"><strong>{age}</strong><span>years old</span></div>}
          <small className="toolHint">Calculated from your birth date and system date.</small>
        </div>
        <div className="toolPanel">
          <div className="toolKicker">CURRENCY REFERENCE</div><h2>USD → PKR</h2>
          <label className="toolInput"><span>US dollars</span><input value={usd} onChange={e=>setUsd(e.target.value)} inputMode="decimal" /></label>
          <div className="toolResult"><strong>{rate ? Math.round(Number(usd||0)*rate).toLocaleString() : "—"}</strong><span>PKR</span></div>
          <small className="toolHint">{rate ? "Live reference rate loaded from Frankfurter." : "Rate unavailable right now."}</small>
        </div>
      </section>
    </PageChrome>
  );
}

"use client";

import { useMemo } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";
import { entries } from "../data/entries";

export default function TodayPage(){
  const today=new Date();
  const dateLabel=new Intl.DateTimeFormat("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(today);
  const selection=useMemo(()=>[...entries].sort((a,b)=>a.number.localeCompare(b.number)).slice((today.getDate()-1)%entries.length,((today.getDate()-1)%entries.length)+3),[today]);

  return (
    <PageChrome>
      <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · TODAY</span><h1>A fresh reason to <em>explore today.</em></h1><p>{dateLabel}. A rotating daily shelf of GlobalPedia knowledge and discovery.</p></section>
      <section className="todayPage sectionWrap"><div className="todayLead"><span>TODAY'S DISCOVERY SHELF</span><strong>{dateLabel}</strong></div><div className="todayGrid">{selection.map(item=><Link className="todayCard" href={"/articles/"+item.slug} key={item.slug}><img src={item.image} alt="" /><div><span>{item.category}</span><h2>{item.title}</h2><p>{item.description}</p><b>Open article ↗</b></div></Link>)}</div></section>
    </PageChrome>
  );
}

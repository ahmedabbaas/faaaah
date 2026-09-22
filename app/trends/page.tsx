"use client";

import { useEffect, useState } from "react";
import PageChrome from "../components/PageChrome";

type News = { id:string; title:string; source:string; topic?:string; link:string; publishedAt:string };

const topics = ["World","Pakistan","Technology","Science","Football","Cricket","Games"];

export default function TrendsPage() {
  const [news,setNews]=useState<News[]>([]);
  useEffect(()=>{fetch("/api/news?mode=explore",{cache:"no-store"}).then(r=>r.json()).then(d=>setNews(d.news||[])).catch(()=>{});},[]);
  const counts=topics.map(topic=>({topic,count:news.filter(n=>(n.topic||"").toLowerCase()===topic.toLowerCase()).length})).sort((a,b)=>b.count-a.count);
  const max=Math.max(1,...counts.map(x=>x.count));

  return (
    <PageChrome>
      <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · TRENDS</span><h1>What the world is <em>talking about.</em></h1><p>A live visual index built from the current GlobalPedia news feeds.</p></section>
      <section className="trendPage sectionWrap">
        <div className="trendHeader"><div><span className="toolKicker">LIVE SIGNALS</span><h2>Topic activity</h2></div><span className="trendStatus">● LIVE FEED</span></div>
        <div className="trendBars">{counts.map(x=><div className="trendBarRow" key={x.topic}><span>{x.topic}</span><div><i style={{width:(x.count/max*100)+"%"}} /></div><b>{x.count}</b></div>)}</div>
        <div className="trendNews">{news.slice(0,12).map(n=><a href={n.link} target="_blank" rel="noreferrer" key={n.id}><span>{n.topic || "World"}</span><strong>{n.title}</strong><small>{n.source}</small></a>)}</div>
      </section>
    </PageChrome>
  );
}

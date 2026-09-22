"use client";

import { useEffect, useMemo, useState } from "react";
import PageChrome from "../components/PageChrome";

type News={id:string;title:string;source:string;topic?:string;link:string;publishedAt:string;image?:string};

const topics=[
  ["World","world"],["Pakistan","countries"],["Technology","technology"],["Science","science"],
  ["Culture","culture"],["Nature","nature"],["Health","health"],["Arts","arts"],["Sports","sports"],["Gaming","games"]
];

export default function FollowingPage(){
  const [selected,setSelected]=useState<string[]>([]);
  const [news,setNews]=useState<News[]>([]);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    try{setSelected(JSON.parse(localStorage.getItem("globalpedia_following")||"[]"))}catch{}
  },[]);

  const toggle=(topic:string)=>{
    setSelected(prev=>{
      const next=prev.includes(topic)?prev.filter(x=>x!==topic):[...prev,topic];
      localStorage.setItem("globalpedia_following",JSON.stringify(next));
      return next;
    });
  };

  useEffect(()=>{
    if(!selected.length){setNews([]);return;}
    setLoading(true);
    Promise.all(selected.map(mode=>fetch("/api/news?mode="+mode,{cache:"no-store"}).then(r=>r.json()).catch(()=>({news:[]}))))
      .then(all=>{
        const merged=all.flatMap(x=>x.news||[]) as News[];
        const unique=merged.filter((item,index,array)=>array.findIndex(x=>x.id===item.id)===index)
          .sort((a,b)=>new Date(b.publishedAt).getTime()-new Date(a.publishedAt).getTime()).slice(0,18);
        setNews(unique);
      }).finally(()=>setLoading(false));
  },[selected]);

  const heading=useMemo(()=>selected.length?selected.length+" topics followed":"Choose topics to build your feed",[selected]);

  return <PageChrome>
    <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · FOLLOWING</span><h1>Your world, <em>your feed.</em></h1><p>Select subjects and GlobalPedia will combine their live signals into one personal stream on this browser.</p></section>
    <section className="followingPage sectionWrap">
      <div className="followingHeader"><div><span>PERSONAL SIGNALS</span><h2>{heading}</h2></div><small>Saved locally on this device</small></div>
      <div className="followChips">{topics.map(([label,mode])=><button className={selected.includes(mode)?"active":""} onClick={()=>toggle(mode)} key={mode}>{selected.includes(mode)?"✓ ":""}{label}</button>)}</div>
      {loading&&<div className="emptyState"><strong>Building your feed…</strong><span>Combining the latest selected signals.</span></div>}
      {!loading && !selected.length && <div className="emptyState"><strong>Nothing followed yet.</strong><span>Pick at least one topic above. Humanity produced the menu, thankfully.</span></div>}
      {!loading && selected.length>0 && <div className="followNewsGrid">{news.map(item=><a href={item.link} target="_blank" rel="noreferrer" key={item.id}><span>{item.topic||"Live"} · {item.source}</span><h3>{item.title}</h3><small>{new Date(item.publishedAt).toLocaleString()}</small></a>)}</div>}
    </section>
  </PageChrome>;
}

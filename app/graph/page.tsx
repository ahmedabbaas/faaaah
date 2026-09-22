"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

type Node={id:string;label:string;type:string;note:string;x:number;y:number;color:string;links:string[]};
const nodes:Node[]=[
{id:"earth",label:"Earth",type:"Planet",note:"The shared starting point.",x:50,y:50,color:"#6e83ff",links:["asia","science"]},
{id:"asia",label:"Asia",type:"Region",note:"A geographic super-region.",x:28,y:34,color:"#43c2d9",links:["pakistan","history"]},
{id:"pakistan",label:"Pakistan",type:"Country",note:"A country in South Asia.",x:24,y:58,color:"#55df91",links:["karachi","history"]},
{id:"karachi",label:"Karachi",type:"City",note:"A major city on Pakistan's southern coast.",x:16,y:76,color:"#ffb14a",links:["pakistan","culture"]},
{id:"history",label:"History",type:"Topic",note:"Connected to place, people and time.",x:52,y:27,color:"#ff8a5b",links:["asia","pakistan","science"]},
{id:"science",label:"Science",type:"Topic",note:"A broad knowledge domain.",x:74,y:34,color:"#a876ff",links:["earth","history"]},
{id:"culture",label:"Culture",type:"Topic",note:"Language, art, food and traditions.",x:72,y:70,color:"#f05c9c",links:["karachi","asia"]},
];
const edges=nodes.flatMap(n=>n.links.map(id=>[n.id,id] as const)).filter((e,i,a)=>i===a.findIndex(x=>x.slice().sort().join("|")===e.slice().sort().join("|")));
export default function GraphPage(){
 const [active,setActive]=useState("earth");
 const current=nodes.find(n=>n.id===active)||nodes[0];
 const related=current.links.map(id=>nodes.find(n=>n.id===id)).filter(Boolean) as Node[];
 return <PageChrome>
  <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · KNOWLEDGE GRAPH</span><h1>See how knowledge <em>connects.</em></h1><p>Click a node to jump from places to subjects, people and history instead of treating every article like an island.</p></section>
  <section className="graphPage sectionWrap">
   <div className="graphLayout">
    <div className="graphCanvas">
      <svg viewBox="0 0 100 100" role="img" aria-label="Interactive knowledge graph">
       {edges.map(([a,b])=>{const na=nodes.find(n=>n.id===a)!,nb=nodes.find(n=>n.id===b)!;return <line key={a+b} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} />})}
       {nodes.map(n=><g key={n.id} className={n.id===active?"activeNode":""} onClick={()=>setActive(n.id)} tabIndex={0}><circle cx={n.x} cy={n.y} r={n.id===active?4.3:3.2} style={{fill:n.color}}/><text x={n.x} y={n.y-5}>{n.label}</text></g>)}
      </svg>
      <div className="graphHint">Click any node to inspect its connections.</div>
    </div>
    <aside className="graphPanel"><span>{current.type}</span><h2>{current.label}</h2><p>{current.note}</p><strong>CONNECTED</strong><div>{related.map(n=><button key={n.id} onClick={()=>setActive(n.id)}>{n.label} · {n.type}</button>)}</div>{current.id==="karachi"&&<Link href="/places/karachi">Open place profile ↗</Link>}{current.id==="pakistan"&&<Link href="/earth">Open on Earth ↗</Link>}</aside>
   </div>
  </section>
 </PageChrome>
}
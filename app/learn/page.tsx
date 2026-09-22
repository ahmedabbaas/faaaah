"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

const tracks = [
  { id:"history", title:"History", desc:"Events, civilizations and turning points.", lessons:["Ancient civilizations","Medieval worlds","Industrial revolution","World history in the 20th century"] },
  { id:"science", title:"Science", desc:"From atoms and cells to stars and galaxies.", lessons:["Scientific method","Matter & energy","Life systems","Space & cosmology"] },
  { id:"technology", title:"Technology", desc:"Understand the systems shaping modern life.", lessons:["Computer basics","Internet fundamentals","AI foundations","Cybersecurity basics"] },
  { id:"geography", title:"Geography", desc:"Read the planet through places, borders and physical systems.", lessons:["Continents & regions","Climate systems","Cities & population","Maps & scale"] },
  { id:"culture", title:"Culture", desc:"Explore how people create, preserve and exchange meaning.", lessons:["Language","Food & traditions","Art & music","Cultural exchange"] },
];

export default function LearnPage(){
  const [progress,setProgress]=useState<Record<string,number>>({});
  useEffect(()=>{ try{setProgress(JSON.parse(localStorage.getItem("globalpedia_learning_progress")||"{}"));}catch{setProgress({});}},[]);
  const setLesson=(id:string)=>{
    const next={...progress,[id]:Math.min(100,(progress[id]||0)+25)};
    setProgress(next);
    localStorage.setItem("globalpedia_learning_progress",JSON.stringify(next));
  };
  return <PageChrome>
    <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · LEARN</span><h1>Turn curiosity into a <em>learning track.</em></h1><p>Short lessons, quick checks and connected knowledge. No ceremonial textbook mountain required.</p></section>
    <section className="learnPage sectionWrap">
      <div className="learnIntro"><div><span>HOW IT WORKS</span><h2>Learn in small, useful steps.</h2><p>Open a track, mark lessons complete and your progress stays on this device.</p></div><Link href="/quiz">Daily Quiz ↗</Link></div>
      <div className="learnGrid">{tracks.map(track=>{
        const done=progress[track.id]||0;
        return <article className="learnCard" id={track.id} key={track.id}>
          <div className="learnCardHead"><span>TRACK</span><strong>{done}%</strong></div>
          <h2>{track.title}</h2><p>{track.desc}</p>
          <div className="learnProgress"><i style={{width:done+"%"}} /></div>
          <div className="learnLessons">{track.lessons.map((lesson,index)=>{
            const lessonKey=track.id+"-"+index;
            const complete=(progress[lessonKey]||0)>=25;
            return <button key={lessonKey} className={complete?"complete":""} onClick={()=>setLesson(lessonKey)}><b>{String(index+1).padStart(2,"0")}</b><span>{lesson}</span><small>{complete?"Done":"Mark complete"}</small></button>
          })}</div>
        </article>
      })}</div>
    </section>
  </PageChrome>
}
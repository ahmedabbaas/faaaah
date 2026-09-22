"use client";

import { useMemo, useState } from "react";
import PageChrome from "../components/PageChrome";

const questions = [
  {q:"Which country is in South Asia?",options:["Pakistan","Brazil","Japan","Egypt"],answer:"Pakistan",why:"Pakistan is a South Asian country."},
  {q:"Which field studies stars and galaxies?",options:["Botany","Astronomy","Geology","Linguistics"],answer:"Astronomy",why:"Astronomy studies celestial objects and the universe."},
  {q:"Which ocean is the largest?",options:["Atlantic","Indian","Pacific","Arctic"],answer:"Pacific",why:"The Pacific Ocean is the largest ocean basin."},
  {q:"Which language family includes English?",options:["Germanic","Romance","Sinitic","Semitic"],answer:"Germanic",why:"English is a West Germanic language."},
  {q:"Which planet is known for its prominent rings?",options:["Mars","Venus","Saturn","Mercury"],answer:"Saturn",why:"Saturn's ring system is especially prominent."}
];

export default function QuizPage(){
  const [index,setIndex]=useState(0),[score,setScore]=useState(0),[picked,setPicked]=useState<string|null>(null),[done,setDone]=useState(false);
  const question=questions[index];
  const choose=(option:string)=>{
    if(picked) return;
    setPicked(option);
    if(option===question.answer) setScore(s=>s+1);
    setTimeout(()=>{if(index===questions.length-1)setDone(true);else{setIndex(i=>i+1);setPicked(null)}},700);
  };
  const reset=()=>{setIndex(0);setScore(0);setPicked(null);setDone(false)};
  const message=useMemo(()=>score===questions.length?"Perfect run.":score>=3?"Strong world knowledge.":score>=2?"Not bad.":"The planet remains undefeated.",[score]);

  return (
    <PageChrome>
      <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · DAILY QUIZ</span><h1>Five questions. <em>One score.</em></h1><p>Test your general knowledge with a quick GlobalPedia quiz.</p></section>
      <section className="quizPage sectionWrap">
        {done
          ? <div className="quizResult"><span>YOUR SCORE</span><strong>{score}/{questions.length}</strong><h2>{message}</h2><button onClick={reset}>Play again</button></div>
          : <div className="quizCard"><div className="quizMeta"><span>QUESTION {index+1}/{questions.length}</span><span>{score} correct</span></div><h2>{question.q}</h2><div className="quizOptions">{question.options.map(o=><button key={o} className={picked===o?(o===question.answer?"correct":"wrong"):""} onClick={()=>choose(o)}>{o}</button>)}</div>{picked&&<p className="quizWhy">{question.why}</p>}</div>}
      </section>
    </PageChrome>
  );
}

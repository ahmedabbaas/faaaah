"use client";

import { useState } from "react";
import PageChrome from "../components/PageChrome";

type Msg={role:"user"|"assistant";text:string};

export default function AiPage(){
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState<Msg[]>([{role:"assistant",text:"I can search GlobalPedia's indexed knowledge and explain the result. Ask about a country, topic, article or current signal."}]);
  const [loading,setLoading]=useState(false);

  const ask=async()=>{
    if(!input.trim()||loading)return;
    const q=input.trim();
    setInput("");
    setMessages(m=>[...m,{role:"user",text:q}]);
    setLoading(true);
    try{
      const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});
      const d=await r.json();
      setMessages(m=>[...m,{role:"assistant",text:d.answer||"No answer available."}]);
    }catch{
      setMessages(m=>[...m,{role:"assistant",text:"The assistant is unavailable right now."}]);
    }finally{setLoading(false)}
  };

  return (
    <PageChrome>
      <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · AI EXPLORER</span><h1>Ask the world <em>anything.</em></h1><p>A dedicated research surface for GlobalPedia topics, countries and indexed knowledge.</p></section>
      <section className="aiPage sectionWrap">
        <div className="aiShell">
          <div className="aiMessages">
            {messages.map((m,i)=><div className={"aiMessage "+m.role} key={i}><span>{m.role==="assistant"?"GP":"YOU"}</span><p>{m.text}</p></div>)}
            {loading&&<div className="aiMessage assistant"><span>GP</span><p>Thinking…</p></div>}
          </div>
          <div className="aiComposer">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")void ask()}} placeholder="Ask: What is Pakistan's capital? Explain transformers..." />
            <button onClick={()=>void ask()} disabled={loading}>Ask ↗</button>
          </div>
        </div>
      </section>
    </PageChrome>
  );
}

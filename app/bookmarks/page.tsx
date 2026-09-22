"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

type Saved={id:string;title:string};

export default function BookmarksPage(){
  const [items,setItems]=useState<Saved[]>([]);
  const read=()=>{try{setItems(JSON.parse(localStorage.getItem("globalpedia_bookmarks")||"[]"))}catch{}};
  useEffect(()=>{read();const on=()=>read();window.addEventListener("globalpedia-bookmarks",on);return()=>window.removeEventListener("globalpedia-bookmarks",on)},[]);
  const clear=()=>{localStorage.removeItem("globalpedia_bookmarks");read()};

  return (
    <PageChrome>
      <section className="pageHero compactHero"><span className="heroTag">GLOBALPEDIA · MY LIBRARY</span><h1>Your saved <em>knowledge.</em></h1><p>Bookmarks stay in this browser, ready for the next rabbit hole.</p></section>
      <section className="bookmarkPage sectionWrap">
        <div className="bookmarkHead"><span>{items.length} saved</span>{items.length>0&&<button onClick={clear}>Clear all</button>}</div>
        {items.length===0
          ? <div className="emptyState"><strong>No bookmarks yet.</strong><span>Use the ☆ button on searchable articles to build your personal library.</span></div>
          : <div className="bookmarkGrid">{items.map(item=>{const slug=item.id.replace("article:","");return <Link className="bookmarkCard" href={"/articles/"+slug} key={item.id}><span>ARTICLE</span><h2>{item.title}</h2><b>Open ↗</b></Link>})}</div>}
      </section>
    </PageChrome>
  );
}

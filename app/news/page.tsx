"use client";

import { useState } from "react";
import PageChrome from "../components/PageChrome";
import LiveNewsFeed from "../components/LiveNewsFeed";

const channels = [
  ["global", "World"],
  ["countries", "Countries"],
  ["technology", "Technology"],
  ["science", "Science"],
  ["business", "Business"],
  ["sports", "Sports"],
  ["games", "Games"],
  ["history", "History"],
  ["culture", "Culture"],
  ["nature", "Nature"],
  ["health", "Health"],
  ["arts", "Arts"],
];

export default function NewsPage() {
  const [channel, setChannel] = useState("global");
  const [key, setKey] = useState(0);

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · NEWS DESK</span>
        <h1>The world, <em>updated.</em></h1>
        <p>Live headlines from Google News feeds with source links, timestamps and publisher images when exposed by the original story.</p>
      </section>
      <section className="newsDeskTabs sectionWrap">
        <div className="newsDeskTabsInner">
          {channels.map(([value, label]) => (
            <button
              key={value}
              className={channel === value ? "active" : ""}
              onClick={() => { setChannel(value); setKey((current) => current + 1); }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      <LiveNewsFeed
        key={`${channel}-${key}`}
        mode={channel}
        title={`${channels.find(([value]) => value === channel)?.[1] || "World"} News`}
        subtitle="Tap any story for its source, feed summary, timestamp and image provenance."
        limit={18}
      />
    </PageChrome>
  );
}

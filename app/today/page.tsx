"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";
import { categories, entries } from "../data/entries";


const dailyFacts = [
  "A day on Venus is longer than its year.",
  "The human brain contains billions of neurons connected by trillions of synapses.",
  "The Pacific Ocean covers more area than all of Earth's land combined.",
  "Honey can remain stable for extremely long periods when sealed and stored properly.",
  "Lightning can heat the surrounding air to temperatures hotter than the surface of the Sun."
];

export default function TodayPage() {
  const today = new Date();
  const dateKey = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(today);
  const [category, setCategory] = useState("All");

  const pool = useMemo(() => {
    const filtered = category === "All" ? entries : entries.filter((item) => item.category === category);
    return filtered.length ? filtered : entries;
  }, [category]);

  const selection = useMemo(() => {
    const start = dateKey % pool.length;
    return Array.from({ length: Math.min(4, pool.length) }, (_, index) => pool[(start + index) % pool.length]);
  }, [dateKey, pool]);

  const focus = selection[0];

  const quickLinks = [
    ["World Timeline", "/timeline", "Trace the story behind major turning points."],
    ["Live Trends", "/trends", "See which topics are moving through the current feed."],
    ["Universal Search", "/search", "Jump directly into the full knowledge index."],
  ];

  return (
    <PageChrome>
      <section className="pageHero compactHero todayHeroUpgrade">
        <span className="heroTag">GLOBALPEDIA · TODAY</span>
        <h1>Today's best route into the <em>knowledge index.</em></h1>
        <p>{dateLabel}. A rotating discovery shelf designed to feel different each day.</p>
        <div className="todayQuickLinks">
          {quickLinks.map(([label, href, description]) => (
            <Link href={href} key={href}>
              <span>{label}</span>
              <small>{description}</small>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="todayPage sectionWrap">
        <div className="todayLead">
          <div>
            <span>TODAY'S DISCOVERY SHELF</span>
            <strong>{dateLabel}</strong>
          </div>
          <div className="todayCategoryFilters">
            {categories.slice(0, 7).map((item) => (
              <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="todayFactStrip">
          <div>
            <span>DAILY KNOWLEDGE</span>
            <strong>{dailyFacts[dateKey % dailyFacts.length]}</strong>
          </div>
          <Link href="/history-today">Today in history ↗</Link>
        </div>

        {focus && (
          <Link className="todayFocus" href={"/articles/" + focus.slug}>
            <img src={focus.image} alt="" />
            <div>
              <span>{focus.category} · TODAY'S FOCUS</span>
              <h2>{focus.title}</h2>
              <p>{focus.description}</p>
              <b>Open the article ↗</b>
            </div>
          </Link>
        )}

        <div className="todayGrid todayGridUpgrade">
          {selection.slice(1).map((item) => (
            <Link className="todayCard" href={"/articles/" + item.slug} key={item.slug}>
              <img src={item.image} alt="" />
              <div>
                <span>{item.category}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <b>Open article ↗</b>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageChrome>
  );
}

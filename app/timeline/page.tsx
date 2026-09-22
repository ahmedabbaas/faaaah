"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

type TimelineItem = {
  year: string;
  era: string;
  topic: string;
  title: string;
  text: string;
};

const timeline: TimelineItem[] = [
  { year: "c. 3200 BCE", era: "Ancient", topic: "Writing", title: "Early writing systems emerge", text: "Cities in Mesopotamia develop cuneiform, creating durable records for trade, administration and culture." },
  { year: "2560 BCE", era: "Ancient", topic: "Engineering", title: "The Great Pyramid era", text: "Large-scale stone engineering in ancient Egypt demonstrates organized labor, surveying and long-term planning." },
  { year: "5th century BCE", era: "Classical", topic: "Philosophy", title: "Classical philosophy expands", text: "Thinkers across the Mediterranean develop influential ideas about ethics, politics, mathematics and nature." },
  { year: "105 CE", era: "Classical", topic: "Technology", title: "Paper-making is documented in China", text: "Paper becomes a major information technology, helping written knowledge travel more efficiently." },
  { year: "1450s", era: "Early Modern", topic: "Communication", title: "Printing transforms Europe", text: "Movable-type printing accelerates the production and circulation of books and ideas." },
  { year: "1492", era: "Early Modern", topic: "Exploration", title: "Atlantic voyages reshape global connections", text: "European voyages across the Atlantic begin a period of sustained exchange, migration and conflict between continents." },
  { year: "1687", era: "Scientific Revolution", topic: "Science", title: "Newton publishes the Principia", text: "Newton's work presents mathematical laws of motion and universal gravitation that reshape physics." },
  { year: "1760s–1840s", era: "Industrial", topic: "Industry", title: "The Industrial Revolution", text: "Mechanization, factories and new transport systems transform production, cities and everyday life." },
  { year: "1876", era: "Industrial", topic: "Communication", title: "Telephone technology enters public life", text: "Practical telephone systems begin connecting voices over distance and change the speed of communication." },
  { year: "1903", era: "Modern", topic: "Aviation", title: "Controlled powered flight", text: "The Wright brothers demonstrate a controlled, powered airplane flight, opening a new age of aviation." },
  { year: "1945", era: "Modern", topic: "World", title: "The United Nations is founded", text: "After the Second World War, nations establish the United Nations to support international cooperation." },
  { year: "1957", era: "Space Age", topic: "Space", title: "Sputnik begins the Space Age", text: "The Soviet Union launches Sputnik 1, the first artificial satellite to orbit Earth." },
  { year: "1969", era: "Space Age", topic: "Space", title: "Humans land on the Moon", text: "Apollo 11 carries astronauts to the lunar surface in the first crewed Moon landing." },
  { year: "1989", era: "Contemporary", topic: "Europe", title: "The Berlin Wall falls", text: "The fall of the Berlin Wall becomes a defining symbol of political change in Europe at the end of the Cold War." },
  { year: "1991", era: "Contemporary", topic: "Technology", title: "The World Wide Web enters public use", text: "The web expands access to linked information and becomes a foundation of modern digital life." },
  { year: "2007", era: "Contemporary", topic: "Mobile", title: "The smartphone era accelerates", text: "Modern smartphones combine communication, computing and internet access in a handheld device." },
];

const eras = ["All", "Ancient", "Classical", "Early Modern", "Scientific Revolution", "Industrial", "Modern", "Space Age", "Contemporary"];

export default function TimelinePage() {
  const [era, setEra] = useState("All");
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");

  const topics = ["All", ...Array.from(new Set(timeline.map((item) => item.topic)))];
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return timeline.filter((item) => {
      const eraMatch = era === "All" || item.era === era;
      const topicMatch = topic === "All" || item.topic === topic;
      const text = (item.year + " " + item.topic + " " + item.title + " " + item.text).toLowerCase();
      return eraMatch && topicMatch && (!term || text.includes(term));
    });
  }, [era, query, topic]);

  return (
    <PageChrome>
      <section className="pageHero timelineHero">
        <span className="heroTag">GLOBALPEDIA · WORLD TIMELINE</span>
        <h1>See the world as a <em>story.</em></h1>
        <p>Move through major eras, discoveries, technologies and turning points without losing the thread.</p>
        <div className="timelineControls">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the timeline..." aria-label="Search the timeline" />
          <span>{filtered.length} milestones</span>
        </div>
      </section>

      <section className="timelineShell sectionWrap">
        <div className="timelineIntro">
          <div>
            <span>ERA INDEX</span>
            <h2>Choose a chapter.</h2>
          </div>
          <Link href="/search">Search the whole knowledge index ↗</Link>
        </div>

        <div className="timelineFilters" aria-label="Filter timeline by era">
          {eras.map((item) => (
            <button key={item} className={era === item ? "active" : ""} onClick={() => setEra(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="timelineFilters timelineTopicFilters" aria-label="Filter timeline by topic">
          {topics.map((item) => (
            <button key={item} className={topic === item ? "active" : ""} onClick={() => setTopic(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="timelineRail">
          {filtered.map((item, index) => (
            <article className="timelineItem" key={item.year + item.title}>
              <div className="timelineMarker">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="timelineDate">
                <strong>{item.year}</strong>
                <small>{item.era}</small>
              </div>
              <div className="timelineCard">
                <span>{item.topic}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
          {!filtered.length && <div className="timelineEmpty">No milestones match these filters.</div>}
        </div>
      </section>
    </PageChrome>
  );
}

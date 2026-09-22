"use client";

import { useMemo } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

type Event = { month: number; day: number; year: string; title: string; text: string; topic: string };

const events: Event[] = [
  { month: 1, day: 12, year: "1964", title: "Zanzibar Revolution", text: "A revolution begins in Zanzibar, becoming a major political turning point in the islands' modern history.", topic: "World" },
  { month: 2, day: 11, year: "1990", title: "Nelson Mandela released", text: "Nelson Mandela is released from prison after 27 years, a major moment in South Africa's transition.", topic: "History" },
  { month: 3, day: 6, year: "1957", title: "Ghana becomes independent", text: "Ghana becomes independent from British rule, becoming the first sub-Saharan African colony to gain independence in the postwar period.", topic: "Africa" },
  { month: 4, day: 12, year: "1961", title: "First human in space", text: "Yuri Gagarin completes the first crewed orbital flight, marking a defining milestone in the Space Age.", topic: "Space" },
  { month: 5, day: 5, year: "1961", title: "First American crewed spaceflight", text: "Alan Shepard becomes the first American to travel into space on a suborbital mission.", topic: "Space" },
  { month: 6, day: 20, year: "1969", title: "Apollo 11 reaches the Moon", text: "Apollo 11's lunar module lands on the Moon during the mission that produced the first human lunar surface walk.", topic: "Science" },
  { month: 7, day: 20, year: "1969", title: "First Moonwalk", text: "Neil Armstrong steps onto the lunar surface, followed by Buzz Aldrin, during Apollo 11.", topic: "Space" },
  { month: 8, day: 9, year: "1945", title: "Atomic bombing of Nagasaki", text: "The bombing of Nagasaki occurs during the final stage of the Second World War.", topic: "History" },
  { month: 9, day: 22, year: "1980", title: "Iran–Iraq War begins", text: "Iraq launches a large-scale invasion of Iran, beginning a war that lasts through much of the 1980s.", topic: "World" },
  { month: 10, day: 24, year: "1945", title: "United Nations enters into force", text: "The United Nations Charter enters into force, formally establishing the organization.", topic: "World" },
  { month: 11, day: 9, year: "1989", title: "Berlin Wall opens", text: "The Berlin Wall opens, becoming a defining symbol of the political changes ending the Cold War in Europe.", topic: "Europe" },
  { month: 12, day: 10, year: "1948", title: "Universal Declaration adopted", text: "The Universal Declaration of Human Rights is adopted by the United Nations General Assembly.", topic: "World" },
];

export default function HistoryTodayPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const featured = useMemo(
    () => events.find((event) => event.month === month && event.day === day) || events[(month + day) % events.length],
    [month, day]
  );

  const nearby = useMemo(
    () =>
      events
        .filter((event) => event.title !== featured.title)
        .sort((a, b) => Math.abs((a.month - month) * 31 + a.day - day) - Math.abs((b.month - month) * 31 + b.day - day))
        .slice(0, 4),
    [featured.title, month, day]
  );

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · TODAY IN HISTORY</span>
        <h1>What happened on <em>this date?</em></h1>
        <p>{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}. A compact historical window around today's date.</p>
      </section>

      <section className="historyToday sectionWrap">
        <div className="historyTodayHero">
          <span>{featured.topic} · {featured.year}</span>
          <h2>{featured.title}</h2>
          <p>{featured.text}</p>
          <Link href="/timeline">Continue through the World Timeline ↗</Link>
        </div>

        <div className="historyTodayGrid">
          {nearby.map((event) => (
            <article key={event.title}>
              <span>{event.month}/{event.day} · {event.year}</span>
              <h3>{event.title}</h3>
              <p>{event.text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageChrome>
  );
}

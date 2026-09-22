"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";
import BookmarkButton from "../components/BookmarkButton";
import { entries } from "../data/entries";

type Country = {
  code: string;
  name: string;
  capital: string;
  region: string;
  population: number;
  flag: string;
};

type News = {
  id: string;
  title: string;
  source: string;
  topic?: string;
  link: string;
  publishedAt: string;
  image?: string;
};

type EngineFilter = "all" | "knowledge" | "countries" | "news";

const rank = (value: string, term: string) => {
  if (!term) return 0;
  const text = value.toLowerCase();
  if (text === term) return 100;
  if (text.startsWith(term)) return 85;
  if (text.includes(" " + term)) return 70;
  if (text.includes(term)) return 50;
  return 0;
};

export default function GlobalEnginePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<EngineFilter>("all");
  const [countries, setCountries] = useState<Country[]>([]);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
    void Promise.all([
      fetch("/api/countries", { cache: "no-store" }).then((r) => r.json()).then((data) => setCountries(Array.isArray(data.countries) ? data.countries : [])),
      fetch("/api/news", { cache: "no-store" }).then((r) => r.json()).then((data) => setNews(Array.isArray(data.news) ? data.news : [])),
    ]).catch(() => {
      setCountries([]);
      setNews([]);
    });
  }, []);

  const term = query.trim().toLowerCase();

  const knowledge = useMemo(
    () =>
      entries
        .map((item) => ({ item, score: rank(item.title, term) + rank(item.category, term) + rank(item.description, term) }))
        .filter(({ score }) => !term || score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map(({ item }) => item),
    [term]
  );

  const countryResults = useMemo(
    () =>
      countries
        .map((item) => ({
          item,
          score: rank(item.name, term) + rank(item.capital, term) + rank(item.region, term),
        }))
        .filter(({ score }) => !term || score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)
        .map(({ item }) => item),
    [countries, term]
  );

  const newsResults = useMemo(
    () =>
      news
        .map((item) => ({ item, score: rank(item.title, term) + rank(item.topic || "", term) + rank(item.source, term) }))
        .filter(({ score }) => !term || score > 0)
        .sort((a, b) => b.score - a.score || new Date(b.item.publishedAt).getTime() - new Date(a.item.publishedAt).getTime())
        .slice(0, 12)
        .map(({ item }) => item),
    [news, term]
  );

  const total = knowledge.length + countryResults.length + newsResults.length;

  return (
    <PageChrome>
      <section className="pageHero engineHero compactHero">
        <span className="heroTag">GLOBALPEDIA · GLOBAL ENGINE</span>
        <h1>Search the whole world <em>fast.</em></h1>
        <p>One engine across GlobalPedia knowledge, countries and live Google News signals.</p>
        <div className="engineSearch">
          <span>⌕</span>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try GTA VI, Pakistan, space, history..." aria-label="Global Engine search" />
          <kbd>/</kbd>
        </div>
        <div className="engineFilters">
          {([
            ["all", "All"],
            ["knowledge", "Knowledge"],
            ["countries", "Countries"],
            ["news", "Live News"],
          ] as [EngineFilter, string][]).map(([value, label]) => (
            <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="enginePage sectionWrap">
        <div className="engineStats">
          <span>{term ? `Results for “${query}”` : "Start typing to search the world"}</span>
          <strong>{term ? total : "∞"}</strong>
        </div>

        {(filter === "all" || filter === "knowledge") && (
          <section className="engineBlock">
            <div className="engineHeading"><span>01</span><h2>Knowledge</h2><small>{knowledge.length}</small></div>
            <div className="engineCards">
              {knowledge.map((item) => (
                <div className="engineCard" key={item.slug}>
                  <Link href={"/articles/" + item.slug}>
                    <span>{item.category}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </Link>
                  <BookmarkButton id={"article:" + item.slug} title={item.title} />
                </div>
              ))}
            </div>
          </section>
        )}

        {(filter === "all" || filter === "countries") && (
          <section className="engineBlock">
            <div className="engineHeading"><span>02</span><h2>Countries</h2><small>{countryResults.length}</small></div>
            <div className="engineCards engineCountryCards">
              {countryResults.map((country) => (
                <Link className="engineCountry" href="/countries" key={country.code}>
                  <img src={country.flag} alt="" />
                  <div><strong>{country.name}</strong><span>{country.capital} · {country.region}</span></div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(filter === "all" || filter === "news") && (
          <section className="engineBlock">
            <div className="engineHeading"><span>03</span><h2>Live News</h2><small>{newsResults.length}</small></div>
            <div className="engineNewsGrid">
              {newsResults.map((item) => (
                <a href={item.link} target="_blank" rel="noreferrer" className="engineNews" key={item.id}>
                  <img src={item.image || ""} alt="" loading="lazy" />
                  <div><span>{item.topic || "World"} · {item.source}</span><h3>{item.title}</h3><small>{new Date(item.publishedAt).toLocaleString()}</small></div>
                </a>
              ))}
            </div>
          </section>
        )}

        {term && total === 0 && (
          <div className="engineEmpty">
            <strong>No direct match.</strong>
            <span>Try a wider phrase or open Global AI for a direct answer.</span>
            <Link href={"/ai?topic=" + encodeURIComponent(query)}>Ask Global AI ↗</Link>
          </div>
        )}
      </section>
    </PageChrome>
  );
}

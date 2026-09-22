
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

const editDistance = (a: string, b: string) => {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const saved = row[j];
      row[j] = a[i - 1] === b[j - 1]
        ? previous
        : Math.min(previous + 1, row[j - 1] + 1, saved + 1);
      previous = saved;
    }
  }
  return row[b.length];
};

export default function GlobalEnginePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<EngineFilter>("all");
  const [countries, setCountries] = useState<Country[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);

    try {
      setRecent(JSON.parse(window.localStorage.getItem("globalpedia_engine_recent") || "[]"));
    } catch {
      setRecent([]);
    }

    void Promise.all([
      fetch("/api/countries", { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => setCountries(Array.isArray(data.countries) ? data.countries : [])),
      fetch("/api/news", { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => setNews(Array.isArray(data.news) ? data.news : [])),
    ]).catch(() => {
      setCountries([]);
      setNews([]);
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)) {
        event.preventDefault();
        document.getElementById("global-engine-input")?.focus();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("global-engine-input")?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const term = query.trim().toLowerCase();

  const knowledge = useMemo(
    () =>
      entries
        .map((item) => ({
          item,
          score: rank(item.title, term) + rank(item.category, term) + rank(item.description, term),
        }))
        .filter(({ score }) => !term || score > 0)
        .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
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
        .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
        .slice(0, 12)
        .map(({ item }) => item),
    [countries, term]
  );

  const newsResults = useMemo(
    () =>
      news
        .map((item) => ({
          item,
          score: rank(item.title, term) + rank(item.topic || "", term) + rank(item.source, term),
        }))
        .filter(({ score }) => !term || score > 0)
        .sort(
          (a, b) =>
            b.score - a.score ||
            new Date(b.item.publishedAt).getTime() - new Date(a.item.publishedAt).getTime()
        )
        .slice(0, 12)
        .map(({ item }) => item),
    [news, term]
  );

  const recentSuggestions = term
    ? []
    : recent.slice(0, 5);

  const autocomplete = term
    ? Array.from(
        new Set(
          [
            ...entries.map((item) => item.title),
            ...entries.map((item) => item.category),
            ...countries.map((item) => item.name),
            ...countries.map((item) => item.capital),
            ...news.slice(0, 20).map((item) => item.title),
          ]
            .filter(Boolean)
            .filter((value) => value.toLowerCase().includes(term))
        )
      ).slice(0, 7)
    : [];

  const candidates = [
    ...entries.map((item) => item.title),
    ...countries.map((item) => item.name),
    ...countries.map((item) => item.capital),
  ];

  const didYouMean = term && knowledge.length + countryResults.length + newsResults.length === 0
    ? candidates
        .map((value) => ({ value, score: editDistance(term, value.toLowerCase()) }))
        .filter(({ value }) => value.toLowerCase() !== term && value.length > 2)
        .sort((a, b) => a.score - b.score)
        .find(({ score }) => score <= Math.max(2, Math.floor(term.length * 0.35)))?.value
    : "";

  const total = knowledge.length + countryResults.length + newsResults.length;

  const commitSearch = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    const next = [clean, ...recent.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
    setRecent(next);
    window.localStorage.setItem("globalpedia_engine_recent", JSON.stringify(next));
    window.history.replaceState(null, "", "/engine?q=" + encodeURIComponent(clean));
  };

  return (
    <PageChrome>
      <section className="pageHero engineHero compactHero">
        <span className="heroTag">GLOBALPEDIA · GLOBAL ENGINE</span>
        <h1>Search the whole world <em>fast.</em></h1>
        <p>One engine across GlobalPedia knowledge, countries and live Google News signals.</p>

        <div className="engineSearch">
          <span>⌕</span>
          <input
            id="global-engine-input"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitSearch(query);
              if (event.key === "Escape") setQuery("");
            }}
            placeholder="Try GTA VI, Pakistan, space, history..."
            aria-label="Global Engine search"
          />
          <kbd>⌘K</kbd>
        </div>

        {autocomplete.length > 0 && (
          <div className="engineAutocomplete">
            {autocomplete.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  commitSearch(suggestion);
                }}
              >
                <span>⌕</span>{suggestion}
              </button>
            ))}
          </div>
        )}

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
        {!term && recentSuggestions.length > 0 && (
          <div className="engineRecent">
            <div>
              <span>RECENT SEARCHES</span>
              <strong>Continue where you left off</strong>
            </div>
            <div className="engineRecentList">
              {recentSuggestions.map((item) => (
                <button key={item} onClick={() => { setQuery(item); commitSearch(item); }}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

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
                  <div>
                    <span>{item.topic || "World"} · {item.source}</span>
                    <h3>{item.title}</h3>
                    <small>{new Date(item.publishedAt).toLocaleString()}</small>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {term && total === 0 && (
          <div className="engineEmpty">
            <strong>No direct match.</strong>
            {didYouMean && (
              <span>
                Did you mean{" "}
                <button className="engineDidYouMean" onClick={() => { setQuery(didYouMean); commitSearch(didYouMean); }}>
                  {didYouMean}
                </button>
                ?
              </span>
            )}
            <span>Try a wider phrase or ask Global AI for a direct answer.</span>
            <Link href={"/ai?topic=" + encodeURIComponent(query)}>Ask Global AI ↗</Link>
          </div>
        )}
      </section>
    </PageChrome>
  );
}

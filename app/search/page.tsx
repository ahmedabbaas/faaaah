"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageChrome from "../components/PageChrome";
import BookmarkButton from "../components/BookmarkButton";
import { entries } from "../data/entries";

type Country = {
  code: string;
  name: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
  currencies: string[];
  flag: string;
};
type News = {
  id: string;
  title: string;
  source: string;
  topic?: string;
  link: string;
  publishedAt: string;
};

type Filter = "all" | "articles" | "countries" | "news";

const score = (value: string, term: string) => {
  if (!term) return 0;
  const text = value.toLowerCase();
  if (text.startsWith(term)) return 80;
  if (text.includes(" " + term)) return 65;
  if (text.includes(term)) return 45;
  return 0;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [countries, setCountries] = useState<Country[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const urlQuery = new URLSearchParams(window.location.search).get("q");
    if (urlQuery) setQuery(urlQuery);
    fetch("/api/countries", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCountries(Array.isArray(d.countries) ? d.countries : []))
      .catch(() => { /* Keep search usable when an auxiliary feed is unavailable. */ });
    fetch("/api/news", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setNews(Array.isArray(d.news) ? d.news : []))
      .catch(() => { /* Keep search usable when an auxiliary feed is unavailable. */ });
    try {
      setRecent(JSON.parse(localStorage.getItem("globalpedia_search_history") || "[]"));
    } catch {
      // Ignore malformed local search history and start fresh.
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("universal-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const commitSearch = (value = query) => {
    const clean = value.trim();
    if (!clean) return;
    const next = [clean, ...recent.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setRecent(next);
    localStorage.setItem("globalpedia_search_history", JSON.stringify(next));
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem("globalpedia_search_history");
  };

  const term = query.trim().toLowerCase();

  const articleResults = useMemo(
    () =>
      entries
        .map((item) => ({
          item,
          score: score(item.title + " " + item.category, term) + score(item.description, term),
        }))
        .filter(({ score: value }) => !term || value > 0)
        .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
        .map(({ item }) => item),
    [term]
  );

  const countryResults = useMemo(
    () =>
      countries
        .map((item) => ({
          item,
          score: score(item.name, term) + score(item.capital, term) + score(item.region, term),
        }))
        .filter(({ score: value }) => !term || value > 0)
        .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
        .slice(0, 18)
        .map(({ item }) => item),
    [countries, term]
  );

  const newsResults = useMemo(
    () =>
      news
        .map((item) => ({
          item,
          score: score(item.title, term) + score(item.topic || "", term) + score(item.source, term),
        }))
        .filter(({ score: value }) => !term || value > 0)
        .sort(
          (a, b) =>
            b.score - a.score ||
            new Date(b.item.publishedAt).getTime() - new Date(a.item.publishedAt).getTime()
        )
        .slice(0, 12)
        .map(({ item }) => item),
    [news, term]
  );

  const visibleArticles = filter === "all" || filter === "articles";
  const visibleCountries = filter === "all" || filter === "countries";
  const visibleNews = filter === "all" || filter === "news";
  const total = articleResults.length + countryResults.length + newsResults.length;

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · UNIVERSAL SEARCH</span>
        <h1>Search the <em>whole index.</em></h1>
        <p>One search across GlobalPedia articles, countries and current live signals.</p>
        <div className="pageSearch searchUpgraded" id="search">
          <span>⌕</span>
          <input
            id="universal-search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitSearch();
              if (e.key === "Escape") setQuery("");
            }}
            placeholder="Search anything..."
            aria-label="Search everything"
          />
          <kbd>⌘K</kbd>
          <strong>{total}</strong>
        </div>

        <div className="searchFilters" role="tablist" aria-label="Search result type">
          {([
            ["all", "Everything"],
            ["articles", "Articles"],
            ["countries", "Countries"],
            ["news", "Live news"],
          ] as [Filter, string][]).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={filter === value}
              className={filter === value ? "active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {!term && recent.length > 0 && (
        <section className="searchRecent sectionWrap">
          <div className="searchRecentHeading">
            <div><span>RECENT</span><h2>Search again</h2></div>
            <button onClick={clearRecent}>Clear</button>
          </div>
          <div className="searchRecentList">
            {recent.map((item) => (
              <button key={item} onClick={() => { setQuery(item); commitSearch(item); }}>
                <span>⌕</span>{item}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="featureResults sectionWrap">
        {visibleArticles && (
          <div className="resultBlock">
            <div className="resultHeading"><span>01</span><h2>Articles</h2><small>{articleResults.length}</small></div>
            {articleResults.length ? (
              <div className="resultGrid">
                {articleResults.map((item) => (
                  <div className="resultCard" key={item.slug}>
                    <Link className="resultCardLink" href={"/articles/" + item.slug}>
                      <div><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p></div>
                    </Link>
                    <BookmarkButton id={"article:" + item.slug} title={item.title} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="searchEmpty">No matching articles.</div>
            )}
          </div>
        )}

        {visibleCountries && (
          <div className="resultBlock">
            <div className="resultHeading"><span>02</span><h2>Countries</h2><small>{countryResults.length}</small></div>
            {countryResults.length ? (
              <div className="resultGrid countryResultsGrid">
                {countryResults.map((item) => (
                  <Link className="resultCard countrySearchCard" href="/countries" key={item.code}>
                    <img src={item.flag} alt="" />
                    <div><span>{item.region}</span><h3>{item.name}</h3><p>{item.capital} · {item.languages.slice(0, 2).join(" · ") || "Languages unavailable"}</p></div>
                    <b>{item.currencies[0] || "Currency unavailable"}</b>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="searchEmpty">No matching countries.</div>
            )}
          </div>
        )}

        {visibleNews && (
          <div className="resultBlock">
            <div className="resultHeading"><span>03</span><h2>Live signals</h2><small>{newsResults.length}</small></div>
            {newsResults.length ? (
              <div className="newsSearchGrid">
                {newsResults.map((item) => (
                  <a className="resultCard newsResultCard" href={item.link} target="_blank" rel="noreferrer" key={item.id}>
                    <div><span>LIVE · {item.source}</span><h3>{item.title}</h3><p>{item.topic || "World"} · {new Date(item.publishedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p></div>
                    <b>↗</b>
                  </a>
                ))}
              </div>
            ) : (
              <div className="searchEmpty">No matching live signals.</div>
            )}
          </div>
        )}

        {term && total === 0 && (
          <div className="searchNoMatch">
            <strong>No results for “{query}”.</strong>
            <span>Try a country, category, article title or a broader phrase.</span>
          </div>
        )}
      </section>
    </PageChrome>
  );
}

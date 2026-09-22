"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageChrome from "../components/PageChrome";
import BookmarkButton from "../components/BookmarkButton";
import { entries } from "../data/entries";

type Country = { code: string; name: string; capital: string; region: string; population: number; languages: string[]; currencies: string[]; flag: string };
type News = { id: string; title: string; source: string; topic?: string; link: string; publishedAt: string };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    fetch("/api/countries", { cache: "no-store" }).then((r) => r.json()).then((d) => setCountries(d.countries || [])).catch(() => {});
    fetch("/api/news", { cache: "no-store" }).then((r) => r.json()).then((d) => setNews(d.news || [])).catch(() => {});
  }, []);

  const term = query.trim().toLowerCase();
  const articleResults = useMemo(
    () => entries.filter((x) => !term || (x.title + " " + x.description + " " + x.category).toLowerCase().includes(term)),
    [term]
  );
  const countryResults = useMemo(
    () => countries.filter((x) => !term || (x.name + " " + x.capital + " " + x.region).toLowerCase().includes(term)).slice(0, 12),
    [countries, term]
  );
  const newsResults = useMemo(
    () => news.filter((x) => !term || (x.title + " " + x.source + " " + (x.topic || "")).toLowerCase().includes(term)).slice(0, 8),
    [news, term]
  );

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · UNIVERSAL SEARCH</span>
        <h1>Search the <em>whole index.</em></h1>
        <p>One search across GlobalPedia articles, countries and current live signals.</p>
        <div className="pageSearch" id="search">
          <span>⌕</span>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try Pakistan, space, Japan, AI..." aria-label="Search everything" />
          <strong>{articleResults.length + countryResults.length + newsResults.length}</strong>
        </div>
      </section>

      <section className="featureResults sectionWrap">
        <div className="resultBlock">
          <div className="resultHeading"><span>01</span><h2>Articles</h2></div>
          <div className="resultGrid">
            {articleResults.map((item) => (
              <Link className="resultCard" href={"/articles/" + item.slug} key={item.slug}>
                <div><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p></div>
                <BookmarkButton id={"article:" + item.slug} title={item.title} />
              </Link>
            ))}
          </div>
        </div>

        <div className="resultBlock">
          <div className="resultHeading"><span>02</span><h2>Countries</h2></div>
          <div className="resultGrid countryResultsGrid">
            {countryResults.map((item) => (
              <Link className="resultCard countrySearchCard" href="/countries" key={item.code}>
                <img src={item.flag} alt="" />
                <div><span>{item.region}</span><h3>{item.name}</h3><p>{item.capital} · {item.languages.slice(0, 2).join(" · ") || "Languages unavailable"}</p></div>
                <b>{item.currencies[0] || "Currency unavailable"}</b>
              </Link>
            ))}
          </div>
        </div>

        <div className="resultBlock">
          <div className="resultHeading"><span>03</span><h2>Live signals</h2></div>
          <div className="newsSearchGrid">
            {newsResults.map((item) => (
              <a className="resultCard newsResultCard" href={item.link} target="_blank" rel="noreferrer" key={item.id}>
                <div><span>LIVE · {item.source}</span><h3>{item.title}</h3><p>{item.topic || "World"} · {new Date(item.publishedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p></div>
                <b>↗</b>
              </a>
            ))}
          </div>
        </div>
      </section>
    </PageChrome>
  );
}

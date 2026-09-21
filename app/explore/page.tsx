"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageChrome from "../components/PageChrome";
import { categories, entries } from "../data/entries";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const categoryMatch = category === "All" || entry.category === category;
      const queryMatch =
        !term ||
        `${entry.title} ${entry.description} ${entry.category}`
          .toLowerCase()
          .includes(term);
      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  return (
    <PageChrome>
      <section className="pageHero">
        <div className="pageHeroGlow" aria-hidden="true" />
        <span className="heroTag">GLOBALPEDIA · EXPLORE</span>
        <h1>Find something worth <em>learning.</em></h1>
        <p>
          Search the growing knowledge index across history, science, technology,
          culture, nature, health and the rest of this gloriously complicated planet.
        </p>
        <div className="pageSearch" id="search">
          <span>⌕</span>
          <input
            autoFocus={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles, topics, categories..."
            aria-label="Search articles"
          />
          <strong>{filtered.length}</strong>
        </div>
      </section>

      <section className="directorySection sectionWrap">
        <div className="filterRow">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="directoryGrid">
          {filtered.map((entry) => (
            <Link href={`/articles/${entry.slug}`} className="directoryCard" key={entry.slug}>
              <div className="directoryImage">
                <img src={entry.image} alt="" loading="lazy" />
                <span className={`articleTag tag-${entry.accent}`}>{entry.category.toUpperCase()}</span>
              </div>
              <div className="directoryCopy">
                <span>{entry.number} · {entry.meta}</span>
                <h2>{entry.title}</h2>
                <p>{entry.description}</p>
                <b>Read article ↗</b>
              </div>
            </Link>
          ))}
        </div>

        {!filtered.length && (
          <div className="emptyState">
            <strong>No exact match.</strong>
            <span>Try a broader topic. The universe has already supplied enough things to search.</span>
          </div>
        )}
      </section>
    </PageChrome>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, entries } from "../data/entries";

export default function GlobalPediaHome() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        inputRef.current?.blur();
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const categoryMatch = active === "All" || entry.category === active;
      const queryMatch =
        !normalized ||
        `${entry.title} ${entry.description} ${entry.category}`.toLowerCase().includes(normalized);
      return categoryMatch && queryMatch;
    });
  }, [active, query]);

  return (
    <main>
      <a className="skipLink" href="#main-content">Skip to content</a>
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <Link className="brand" href="#top" aria-label="GlobalPedia home">
          <span className="brandMark">G</span>
          <span>GLOBALPEDIA</span>
        </Link>
        <nav className={`topnav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          <a href="#explore" onClick={() => setMenuOpen(false)}>Explore</a>
          <a href="#featured" onClick={() => setMenuOpen(false)}>Featured</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
        <div className="topbarActions">
          <a href="#explore" className="textButton">Browse</a>
          <button className="menuButton" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">☰</button>
        </div>
      </header>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="heroGrid" aria-hidden="true" />
        <div className="heroHalo haloOne" aria-hidden="true" />
        <div className="heroHalo haloTwo" aria-hidden="true" />
        <div className="heroCopy" id="main-content">
          <div className="eyebrow"><span /> THE OPEN KNOWLEDGE INDEX</div>
          <h1 id="hero-title">Know more.<br /><span>See farther.</span></h1>
          <p className="heroLead">A cinematic, human-friendly encyclopedia for the questions that keep you awake, curious, and occasionally lost at 2 a.m.</p>
          <div className="searchShell">
            <div className="searchIcon" aria-hidden="true">⌕</div>
            <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search science, history, cities, ideas..." aria-label="Search knowledge" />
            <span className="searchHint">Press /</span>
          </div>
          <div className="heroStats" aria-label="GlobalPedia overview">
            <span><b>06</b> domains</span>
            <span><b>∞</b> questions</span>
            <span><b>01</b> place to start</span>
          </div>
        </div>
        <div className="heroVisual" aria-hidden="true">
          <div className="planet planetBack" />
          <div className="planet planetFront" />
          <div className="orbit orbitOne" />
          <div className="orbit orbitTwo" />
          <div className="orbitDot" />
          <div className="visualLabel labelTop">THE KNOWN<br /><strong>WORLD</strong></div>
          <div className="visualLabel labelBottom">BUILD A BETTER<br /><strong>MENTAL MAP.</strong></div>
        </div>
      </section>

      <section id="explore" className="explore sectionWrap">
        <div className="sectionIntro">
          <div>
            <div className="eyebrow muted"><span /> EXPLORE THE INDEX</div>
            <h2>Pick a direction.</h2>
          </div>
          <p>Six doors into the same enormous room. Humans named things so they could understand them. We kept the useful part.</p>
        </div>
        <div className="categoryRail" role="group" aria-label="Knowledge categories">
          {categories.map((category) => (
            <button key={category} className={active === category ? "active" : ""} onClick={() => setActive(category)} aria-pressed={active === category}>
              {category}
            </button>
          ))}
        </div>
      </section>

      <section id="featured" className="library sectionWrap" aria-labelledby="featured-title">
        <div className="sectionBar">
          <div>
            <div className="eyebrow muted"><span /> CURATED KNOWLEDGE</div>
            <h2 id="featured-title">Worth your attention.</h2>
          </div>
          <span className="resultCount" aria-live="polite">{filtered.length.toString().padStart(2, "0")} stories</span>
        </div>

        <div className="storyGrid">
          {filtered.map((entry) => (
            <article key={entry.slug} className={`storyCard ${entry.featured ? "featured" : ""} accent-${entry.accent}`}>
              <div className="storyTexture" aria-hidden="true" />
              <div className="storyTop"><span>{entry.number}</span><span>{entry.category}</span></div>
              <div className="storyBody">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                <div className="storyFooter"><span>{entry.meta}</span><Link href={`/articles/${entry.slug}`} aria-label={`Read ${entry.title}`}>↗</Link></div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="emptyState">
            <div className="emptyIcon">⌁</div>
            <h3>No article matched that search.</h3>
            <p>Try another idea, category, or fewer words. The database is not personally offended.</p>
            <button onClick={() => { setQuery(""); setActive("All"); }}>Reset search</button>
          </div>
        )}
      </section>

      <section id="about" className="manifesto sectionWrap">
        <div className="manifestoRule" />
        <div className="manifestoInner">
          <div className="eyebrow"><span /> THE IDEA</div>
          <h2>Curiosity is not a distraction.<br /><em>It is the engine.</em></h2>
          <p>GlobalPedia is designed around one simple belief: useful knowledge should feel inviting, legible, and alive. Not a wall of text. Not a maze of links. A map.</p>
        </div>
        <div className="signature">GP<span>01</span></div>
      </section>

      <footer className="footer">
        <Link className="brand footerBrand" href="#top"><span className="brandMark">G</span><span>GLOBALPEDIA</span></Link>
        <div className="footerMeta"><span>KNOWLEDGE WITHOUT BOUNDARIES.</span><span>© 2026 GLOBALPEDIA</span></div>
      </footer>
    </main>
  );
}

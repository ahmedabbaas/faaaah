"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, entries, regions } from "../data/entries";

type IconName = "countries" | "history" | "science" | "technology" | "culture" | "nature" | "health" | "arts";

const iconMap: Record<IconName, JSX.Element> = {
  countries: <><circle cx="12" cy="12" r="8.5"/><path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.2 2.3 3.4 5.1 3.4 8.5S14.2 18.2 12 20.5C9.8 18.2 8.6 15.4 8.6 12S9.8 5.8 12 3.5Z"/></>,
  history: <><path d="M5 20h14M7 17V9m4 8V9m4 8V9M4 7h16M6 5h12"/><path d="m7 7 5-3 5 3"/></>,
  science: <><circle cx="12" cy="12" r="2"/><path d="M12 3c2.3 0 4.1 4 4.1 9s-1.8 9-4.1 9-4.1-4-4.1-9S9.7 3 12 3Z"/><path d="M4.2 7c1.2-2 5.5-.2 9.2 3s5.9 6.8 4.7 8.8-5.5.2-9.2-3S3 9 4.2 7Z" transform="rotate(120 12 12)"/></>,
  technology: <><rect x="5" y="5" width="14" height="11" rx="2"/><path d="M9 20h6M12 16v4"/></>,
  culture: <><circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3.5 20c.5-3.2 2.1-5 4.5-5s4 1.8 4.5 5M11.5 20c.5-3.2 2.1-5 4.5-5s4 1.8 4.5 5"/></>,
  nature: <><path d="M12 20V6"/><path d="M12 11C7 10 5 7 5 4c3 0 6 1 7 4"/><path d="M12 15c5-1 7-4 7-7-3 0-6 1-7 4"/></>,
  health: <path d="M20 8.5C20 14 12 20 12 20S4 14 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5Z"/>,
  arts: <><circle cx="12" cy="12" r="8.5"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="10" r="1"/><path d="M8 16c2 1.4 6 1.4 8 0"/></>,
};

const categoryCards: { label: string; sub: string; icon: IconName; tone: string }[] = [
  { label: "Countries", sub: "195+", icon: "countries", tone: "blue" },
  { label: "History", sub: "Explore past", icon: "history", tone: "orange" },
  { label: "Science", sub: "Discover more", icon: "science", tone: "violet" },
  { label: "Technology", sub: "Future & innovation", icon: "technology", tone: "blue2" },
  { label: "Culture", sub: "People & traditions", icon: "culture", tone: "pink" },
  { label: "Nature", sub: "Our planet", icon: "nature", tone: "teal" },
  { label: "Health", sub: "Live better", icon: "health", tone: "red" },
  { label: "Arts", sub: "Creativity & more", icon: "arts", tone: "purple" },
];

const heroImage = "https://images.unsplash.com/photo-1634176866089-b633f4aec882?auto=format&fit=crop&fm=jpg&q=88&w=1800";

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
    const term = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const categoryMatch = active === "All" || entry.category === active || (active === "Countries" && entry.slug.includes("pakistan"));
      const queryMatch = !term || `${entry.title} ${entry.description} ${entry.category}`.toLowerCase().includes(term);
      return categoryMatch && queryMatch;
    });
  }, [active, query]);

  const featured = filtered.length ? filtered.slice(0, 3) : entries.slice(0, 3);

  return (
    <main>
      <a className="skipLink" href="#main-content">Skip to content</a>
      <div className="noise" aria-hidden="true" />

      <header className="topbar">
        <Link className="brand" href="#top" aria-label="GlobalPedia home">
          <span className="brandMark globeMark">◎</span>
          <span>Global<span className="brandBlue">Pedia</span></span>
        </Link>
        <nav className={`topnav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          {[["Home", "#top"], ["Explore", "#categories"], ["Categories", "#categories"], ["Countries", "#regions"], ["Random", "#featured"], ["About", "#about"]].map(([label, href], index) => (
            <a className={index === 0 ? "active" : ""} key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
        <div className="topbarActions">
          <button className="iconButton" onClick={() => inputRef.current?.focus()} aria-label="Focus search">⌕</button>
          <button className="signButton">Sign In</button>
          <button className="menuButton" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">☰</button>
        </div>
      </header>

      <section id="top" className="heroMain">
        <img className="heroImage" src={heroImage} alt="Earth viewed from space at night" fetchPriority="high" />
        <div className="heroOverlay" />
        <div className="starField" aria-hidden="true" />
        <div className="heroContent" id="main-content">
          <div className="heroTag">ONE WORLD <span>•</span> ENDLESS KNOWLEDGE</div>
          <h1>Global<span>Pedia</span></h1>
          <h2>Discover. Learn. Explore.</h2>
          <p>GlobalPedia is your source for reliable, visual and human-friendly knowledge about the world, from countries and cultures to history, science and technology.</p>
          <div className="heroSearch">
            <span className="searchGlyph">⌕</span>
            <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for countries, people, events, science..." aria-label="Search GlobalPedia" />
            <span className="slashHint">/</span>
            <button aria-label="Search">→</button>
          </div>
          <div className="popular"><span>Popular:</span>{["Pakistan", "Space", "World War II", "Technology", "Ancient History"].map((item) => <button key={item} onClick={() => setQuery(item)}>{item}</button>)}</div>
        </div>
        <div className="heroAside" aria-hidden="true">
          <p>A whole world<br />of knowledge<span>.</span></p>
          <div className="scribble" />
        </div>
        <div className="heroOrbital orbA" aria-hidden="true" />
        <div className="heroOrbital orbB" aria-hidden="true" />
      </section>

      <section id="categories" className="categorySection sectionWrap">
        <div className="categoryGrid">
          {categoryCards.map((item) => (
            <button key={item.label} className={`categoryCard tone-${item.tone}`} onClick={() => setActive(item.label)} aria-pressed={active === item.label}>
              <span className="categoryIcon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{iconMap[item.icon]}</svg></span>
              <strong>{item.label}</strong>
              <small>{item.sub}</small>
            </button>
          ))}
        </div>
      </section>

      <section id="featured" className="contentSection sectionWrap">
        <div className="sectionHeading">
          <div><span className="sectionKicker">✦</span><h2>Featured Articles</h2></div>
          <a href="#featured">View All →</a>
        </div>
        <div className="contentColumns">
          <div className="articleGrid">
            {featured.map((entry) => (
              <Link href={`/articles/${entry.slug}`} key={entry.slug} className="articleCard">
                <div className="articleImageWrap"><img src={entry.image} alt="" loading="lazy" /><div className={`articleTag tag-${entry.accent}`}>{entry.category.toUpperCase()}</div></div>
                <div className="articleText"><h3>{entry.title}</h3><p>{entry.description}</p><div className="articleMeta"><span>◷ {entry.meta.split(" · ")[0]}</span><span>◴ {entry.meta.split(" · ")[1]}</span></div></div>
              </Link>
            ))}
          </div>
          <aside className="factsPanel">
            <div className="panelHeader"><span>✦</span><h3>Quick Facts</h3></div>
            {[['Total Articles','50,000+'],['Countries','195+'],['Languages','20+'],['Last Updated','Sep 10, 2026']].map(([label,value]) => <div className="factRow" key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </aside>
        </div>
        <div className="worldPanel">
          <div><span className="sectionKicker">◈</span><h3>Explore the World</h3><p>Jump from one corner of the planet to another.</p></div>
          <div className="worldMap" aria-hidden="true"><div className="mapDots" /></div>
          <a href="#regions">View All Countries →</a>
        </div>
      </section>

      <section id="regions" className="regionSection sectionWrap">
        <div className="sectionHeading"><div><h2>Explore by Region</h2></div><a href="#regions">View All →</a></div>
        <div className="regionGrid">
          {regions.map((region) => <a className="regionCard" href="#featured" key={region.name}><img src={region.image} alt="" loading="lazy" /><span>{region.name}</span></a>)}
        </div>
      </section>

      <section id="about" className="aboutSection sectionWrap">
        <div className="aboutCopy"><span className="heroTag">GLOBALPEDIA <span>•</span> THE IDEA</span><h2>Knowledge should feel<br /><em>worth exploring.</em></h2><p>Not a wall of text. Not a maze of links. A visual, searchable map of the world with room for the details humans inevitably insist on arguing about.</p></div>
        <div className="aboutStat"><strong>01</strong><span>WORLD<br />INDEX</span></div>
      </section>

      <footer className="footer"><Link className="brand" href="#top"><span className="brandMark globeMark">◎</span><span>Global<span className="brandBlue">Pedia</span></span></Link><div><span>ONE WORLD • ENDLESS KNOWLEDGE</span><span>© 2026 GLOBALPEDIA</span></div></footer>
    </main>
  );
}

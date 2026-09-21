"use client";

import { useMemo, useState } from "react";

type Entry = {
  category: string;
  number: string;
  title: string;
  description: string;
  meta: string;
  accent: string;
  featured?: boolean;
};

const categories = ["All", "Science", "History", "Technology", "Geography", "Culture", "Space"];

const entries: Entry[] = [
  {
    category: "Space",
    number: "01",
    title: "The universe is still getting larger",
    description: "A visual introduction to cosmic expansion, dark energy, and the strange geometry of space-time.",
    meta: "12 min read · Updated Sep 2026",
    accent: "violet",
    featured: true,
  },
  {
    category: "Technology",
    number: "02",
    title: "Inside the architecture of modern AI",
    description: "How transformers, data, training and inference turned research ideas into everyday tools.",
    meta: "9 min read · Technology",
    accent: "green",
  },
  {
    category: "History",
    number: "03",
    title: "Why cities became civilization's engines",
    description: "Trade routes, rivers, migration and institutions helped cities become the organizing systems of human life.",
    meta: "11 min read · History",
    accent: "amber",
  },
  {
    category: "Science",
    number: "04",
    title: "What makes a living system alive?",
    description: "A tour from cells and metabolism to adaptation, information and the edge of biology.",
    meta: "8 min read · Science",
    accent: "cyan",
  },
  {
    category: "Geography",
    number: "05",
    title: "The invisible map beneath every country",
    description: "Climate, terrain, oceans and resources shape the world long before borders are drawn.",
    meta: "7 min read · Geography",
    accent: "blue",
  },
  {
    category: "Culture",
    number: "06",
    title: "How ideas travel between cultures",
    description: "Languages, food, art and stories constantly cross borders, mutate and become something new.",
    meta: "10 min read · Culture",
    accent: "rose",
  },
];

export default function GlobalPediaHome() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="GlobalPedia home">
          <span className="brandMark">G</span>
          <span>GLOBALPEDIA</span>
        </a>
        <nav className={`topnav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          <a href="#explore" onClick={() => setMenuOpen(false)}>Explore</a>
          <a href="#featured" onClick={() => setMenuOpen(false)}>Featured</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
        <div className="topbarActions">
          <a href="#explore" className="textButton">Browse</a>
          <button className="menuButton" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">☰</button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="heroGrid" aria-hidden="true" />
        <div className="heroHalo haloOne" aria-hidden="true" />
        <div className="heroHalo haloTwo" aria-hidden="true" />
        <div className="heroCopy">
          <div className="eyebrow"><span /> THE OPEN KNOWLEDGE INDEX</div>
          <h1>Know more.<br /><span>See farther.</span></h1>
          <p className="heroLead">A cinematic, human-friendly encyclopedia for the questions that keep you awake, curious, and occasionally lost at 2 a.m.</p>
          <div className="searchShell">
            <div className="searchIcon">⌕</div>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search science, history, cities, ideas..." aria-label="Search knowledge" />
            <span className="searchHint">Press /</span>
          </div>
          <div className="heroStats">
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
        <div className="categoryRail" role="tablist" aria-label="Knowledge categories">
          {categories.map((category) => (
            <button key={category} className={active === category ? "active" : ""} onClick={() => setActive(category)} role="tab" aria-selected={active === category}>
              {category}
            </button>
          ))}
        </div>
      </section>

      <section id="featured" className="library sectionWrap">
        <div className="sectionBar">
          <div>
            <div className="eyebrow muted"><span /> CURATED KNOWLEDGE</div>
            <h2>Worth your attention.</h2>
          </div>
          <span className="resultCount">{filtered.length.toString().padStart(2, "0")} stories</span>
        </div>

        <div className="storyGrid">
          {filtered.map((entry) => (
            <article key={entry.number} className={`storyCard ${entry.featured ? "featured" : ""} accent-${entry.accent}`}>
              <div className="storyTexture" aria-hidden="true" />
              <div className="storyTop"><span>{entry.number}</span><span>{entry.category}</span></div>
              <div className="storyBody">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                <div className="storyFooter"><span>{entry.meta}</span><button aria-label={`Open ${entry.title}`}>↗</button></div>
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
        <div className="brand footerBrand"><span className="brandMark">G</span><span>GLOBALPEDIA</span></div>
        <div className="footerMeta"><span>KNOWLEDGE WITHOUT BOUNDARIES.</span><span>© 2026 GLOBALPEDIA</span></div>
      </footer>
    </main>
  );
}

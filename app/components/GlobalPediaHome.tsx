"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { entries, regions } from "../data/entries";

type IconName =
  | "countries"
  | "history"
  | "science"
  | "technology"
  | "culture"
  | "nature"
  | "health"
  | "arts";

type NewsItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  publishedAt: string;
  category: string;
};

const categoryCards: {
  label: string;
  sub: string;
  icon: IconName;
  tone: string;
}[] = [
  { label: "Countries", sub: "195+ nations", icon: "countries", tone: "blue" },
  { label: "History", sub: "Civilizations & eras", icon: "history", tone: "orange" },
  { label: "Science", sub: "Ideas & discovery", icon: "science", tone: "violet" },
  { label: "Technology", sub: "Future & innovation", icon: "technology", tone: "blue2" },
  { label: "Culture", sub: "People & traditions", icon: "culture", tone: "pink" },
  { label: "Nature", sub: "Planet & wildlife", icon: "nature", tone: "teal" },
  { label: "Health", sub: "Life & wellbeing", icon: "health", tone: "red" },
  { label: "Arts", sub: "Creativity & expression", icon: "arts", tone: "purple" },
];

const heroImage =
  "https://images.unsplash.com/photo-1634176866089-b633f4aec882?auto=format&fit=crop&fm=jpg&q=90&w=2400";

const universeImage =
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=88&w=1800";

const worldImages = [
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=88&w=1200",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=88&w=1200",
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=88&w=1200",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&q=88&w=1200",
];

const iconMap: Record<IconName, ReactNode> = {
  countries: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.8 9h16.4M3.8 15h16.4M12 3.5c2.2 2.3 3.4 5.1 3.4 8.5S14.2 18.2 12 20.5C9.8 18.2 8.6 15.4 8.6 12S9.8 5.8 12 3.5Z" />
    </>
  ),
  history: (
    <>
      <path d="M5 20h14M7 17V9m4 8V9m4 8V9M4 7h16M6 5h12" />
      <path d="m7 7 5-3 5 3" />
    </>
  ),
  science: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 3c2.3 0 4.1 4 4.1 9s-1.8 9-4.1 9-4.1-4-4.1-9S9.7 3 12 3Z" />
      <path d="M4.2 7c1.2-2 5.5-.2 9.2 3s5.9 6.8 4.7 8.8-5.5.2-9.2-3S3 9 4.2 7Z" transform="rotate(120 12 12)" />
    </>
  ),
  technology: (
    <>
      <rect x="5" y="5" width="14" height="11" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  culture: (
    <>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M3.5 20c.5-3.2 2.1-5 4.5-5s4 1.8 4.5 5M11.5 20c.5-3.2 2.1-5 4.5-5s4 1.8 4.5 5" />
    </>
  ),
  nature: (
    <>
      <path d="M12 20V6" />
      <path d="M12 11C7 10 5 7 5 4c3 0 6 1 7 4" />
      <path d="M12 15c5-1 7-4 7-7-3 0-6 1-7 4" />
    </>
  ),
  health: <path d="M20 8.5C20 14 12 20 12 20S4 14 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5Z" />,
  arts: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="8" cy="10" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="16" cy="10" r="1" />
      <path d="M8 16c2 1.4 6 1.4 8 0" />
    </>
  ),
};

function tiltStyle(
  event: MouseEvent<HTMLElement>,
  strength = 7,
): CSSProperties & Record<string, string> {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  return {
    "--rx": `${(-y * strength).toFixed(2)}deg`,
    "--ry": `${(x * strength).toFixed(2)}deg`,
    "--mx": `${((x + 0.5) * 100).toFixed(1)}%`,
    "--my": `${((y + 0.5) * 100).toFixed(1)}%`,
  };
}

function TiltCard({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const [style, setStyle] = useState<CSSProperties & Record<string, string>>({});
  const content = <div className={className} style={style}>{children}</div>;

  const handlers = {
    onMouseMove: (event: MouseEvent<HTMLDivElement>) => setStyle(tiltStyle(event)),
    onMouseLeave: () =>
      setStyle({
        "--rx": "0deg",
        "--ry": "0deg",
        "--mx": "50%",
        "--my": "50%",
      }),
  };

  if (href) {
    return (
      <Link
        href={href}
        className="tiltLink"
        onMouseMove={handlers.onMouseMove}
        onMouseLeave={handlers.onMouseLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <div onMouseMove={handlers.onMouseMove} onMouseLeave={handlers.onMouseLeave}>
      {content}
    </div>
  );
}

export default function GlobalPediaHome() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState("");
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsRefreshing, setNewsRefreshing] = useState(false);
  const [newsError, setNewsError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLElement>(null);

  const loadLiveNews = async (manual = false) => {
    try {
      setNewsError("");
      if (manual) setNewsRefreshing(true);
      const response = await fetch("/api/news", { cache: "no-store" });
      if (!response.ok) throw new Error("News request failed");
      const data = (await response.json()) as {
        news?: NewsItem[];
        updatedAt?: string;
      };
      setLiveNews(Array.isArray(data.news) ? data.news : []);
      setNewsUpdatedAt(data.updatedAt || new Date().toISOString());
    } catch {
      setNewsError("Live news is temporarily unavailable.");
    } finally {
      setNewsLoading(false);
      setNewsRefreshing(false);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
      shellRef.current?.style.setProperty("--scroll-y", window.scrollY.toFixed(1));
    };
    const onPointer = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty("--pointer-x", x.toFixed(4));
      document.documentElement.style.setProperty("--pointer-y", y.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useEffect(() => {
    void loadLiveNews();
    const timer = window.setInterval(() => void loadLiveNews(), 10 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

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
      const categoryMatch =
        active === "All" ||
        entry.category === active ||
        (active === "Countries" && entry.slug.includes("pakistan"));
      const queryMatch =
        !term ||
        `${entry.title} ${entry.description} ${entry.category}`
          .toLowerCase()
          .includes(term);
      return categoryMatch && queryMatch;
    });
  }, [active, query]);

  const featured = filtered.length ? filtered.slice(0, 6) : entries.slice(0, 6);
  const lead = featured[0] ?? entries[0];
  const secondary = featured.slice(1, 4);
  const timestamp = newsUpdatedAt
    ? new Date(newsUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Syncing";

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <main ref={shellRef} className="gpExperience" id="top">
      <div className="scrollProgress"><span /></div>
      <div className="cursorGlow" aria-hidden="true" />
      <div className="ambientNoise" aria-hidden="true" />
      <div className="gridAtmosphere" aria-hidden="true" />

      <a className="skipLink" href="#main-content">Skip to content</a>

      <header className="gpNav">
        <Link href="#top" className="gpBrand" aria-label="GlobalPedia home">
          <span className="brandGlyph">◎</span>
          <span>Global<span>Pedia</span></span>
        </Link>

        <nav className={`gpNavLinks ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          {[
            ["Home", "top"],
            ["Explore", "explore"],
            ["Live", "latest-news"],
            ["World", "regions"],
            ["Stories", "featured"],
            ["About", "about"],
          ].map(([label, id], index) => (
            <button className={index === 0 ? "active" : ""} key={label} onClick={() => scrollTo(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="gpNavActions">
          <button className="navSearch" onClick={() => inputRef.current?.focus()} aria-label="Focus search">⌕</button>
          <Link href="/sign-in" className="signButton">Sign In</Link>
          <button className="menuButton" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>☰</button>
        </div>
      </header>

      <section className="cinematicHero" id="main-content">
        <img className="cinematicHeroImage" src={heroImage} alt="Earth from orbit" fetchPriority="high" />
        <div className="heroVignette" />
        <div className="heroAurora auroraOne" />
        <div className="heroAurora auroraTwo" />

        <div className="heroParticles" aria-hidden="true">
          {Array.from({ length: 20 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}
        </div>

        <div className="heroOrbit orbitOne" aria-hidden="true" />
        <div className="heroOrbit orbitTwo" aria-hidden="true" />

        <div className="heroInner">
          <div className="heroCopy">
            <span className="eyebrow">ONE WORLD <b>•</b> ENDLESS KNOWLEDGE</span>
            <h1>
              The world,
              <br />
              <span>decoded.</span>
            </h1>
            <p>
              Explore people, places, history, science and ideas through a cinematic knowledge experience built to make curiosity impossible to ignore.
            </p>

            <div className="heroSearchBox">
              <span>⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search countries, events, science, people..."
                aria-label="Search GlobalPedia"
              />
              <kbd>/</kbd>
              <button onClick={() => scrollTo("featured")} aria-label="Open search results">↗</button>
            </div>

            <div className="heroActions">
              <button className="primaryCta" onClick={() => scrollTo("explore")}>Start Exploring <span>↗</span></button>
              <button className="ghostCta" onClick={() => scrollTo("latest-news")}>See what&apos;s happening <span>↓</span></button>
            </div>

            <div className="heroStats">
              <span><strong>195+</strong> countries</span>
              <span><strong>50K+</strong> knowledge nodes</span>
              <span><strong>24/7</strong> live signals</span>
            </div>
          </div>

          <div className="heroDepthPanel">
            <div className="depthCard depthCardBack">
              <span>LIVE INDEX</span>
              <strong>WORLD</strong>
              <small>Every direction leads somewhere.</small>
            </div>
            <div className="depthCard depthCardMain">
              <div className="depthImageWrap">
                <img src={universeImage} alt="" />
                <span className="liveDot">LIVE</span>
              </div>
              <div className="depthCardCopy">
                <span>DISCOVER NEXT</span>
                <strong>The mysteries of the universe</strong>
                <small>Science · 7 min read</small>
              </div>
            </div>
            <div className="depthCard depthCardFront">
              <span>SCROLL TO EXPLORE</span>
              <strong>↓</strong>
            </div>
          </div>
        </div>

        <div className="heroBottom">
          <button onClick={() => scrollTo("explore")} className="scrollHint"><span /> Scroll to explore</button>
          <span className="heroCoordinate">24.8607° N · 67.0011° E · 2026</span>
        </div>
      </section>

      <div className="marqueeBand" aria-hidden="true">
        <div>
          <span>COUNTRIES</span><b>✦</b><span>HISTORY</span><b>✦</b><span>SCIENCE</span><b>✦</b><span>TECHNOLOGY</span><b>✦</b><span>CULTURE</span><b>✦</b><span>NATURE</span><b>✦</b><span>ARTS</span><b>✦</b>
          <span>COUNTRIES</span><b>✦</b><span>HISTORY</span><b>✦</b><span>SCIENCE</span><b>✦</b><span>TECHNOLOGY</span><b>✦</b>
        </div>
      </div>

      <section className="depthSection exploreSection" id="explore">
        <div className="sectionIntro">
          <div>
            <span className="sectionNumber">01</span>
            <span className="eyebrow">ENTER THE INDEX</span>
          </div>
          <h2>Pick a direction.<br /><em>Go deeper.</em></h2>
          <p>Eight portals into the living map of human knowledge. Hover, scroll, click. Humanity has apparently decided all three are necessary.</p>
        </div>

        <div className="categoryStage">
          <div className="categoryOrb" aria-hidden="true" />
          <div className="categoryGrid3d">
            {categoryCards.map((item, index) => (
              <button
                key={item.label}
                className={`category3dCard tone-${item.tone} ${active === item.label ? "selected" : ""}`}
                onClick={() => {
                  setActive(item.label);
                  scrollTo("featured");
                }}
                onMouseMove={(event) => {
                  const target = event.currentTarget;
                  const values = tiltStyle(event, 10);
                  Object.entries(values).forEach(([key, value]) => target.style.setProperty(key, value));
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.setProperty("--rx", "0deg");
                  event.currentTarget.style.setProperty("--ry", "0deg");
                }}
                style={{ "--delay": `${index * 45}ms` } as CSSProperties}
              >
                <span className="categoryGlow" />
                <span className="categoryIcon3d">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {iconMap[item.icon]}
                  </svg>
                </span>
                <strong>{item.label}</strong>
                <small>{item.sub}</small>
                <span className="categoryArrow">↗</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="newsSection depthSection" id="latest-news">
        <div className="sectionHeaderLine">
          <div>
            <span className="liveStatus"><i /> LIVE</span>
            <h2>What&apos;s happening now</h2>
          </div>
          <div className="newsMeta">
            <span>Updated {timestamp}</span>
            <button onClick={() => void loadLiveNews(true)} disabled={newsRefreshing}>
              {newsRefreshing ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </div>

        {newsError ? (
          <div className="newsState">{newsError}</div>
        ) : newsLoading ? (
          <div className="newsMosaic">
            {Array.from({ length: 6 }, (_, index) => <div className="newsSkeleton" key={index} />)}
          </div>
        ) : (
          <div className="newsMosaic">
            {(liveNews.length ? liveNews.slice(0, 6) : []).map((item, index) => (
              <a key={item.id} className={`newsMosaicCard newsCard-${index}`} href={item.link} target="_blank" rel="noreferrer">
                <span className="newsCardTop">{item.category} · {item.source}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="newsCardBottom">Read story ↗</span>
              </a>
            ))}
            {!liveNews.length && <div className="newsState">No live stories available right now.</div>}
          </div>
        )}
      </section>

      <section className="featureUniverse depthSection" id="featured">
        <div className="featureUniverseHead">
          <div>
            <span className="sectionNumber">02</span>
            <span className="eyebrow">THE STORY UNIVERSE</span>
          </div>
          <h2>Knowledge with<br /><em>depth.</em></h2>
          <p>Scroll through a selection of stories. Each one opens into its own world.</p>
        </div>

        <div className="featureLead">
          <Link href={`/articles/${lead.slug}`} className="featureHeroCard">
            <img src={lead.image} alt="" />
            <div className="featureShade" />
            <div className="featureHeroCopy">
              <span>{lead.category.toUpperCase()} · {lead.meta}</span>
              <h3>{lead.title}</h3>
              <p>{lead.description}</p>
              <strong>Open story ↗</strong>
            </div>
          </Link>

          <div className="featureStack">
            {secondary.map((entry, index) => (
              <TiltCard href={`/articles/${entry.slug}`} key={entry.slug} className="featureStackCard">
                <img src={entry.image} alt="" />
                <div className="featureStackShade" />
                <div className="featureStackCopy">
                  <span>0{index + 2} · {entry.category}</span>
                  <h3>{entry.title}</h3>
                  <small>{entry.meta}</small>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        <div className="articleRail">
          {featured.map((entry, index) => (
            <TiltCard href={`/articles/${entry.slug}`} className="railCard" key={entry.slug}>
              <span className="railIndex">0{index + 1}</span>
              <img src={entry.image} alt="" />
              <div className="railOverlay" />
              <div className="railCopy">
                <span>{entry.category}</span>
                <h3>{entry.title}</h3>
                <small>{entry.meta}</small>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="worldSection depthSection" id="regions">
        <div className="worldCopy">
          <div>
            <span className="sectionNumber">03</span>
            <span className="eyebrow">THE WORLD, IN MOTION</span>
          </div>
          <h2>Every place<br /><em>has a story.</em></h2>
          <p>Move across regions, then drop into the stories, cultures and landscapes that make them distinct.</p>
          <button className="primaryCta" onClick={() => scrollTo("about")}>Explore the atlas <span>↗</span></button>
        </div>

        <div className="globeStage">
          <div className="globeGlow" />
          <div className="globe">
            <img src={worldImages[0]} alt="" />
            <div className="globeLines" />
            <div className="globePin pinA" />
            <div className="globePin pinB" />
            <div className="globePin pinC" />
          </div>
          <div className="globeRing ringA" />
          <div className="globeRing ringB" />
          <div className="globeRing ringC" />
          <div className="globeLabel labelA">ASIA <small>48% INDEX</small></div>
          <div className="globeLabel labelB">EUROPE <small>31% INDEX</small></div>
          <div className="globeLabel labelC">AFRICA <small>26% INDEX</small></div>
        </div>

        <div className="regionOrbit">
          {regions.map((region, index) => (
            <a href="#about" key={region.name} className={`regionOrbitCard orbitCard-${index}`}>
              <img src={region.image} alt="" />
              <span>{region.name}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="aboutImmersive depthSection" id="about">
        <div className="aboutBackground" />
        <div className="aboutGrid">
          <div className="aboutStatement">
            <span className="eyebrow">04 · THE IDEA</span>
            <h2>Knowledge should feel <em>alive.</em></h2>
            <p>
              GlobalPedia turns a reference library into an explorable world. Visual context, fast search, live signals and deep stories all belong in the same experience.
            </p>
          </div>
          <div className="aboutNumbers">
            <div><strong>01</strong><span>ONE WORLD INDEX</span></div>
            <div><strong>∞</strong><span>ENDLESS QUESTIONS</span></div>
            <div><strong>24/7</strong><span>LIVE SIGNALS</span></div>
          </div>
        </div>
        <div className="aboutGallery">
          {[...worldImages, ...entries.slice(0, 4).map((entry) => entry.image)].map((image, index) => (
            <div className={`galleryTile gallery-${index}`} key={image + index}>
              <img src={image} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <footer className="gpFooter">
        <Link href="#top" className="gpBrand">
          <span className="brandGlyph">◎</span>
          <span>Global<span>Pedia</span></span>
        </Link>
        <div className="footerCenter">ONE WORLD · ENDLESS KNOWLEDGE</div>
        <div className="footerRight">© 2026 GLOBALPEDIA · BUILT FOR CURIOSITY</div>
      </footer>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { categories, entries, regions } from "../data/entries";
import WorldKnowledgeHub from "./WorldKnowledgeHub";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

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
  image?: string;
  topic?: string;
};
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
      <path
        d="M4.2 7c1.2-2 5.5-.2 9.2 3s5.9 6.8 4.7 8.8-5.5.2-9.2-3S3 9 4.2 7Z"
        transform="rotate(120 12 12)"
      />
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
  health: (
    <path d="M20 8.5C20 14 12 20 12 20S4 14 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5Z" />
  ),
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

const categoryCards: {
  label: string;
  sub: string;
  icon: IconName;
  tone: string;
}[] = [
  { label: "Countries", sub: "195+", icon: "countries", tone: "blue" },
  { label: "History", sub: "Explore past", icon: "history", tone: "orange" },
  { label: "Science", sub: "Discover more", icon: "science", tone: "violet" },
  {
    label: "Technology",
    sub: "Future & innovation",
    icon: "technology",
    tone: "blue2",
  },
  {
    label: "Culture",
    sub: "People & traditions",
    icon: "culture",
    tone: "pink",
  },
  { label: "Nature", sub: "Our planet", icon: "nature", tone: "teal" },
  { label: "Health", sub: "Live better", icon: "health", tone: "red" },
  { label: "Arts", sub: "Creativity & more", icon: "arts", tone: "purple" },
];

const heroImage =
  "https://images.unsplash.com/photo-1634176866089-b633f4aec882?auto=format&fit=crop&fm=jpg&q=88&w=1800";

export default function GlobalPediaHome() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);
  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState("");
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsRefreshing, setNewsRefreshing] = useState(false);
  const [newsError, setNewsError] = useState("");
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(600);
  const [newsRefreshNotice, setNewsRefreshNotice] = useState("");

  const loadLiveNews = async (manual = false) => {
    try {
      setNewsError("");
      if (manual) setNewsRefreshing(true);
      const response = await fetch(`/api/news?ts=${Date.now()}`, { cache: "no-store" });
      if (!response.ok)
        throw new Error(`News request failed: ${response.status}`);
      const data = (await response.json()) as {
        news?: NewsItem[];
        updatedAt?: string;
      };
      const nextNews = Array.isArray(data.news) ? data.news : [];
      setNewsRefreshNotice(
        manual
          ? `${nextNews.filter((item) => !liveNews.some((old) => old.id === item.id)).length} new ${nextNews.length === 1 ? "story" : "stories"} found`
          : ""
      );
      setLiveNews(nextNews);
      setNewsUpdatedAt(data.updatedAt || new Date().toISOString());
      setSecondsUntilRefresh(600);
    } catch {
      setNewsError("Live news is temporarily unavailable.");
    } finally {
      setNewsLoading(false);
      setNewsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadLiveNews();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsUntilRefresh((previous) => {
        if (previous <= 1) {
          void loadLiveNews();
          return 600;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const newsCountdown = `${String(Math.floor(secondsUntilRefresh / 60)).padStart(2, "0")}:${String(secondsUntilRefresh % 60).padStart(2, "0")}`;
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") inputRef.current?.blur();
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

  const featured = filtered.length ? filtered.slice(0, 3) : entries.slice(0, 3);

  return (
    <main>
      <a className="skipLink" href="#main-content">
        Skip to content
      </a>
      <div className="noise" aria-hidden="true" />

      <SiteHeader />

      <section id="top" className="heroMain">
        <img
          className="heroImage"
          src={heroImage}
          alt="Earth viewed from space at night"
          fetchPriority="high"
        />
        <div className="heroOverlay" />
        <div className="starField" aria-hidden="true" />
        <div className="heroContent" id="main-content">
          <div className="heroTag">
            ONE WORLD <span>â€¢</span> ENDLESS KNOWLEDGE
          </div>
          <h1>
            Global<span>Pedia</span>
          </h1>
          <h2>Discover. Learn. Explore.</h2>
          <p>
            GlobalPedia is your source for reliable, visual and human-friendly
            knowledge about the world, from countries and cultures to history,
            science and technology.
          </p>
          <div className="heroSearch">
            <span className="searchGlyph">âŒ•</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for countries, people, events, science..."
              aria-label="Search GlobalPedia"
            />
            <span className="slashHint">/</span>
            <button aria-label="Search">â†’</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            {[
              "Pakistan",
              "Space",
              "World War II",
              "Technology",
              "Ancient History",
            ].map((item) => (
              <button key={item} onClick={() => setQuery(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="heroAside" aria-hidden="true">
          <p>
            A whole world
            <br />
            of knowledge<span>.</span>
          </p>
          <div className="scribble" />
        </div>
        <div className="heroOrbital orbA" aria-hidden="true" />
        <div className="heroOrbital orbB" aria-hidden="true" />
      </section>

      <section id="categories" className="categorySection sectionWrap">
        <div className="categoryGrid">
          {categoryCards.map((item) => (
            <button
              key={item.label}
              className={`categoryCard tone-${item.tone}`}
              onClick={() => setActive(item.label)}
              aria-pressed={active === item.label}
            >
              <span className="categoryIcon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {iconMap[item.icon]}
                </svg>
              </span>
              <strong>{item.label}</strong>
              <small>{item.sub}</small>
            </button>
          ))}
        </div>
      </section>
      <section id="latest-news" className="liveNewsSection sectionWrap">
        <div className="sectionHeading">
          <div className="liveNewsTitle">
            <span className="sectionKicker livePulse">â—</span>
            <h2>Latest News</h2>
            <span className="liveBadge">LIVE</span>
          </div>
          <div className="newsControls">
            <span>
              {newsUpdatedAt
                ? `Updated ${new Date(newsUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Updating..."}
            </span>
            <span className="liveCountdown" aria-live="polite">
              Next update <strong>{newsCountdown}</strong>
            </span>
            {newsRefreshNotice && <span className="liveRefreshNotice">{newsRefreshNotice}</span>}
            <button
              onClick={() => void loadLiveNews(true)}
              disabled={newsRefreshing}
              aria-label="Refresh latest news"
            >
              {newsRefreshing ? "Refreshingâ€¦" : "â†» Refresh"}
            </button>
          </div>
        </div>

        {newsError ? (
          <div className="newsState">{newsError}</div>
        ) : newsLoading ? (
          <div className="newsGrid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div className="newsSkeleton" key={item} />
            ))}
          </div>
        ) : liveNews.length ? (
          <div className="newsGrid">
            {liveNews.slice(0, 12).map((item) => (
              <a
                className="liveNewsCard"
                href={item.link}
                target="_blank"
                rel="noreferrer"
                key={item.id}
              >
                <div className="liveNewsImage">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1521292270410-a8c4d7166c7c?auto=format&fit=crop&q=82&w=1000"}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <div className="liveNewsTop">
                  <span className="liveNewsCategory">LIVE NEWS · {item.source}</span>
                  <span className="liveNewsTime">
                    {new Date(item.publishedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="liveNewsBottom">
                  <span>GlobalPedia brief · {item.topic || "World"}</span>
                  <span>Read source ↗</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="newsState">No live stories available right now.</div>
        )}
      </section>
      <section id="featured" className="contentSection sectionWrap">
        <div className="sectionHeading">
          <div>
            <span className="sectionKicker">âœ¦</span>
            <h2>Featured Articles</h2>
          </div>
          <Link href="/explore">View All →</Link>
        </div>
        <div className="contentColumns">
          <div className="articleGrid">
            {featured.map((entry) => (
              <Link
                href={`/articles/${entry.slug}`}
                key={entry.slug}
                className="articleCard"
              >
                <div className="articleImageWrap">
                  <img src={entry.image} alt="" loading="lazy" />
                  <div className={`articleTag tag-${entry.accent}`}>
                    {entry.category.toUpperCase()}
                  </div>
                </div>
                <div className="articleText">
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  <div className="articleMeta">
                    <span>â—· {entry.meta.split(" Â· ")[0]}</span>
                    <span>â—´ {entry.meta.split(" Â· ")[1]}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <aside className="factsPanel">
            <div className="panelHeader">
              <span>âœ¦</span>
              <h3>Quick Facts</h3>
            </div>
            {[
              ["Total Articles", "50,000+"],
              ["Countries", "195+"],
              ["Languages", "20+"],
              ["Last Updated", "Sep 10, 2026"],
            ].map(([label, value]) => (
              <div className="factRow" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </aside>
        </div>
        <div className="worldPanel">
          <div>
            <span className="sectionKicker">â—ˆ</span>
            <h3>Explore the World</h3>
            <p>Jump from one corner of the planet to another.</p>
          </div>
          <div className="worldMap" aria-hidden="true">
            <div className="mapDots" />
          </div>
          <Link href="/countries">View All Countries →</Link>
        </div>
      </section>

      <section id="regions" className="regionSection sectionWrap">
        <div className="sectionHeading">
          <div>
            <h2>Explore by Region</h2>
          </div>
          <Link href="/countries">View All →</Link>
        </div>
        <div className="regionGrid">
          {regions.map((region) => (
            <a className="regionCard" href="#featured" key={region.name}>
              <img src={region.image} alt="" loading="lazy" />
              <span>{region.name}</span>
            </a>
          ))}
        </div>
      </section>

      <WorldKnowledgeHub />\n\n      <section id="about" className="aboutSection sectionWrap">
        <div className="aboutCopy">
          <span className="heroTag">
            GLOBALPEDIA <span>â€¢</span> THE IDEA
          </span>
          <h2>
            Knowledge should feel
            <br />
            <em>worth exploring.</em>
          </h2>
          <p>
            Not a wall of text. Not a maze of links. A visual, searchable map of
            the world with room for the details humans inevitably insist on
            arguing about.
          </p>
        </div>
        <div className="aboutStat">
          <strong>01</strong>
          <span>
            WORLD
            <br />
            INDEX
          </span>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Country = {
  code: string;
  name: string;
  flag: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  continents: string[];
  timezones: string[];
  languages: string[];
  currencies: string[];
};

type NewsItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  publishedAt: string;
  image?: string;
  topic?: string;
};

const sportsProfile: Record<string, string> = {
  PK: "Cricket · Field hockey · Football",
  IN: "Cricket · Football · Badminton",
  AU: "Cricket · Rugby · Australian rules football",
  GB: "Football · Cricket · Rugby",
  US: "American football · Basketball · Baseball",
  CA: "Ice hockey · Lacrosse · Soccer",
  BR: "Football · Volleyball · Motorsport",
  AR: "Football · Rugby · Basketball",
  FR: "Football · Rugby · Cycling",
  DE: "Football · Handball · Motorsport",
  ES: "Football · Basketball · Tennis",
  IT: "Football · Cycling · Motorsport",
  JP: "Baseball · Football · Sumo",
  KR: "Football · Baseball · Taekwondo",
  CN: "Table tennis · Badminton · Basketball",
  ZA: "Rugby · Cricket · Football",
  NG: "Football · Basketball · Athletics",
  EG: "Football · Squash · Handball",
  SA: "Football · Motorsport · E-sports",
  AE: "Football · Cricket · Motorsport",
};

const gameCards = [
  {
    title: "Grand Theft Auto VI",
    meta: "Rockstar Games · PS5 / Xbox Series X|S",
    status: "November 19, 2026",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=86&w=1200",
    link: "https://www.rockstargames.com/VI",
    note: "Official Rockstar release date currently listed.",
  },
  {
    title: "Red Dead Redemption III",
    meta: "Rockstar franchise watch",
    status: "No official date listed",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&q=86&w=1200",
    link: "https://www.rockstargames.com/newswire",
    note: "Official announcements and credible updates only, not rumor presented as fact.",
  },
  {
    title: "Game Radar",
    meta: "Live gaming headlines",
    status: "Updating",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=86&w=1200",
    link: "#hub",
    note: "Trailers, announcements and release-date updates flow into the live feed.",
  },
];

const formatPopulation = (value: number) =>
  value
    ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)
    : "—";

const localTime = (timezone: string) => {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    }).format(new Date());
  } catch {
    return "—";
  }
};

export default function WorldKnowledgeHub({ initialTab = "atlas" }: { initialTab?: "atlas" | "sports" | "games" }) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState<Country | null>(null);
  const [sort, setSort] = useState<"name" | "population" | "area">("name");
  const [tab, setTab] = useState<"atlas" | "sports" | "games">(initialTab);
  const [sportsNews, setSportsNews] = useState<NewsItem[]>([]);
  const [gameNews, setGameNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/countries", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setCountries(Array.isArray(data.countries) ? data.countries : []))
      .catch(() => setCountries([]));

    const loadFeeds = async () => {
      try {
        const [sportsResponse, gameResponse] = await Promise.all([
          fetch("/api/news?mode=sports", { cache: "no-store" }),
          fetch("/api/news?mode=games", { cache: "no-store" }),
        ]);
        const sports = await sportsResponse.json();
        const games = await gameResponse.json();
        setSportsNews(Array.isArray(sports.news) ? sports.news.slice(0, 6) : []);
        setGameNews(Array.isArray(games.news) ? games.news.slice(0, 6) : []);
      } catch {
        setSportsNews([]);
        setGameNews([]);
      }
    };

    void loadFeeds();
  }, []);

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(countries.map((country) => country.region).filter(Boolean))).sort()],
    [countries]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filteredCountries = countries
      .filter((country) => region === "All" || country.region === region)
      .filter((country) =>
        !term
          ? true
          : (country.name + " " + country.capital + " " + country.subregion)
              .toLowerCase()
              .includes(term)
      );

    return filteredCountries
      .sort((a, b) => {
        if (sort === "population") return b.population - a.population;
        if (sort === "area") return b.area - a.area;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 24);
  }, [countries, query, region, sort]);

  return (
    <section className="knowledgeHub" id="hub">
      <div className="hubTexture" aria-hidden="true" />
      <div className="hubHeading">
        <div>
          <span className="hubKicker">THE GLOBAL INTELLIGENCE LAYER</span>
          <h2>
            One place for the <em>whole world.</em>
          </h2>
          <p>
            Countries, time zones, sports coverage, current signals and game updates in one continuously expanding layer.
          </p>
        </div>
        <div className="hubTabs" role="tablist" aria-label="Knowledge sections">
          <Link className={tab === "atlas" ? "active" : ""} href="/countries" role="tab">
            World Atlas
          </Link>
          <Link className={tab === "sports" ? "active" : ""} href="/sports" role="tab">
            Sports
          </Link>
          <Link className={tab === "games" ? "active" : ""} href="/games" role="tab">
            Games
          </Link>
        </div>
      </div>

      {tab === "atlas" && (
        <>
          <div className="earthCommandCenter">
            <div className="earthViewport">
              <div className="earthGlow" />
              <div className="earthSphere">
                <div className="earthTexture" />
                <div className="earthGrid" />
                <span className="earthPin pin1" />
                <span className="earthPin pin2" />
                <span className="earthPin pin3" />
              </div>
              <div className="earthOrbit orbit1" />
              <div className="earthOrbit orbit2" />
            </div>

            <div className="commandPanel">
              <div className="commandTop">
                <span>WORLD SYSTEM</span>
                <i>LIVE</i>
              </div>
              <strong>{countries.length || "180+"}</strong>
              <small>country profiles available</small>
              <div className="commandRows">
                <div><span>Time zones</span><b>Local clock</b></div>
                <div><span>Culture</span><b>Languages · money</b></div>
                <div><span>Geography</span><b>Capital · region · people</b></div>
                <div><span>Sports</span><b>National focus</b></div>
              </div>
            </div>
          </div>

          <div className="atlasControls">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search any country..."
              aria-label="Search any country"
            />
            <select
              className="atlasSort"
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
              aria-label="Sort countries"
            >
              <option value="name">A–Z</option>
              <option value="population">Population</option>
              <option value="area">Area</option>
            </select>
            <div className="regionFilters">
              {regions.slice(0, 7).map((item) => (
                <button
                  key={item}
                  className={region === item ? "active" : ""}
                  onClick={() => setRegion(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="countryMatrix">
            {filtered.map((country) => (
              <button className="countryTile" key={country.code} onClick={() => setSelected(country)}>
                <img src={country.flag} alt="" loading="lazy" />
                <span className="countryTileIdentity">
                  <strong>{country.name}</strong>
                  <small>{country.capital || "Capital unavailable"} · {country.region || "Region unavailable"}</small>
                </span>
                <b className="countryTileArrow">↗</b>
                <div className="countryTileFacts">
                  <span>
                    <small>Population</small>
                    <strong>{formatPopulation(country.population)}</strong>
                  </span>
                  <span>
                    <small>Languages</small>
                    <strong>{country.languages.slice(0, 2).join(" · ") || "Not listed"}</strong>
                  </span>
                  <span>
                    <small>Currency</small>
                    <strong>{country.currencies.slice(0, 2).join(" · ") || "Not listed"}</strong>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {tab === "sports" && (
        <div className="hubStream">
          <div className="streamIntro">
            <span>LIVE SPORTS SIGNALS</span>
            <h3>Follow the game without pretending one sport defines a country.</h3>
          </div>
          <div className="signalGrid">
            {["PK", "IN", "AU", "GB", "US", "BR", "FR", "JP"].map((code) => {
              const country = countries.find((item) => item.code === code);
              return country ? (
                <button className="signalCard" key={code} onClick={() => setSelected(country)}>
                  <img src={country.flag} alt="" />
                  <span>
                    <strong>{country.name}</strong>
                    <small>{sportsProfile[code] || "Football · athletics · regional sports"}</small>
                  </span>
                  <b>View profile ↗</b>
                </button>
              ) : null;
            })}
          </div>
          <div className="newsStrip">
            {sportsNews.map((item) => (
              <a href={item.link} target="_blank" rel="noreferrer" key={item.id}>
                <span>SPORTS</span>
                <strong>{item.title}</strong>
                <small>{item.source}</small>
              </a>
            ))}
          </div>
        </div>
      )}

      {tab === "games" && (
        <div className="hubStream">
          <div className="streamIntro">
            <span>GAME RADAR</span>
            <h3>Release dates, announcements and current gaming headlines.</h3>
          </div>
          <div className="gameGrid">
            {gameCards.map((game) => (
              <a className="gameCard" href={game.link} target="_blank" rel="noreferrer" key={game.title}>
                <img src={game.image} alt="" loading="lazy" />
                <div className="gameShade" />
                <div className="gameCopy">
                  <span>{game.meta}</span>
                  <h3>{game.title}</h3>
                  <strong>{game.status}</strong>
                  <p>{game.note}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="newsStrip">
            {gameNews.map((item) => (
              <a href={item.link} target="_blank" rel="noreferrer" key={item.id}>
                <span>GAMES</span>
                <strong>{item.title}</strong>
                <small>{item.source}</small>
              </a>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="countryModal" role="dialog" aria-modal="true" aria-label={selected.name}>
          <button className="countryModalBackdrop" aria-label="Close country profile" onClick={() => setSelected(null)} />
          <article className="countryModalPanel">
            <button className="countryClose" onClick={() => setSelected(null)} aria-label="Close">×</button>

            <div className="countryHero">
              <img src={selected.flag} alt="" />
              <div>
                <span>{selected.region} · {selected.subregion}</span>
                <h3>{selected.name}</h3>
                <small>{selected.capital} · {selected.code}</small>
              </div>
            </div>

            <div className="countryStats">
              <div><span>Population</span><strong>{selected.population ? new Intl.NumberFormat("en").format(selected.population) : "—"}</strong></div>
              <div><span>Area</span><strong>{selected.area ? new Intl.NumberFormat("en").format(selected.area) + " km²" : "—"}</strong></div>
              <div><span>Population density</span><strong>{selected.area && selected.population ? new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(selected.population / selected.area) + " / km²" : "—"}</strong></div>
              <div><span>Currency</span><strong>{selected.currencies.join(" · ") || "—"}</strong></div>
              <div><span>Languages</span><strong>{selected.languages.join(" · ") || "—"}</strong></div>
              <div><span>Continent</span><strong>{selected.continents.join(" · ") || selected.region || "—"}</strong></div>
            </div>

            <div className="countryTimeGrid">
              {selected.timezones.slice(0, 4).map((timezone) => (
                <div key={timezone}>
                  <span>{timezone.replace("Etc/GMT", "UTC")}</span>
                  <strong>{localTime(timezone)}</strong>
                </div>
              ))}
            </div>

            <div className="countrySports">
              <span>SPORTS SNAPSHOT</span>
              <strong>{sportsProfile[selected.code] || "Football · athletics · regional sports"}</strong>
              <small>Coverage describes prominent sporting activity, not a quality ranking.</small>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

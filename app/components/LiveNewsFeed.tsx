"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  publishedAt: string;
  image?: string;
  imageSource?: "feed" | "publisher" | "none";
  topic?: string;
};

export default function LiveNewsFeed({
  mode = "global",
  title = "Live News",
  subtitle = "Fresh headlines from current feeds. Open the original source for the full report.",
  limit = 12,
}: {
  mode?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [sort, setSort] = useState<"latest" | "source">("latest");

  const load = useCallback(async (manual = false) => {
    try {
      setError("");
      if (manual) setRefreshing(true);
      const response = await fetch(
        `/api/news?mode=${encodeURIComponent(mode)}&ts=${Date.now()}`,
        { cache: "no-store" }
      );
      if (!response.ok) throw new Error("feed");
      const data = (await response.json()) as {
        news?: NewsItem[];
        updatedAt?: string;
      };
      setItems(Array.isArray(data.news) ? data.news : []);
      setUpdatedAt(data.updatedAt || new Date().toISOString());
    } catch {
      setError("Live feed is temporarily unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mode]);

  useEffect(() => {
    void load();
  }, [load]);

  const displayItems = useMemo(() => {
    const next = [...items];
    if (sort === "source") {
      next.sort((a, b) => a.source.localeCompare(b.source));
    } else {
      next.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    return next.slice(0, limit);
  }, [items, limit, sort]);

  return (
    <section className="liveFeedSection sectionWrap">
      <div className="liveFeedHeading">
        <div>
          <span className="sectionKicker livePulse">●</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="liveFeedControls">
          <span>
            {updatedAt
              ? `Updated ${new Date(updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}`
              : "Updating..."}
          </span>
          <button onClick={() => setSort((current) => current === "latest" ? "source" : "latest")}>
            {sort === "latest" ? "Latest" : "By source"}
          </button>
          <button onClick={() => void load(true)} disabled={refreshing}>
            {refreshing ? "Refreshing…" : "↻ Refresh"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="liveFeedGrid">
          {Array.from({ length: Math.min(limit, 12) }, (_, index) => (
            <div className="newsSkeleton" key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="newsState">{error}</div>
      ) : displayItems.length ? (
        <div className="liveFeedGrid">
          {displayItems.map((item) => (
            <article className="liveFeedCard" key={item.id}>
              <button
                className="liveFeedCardMain"
                onClick={() => setSelected(item)}
                aria-label={`Open story: ${item.title}`}
              >
                <div className="liveFeedImage">
                  {item.image ? (
                    <img src={item.image} alt="" loading="lazy" />
                  ) : (
                    <div className="newsExactPlaceholder">
                      <span>IMAGE UNAVAILABLE</span>
                      <small>Publisher did not expose an article image.</small>
                    </div>
                  )}
                </div>
                <div className="liveFeedMeta">
                  <span>LIVE · {item.topic || "WORLD"}</span>
                  <time>{new Date(item.publishedAt).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}</time>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description || "Open the publisher for the complete report."}</p>
              </button>
              <div className="liveFeedSource">
                <span>{item.source}</span>
                <span className="liveSourceActions">
                  <span className="imageProvenance">
                    {item.imageSource === "publisher" ? "Publisher image" : item.imageSource === "feed" ? "Feed image" : "No image"}
                  </span>
                  <a href={item.link} target="_blank" rel="noreferrer">
                    Read source ↗
                  </a>
                  <a href={"/search?q=" + encodeURIComponent(item.title)}>
                    Explore context
                  </a>
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="newsState">No current stories available.</div>
      )}

      {selected && (
        <div className="newsStoryModal" role="dialog" aria-modal="true" aria-label={selected.title}>
          <button className="newsStoryBackdrop" aria-label="Close story" onClick={() => setSelected(null)} />
          <article className="newsStoryPanel">
            <button className="newsStoryClose" onClick={() => setSelected(null)} aria-label="Close">×</button>
            <div className="newsStoryImage">
              {selected.image ? (
                <img src={selected.image} alt="" />
              ) : (
                <div className="newsExactPlaceholder"><span>NO PUBLISHER IMAGE</span></div>
              )}
            </div>
            <div className="newsStoryBody">
              <div className="liveFeedMeta">
                <span>{selected.topic || "WORLD"} · {selected.source}</span>
                <time>{new Date(selected.publishedAt).toLocaleString()}</time>
              </div>
              <h2>{selected.title}</h2>
              <p className="newsStorySummary">{selected.description || "The publisher has not supplied a feed summary."}</p>
              <div className="newsStoryFacts">
                <div><span>Source</span><strong>{selected.source}</strong></div>
                <div><span>Published</span><strong>{new Date(selected.publishedAt).toLocaleString()}</strong></div>
                <div><span>Image</span><strong>{selected.imageSource === "publisher" ? "Publisher og:image" : selected.imageSource === "feed" ? "Publisher/feed media" : "Not exposed"}</strong></div>
              </div>
              <div className="newsStoryActions">
                <a className="iphoneButton" href={selected.link} target="_blank" rel="noreferrer">Read original article ↗</a>
                <a className="articleActionLink" href={"/search?q=" + encodeURIComponent(selected.title)}>Explore GlobalPedia context</a>
              </div>
              <small className="newsCopyrightNote">
                GlobalPedia shows headline and feed metadata here. The complete report remains on the original publisher.
              </small>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

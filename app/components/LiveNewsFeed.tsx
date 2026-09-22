"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

export default function LiveNewsFeed({
  mode = "global",
  title = "Live News",
  subtitle = "Fresh headlines from current feeds. Open the original source for the full report.",
  limit = 8,
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
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(600);
  const [refreshNotice, setRefreshNotice] = useState("");
  const itemsRef = useRef<NewsItem[]>([]);

  const load = useCallback(async (manual = false) => {
    try {
      setError("");
      if (manual) setRefreshing(true);
      const response = await fetch(`/api/news?mode=${encodeURIComponent(mode)}&ts=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("feed");
      const data = (await response.json()) as { news?: NewsItem[]; updatedAt?: string };
      const nextItems = Array.isArray(data.news) ? data.news : [];
      setRefreshNotice(
        manual
          ? `${nextItems.filter((item) => !itemsRef.current.some((old) => old.id === item.id)).length} new ${nextItems.length === 1 ? "story" : "stories"} found`
          : ""
      );
      itemsRef.current = nextItems;
      setItems(nextItems);
      setUpdatedAt(data.updatedAt || new Date().toISOString());
      setSecondsUntilRefresh(600);
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsUntilRefresh((previous) => {
        if (previous <= 1) {
          void load();
          return 600;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [load]);

  const countdown = `${String(Math.floor(secondsUntilRefresh / 60)).padStart(2, "0")}:${String(secondsUntilRefresh % 60).padStart(2, "0")}`;

  return (
    <section className="liveFeedSection sectionWrap">
      <div className="liveFeedHeading">
        <div>
          <span className="sectionKicker livePulse">●</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="liveFeedControls">
          <span>{updatedAt ? `Updated ${new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Updating..."}</span>
          <span className="liveCountdown" aria-live="polite">Next update <strong>{countdown}</strong></span>
          {refreshNotice && <span className="liveRefreshNotice">{refreshNotice}</span>}
          <button onClick={() => void load(true)} disabled={refreshing}>
            {refreshing ? "Refreshing…" : "↻ Refresh"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="liveFeedGrid">{Array.from({ length: Math.min(limit, 8) }, (_, index) => <div className="newsSkeleton" key={index} />)}</div>
      ) : error ? (
        <div className="newsState">{error}</div>
      ) : items.length ? (
        <div className="liveFeedGrid">
          {items.slice(0, limit).map((item) => (
            <a className="liveFeedCard" href={item.link} target="_blank" rel="noreferrer" key={item.id}>
              <div className="liveFeedImage">
                <img src={item.image} alt="" loading="lazy" />
              </div>
              <div className="liveFeedMeta">
                <span>LIVE · {item.topic || "WORLD"}</span>
                <time>{new Date(item.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="liveFeedSource">
                <span>{item.source}</span>
                <span>Read source ↗</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="newsState">No current stories available.</div>
      )}
    </section>
  );
}

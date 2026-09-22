"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

type Saved = { id: string; title: string };
type History = { slug: string; title: string; category: string; viewedAt: string };

export default function BookmarksPage() {
  const [items, setItems] = useState<Saved[]>([]);
  const [history, setHistory] = useState<History[]>([]);

  const read = () => {
    try {
      setItems(JSON.parse(localStorage.getItem("globalpedia_bookmarks") || "[]"));
      setHistory(JSON.parse(localStorage.getItem("globalpedia_reading_history") || "[]"));
    } catch {
      setItems([]);
      setHistory([]);
    }
  };

  useEffect(() => {
    read();
    const onBookmarks = () => read();
    const onHistory = () => read();
    window.addEventListener("globalpedia-bookmarks", onBookmarks);
    window.addEventListener("globalpedia-history", onHistory);
    return () => {
      window.removeEventListener("globalpedia-bookmarks", onBookmarks);
      window.removeEventListener("globalpedia-history", onHistory);
    };
  }, []);

  const clear = () => {
    localStorage.removeItem("globalpedia_bookmarks");
    read();
  };

  const clearHistory = () => {
    localStorage.removeItem("globalpedia_reading_history");
    read();
  };

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · MY LIBRARY</span>
        <h1>Your saved <em>knowledge.</em></h1>
        <p>Bookmarks and reading history stay on this browser, ready for the next rabbit hole.</p>
        <div className="libraryQuickLinks">
          <Link href="/dashboard">Open dashboard ↗</Link>
          <Link href="/following">Following ↗</Link>
        </div>
      </section>

      <section className="bookmarkPage sectionWrap">
        <div className="librarySectionHead">
          <div><span>BOOKMARKS</span><strong>{items.length} saved</strong></div>
          {items.length > 0 && <button onClick={clear}>Clear all</button>}
        </div>

        {items.length === 0 ? (
          <div className="emptyState">
            <strong>No bookmarks yet.</strong>
            <span>Use the star button on articles to build your personal library.</span>
          </div>
        ) : (
          <div className="bookmarkGrid">
            {items.map((item) => {
              const slug = item.id.replace("article:", "");
              return (
                <Link className="bookmarkCard" href={"/articles/" + slug} key={item.id}>
                  <span>ARTICLE</span>
                  <h2>{item.title}</h2>
                  <b>Open ↗</b>
                </Link>
              );
            })}
          </div>
        )}

        <div className="librarySectionHead historyHead">
          <div><span>READING HISTORY</span><strong>{history.length} recent reads</strong></div>
          {history.length > 0 && <button onClick={clearHistory}>Clear history</button>}
        </div>

        {history.length === 0 ? (
          <div className="emptyState">
            <strong>Your reading history is empty.</strong>
            <span>Open any GlobalPedia article and it will appear here automatically.</span>
          </div>
        ) : (
          <div className="readingHistoryList">
            {history.slice(0, 10).map((item) => (
              <Link href={"/articles/" + item.slug} key={item.slug}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <small>{new Date(item.viewedAt).toLocaleString()}</small>
                <b>Read ↗</b>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageChrome>
  );
}

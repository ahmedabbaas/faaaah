"use client";

import { useEffect } from "react";

type HistoryItem = {
  slug: string;
  title: string;
  category: string;
  viewedAt: string;
};

const KEY = "globalpedia_reading_history";

export default function ReadingTracker({
  slug,
  title,
  category,
}: {
  slug: string;
  title: string;
  category: string;
}) {
  useEffect(() => {
    try {
      const current = JSON.parse(localStorage.getItem(KEY) || "[]") as HistoryItem[];
      const next: HistoryItem[] = [
        { slug, title, category, viewedAt: new Date().toISOString() },
        ...current.filter((item) => item.slug !== slug),
      ].slice(0, 20);
      localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("globalpedia-history"));
    } catch {
      // Reading history is optional and must never block the article.
    }
  }, [slug, title, category]);

  return null;
}

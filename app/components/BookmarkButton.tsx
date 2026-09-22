"use client";

import { useEffect, useState, type MouseEvent } from "react";

const KEY = "globalpedia_bookmarks";

export default function BookmarkButton({ id, title }: { id: string; title: string }) {
  const [saved, setSaved] = useState(false);

  const read = () => {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || "[]") as { id: string; title: string }[];
      setSaved(list.some((item) => item.id === id));
    } catch {}
  };

  useEffect(() => {
    read();
  }, [id]);

  const toggle = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || "[]") as { id: string; title: string }[];
      const next = saved
        ? list.filter((item) => item.id !== id)
        : [...list, { id, title }];
      localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("globalpedia-bookmarks"));
      setSaved(!saved);
    } catch {}
  };

  return (
    <button className={"bookmarkButton" + (saved ? " saved" : "")} onClick={toggle} aria-label={saved ? "Remove " + title + " from bookmarks" : "Save " + title}>
      {saved ? "★" : "☆"}
    </button>
  );
}

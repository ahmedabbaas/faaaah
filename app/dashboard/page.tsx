"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";
import { entries } from "../data/entries";

type Saved = { id: string; title: string };
type History = { slug: string; title: string; category: string; viewedAt: string };

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<Saved[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  const load = () => {
    try {
      setBookmarks(JSON.parse(localStorage.getItem("globalpedia_bookmarks") || "[]"));
      setHistory(JSON.parse(localStorage.getItem("globalpedia_reading_history") || "[]"));
      setFollowing(JSON.parse(localStorage.getItem("globalpedia_following") || "[]"));
    } catch {
      setBookmarks([]);
      setHistory([]);
      setFollowing([]);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("globalpedia-history", load);
    window.addEventListener("globalpedia-bookmarks", load);
    return () => {
      window.removeEventListener("globalpedia-history", load);
      window.removeEventListener("globalpedia-bookmarks", load);
    };
  }, []);

  const recommended = entries
    .filter((entry) => !history.some((item) => item.slug === entry.slug))
    .slice(0, 3);

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · MY DASHBOARD</span>
        <h1>Your personal <em>knowledge desk.</em></h1>
        <p>Saved articles, reading history, followed topics and a few sensible ways to continue exploring.</p>
      </section>

      <section className="dashboardPage sectionWrap">
        <div className="dashboardStats">
          <div><span>Saved</span><strong>{bookmarks.length}</strong><small>articles</small></div>
          <div><span>History</span><strong>{history.length}</strong><small>recent reads</small></div>
          <div><span>Following</span><strong>{following.length}</strong><small>topics</small></div>
        </div>

        <div className="dashboardColumns">
          <section className="dashboardPanel">
            <div className="dashboardHeading"><span>RECENTLY READ</span><Link href="/bookmarks">My Library ↗</Link></div>
            {history.length ? (
              <div className="dashboardList">
                {history.slice(0, 6).map((item) => (
                  <Link href={"/articles/" + item.slug} key={item.slug}>
                    <span>{item.category}</span>
                    <strong>{item.title}</strong>
                    <small>{new Date(item.viewedAt).toLocaleString()}</small>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="dashboardEmpty">Open an article and your reading history will appear here.</div>
            )}
          </section>

          <section className="dashboardPanel">
            <div className="dashboardHeading"><span>FOLLOWED TOPICS</span><Link href="/following">Manage ↗</Link></div>
            {following.length ? (
              <div className="dashboardTopics">{following.map((topic) => <span key={topic}>{topic}</span>)}</div>
            ) : (
              <div className="dashboardEmpty">Choose a few topics in Following to build your personal signal stream.</div>
            )}
          </section>
        </div>

        <section className="dashboardPanel">
          <div className="dashboardHeading"><span>CONTINUE EXPLORING</span><Link href="/today">Today's shelf ↗</Link></div>
          <div className="dashboardRecommendations">
            {recommended.map((item) => (
              <Link href={"/articles/" + item.slug} key={item.slug}>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <b>Read ↗</b>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </PageChrome>
  );
}

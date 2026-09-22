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
  const [learning, setLearning] = useState<Record<string, number>>({});
  const [places, setPlaces] = useState<string[]>([]);

  const load = () => {
    try {
      setBookmarks(JSON.parse(localStorage.getItem("globalpedia_bookmarks") || "[]"));
      setHistory(JSON.parse(localStorage.getItem("globalpedia_reading_history") || "[]"));
      setFollowing(JSON.parse(localStorage.getItem("globalpedia_following") || "[]"));
      setLearning(JSON.parse(localStorage.getItem("globalpedia_learning_progress") || "{}"));
      setPlaces((localStorage.getItem("globalpedia_places") || "").split("|").filter(Boolean));
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
          <div><span>Learning</span><strong>{Object.keys(learning).length}</strong><small>lessons</small></div>
          <div><span>Places</span><strong>{places.length}</strong><small>saved</small></div>
        </div>

        <div className="dashboardColumns">
          <section className="dashboardPanel">
          <div className="dashboardHeading"><span>KEEP BUILDING</span><Link href="/learn">Learning hub ↗</Link></div>
          <div className="dashboardRecommendations">
            <Link href="/learn#history"><span>HISTORY</span><h3>Build a history track</h3><p>Short modules, key dates and quick quizzes for steady progress.</p><b>Start ↗</b></Link>
            <Link href="/learn#science"><span>SCIENCE</span><h3>Explore a science track</h3><p>Move from concepts to interactive questions without leaving GlobalPedia.</p><b>Start ↗</b></Link>
            <Link href="/data"><span>DATA</span><h3>Compare the world</h3><p>Inspect country indicators and save the places you want to revisit.</p><b>Open ↗</b></Link>
          </div>
        </section>

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
          <div className="dashboardHeading"><span>MY PLACES</span><Link href="/atlas">Explore Atlas ↗</Link></div>
          {places.length ? <div className="dashboardTopics">{places.map(place=><Link className="dashboardPlaceLink" href={"/places/"+place} key={place}>{place.replace("-", " ")}</Link>)}</div> : <div className="dashboardEmpty">Save cities from a place profile and they will stay here.</div>}
        </section>

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

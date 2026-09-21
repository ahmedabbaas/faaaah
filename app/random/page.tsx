import Link from "next/link";
import PageChrome from "../components/PageChrome";
import { entries } from "../data/entries";

export const dynamic = "force-dynamic";

export default function RandomPage() {
  const entry = entries[Math.floor(Math.random() * entries.length)];

  return (
    <PageChrome>
      <section className="randomPage sectionWrap">
        <div className="randomBadge">RANDOM DISCOVERY · {entry.category.toUpperCase()}</div>
        <div className="randomLayout">
          <div className="randomImage">
            <img src={entry.image} alt="" />
          </div>
          <article className="randomCopy">
            <span>{entry.number} · {entry.meta}</span>
            <h1>{entry.title}</h1>
            <p>{entry.description}</p>
            <div className="randomActions">
              <Link className="primaryAction" href={`/articles/${entry.slug}`}>
                Open article ↗
              </Link>
              <Link className="secondaryAction" href="/random">
                Another discovery
              </Link>
            </div>
          </article>
        </div>
      </section>
    </PageChrome>
  );
}

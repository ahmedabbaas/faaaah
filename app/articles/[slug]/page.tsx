import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { entries, getEntry } from "../../data/entries";
import BookmarkButton from "../../components/BookmarkButton";
import ReadingTracker from "../../components/ReadingTracker";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return { title: "Article not found | GlobalPedia" };
  return { title: entry.title + " | GlobalPedia", description: entry.description };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const related = entries
    .filter((item) => item.slug !== entry.slug)
    .sort((a, b) => (a.category === entry.category ? -1 : 1) - (b.category === entry.category ? -1 : 1))
    .slice(0, 3);

  const aiHref =
    "/ai?topic=" +
    encodeURIComponent("Explain " + entry.title) +
    "&context=" +
    encodeURIComponent(entry.title + ". " + entry.description + " " + entry.body.join(" "));

  return (
    <main className="articlePage">
      <ReadingTracker slug={entry.slug} title={entry.title} category={entry.category} />
      <header className="articleHeader">
        <Link className="brand" href="/">
          <span className="brandMark globeMark">◎</span>
          <span>Global<span className="brandBlue">Pedia</span></span>
        </Link>
        <Link className="backLink" href="/#featured">← Back</Link>
      </header>

      <div className="articleHero">
        <img src={entry.image} alt="" />
        <div className="articleHeroShade" />
        <div className="articleHeroText">
          <span className={"articleTag tag-" + entry.accent}>{entry.category.toUpperCase()}</span>
          <h1>{entry.title}</h1>
          <div className="articleMeta">
            <span>◷ {entry.meta.split(" · ")[0]}</span>
            <span>◴ {entry.meta.split(" · ")[1]}</span>
          </div>
        </div>
      </div>

      <article className="articleRead">
        <div className="articleUtilityBar">
          <span>{entry.category} · GlobalPedia knowledge article</span>
          <Link href={aiHref}>Ask AI about this ↗</Link>
        </div>

        <p className="articleLead">{entry.description}</p>
        {entry.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

        <div className="articleActions">
          <BookmarkButton id={"article:" + entry.slug} title={entry.title} />
          <button>♡ 235</button>
          <button>◌ 12</button>
          <button>⌁ Share</button>
        </div>

        <section className="knowledgeGraph">
          <div>
            <span>KNOWLEDGE GRAPH</span>
            <h2>Where this topic leads next</h2>
          </div>
          <div className="knowledgeGraphLinks">
            {[entry.category, ...related.map((item) => item.category)].filter((value, index, array) => array.indexOf(value) === index).map((topic) => (
              <Link href={"/search?type=articles&q=" + encodeURIComponent(topic)} key={topic}>{topic} ↗</Link>
            ))}
            <Link href="/timeline">Timeline ↗</Link>
            <Link href="/people">People ↗</Link>
          </div>
        </section>

        <section className="relatedArticles">
          <div>
            <span>KEEP EXPLORING</span>
            <h2>Related knowledge</h2>
          </div>
          <div className="relatedArticleGrid">
            {related.map((item) => (
              <Link href={"/articles/" + item.slug} key={item.slug}>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <b>Read ↗</b>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}

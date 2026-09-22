
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { entries, getEntry } from "../../data/entries";
import BookmarkButton from "../../components/BookmarkButton";
import ReadingTracker from "../../components/ReadingTracker";

type Props = { params: Promise<{ slug: string }> };

const sectionNames = ["Overview", "Key context", "Why it matters", "What to explore next"];

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return { title: "Article not found | GlobalPedia" };

  return {
    title: entry.title + " | GlobalPedia",
    description: entry.description,
    openGraph: {
      title: entry.title + " | GlobalPedia",
      description: entry.description,
      images: [entry.image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const [published, readTime] = entry.meta.split(" · ");
  const related = entries
    .filter((item) => item.slug !== entry.slug)
    .sort((a, b) => (a.category === entry.category ? -1 : 1) - (b.category === entry.category ? -1 : 1))
    .slice(0, 3);

  const aiHref =
    "/ai?topic=" +
    encodeURIComponent("Explain " + entry.title) +
    "&context=" +
    encodeURIComponent(entry.title + ". " + entry.description + " " + entry.body.join(" "));

  const keyTakeaways = entry.body.slice(0, 3).map((paragraph) => {
    const clean = paragraph.trim();
    const stop = clean.indexOf(". ");
    return (stop > 0 ? clean.slice(0, stop + 1) : clean).slice(0, 170);
  });

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
            <span>◷ {published || "GlobalPedia"}</span>
            <span>◴ {readTime || "Read"}</span>
          </div>
        </div>
      </div>

      <div className="articleReadingLayout">
        <aside className="articleRail">
          <div className="articleRailCard">
            <span>ON THIS PAGE</span>
            {entry.body.map((_, index) => (
              <a href={"#article-section-" + index} key={index}>
                {sectionNames[index] || "Further context"}
              </a>
            ))}
          </div>

          <Link className="articleAiCard" href={aiHref}>
            <span>GLOBAL AI</span>
            <strong>Ask about this article ↗</strong>
            <small>Use the full article as context.</small>
          </Link>
        </aside>

        <article className="articleRead">
          <div className="articleUtilityBar">
            <span>{entry.category} · GlobalPedia knowledge article</span>
            <Link href={aiHref}>Ask AI about this ↗</Link>
          </div>

          <div className="articleIntroGrid">
            <div>
              <span>OVERVIEW</span>
              <p className="articleLead">{entry.description}</p>
            </div>
            <div className="articleFactGrid">
              <div><span>CATEGORY</span><strong>{entry.category}</strong></div>
              <div><span>READ TIME</span><strong>{readTime || "—"}</strong></div>
              <div><span>SECTIONS</span><strong>{entry.body.length}</strong></div>
            </div>
          </div>

          <div className="articleTakeaways">
            <div>
              <span>KEY TAKEAWAYS</span>
              <h2>What matters at a glance</h2>
            </div>
            <div className="takeawayList">
              {keyTakeaways.map((takeaway, index) => (
                <div key={index}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <p>{takeaway}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="articleBody">
            {entry.body.map((paragraph, index) => (
              <section id={"article-section-" + index} key={paragraph}>
                <span className="articleSectionNumber">{String(index + 1).padStart(2, "0")}</span>
                <h2>{sectionNames[index] || "Further context"}</h2>
                <p>{paragraph}</p>
              </section>
            ))}
          </div>

          <div className="articleActions">
            <BookmarkButton id={"article:" + entry.slug} title={entry.title} />
            <Link className="articleActionLink" href={aiHref}>Ask AI</Link>
            <Link className="articleActionLink" href={"/search?q=" + encodeURIComponent(entry.category)}>Explore topic</Link>
          </div>

          <section className="knowledgeGraph">
            <div>
              <span>KNOWLEDGE GRAPH</span>
              <h2>Where this topic leads next</h2>
            </div>
            <div className="knowledgeGraphLinks">
              {[entry.category, ...related.map((item) => item.category)]
                .filter((value, index, array) => array.indexOf(value) === index)
                .map((topic) => (
                  <Link href={"/search?type=articles&q=" + encodeURIComponent(topic)} key={topic}>
                    {topic} ↗
                  </Link>
                ))}
              <Link href="/timeline">Timeline ↗</Link>
              <Link href="/people">People ↗</Link>
              <Link href="/engine">Global Engine ↗</Link>
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
      </div>
    </main>
  );
}

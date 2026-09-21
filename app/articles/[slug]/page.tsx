import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { entries, getEntry } from "../../data/entries";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return { title: "Article not found | GlobalPedia" };
  return {
    title: `${entry.title} | GlobalPedia`,
    description: entry.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  return (
    <main className={`articlePage accent-${entry.accent}`}>
      <div className="articleBackdrop" aria-hidden="true" />
      <header className="articleHeader">
        <Link className="brand" href="/" aria-label="GlobalPedia home">
          <span className="brandMark">G</span>
          <span>GLOBALPEDIA</span>
        </Link>
        <Link className="backLink" href="/#featured">← Back to index</Link>
      </header>
      <article className="articleRead">
        <div className="eyebrow muted"><span /> {entry.category.toUpperCase()} · {entry.meta}</div>
        <h1>{entry.title}</h1>
        <p className="articleLead">{entry.description}</p>
        <div className="articleRule" />
        <div className="articleBody">
          {entry.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>
    </main>
  );
}

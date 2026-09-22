import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { entries, getEntry } from "../../data/entries";
import BookmarkButton from "../../components/BookmarkButton";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return { title: "Article not found | GlobalPedia" };
  return { title: `${entry.title} | GlobalPedia`, description: entry.description };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  return (
    <main className="articlePage">
      <header className="articleHeader"><Link className="brand" href="/"><span className="brandMark globeMark">◎</span><span>Global<span className="brandBlue">Pedia</span></span></Link><Link className="backLink" href="/#featured">← Back</Link></header>
      <div className="articleHero"><img src={entry.image} alt="" /><div className="articleHeroShade" /><div className="articleHeroText"><span className={`articleTag tag-${entry.accent}`}>{entry.category.toUpperCase()}</span><h1>{entry.title}</h1><div className="articleMeta"><span>◷ {entry.meta.split(" · ")[0]}</span><span>◴ {entry.meta.split(" · ")[1]}</span></div></div></div>
      <article className="articleRead"><p className="articleLead">{entry.description}</p>{entry.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="articleActions"><BookmarkButton id={"article:" + entry.slug} title={entry.title} /><button>♡ 235</button><button>◌ 12</button><button>⌁ Share</button></div></article>
    </main>
  );
}

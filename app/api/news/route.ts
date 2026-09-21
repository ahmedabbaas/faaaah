import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const baseFeeds: [string, string][] = [
  ["World", "https://news.google.com/rss/search?q=world+news&hl=en-US&gl=US&ceid=US:en"],
  ["Pakistan", "https://news.google.com/rss/search?q=Pakistan+news&hl=en-US&gl=US&ceid=US:en"],
  ["Technology", "https://news.google.com/rss/search?q=technology+news&hl=en-US&gl=US&ceid=US:en"],
  ["Science", "https://news.google.com/rss/search?q=science+news&hl=en-US&gl=US&ceid=US:en"],
];

const sportsFeeds: [string, string][] = [
  ["Football", "https://news.google.com/rss/search?q=football+soccer+news&hl=en-US&gl=US&ceid=US:en"],
  ["Cricket", "https://news.google.com/rss/search?q=cricket+news&hl=en-US&gl=US&ceid=US:en"],
  ["Sports", "https://news.google.com/rss/search?q=global+sports+news&hl=en-US&gl=US&ceid=US:en"],
];

const gameFeeds: [string, string][] = [
  ["Games", "https://news.google.com/rss/search?q=video+game+news+release+date+announcements&hl=en-US&gl=US&ceid=US:en"],
  ["Rockstar", "https://news.google.com/rss/search?q=Rockstar+Games+GTA+VI+Red+Dead+news&hl=en-US&gl=US&ceid=US:en"],
  ["PlayStation", "https://news.google.com/rss/search?q=PlayStation+game+announcements&hl=en-US&gl=US&ceid=US:en"],
];

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function getTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function getAttr(xml: string, tag: string, attr: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i"));
  return match ? match[1] : "";
}

function fallbackImage(topic: string) {
  const images: Record<string, string> = {
    World: "https://images.unsplash.com/photo-1521292270410-a8c4d7166c7c?auto=format&fit=crop&q=82&w=1000",
    Pakistan: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=82&w=1000",
    Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=82&w=1000",
    Science: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=82&w=1000",
    Football: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=82&w=1000",
    Cricket: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=82&w=1000",
    Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=82&w=1000",
    Games: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=82&w=1000",
    Rockstar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=82&w=1000",
    PlayStation: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&q=82&w=1000",
  };
  return images[topic] || images.World;
}

function parseItem(item: string, topic: string) {
  const rawTitle = getTag(item, "title");
  const parts = rawTitle.split(" - ");
  const descriptionHtml = getTag(item, "description");
  const image =
    getTag(item, "media:content") ||
    getAttr(item, "media:content", "url") ||
    getAttr(item, "media:thumbnail", "url") ||
    getAttr(item, "enclosure", "url") ||
    ((descriptionHtml.match(/https?:\/\/[^"' <]+\.(?:jpg|jpeg|png|webp)/i) || [])[0] ?? fallbackImage(topic));

  return {
    id: getTag(item, "link"),
    title: parts.length > 1 ? parts.slice(0, -1).join(" - ") : rawTitle,
    description: descriptionHtml.slice(0, 220),
    link: getTag(item, "link"),
    source: parts.length > 1 ? parts[parts.length - 1] : "News",
    publishedAt: getTag(item, "pubDate"),
    category: "Live News",
    topic,
    image,
  };
}

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get("mode");
  const feeds = mode === "sports" ? sportsFeeds : mode === "games" ? gameFeeds : baseFeeds;

  const results = await Promise.allSettled(
    feeds.map(async ([topic, url]) => {
      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(6500),
        headers: { "user-agent": "GlobalPedia/1.0 news aggregator" },
      });

      if (!response.ok) throw new Error(`Feed error: ${response.status}`);
      const xml = await response.text();

      return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
        .slice(0, 12)
        .map((match) => parseItem(match[1], topic))
        .filter((item) => item.id && item.title);
    })
  );

  const news = results
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((item, index, array) => array.findIndex((x) => x.id === item.id) === index)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 30);

  return NextResponse.json(
    { news, updatedAt: new Date().toISOString(), mode: mode || "global" },
    { headers: { "Cache-Control": "no-store" } }
  );
}

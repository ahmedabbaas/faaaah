import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const baseFeeds: [string, string][] = [
  ["World", "https://news.google.com/rss/search?q=world+news&hl=en-US&gl=US&ceid=US:en"],
  ["Pakistan", "https://news.google.com/rss/search?q=Pakistan+latest+news&hl=en-US&gl=US&ceid=US:en"],
  ["Technology", "https://news.google.com/rss/search?q=technology+AI+news&hl=en-US&gl=US&ceid=US:en"],
  ["Science", "https://news.google.com/rss/search?q=science+space+research+news&hl=en-US&gl=US&ceid=US:en"],
  ["Sports", "https://news.google.com/rss/search?q=global+sports+news&hl=en-US&gl=US&ceid=US:en"],
  ["Games", "https://news.google.com/rss/search?q=video+games+gaming+news&hl=en-US&gl=US&ceid=US:en"],
];

const sportsFeeds: [string, string][] = [
  ["Football", "https://news.google.com/rss/search?q=football+soccer+news&hl=en-US&gl=US&ceid=US:en"],
  ["Cricket", "https://news.google.com/rss/search?q=cricket+news&hl=en-US&gl=US&ceid=US:en"],
  ["Sports", "https://news.google.com/rss/search?q=global+sports+news&hl=en-US&gl=US&ceid=US:en"],
];

const gameFeeds: [string, string][] = [
  ["GTA VI", "https://news.google.com/rss/search?q=GTA+VI+news&hl=en-US&gl=US&ceid=US:en"],
  ["Upcoming Games", "https://news.google.com/rss/search?q=upcoming+games+2026+release+date&hl=en-US&gl=US&ceid=US:en"],
  ["Nintendo", "https://news.google.com/rss/search?q=Nintendo+game+announcements+2026&hl=en-US&gl=US&ceid=US:en"],
  ["PlayStation", "https://news.google.com/rss/search?q=PlayStation+game+announcements+2026&hl=en-US&gl=US&ceid=US:en"],
  ["Xbox", "https://news.google.com/rss/search?q=Xbox+game+announcements+2026&hl=en-US&gl=US&ceid=US:en"],
  ["PC Gaming", "https://news.google.com/rss/search?q=PC+gaming+new+games+2026&hl=en-US&gl=US&ceid=US:en"],
];

const categoryFeeds: Record<string, [string, string][]> = {
  categories: [
    ["World", "https://news.google.com/rss/search?q=world+news+international&hl=en-US&gl=US&ceid=US:en"],
    ["Science", "https://news.google.com/rss/search?q=science+research+news&hl=en-US&gl=US&ceid=US:en"],
    ["Technology", "https://news.google.com/rss/search?q=technology+AI+news&hl=en-US&gl=US&ceid=US:en"],
    ["Culture", "https://news.google.com/rss/search?q=culture+arts+heritage+news&hl=en-US&gl=US&ceid=US:en"],
  ],
  countries: [
    ["World", "https://news.google.com/rss/search?q=international+country+news+geopolitics&hl=en-US&gl=US&ceid=US:en"],
    ["Pakistan", "https://news.google.com/rss/search?q=Pakistan+latest+news&hl=en-US&gl=US&ceid=US:en"],
    ["Asia", "https://news.google.com/rss/search?q=Asia+latest+news&hl=en-US&gl=US&ceid=US:en"],
    ["Europe", "https://news.google.com/rss/search?q=Europe+latest+news&hl=en-US&gl=US&ceid=US:en"],
  ],
  history: [
    ["History", "https://news.google.com/rss/search?q=history+archaeology+museum+discoveries&hl=en-US&gl=US&ceid=US:en"],
    ["Heritage", "https://news.google.com/rss/search?q=cultural+heritage+archaeology&hl=en-US&gl=US&ceid=US:en"],
  ],
  science: [
    ["Science", "https://news.google.com/rss/search?q=science+research+space+discovery&hl=en-US&gl=US&ceid=US:en"],
    ["Space", "https://news.google.com/rss/search?q=space+NASA+astronomy+news&hl=en-US&gl=US&ceid=US:en"],
  ],
  technology: [
    ["Technology", "https://news.google.com/rss/search?q=technology+AI+software+news&hl=en-US&gl=US&ceid=US:en"],
    ["AI", "https://news.google.com/rss/search?q=artificial+intelligence+AI+news&hl=en-US&gl=US&ceid=US:en"],
  ],
  culture: [
    ["Culture", "https://news.google.com/rss/search?q=culture+traditions+society+news&hl=en-US&gl=US&ceid=US:en"],
    ["Arts", "https://news.google.com/rss/search?q=arts+music+film+culture+news&hl=en-US&gl=US&ceid=US:en"],
  ],
  nature: [
    ["Nature", "https://news.google.com/rss/search?q=nature+wildlife+environment+news&hl=en-US&gl=US&ceid=US:en"],
    ["Climate", "https://news.google.com/rss/search?q=climate+environment+news&hl=en-US&gl=US&ceid=US:en"],
  ],
  health: [
    ["Health", "https://news.google.com/rss/search?q=health+medical+science+news&hl=en-US&gl=US&ceid=US:en"],
    ["Medicine", "https://news.google.com/rss/search?q=medicine+public+health+news&hl=en-US&gl=US&ceid=US:en"],
  ],
  arts: [
    ["Arts", "https://news.google.com/rss/search?q=arts+design+museum+news&hl=en-US&gl=US&ceid=US:en"],
    ["Culture", "https://news.google.com/rss/search?q=film+music+literature+arts+news&hl=en-US&gl=US&ceid=US:en"],
  ],
  explore: [
    ["World", "https://news.google.com/rss/search?q=world+breaking+news&hl=en-US&gl=US&ceid=US:en"],
    ["Technology", "https://news.google.com/rss/search?q=technology+science+news&hl=en-US&gl=US&ceid=US:en"],
    ["Pakistan", "https://news.google.com/rss/search?q=Pakistan+latest+news&hl=en-US&gl=US&ceid=US:en"],
  ],
  random: [
    ["World", "https://news.google.com/rss/search?q=world+news+interesting+stories&hl=en-US&gl=US&ceid=US:en"],
    ["Science", "https://news.google.com/rss/search?q=science+interesting+discoveries&hl=en-US&gl=US&ceid=US:en"],
  ],
  about: [
    ["World", "https://news.google.com/rss/search?q=world+news+international&hl=en-US&gl=US&ceid=US:en"],
    ["Global", "https://news.google.com/rss/search?q=global+affairs+news&hl=en-US&gl=US&ceid=US:en"],
  ],
};

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
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

function getSource(xml: string) {
  return getTag(xml, "source") || "Google News";
}

function extractImage(xml: string) {
  const direct =
    getAttr(xml, "media:content", "url") ||
    getAttr(xml, "media:thumbnail", "url") ||
    getAttr(xml, "enclosure", "url");

  if (direct) return direct.startsWith("//") ? `https:${direct}` : direct;

  const description = xml.match(/<description[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)?.[1];
  if (description) return description.startsWith("//") ? `https:${description}` : description;

  const content = xml.match(/<content:encoded[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)?.[1];
  if (content) return content.startsWith("//") ? `https:${content}` : content;

  return ""; 
}

function fallbackImage(topic: string) {
  const fallback: Record<string, string> = {
    World: "https://images.unsplash.com/photo-1521292270410-a8c4d7166c7c?auto=format&fit=crop&q=82&w=1000",
    Pakistan: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=82&w=1000",
    Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=82&w=1000",
    Science: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=82&w=1000",
    Football: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=82&w=1000",
    Cricket: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=82&w=1000",
    Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=82&w=1000",
    Games: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=82&w=1000",
    "GTA VI": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=82&w=1000",
    "Upcoming Games": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=82&w=1000",
    Nintendo: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=82&w=1000",
    PlayStation: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&q=82&w=1000",
    Xbox: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=82&w=1000",
    "PC Gaming": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&q=82&w=1000",
  };

  return fallback[topic] || fallback.Games;
}

async function resolveArticleImage(link: string, fallback: string) {
  if (!link) return fallback;

  try {
    const response = await fetch(link, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(3500),
      headers: { "user-agent": "GlobalPedia/1.0 thumbnail resolver" },
    });
    if (!response.ok) return fallback;

    const html = await response.text();
    const image =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1];

    if (!image) return fallback;
    return image.startsWith("//") ? `https:${image}` : image;
  } catch {
    return fallback;
  }
}

function matchImageSource(item: { image?: string }) {
  return item.image || "";
}

function parseItem(item: string, topic: string) {
  const rawTitle = getTag(item, "title");
  const titleParts = rawTitle.split(" - ");
  const descriptionHtml = getTag(item, "description");
  const link = getTag(item, "link") || getTag(item, "guid");

  return {
    id: link || rawTitle,
    title: titleParts.length > 1 ? titleParts.slice(0, -1).join(" - ") : rawTitle,
    description: descriptionHtml.slice(0, 220),
    link,
    source: getSource(item) || (titleParts.length > 1 ? titleParts[titleParts.length - 1] : "News"),
    publishedAt: getTag(item, "pubDate") || getTag(item, "dc:date"),
    category: "Live News",
    topic,
    image: extractImage(item) || fallbackImage(topic),
  };
}

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get("mode");
  const feeds =
    (mode && categoryFeeds[mode]) ||
    (mode === "sports" ? sportsFeeds : mode === "games" ? gameFeeds : baseFeeds);

  const results = await Promise.allSettled(
    feeds.map(async ([topic, url]) => {
      const freshUrl = `${url}${url.includes("?") ? "&" : "?"}_gp_ts=${Date.now()}`;
      const response = await fetch(freshUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(6500),
        headers: {
          "user-agent": "GlobalPedia/1.0 news aggregator",
          "cache-control": "no-cache",
        },
      });

      if (!response.ok) throw new Error(`Feed error: ${response.status}`);
      const xml = await response.text();

      const parsed = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
        .slice(0, 12)
        .map((match) => parseItem(match[1], topic))
        .filter((item) => item.id && item.title);

      return Promise.all(
        parsed.map(async (item, index) => {
          const hasFeedImage = /(?:media:content|media:thumbnail|enclosure|<img[^>]+src=)/i.test(
            matchImageSource(item)
          );
          if (index >= 4 || hasFeedImage) return item;
          return { ...item, image: await resolveArticleImage(item.link, item.image || fallbackImage(topic)) };
        })
      );
    })
  );

  const news = results
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((item, index, array) => array.findIndex((x) => x.id === item.id) === index)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 36);

  return NextResponse.json(
    { news, updatedAt: new Date().toISOString(), mode: mode || "global" },
    { headers: { "Cache-Control": "no-store" } }
  );
}

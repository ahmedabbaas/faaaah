import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Feed = [string, string];

const commonQuery = (query: string) =>
  "https://news.google.com/rss/search?q=" +
  encodeURIComponent(query) +
  "&hl=en-US&gl=US&ceid=US:en";

const baseFeeds: Feed[] = [
  ["World", commonQuery("world latest news")],
  ["Pakistan", commonQuery("Pakistan latest news")],
  ["Technology", commonQuery("technology latest news")],
  ["Science", commonQuery("science research latest news")],
  ["Business", commonQuery("business markets latest news")],
  ["Sports", commonQuery("global sports latest news")],
  ["Games", commonQuery("video games gaming latest news")],
  ["Culture", commonQuery("culture arts latest news")],
];

const sportsFeeds: Feed[] = [
  ["Football", commonQuery("football soccer latest news")],
  ["Cricket", commonQuery("cricket latest news")],
  ["Sports", commonQuery("global sports latest news")],
  ["Tennis", commonQuery("tennis latest news")],
  ["Formula 1", commonQuery("Formula 1 latest news")],
];

const gameFeeds: Feed[] = [
  ["GTA VI", commonQuery("GTA VI latest news")],
  ["Upcoming Games", commonQuery("upcoming video games 2026 2027 release")],
  ["Nintendo", commonQuery("Nintendo latest game news")],
  ["PlayStation", commonQuery("PlayStation latest game news")],
  ["Xbox", commonQuery("Xbox latest game news")],
  ["PC Gaming", commonQuery("PC gaming latest news")],
  ["Mobile Games", commonQuery("mobile games latest news")],
  ["Indie Games", commonQuery("indie games latest news")],
];

const categoryFeeds: Record<string, Feed[]> = {
  countries: [
    ["Pakistan", commonQuery("Pakistan latest news")],
    ["Asia", commonQuery("Asia latest news")],
    ["Europe", commonQuery("Europe latest news")],
    ["Middle East", commonQuery("Middle East latest news")],
    ["Americas", commonQuery("Americas latest news")],
    ["Africa", commonQuery("Africa latest news")],
  ],
  history: [
    ["History", commonQuery("history archaeology latest discoveries")],
    ["Archaeology", commonQuery("archaeology latest discoveries museum")],
    ["Heritage", commonQuery("cultural heritage latest news")],
  ],
  science: [
    ["Science", commonQuery("science research latest news")],
    ["Space", commonQuery("space NASA astronomy latest news")],
    ["Environment", commonQuery("environment climate latest news")],
    ["Medicine", commonQuery("medical health research latest news")],
  ],
  technology: [
    ["Technology", commonQuery("technology latest news")],
    ["AI", commonQuery("artificial intelligence latest news")],
    ["Cybersecurity", commonQuery("cybersecurity latest news")],
    ["Mobile", commonQuery("smartphone mobile technology latest news")],
  ],
  culture: [
    ["Culture", commonQuery("culture society latest news")],
    ["Arts", commonQuery("arts museum design latest news")],
    ["Film", commonQuery("film cinema latest news")],
    ["Music", commonQuery("music latest news")],
  ],
  nature: [
    ["Nature", commonQuery("nature wildlife latest news")],
    ["Environment", commonQuery("environment climate latest news")],
    ["Climate", commonQuery("climate science latest news")],
  ],
  health: [
    ["Health", commonQuery("health medical latest news")],
    ["Medicine", commonQuery("medicine clinical research latest news")],
    ["Public Health", commonQuery("public health latest news")],
  ],
  arts: [
    ["Arts", commonQuery("arts design museum latest news")],
    ["Culture", commonQuery("culture literature latest news")],
    ["Film", commonQuery("film cinema latest news")],
  ],
  business: [
    ["Business", commonQuery("business markets latest news")],
    ["Markets", commonQuery("stock markets latest news")],
    ["Technology", commonQuery("technology business latest news")],
  ],
  explore: [
    ...baseFeeds,
    ["Space", commonQuery("space astronomy latest news")],
    ["Environment", commonQuery("environment climate latest news")],
  ],
  random: [
    ["World", commonQuery("interesting world stories latest news")],
    ["Science", commonQuery("interesting science discoveries latest news")],
    ["Culture", commonQuery("interesting culture stories latest news")],
  ],
  about: baseFeeds,
};

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function getAttr(xml: string, tag: string, attr: string) {
  const match = xml.match(
    new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i")
  );
  return match ? decodeEntities(match[1]) : "";
}

function extractImage(xml: string) {
  const direct =
    getAttr(xml, "media:content", "url") ||
    getAttr(xml, "media:thumbnail", "url") ||
    getAttr(xml, "enclosure", "url");

  if (direct) return direct.startsWith("//") ? `https:${direct}` : direct;

  const embedded =
    xml.match(/<description[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)?.[1] ||
    xml.match(/<content:encoded[\s\S]*?<img[^>]+src=["']([^"']+)["']/i)?.[1];

  if (!embedded) return "";
  return embedded.startsWith("//") ? `https:${embedded}` : embedded;
}

function cleanUrl(value: string, base?: string) {
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
}

function parseItem(item: string, topic: string) {
  const rawTitle = getTag(item, "title");
  const sourceParts = rawTitle.split(" - ");
  const link = cleanUrl(getTag(item, "link") || getTag(item, "guid"));
  const description = getTag(item, "description");

  return {
    id: link || rawTitle,
    title: sourceParts.length > 1 ? sourceParts.slice(0, -1).join(" - ") : rawTitle,
    description: description.slice(0, 360),
    link,
    source: getTag(item, "source") || (sourceParts.length > 1 ? sourceParts[sourceParts.length - 1] : "News"),
    publishedAt: getTag(item, "pubDate") || getTag(item, "dc:date"),
    category: "Live News",
    topic,
    image: extractImage(item),
  };
}

async function resolvePublisherImage(link: string) {
  if (!link) return "";

  try {
    const response = await fetch(link, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(2500),
      headers: {
        "user-agent": "GlobalPedia/1.0 (+live-news-thumbnail)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) return "";
    const finalUrl = response.url || link;
    const html = await response.text();

    const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
    for (const tag of metaTags) {
      const property =
        tag.match(/property=["']([^"']+)["']/i)?.[1]?.toLowerCase() ||
        tag.match(/name=["']([^"']+)["']/i)?.[1]?.toLowerCase() ||
        "";
      if (property !== "og:image" && property !== "twitter:image") continue;
      const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
      if (content) return cleanUrl(content, finalUrl);
    }
  } catch {
    // Publisher pages can block server-side requests. Keep the feed image if one exists.
  }

  return "";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const mode = requestUrl.searchParams.get("mode") || "global";
  const feeds =
    categoryFeeds[mode] ||
    (mode === "sports" ? sportsFeeds : mode === "games" ? gameFeeds : baseFeeds);

  const results = await Promise.allSettled(
    feeds.map(async ([topic, url]) => {
      const response = await fetch(
        `${url}${url.includes("?") ? "&" : "?"}_gp_ts=${Date.now()}`,
        {
          cache: "no-store",
          signal: AbortSignal.timeout(6500),
          headers: {
            "user-agent": "GlobalPedia/1.0 live news aggregator",
            "cache-control": "no-cache",
          },
        }
      );

      if (!response.ok) throw new Error(`Feed error: ${response.status}`);
      const xml = await response.text();

      return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
        .slice(0, 10)
        .map((match) => parseItem(match[1], topic))
        .filter((item) => item.id && item.title);
    })
  );

  let news = results
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id) === index)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  const imageCandidates = news.filter((item) => !item.image).slice(0, 20);
  const resolvedImages = await Promise.all(
    imageCandidates.map(async (item) => [item.id, await resolvePublisherImage(item.link)] as const)
  );
  const imageMap = new Map(resolvedImages);

  news = news
    .map((item) => {
      const publisherImage = imageMap.get(item.id) || "";
      return {
        ...item,
        image: item.image || publisherImage,
        imageSource: item.image ? "feed" : publisherImage ? "publisher" : "none",
      };
    })
    .slice(0, 90);

  return NextResponse.json(
    {
      news,
      updatedAt: new Date().toISOString(),
      mode,
      count: news.length,
      note: "Live Google News RSS headlines. Summaries are feed metadata; full reporting stays with the original publisher.",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

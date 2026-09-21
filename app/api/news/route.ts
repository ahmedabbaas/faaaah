import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const feeds = [
  ["World", "https://news.google.com/rss/search?q=world+news&hl=en-US&gl=US&ceid=US:en"],
  ["Pakistan", "https://news.google.com/rss/search?q=Pakistan+news&hl=en-US&gl=US&ceid=US:en"],
  ["Technology", "https://news.google.com/rss/search?q=technology+news&hl=en-US&gl=US&ceid=US:en"],
  ["Science", "https://news.google.com/rss/search?q=science+news&hl=en-US&gl=US&ceid=US:en"],
];

function clean(value: string) {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();
}

function getTag(xml: string, tag: string) {
  const match = xml.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i")
  );
  return match ? clean(match[1]) : "";
}

export async function GET() {
  const results = await Promise.allSettled(
    feeds.map(async ([category, url]) => {
      const response = await fetch(url, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Feed error: ${response.status}`);
      }

      const xml = await response.text();

      return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
        .slice(0, 10)
        .map((match) => {
          const item = match[1];
          const rawTitle = getTag(item, "title");
          const parts = rawTitle.split(" - ");

          return {
            id: getTag(item, "link"),
            title: parts.length > 1
              ? parts.slice(0, -1).join(" - ")
              : rawTitle,
            description: getTag(item, "description").slice(0, 180),
            link: getTag(item, "link"),
            source: parts.length > 1
              ? parts[parts.length - 1]
              : "News",
            publishedAt: getTag(item, "pubDate"),
            category,
          };
        })
        .filter((item) => item.id && item.title);
    })
  );

  const news = results
    .flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    )
    .filter(
      (item, index, array) =>
        array.findIndex((x) => x.id === item.id) === index
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    )
    .slice(0, 30);

  return NextResponse.json(
    {
      news,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
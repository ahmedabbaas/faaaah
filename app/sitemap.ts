import type { MetadataRoute } from "next";
import { entries } from "./data/entries";

export default function sitemap(): MetadataRoute.Sitemap {
  const host = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const base = host ? (host.startsWith("http") ? host : `https://${host}`) : "http://localhost:3000";

  return [
    { url: base, lastModified: new Date() },
    ...["timeline","search","compare","tools","trends","quiz","today","bookmarks","ai","following"].map((path) => ({ url: `${base}/${path}`, lastModified: new Date() })),
    ...entries.map((entry) => ({
      url: `${base}/articles/${entry.slug}`,
      lastModified: new Date(),
    })),
  ];
}

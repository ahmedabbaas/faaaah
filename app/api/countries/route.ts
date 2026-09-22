import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApiCountry = {
  name?: { common?: string; official?: string };
  cca2?: string;
  cca3?: string;
  flags?: { png?: string; svg?: string };
  capital?: string[];
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  timezones?: string[];
  languages?: Record<string, string>;
  currencies?: Record<string, { name?: string }>;
  continents?: string[];
};

const fallback = [
  ["PK","Pakistan","Asia"],["IN","India","Asia"],["CN","China","Asia"],["JP","Japan","Asia"],
  ["KR","South Korea","Asia"],["ID","Indonesia","Asia"],["TR","Türkiye","Asia"],["SA","Saudi Arabia","Asia"],
  ["AE","United Arab Emirates","Asia"],["GB","United Kingdom","Europe"],["FR","France","Europe"],
  ["DE","Germany","Europe"],["IT","Italy","Europe"],["ES","Spain","Europe"],["US","United States","Americas"],
  ["CA","Canada","Americas"],["BR","Brazil","Americas"],["MX","Mexico","Americas"],["AU","Australia","Oceania"],
  ["ZA","South Africa","Africa"],["NG","Nigeria","Africa"],["EG","Egypt","Africa"],["MA","Morocco","Africa"]
];

export async function GET() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,capital,region,subregion,population,area,timezones,languages,currencies,continents",
      { cache: "no-store", signal: AbortSignal.timeout(7000) }
    );

    if (!response.ok) throw new Error("Country API failed");

    const raw = (await response.json()) as ApiCountry[];
    const countries = raw
      .filter((c) => c.cca2 && c.name?.common)
      .map((c) => ({
        code: c.cca2 as string,
        code3: c.cca3 ?? "",
        name: c.name?.common ?? "",
        officialName: c.name?.official ?? c.name?.common ?? "",
        flag:
          c.flags?.png ||
          c.flags?.svg ||
          `https://flagcdn.com/w320/${(c.cca2 as string).toLowerCase()}.png`,
        capital: c.capital?.[0] ?? "—",
        region: c.region ?? "—",
        subregion: c.subregion ?? "—",
        population: c.population ?? 0,
        area: c.area ?? 0,
        timezones: c.timezones ?? [],
        languages: Object.values(c.languages ?? {}).slice(0, 4),
        currencies: Object.values(c.currencies ?? {})
          .map((v) => v.name ?? "")
          .filter(Boolean)
          .slice(0, 3),
        continents: c.continents ?? [],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(
      { countries, source: "REST Countries", updatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json({
      fallback: true,
      updatedAt: new Date().toISOString(),
      countries: fallback.map(([code, name, region]) => ({
        code,
        code3: "",
        name,
        officialName: name,
        flag: `https://flagcdn.com/w320/${String(code).toLowerCase()}.png`,
        capital: "—",
        region,
        subregion: "—",
        population: 0,
        area: 0,
        timezones: [],
        languages: [],
        currencies: [],
        continents: [region],
      })),
    });
  }
}

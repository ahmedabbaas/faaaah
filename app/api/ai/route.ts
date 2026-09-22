import { NextResponse } from "next/server";
import { entries } from "../../data/entries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Country = {
  name: string;
  capital?: string[];
  region?: string;
  population?: number;
  languages?: Record<string, string>;
  currencies?: Record<string, { name?: string }>;
};

type AiBody = {
  question?: unknown;
  context?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AiBody;
  const q = String(body.question || "").trim();
  const context = String(body.context || "").trim();

  if (!q) {
    return NextResponse.json({ answer: "Ask a specific question." });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const model = process.env.OPENAI_MODEL || "gpt-5.6-sol";
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          instructions:
            "You are Global AI for GlobalPedia. Answer only the user's actual question. Do not add unrelated facts, filler, recommendations, or a generic introduction. Be direct and concise. When the question asks for current, latest, today's, or recent information, use web search and answer from current evidence. Never invent facts. If the user asks for a specific item, answer that item and stop. If article context is provided, use it when relevant but do not drift beyond the question.",
          input:
            (context ? "Article context:\n" + context + "\n\n" : "") +
            "User question:\n" +
            q,
          tools: [{ type: "web_search" }],
          reasoning: { effort: "low" },
          max_output_tokens: 700,
        }),
        signal: AbortSignal.timeout(20000),
      });

      const data = await response.json();
      const answer =
        data.output_text ||
        (data.output || [])
          .flatMap((item: { content?: { text?: string }[] }) => item.content || [])
          .map((item: { text?: string }) => item.text || "")
          .join(" ");

      if (response.ok && answer) {
        return NextResponse.json({
          answer,
          mode: "ai",
          source: { type: "model", model },
        });
      }
    } catch {
      // Use local knowledge fallbacks below.
    }
  }

  const normalized = q.toLowerCase();
  const exact = entries.find((entry) =>
    (entry.title + " " + entry.description + " " + entry.category)
      .toLowerCase()
      .includes(normalized)
  );
  const tokenMatch = entries.find((entry) =>
    normalized.split(/\s+/).some(
      (word) =>
        word.length > 3 &&
        (entry.title + " " + entry.description).toLowerCase().includes(word)
    )
  );
  const article = exact || tokenMatch;

  if (article) {
    return NextResponse.json({
      answer: article.description,
      mode: "knowledge",
      source: { type: "article", slug: article.slug, title: article.title },
    });
  }

  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/name/" +
        encodeURIComponent(q) +
        "?fields=name,capital,region,population,languages,currencies",
      { cache: "no-store", signal: AbortSignal.timeout(6000) }
    );

    if (response.ok) {
      const data = (await response.json()) as Country[];
      const country = data[0];

      if (country) {
        const languages =
          Object.values(country.languages || {}).join(", ") || "—";
        const currencies =
          Object.values(country.currencies || {})
            .map((value) => value.name || "")
            .filter(Boolean)
            .join(", ") || "—";

        return NextResponse.json({
          answer:
            (country.name || q) +
            " is in " +
            (country.region || "—") +
            ". Capital: " +
            (country.capital?.[0] || "—") +
            ". Population: " +
            new Intl.NumberFormat("en").format(country.population || 0) +
            ". Languages: " +
            languages +
            ". Currency: " +
            currencies +
            ".",
          mode: "country",
          source: { type: "country", name: country.name || q },
        });
      }
    }
  } catch {
    // The country service is optional.
  }

  return NextResponse.json({
    answer:
      "I could not find a direct answer in the current GlobalPedia index. Ask a more specific question or enable the AI provider for broader answers.",
    mode: "search",
  });
}

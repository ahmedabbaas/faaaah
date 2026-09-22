import { NextResponse } from "next/server";
import { entries } from "../../data/entries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Country = {
  name:string;
  capital?:string[];
  region?:string;
  population?:number;
  languages?:Record<string,string>;
  currencies?:Record<string,{name?:string}>;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const q = String(body.question || "").trim();
  const context = String(body.context || "").trim();
  if (!q) return NextResponse.json({ answer: "Ask me something about GlobalPedia." });

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
      const response = await fetch("https://api.openai.com/v1/responses", {
        method:"POST",
        headers:{Authorization:"Bearer "+apiKey,"Content-Type":"application/json"},
        body:JSON.stringify({
          model,
          input:"You are GlobalPedia AI. Answer clearly and briefly. Use only information you can support. If article context is supplied, answer from that context first and clearly separate broader knowledge. Article context: "+(context || "none")+"\nUser question: "+q,
          max_output_tokens:500
        }),
        signal:AbortSignal.timeout(15000)
      });
      const data = await response.json();
      const answer = data.output_text || (data.output || []).flatMap((x:{content?:{text?:string}[]})=>x.content || []).map((x:{text?:string})=>x.text || "").join(" ");
      if (response.ok && answer) return NextResponse.json({answer,mode:"ai"});
    } catch {
      // Fall back to the local knowledge index when the external AI request fails.
    }
  }

  const normalized = q.toLowerCase();
  const exact = entries.find(e => (e.title+" "+e.description+" "+e.category).toLowerCase().includes(normalized));
  const tokenMatch = entries.find(e => normalized.split(/\s+/).some((w:string)=>w.length>3 && (e.title+" "+e.description).toLowerCase().includes(w)));
  const article = exact || tokenMatch;

  if (article) {
    return NextResponse.json({
      answer: article.title+"\n\n"+article.description+"\n\nCategory: "+article.category+". Open the full GlobalPedia article for the longer explanation.",
      mode:"knowledge"
    });
  }

  try {
    const response = await fetch("https://restcountries.com/v3.1/name/"+encodeURIComponent(q)+"?fields=name,capital,region,population,languages,currencies", {
      cache:"no-store",
      signal:AbortSignal.timeout(6000)
    });
    if (response.ok) {
      const data = (await response.json()) as Country[];
      const c = data[0];
      if (c) {
        return NextResponse.json({
          const languages = Object.values(c.languages || {}).join(", ") || "—";
          const currencies = Object.values(c.currencies || {}).map(x=>x.name || "").filter(Boolean).join(", ") || "—";
          return NextResponse.json({
            answer:(c.name || q)+" is in "+(c.region || "—")+". Capital: "+(c.capital?.[0] || "—")+". Population: "+new Intl.NumberFormat("en").format(c.population || 0)+". Languages: "+languages+". Currency: "+currencies+".",
            source: { type: "country", name: c.name || q },
            mode:"country"
          });
        });
      }
    }
  } catch {
    // Fall back to the search response when the country service is unavailable.
  }

  return NextResponse.json({
    answer:"I couldn't find a direct match in the current GlobalPedia index. Try a country name, article title, category, or configure the AI provider key for broader answers.",
    mode:"search"
  });
}

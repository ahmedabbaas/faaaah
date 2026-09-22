
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

type Source = {
  type?: string;
  title?: string;
  name?: string;
  model?: string;
  slug?: string;
};

type Msg = {
  role: "user" | "assistant";
  text: string;
  source?: Source;
};

export default function AiPage() {
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Ask one clear question. Global AI will focus on that question instead of wandering off into the digital bushes.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");
    const articleContext = params.get("context");
    if (topic) setInput(topic);
    if (articleContext) setContext(articleContext);
  }, []);

  const ask = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMessages((current) => [...current, { role: "user", text: q }]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context }),
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.answer || "No answer available.",
          source: data.source,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: "The assistant is unavailable right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const prompts = [
    "Explain this topic simply",
    "What are the key facts?",
    "What is the latest news?",
    "Compare two things",
  ];

  return (
    <PageChrome>
      <section className="pageHero compactHero aiHeroUpgrade">
        <span className="heroTag">GLOBALPEDIA · GLOBAL AI</span>
        <h1>Ask one thing. Get <em>one answer.</em></h1>
        <p>
          Global AI uses GlobalPedia knowledge first and current web information
          when the question needs an up-to-date answer.
        </p>
        {context && (
          <div className="aiContextChip">
            <span>ARTICLE CONTEXT</span>
            <strong>{context.slice(0, 180)}{context.length > 180 ? "…" : ""}</strong>
          </div>
        )}
      </section>

      <section className="aiPage sectionWrap">
        <div className="aiShell">
          <div className="aiMessages">
            {messages.map((message, index) => (
              <div className={"aiMessage " + message.role} key={index}>
                <span>{message.role === "assistant" ? "GP" : "YOU"}</span>
                <div>
                  <p>{message.text}</p>
                  {message.role === "assistant" && message.source && (
                    <div className="aiSource">
                      <small>SOURCE</small>
                      {message.source.slug ? (
                        <Link href={"/articles/" + message.source.slug}>
                          {message.source.title || "GlobalPedia article"} ↗
                        </Link>
                      ) : (
                        <span>
                          {message.source.name || message.source.title || message.source.model || "GlobalPedia"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="aiMessage assistant">
                <span>GP</span>
                <p>Checking the right context…</p>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="aiPromptRow">
              {prompts.map((prompt) => (
                <button key={prompt} onClick={() => setInput(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="aiComposer">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void ask();
              }}
              placeholder="Ask a specific question..."
              aria-label="Ask GlobalPedia AI"
            />
            <button onClick={() => void ask()} disabled={loading}>
              {loading ? "..." : "Ask ↗"}
            </button>
          </div>

          <div className="aiFooter">
            <span>Current questions use web search when the AI provider is configured.</span>
            <Link href="/engine">Open Global Engine ↗</Link>
          </div>
        </div>
      </section>
    </PageChrome>
  );
}

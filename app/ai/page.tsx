"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageChrome from "../components/PageChrome";

type Msg = { role: "user" | "assistant"; text: string };

export default function AiPage() {
  const params = useSearchParams();
  const [input, setInput] = useState("");
  const [context, setContext] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "I can search GlobalPedia's indexed knowledge and explain the result. Ask about a country, topic, article or current signal.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const topic = params.get("topic");
    const articleContext = params.get("context");
    if (topic) setInput(topic);
    if (articleContext) setContext(articleContext);
  }, [params]);

  const ask = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMessages((messages) => [...messages, { role: "user", text: q }]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context }),
      });
      const data = await response.json();
      setMessages((messages) => [
        ...messages,
        { role: "assistant", text: data.answer || "No answer available." },
      ]);
    } catch {
      setMessages((messages) => [
        ...messages,
        { role: "assistant", text: "The assistant is unavailable right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const prompts = [
    "Explain this topic simply",
    "Give me the key facts",
    "What is the historical context?",
    "What should I explore next?",
  ];

  return (
    <PageChrome>
      <section className="pageHero compactHero aiHeroUpgrade">
        <span className="heroTag">GLOBALPEDIA · AI EXPLORER</span>
        <h1>Ask the world <em>anything.</em></h1>
        <p>
          A research assistant connected to GlobalPedia's indexed knowledge,
          country data and article context.
        </p>
        {context && (
          <div className="aiContextChip">
            <span>ARTICLE CONTEXT</span>
            <strong>{context}</strong>
          </div>
        )}
      </section>

      <section className="aiPage sectionWrap">
        <div className="aiShell">
          <div className="aiMessages">
            {messages.map((message, index) => (
              <div className={"aiMessage " + message.role} key={index}>
                <span>{message.role === "assistant" ? "GP" : "YOU"}</span>
                <p>{message.text}</p>
              </div>
            ))}
            {loading && (
              <div className="aiMessage assistant">
                <span>GP</span>
                <p>Thinking…</p>
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
              placeholder="Ask: What is Pakistan's capital? Explain transformers..."
              aria-label="Ask GlobalPedia AI"
            />
            <button onClick={() => void ask()} disabled={loading}>
              {loading ? "..." : "Ask ↗"}
            </button>
          </div>

          <div className="aiFooter">
            <span>Answers can be incomplete. Check source material for important claims.</span>
            <Link href="/search">Search the index ↗</Link>
          </div>
        </div>
      </section>
    </PageChrome>
  );
}

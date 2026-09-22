"use client";

import { useEffect, useState } from "react";

const languages = [
  ["en", "English", "EN"],
  ["ur", "اردو", "اردو"],
  ["ar", "العربية", "AR"],
  ["es", "Español", "ES"],
  ["hi", "हिन्दी", "HI"],
] as const;

export default function LanguageSelector() {
  const [value, setValue] = useState("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("globalpedia_language") || "en";
    setValue(saved);
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === "ur" || saved === "ar" ? "rtl" : "ltr";
  }, []);

  const change = (next: string) => {
    setValue(next);
    window.localStorage.setItem("globalpedia_language", next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ur" || next === "ar" ? "rtl" : "ltr";
  };

  return (
    <label className="languageSelector">
      <span>Language</span>
      <select value={value} onChange={(event) => change(event.target.value)} aria-label="Site language">
        {languages.map(([code, label, short]) => (
          <option value={code} key={code}>{label} · {short}</option>
        ))}
      </select>
    </label>
  );
}

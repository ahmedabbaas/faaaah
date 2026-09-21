"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("gp-theme");
    const next = saved === "light";
    document.documentElement.dataset.theme = next ? "light" : "dark";
    setLight(next);
  }, []);

  const toggle = () => {
    const next = !light;
    document.documentElement.dataset.theme = next ? "light" : "dark";
    window.localStorage.setItem("gp-theme", next ? "light" : "dark");
    setLight(next);
  };

  return (
    <button
      className="themeToggle"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Dark mode" : "Light mode"}
    >
      <span>{light ? "☀" : "☾"}</span>
      <small>{light ? "Light" : "Dark"}</small>
    </button>
  );
}

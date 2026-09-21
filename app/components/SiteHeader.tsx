"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import AccountHud from "./AccountHud";

const links = [
  ["Home", "/"],
  ["Explore", "/explore"],
  ["Categories", "/categories"],
  ["Countries", "/countries"],
  ["Sports", "/sports"],
  ["Games", "/games"],
  ["Random", "/random"],
  ["About", "/about"],
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="GlobalPedia home">
        <span className="brandMark globeMark">◎</span>
        <span>
          Global<span className="brandBlue">Pedia</span>
        </span>
      </Link>

      <nav
        className={`topnav ${menuOpen ? "open" : ""}`}
        aria-label="Main navigation"
      >
        {links.map(([label, href]) => (
          <Link
            className={isActive(href) ? "active" : ""}
            key={label}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="topbarActions">
        <Link className="iconButton" href="/explore#search" aria-label="Search GlobalPedia" title="Search">
          ⌕
        </Link>
        <AccountHud />
        <ThemeToggle />
        <button
          className="menuButton"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>
    </header>
  );
}

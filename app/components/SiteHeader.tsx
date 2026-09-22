"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import AccountHud from "./AccountHud";

const links = [
  ["Home", "/"],
  ["Explore", "/explore"],
  ["Countries", "/countries"],
  ["Sports", "/sports"],
  ["Games", "/games"],
] as const;

const moreLinks = [
  ["Universal Search", "/search"],
  ["Compare Countries", "/compare"],
  ["World Tools", "/tools"],
  ["Live Trends", "/trends"],
  ["Daily Quiz", "/quiz"],
  ["Today", "/today"],
  ["My Library", "/bookmarks"],
  ["AI Explorer", "/ai"],
  ["Following", "/following"],
  ["World Timeline", "/timeline"],
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="GlobalPedia home">
        <span className="brandMark globeMark">
          <span className="brandOrbit">◎</span>
        </span>
        <span className="brandWordmark">
          Global<span className="brandBlue">Pedia</span>
        </span>
      </Link>

      <div className="navCenter">
        <nav className={"topnav " + (menuOpen ? "open" : "")} aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              className={isActive(href) ? "active" : ""}
              key={label}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span>{label}</span>
            </Link>
          ))}
          <div className="moreMenu">
            <button className={"moreTrigger " + (moreOpen ? "active" : "")} onClick={() => setMoreOpen((v) => !v)} aria-expanded={moreOpen}>
              More <span>⌄</span>
            </button>
            {moreOpen && (
              <div className="moreDropdown">
                {moreLinks.map(([label, href]) => (
                  <Link key={href} href={href} className={isActive(href) ? "active" : ""} onClick={() => { setMoreOpen(false); setMenuOpen(false); }}>
                    <span>{label}</span><small>↗</small>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="topbarActions">
        <Link className="headerSearchButton" href="/search" aria-label="Search GlobalPedia" title="Search">
          <span>⌕</span><small>Search</small><kbd>/</kbd>
        </Link>
        <AccountHud />
        <ThemeToggle />
        <button className="menuButton" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

import type { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export default function PageChrome({ children }: { children: ReactNode }) {
  return (
    <main className="sitePage">
      <div className="noise" aria-hidden="true" />
      <SiteHeader />
      {children}
      <SiteFooter />
    </main>
  );
}

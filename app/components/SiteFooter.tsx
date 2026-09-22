import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <Link className="brand" href="/">
        <span className="brandMark globeMark">◎</span>
        <span>
          Global<span className="brandBlue">Pedia</span>
        </span>
      </Link>
      <div className="footerLinks">
        <Link href="/learn">Learn</Link>
        <Link href="/atlas">Atlas</Link>
        <Link href="/data">World Data</Link>
        <Link href="/graph">Knowledge Graph</Link>
        <span>© 2026 GLOBALPEDIA</span>
      </div>
    </footer>
  );
}

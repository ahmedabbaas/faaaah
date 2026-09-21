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
      <div>
        <span>ONE WORLD · ENDLESS KNOWLEDGE</span>
        <span>© 2026 GLOBALPEDIA</span>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="statePage">
      <div className="eyebrow"><span /> GLOBALPEDIA · 404</div>
      <h1>That page does not exist.</h1>
      <p>The address may be wrong, or the knowledge escaped through a tiny dimensional crack.</p>
      <Link className="stateLink" href="/">Return to GlobalPedia</Link>
    </main>
  );
}

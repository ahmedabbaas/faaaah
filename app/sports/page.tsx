import PageChrome from "../components/PageChrome";
import WorldKnowledgeHub from "../components/WorldKnowledgeHub";

export const metadata = {
  title: "Sports | GlobalPedia",
  description: "Explore neutral country sports profiles and live sports signals.",
};

export default function SportsPage() {
  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · SPORTS</span>
        <h1>Sports, signals and <em>global context.</em></h1>
        <p>
          Follow live sports headlines alongside neutral country profiles and
          prominent sporting activity without turning the page into a scoreboard for national pride.
        </p>
      </section>
      <WorldKnowledgeHub initialTab="sports" />
    </PageChrome>
  );
}

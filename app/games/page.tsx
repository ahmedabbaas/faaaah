import PageChrome from "../components/PageChrome";
import LiveNewsFeed from "../components/LiveNewsFeed";
import WorldKnowledgeHub from "../components/WorldKnowledgeHub";

export const metadata = {
  title: "Games | GlobalPedia",
  description: "Track gaming releases, announcements and live gaming headlines.",
};

export default function GamesPage() {
  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · GAME RADAR</span>
        <h1>Games, releases and <em>announcements.</em></h1>
        <p>
          Track verified release information, official announcements and live
          gaming headlines in one dedicated radar.
        </p>
      </section>
      <LiveNewsFeed
        mode="games"
        title="Live Gaming Updates"
        subtitle="Fresh game announcements, release news, Rockstar signals and platform headlines."
      />
      <WorldKnowledgeHub initialTab="games" />
    </PageChrome>
  );
}

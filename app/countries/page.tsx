import PageChrome from "../components/PageChrome";
import LiveNewsFeed from "../components/LiveNewsFeed";
import WorldKnowledgeHub from "../components/WorldKnowledgeHub";

export const metadata = {
  title: "Countries | GlobalPedia",
  description: "Explore country profiles, regions, time zones, sports and global signals.",
};

export default function CountriesPage() {
  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · COUNTRIES</span>
        <h1>The world, one <em>country</em> at a time.</h1>
        <p>
          Search country profiles, inspect regions, check local time and jump into
          the global signals layer.
        </p>
      </section>
      <LiveNewsFeed
        mode="countries"
        title="Countries Live Updates"
        subtitle="International and regional headlines to keep country profiles anchored in current context."
      />
      <WorldKnowledgeHub />
    </PageChrome>
  );
}

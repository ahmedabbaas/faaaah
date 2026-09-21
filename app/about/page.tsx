import PageChrome from "../components/PageChrome";
import LiveNewsFeed from "../components/LiveNewsFeed";

export const metadata = {
  title: "About | GlobalPedia",
  description: "About GlobalPedia, a visual map of knowledge.",
};

export default function AboutPage() {
  return (
    <PageChrome>
      <section className="aboutPageHero">
        <span className="heroTag">GLOBALPEDIA · ABOUT</span>
        <h1>Knowledge should feel worth <em>exploring.</em></h1>
        <p>
          GlobalPedia is designed as a visual, searchable map of the world rather
          than a wall of text. The goal is simple: make useful context easier to find,
          understand and connect.
        </p>
      </section>

      <section className="aboutFeatureGrid sectionWrap">
        <article>
          <span>01</span>
          <h2>Visual first</h2>
          <p>Maps, images, structured profiles and motion help information feel navigable instead of flat.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Human friendly</h2>
          <p>Complex subjects are organized into readable pieces without pretending the world is simple.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Always expanding</h2>
          <p>The architecture is built to grow across countries, categories, live signals and deeper article pages.</p>
        </article>
      </section>

      <LiveNewsFeed
        mode="about"
        title="GlobalPedia Live Desk"
        subtitle="The live layer brings current headlines alongside the evergreen knowledge experience."
      />

      <section className="aboutMission sectionWrap">
        <div>
          <span className="heroTag">THE MISSION</span>
          <h2>One world. Endless knowledge.</h2>
        </div>
        <p>
          The project brings together evergreen knowledge and clearly attributed live
          information so visitors can move from a quick answer to deeper context without
          getting lost in a maze of tabs and links.
        </p>
      </section>
    </PageChrome>
  );
}

import PageChrome from "../components/PageChrome";

export const metadata = {
  title: "About GlobalPedia | GlobalPedia",
  description: "Learn what GlobalPedia is, how it is structured, and the vision behind the platform.",
};

export default function AboutPage() {
  return (
    <PageChrome>
      <section className="aboutPageHero">
        <span className="heroTag">GLOBALPEDIA · THE PLATFORM</span>
        <h1>One world. <em>One place to explore it.</em></h1>
        <p>
          GlobalPedia is a visual knowledge platform built to bring the world's
          subjects into one clear, searchable experience. Instead of making visitors
          jump between disconnected pages, GlobalPedia connects articles, countries,
          categories, live signals, sports and gaming into one expanding knowledge system.
        </p>
      </section>

      <section className="aboutFeatureGrid sectionWrap">
        <article>
          <span>01</span>
          <h2>World Knowledge</h2>
          <p>
            Explore countries, geography, history, science, technology, culture,
            nature, health and arts through structured pages designed for discovery.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Live Information</h2>
          <p>
            Dedicated live-news feeds connect current headlines with the relevant
            GlobalPedia section, while the original source remains one click away.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Built to Expand</h2>
          <p>
            The platform is designed as a growing system rather than a fixed collection
            of articles, making room for more countries, topics, profiles and deeper research.
          </p>
        </article>
      </section>

      <section className="aboutMission sectionWrap">
        <div>
          <span className="heroTag">WHAT YOU CAN EXPLORE</span>
          <h2>From a country profile to the latest global signal.</h2>
        </div>
        <p>
          GlobalPedia separates its major experiences into dedicated pages so each
          area can have its own interface and data. Explore lets you search the knowledge
          index. Categories organize subjects. Countries provide world profiles and
          regional context. Sports and Games have their own live information layers.
          Random is built for discovery, while the home page acts as the visual gateway
          to the whole platform.
        </p>
      </section>

      <section className="aboutFeatureGrid sectionWrap aboutPrinciples">
        <article>
          <span>04</span>
          <h2>Source Linked</h2>
          <p>
            Live stories are presented as concise feed-based briefs with attribution
            and a direct link to the original publisher rather than reproducing entire articles.
          </p>
        </article>
        <article>
          <span>05</span>
          <h2>Visual Interface</h2>
          <p>
            Maps, imagery, animated surfaces, country cards and dedicated page layouts
            make the information easier to navigate than a plain wall of text.
          </p>
        </article>
        <article>
          <span>06</span>
          <h2>Global by Design</h2>
          <p>
            GlobalPedia is being developed around a world-scale structure, with country
            data, regions, local time information and expandable topic coverage at its core.
          </p>
        </article>
      </section>

      <section className="aboutMission sectionWrap">
        <div>
          <span className="heroTag">THE VISION</span>
          <h2>Knowledge should feel worth exploring.</h2>
        </div>
        <p>
          The long-term idea is simple: make GlobalPedia a place where a visitor can
          arrive with a single question and keep exploring naturally, moving from a
          quick overview to deeper articles, world profiles and current information
          without losing the thread.
        </p>
      </section>
    </PageChrome>
  );
}

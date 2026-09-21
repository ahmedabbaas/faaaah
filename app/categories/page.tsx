import Link from "next/link";
import PageChrome from "../components/PageChrome";
import { categories, entries } from "../data/entries";

const descriptions: Record<string, string> = {
  Countries: "Profiles, places, people and geographic context from around the world.",
  History: "Events, civilizations, places and stories that shaped the world.",
  Science: "Ideas and discoveries across physics, biology, astronomy and more.",
  Technology: "Computing, AI, engineering and the systems shaping tomorrow.",
  Culture: "Languages, traditions, food, art and the ways people share ideas.",
  Nature: "Landscapes, ecosystems, wildlife and the planet we all share.",
  Health: "Accessible background knowledge about health, biology and wellbeing.",
  Arts: "Creative expression across visual art, performance and imagination.",
};

export default function CategoriesPage() {
  const categoryList = categories.filter((item) => item !== "All");

  return (
    <PageChrome>
      <section className="pageHero compactHero">
        <span className="heroTag">GLOBALPEDIA · CATEGORIES</span>
        <h1>Explore the world by <em>subject.</em></h1>
        <p>
          Every subject gets its own lane, because putting physics, poetry and
          geopolitics into one dropdown would be a small crime against interface design.
        </p>
      </section>

      <section className="categoryDirectory sectionWrap">
        <div className="categoryIndexGrid">
          {categoryList.map((category, index) => {
            const count = entries.filter((entry) => entry.category === category).length;
            return (
              <Link
                href={`/explore?category=${encodeURIComponent(category)}`}
                className="categoryIndexCard"
                key={category}
              >
                <span className={`categoryIndexNumber tone-${index % 2 ? "blue" : "violet"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2>{category}</h2>
                  <p>{descriptions[category]}</p>
                  <small>{count || "0"} indexed articles · Explore ↗</small>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="categorySpotlight sectionWrap">
        <div>
          <span className="heroTag">EDITORIAL INDEX</span>
          <h2>Built to expand without turning into a junk drawer.</h2>
        </div>
        <p>
          Categories act as navigation, not walls. Articles can connect across
          subjects, regions and themes as the knowledge graph grows.
        </p>
      </section>
    </PageChrome>
  );
}

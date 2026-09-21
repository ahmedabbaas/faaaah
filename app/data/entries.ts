export type Entry = {
  slug: string;
  category: string;
  number: string;
  title: string;
  description: string;
  meta: string;
  accent: string;
  featured?: boolean;
  body: string[];
};

export const categories = ["All", "Science", "History", "Technology", "Geography", "Culture", "Space"];

export const entries: Entry[] = [
  {
    slug: "the-universe-is-still-getting-larger",
    category: "Space",
    number: "01",
    title: "The universe is still getting larger",
    description: "A visual introduction to cosmic expansion, dark energy, and the strange geometry of space-time.",
    meta: "12 min read · Updated Sep 2026",
    accent: "violet",
    featured: true,
    body: [
      "The universe is not simply expanding into an empty room. Space itself changes scale, carrying galaxies farther apart as the cosmos evolves.",
      "Measurements of distant galaxies and the cosmic background radiation show that expansion has a long history. More recent observations also point to a component called dark energy, whose deeper nature remains an open question.",
      "Thinking about cosmic expansion is useful because it connects observations we can make today with the structure and history of the universe on its largest scales.",
    ],
  },
  {
    slug: "inside-the-architecture-of-modern-ai",
    category: "Technology",
    number: "02",
    title: "Inside the architecture of modern AI",
    description: "How transformers, data, training and inference turned research ideas into everyday tools.",
    meta: "9 min read · Technology",
    accent: "green",
    body: [
      "Modern language and multimodal systems rely on architectures designed to process relationships between pieces of information rather than reading data as a simple linear stream.",
      "Training turns large collections of examples into statistical capabilities. Inference then applies those learned patterns to a new request, with system design, hardware and product constraints shaping the experience users actually see.",
      "The result is a stack that spans mathematics, data engineering, model architecture, software infrastructure and interface design.",
    ],
  },
  {
    slug: "why-cities-became-civilizations-engines",
    category: "History",
    number: "03",
    title: "Why cities became civilization's engines",
    description: "Trade routes, rivers, migration and institutions helped cities become the organizing systems of human life.",
    meta: "11 min read · History",
    accent: "amber",
    body: [
      "Cities concentrate people, resources and institutions. That concentration makes exchange easier and creates conditions for specialized work, administration and cultural production.",
      "Geography mattered enormously. Rivers, coastlines, crossroads and fertile regions repeatedly became settings for urban growth, while political power and trade networks helped successful cities extend their influence.",
      "Urban history is therefore not just the story of buildings. It is a story about how humans organize knowledge, movement, work and power in shared spaces.",
    ],
  },
  {
    slug: "what-makes-a-living-system-alive",
    category: "Science",
    number: "04",
    title: "What makes a living system alive?",
    description: "A tour from cells and metabolism to adaptation, information and the edge of biology.",
    meta: "8 min read · Science",
    accent: "cyan",
    body: [
      "Living systems maintain themselves through networks of processes that capture energy, regulate internal conditions and respond to their environments.",
      "Cells provide a useful example. Their membranes, chemical pathways and information systems work together to preserve organization while exchanging matter and energy with the surroundings.",
      "Biology becomes especially interesting at the boundaries, where simple components cooperate to produce behavior that is more than any one component can do alone.",
    ],
  },
  {
    slug: "the-invisible-map-beneath-every-country",
    category: "Geography",
    number: "05",
    title: "The invisible map beneath every country",
    description: "Climate, terrain, oceans and resources shape the world long before borders are drawn.",
    meta: "7 min read · Geography",
    accent: "blue",
    body: [
      "Political borders are visible on maps, but physical geography often explains why settlements and economies develop where they do.",
      "Mountains, coastlines, climate zones, rivers and access to resources influence transport, agriculture, hazards and patterns of human settlement.",
      "Understanding those layers turns a map from a collection of boundaries into a model of the systems interacting beneath them.",
    ],
  },
  {
    slug: "how-ideas-travel-between-cultures",
    category: "Culture",
    number: "06",
    title: "How ideas travel between cultures",
    description: "Languages, food, art and stories constantly cross borders, mutate and become something new.",
    meta: "10 min read · Culture",
    accent: "rose",
    body: [
      "Cultures are not sealed containers. People travel, trade, migrate, study and communicate, carrying ideas with them and adapting them to new settings.",
      "Food, language, music and storytelling show this process especially clearly. Borrowed forms rarely remain unchanged; they acquire local meanings and new combinations.",
      "Cultural exchange is therefore both a historical process and a creative one, producing identities that can be layered rather than singular.",
    ],
  },
];

export function getEntry(slug: string) {
  return entries.find((entry) => entry.slug === slug);
}

export type Entry = {
  slug: string;
  category: string;
  number: string;
  title: string;
  description: string;
  meta: string;
  accent: string;
  image: string;
  featured?: boolean;
  body: string[];
};

export const categories = ["All", "Countries", "History", "Science", "Technology", "Culture", "Nature", "Health", "Arts", "Sports"];

export const entries: Entry[] = [
  {
    slug: "the-northern-areas-of-pakistan",
    category: "Nature",
    number: "01",
    title: "The Northern Areas of Pakistan",
    description: "Explore the landscapes, people and natural beauty of Pakistan's northern regions.",
    meta: "Sep 10, 2026 · 5 min read",
    accent: "green",
    image: "https://images.unsplash.com/photo-1774509424007-4734d656ff81?auto=format&fit=crop&fm=jpg&q=86&w=1400",
    featured: true,
    body: [
      "Pakistan's northern regions are home to dramatic mountain ranges, high valleys and some of South Asia's most recognizable alpine landscapes.",
      "From snow-fed lakes to high-altitude settlements, geography strongly shapes the rhythm of life. Travel routes, weather, agriculture and tourism are all influenced by steep terrain and seasonal change.",
      "The result is a region where natural beauty and human adaptation sit unusually close together, creating landscapes that feel both immense and deeply lived-in.",
    ],
  },
  {
    slug: "the-mysteries-of-the-universe",
    category: "Science",
    number: "02",
    title: "The Mysteries of the Universe",
    description: "From black holes to distant galaxies, explore the most fascinating secrets of our cosmos.",
    meta: "Sep 8, 2026 · 7 min read",
    accent: "violet",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=86&w=1400",
    body: [
      "Modern astronomy gives us a remarkable view of a universe filled with stars, galaxies, compact objects and structures spanning billions of light-years.",
      "Black holes, dark matter and dark energy remain among the most interesting open questions because they force researchers to connect observation with theories about gravity and the evolution of the cosmos.",
      "Every new telescope effectively adds another layer to the map, showing that the universe is both more structured and more surprising than the night sky suggests at first glance.",
    ],
  },
  {
    slug: "the-rich-history-of-lahore",
    category: "History",
    number: "03",
    title: "The Rich History of Lahore",
    description: "A journey through the cultural and historical landmarks that shaped Lahore's legacy.",
    meta: "Sep 6, 2026 · 6 min read",
    accent: "orange",
    image: "https://images.unsplash.com/photo-1653675054031-89a567f78ea3?auto=format&fit=crop&q=86&w=1400",
    body: [
      "Lahore has been shaped by centuries of political change, scholarship, architecture, trade and cultural exchange.",
      "Its historic core preserves layers from different eras, with Mughal monuments, colonial-era buildings, markets and neighborhoods forming a dense urban archive.",
      "Studying Lahore is therefore also a way of seeing how a city carries its past while continually changing in response to new generations.",
    ],
  },
  {
    slug: "inside-the-architecture-of-modern-ai",
    category: "Technology",
    number: "04",
    title: "Inside the Architecture of Modern AI",
    description: "How transformers, data, training and inference turned research ideas into everyday tools.",
    meta: "Sep 4, 2026 · 9 min read",
    accent: "blue",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=86&w=1400",
    body: [
      "Modern AI systems combine model architecture, large-scale data processing, specialized hardware and product infrastructure.",
      "Transformer-based systems are particularly important because they can model relationships among many pieces of information in parallel, which makes them useful for language and increasingly for multimodal tasks.",
      "The visible assistant is only the surface. Underneath it is a stack of data, training, inference, evaluation and software systems working together.",
    ],
  },
  {
    slug: "what-makes-a-living-system-alive",
    category: "Science",
    number: "05",
    title: "What Makes a Living System Alive?",
    description: "A tour from cells and metabolism to adaptation, information and the edge of biology.",
    meta: "Sep 2, 2026 · 8 min read",
    accent: "teal",
    image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=86&w=1400",
    body: [
      "Living systems maintain organization by regulating energy, matter and information. Cells are a particularly clear example of this coordination.",
      "Their membranes, chemical pathways and genetic machinery work together to maintain conditions that permit growth and reproduction.",
      "Biology becomes especially interesting at the boundary where collections of simple components produce complex, coordinated behavior.",
    ],
  },
  {
    slug: "how-ideas-travel-between-cultures",
    category: "Culture",
    number: "06",
    title: "How Ideas Travel Between Cultures",
    description: "Languages, food, art and stories cross borders, mutate and become something new.",
    meta: "Aug 31, 2026 · 10 min read",
    accent: "rose",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=86&w=1400",
    body: [
      "Cultures are not sealed containers. People travel, trade, migrate and communicate, carrying ideas with them and adapting them to new settings.",
      "Food, music, language and storytelling show the process clearly because borrowed forms often acquire new local meanings.",
      "Cultural exchange is therefore both historical and creative, producing identities that can be layered rather than singular.",
    ],
  },
];

export const regions = [
  { name: "Asia", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=84&w=900" },
  { name: "Europe", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=84&w=900" },
  { name: "Africa", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=84&w=900" },
  { name: "North America", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&q=84&w=900" },
  { name: "South America", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=84&w=900" },
  { name: "Oceania", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=84&w=900" },
];

export function getEntry(slug: string) {
  return entries.find((entry) => entry.slug === slug);
}

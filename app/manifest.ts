import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GlobalPedia",
    short_name: "GlobalPedia",
    description: "A visual knowledge index for countries, history, science, technology, culture and live world signals.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8fb",
    theme_color: "#ffffff",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobalPedia | Knowledge Without Boundaries",
  description:
    "Explore science, history, technology, geography, culture, and space through GlobalPedia.",
  applicationName: "GlobalPedia",
  keywords: ["GlobalPedia", "encyclopedia", "knowledge", "science", "history", "technology"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

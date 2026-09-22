import PageChrome from "../components/PageChrome";
import EarthExplorer from "../components/EarthExplorer";

export const metadata = {
  title: "3D Earth Explorer | GlobalPedia",
  description: "Rotate the planet, focus a country and zoom toward city-level labels with GlobalPedia's interactive 3D Earth.",
};

export default function EarthPage() {
  return (
    <PageChrome>
      <EarthExplorer />
    </PageChrome>
  );
}

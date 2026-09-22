"use client";

type Props = {
  onEnter: () => void;
};

export default function WelcomeScreen({ onEnter }: Props) {
  return (
    <main className="welcomeScreen">
      <div className="welcomeGlow" aria-hidden="true" />
      <div className="welcomeInner">
        <div className="welcomeMark">◎</div>
        <p className="welcomeEyebrow">A WORLD OF KNOWLEDGE</p>
        <h1>Global<span>Pedia</span></h1>
        <p className="welcomeLead">
          Explore countries, history, science, culture, technology and the latest signals from around the world.
        </p>
        <button className="iphoneButton welcomeButton" onClick={onEnter}>
          Enter GlobalPedia
          <span>→</span>
        </button>
        <p className="welcomeNote">Search. Explore. Learn.</p>
      </div>
    </main>
  );
}

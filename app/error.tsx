"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="statePage">
      <div className="eyebrow"><span /> GLOBALPEDIA</div>
      <h1>The page hit a wall.</h1>
      <p>Something failed while rendering this view. The rest of the encyclopedia does not need to come down with it.</p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}

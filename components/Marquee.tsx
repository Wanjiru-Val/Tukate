// The running strip, like the text along the side of a nganya.
export function Marquee({ words }: { words: string[] }) {
  const run = (
    <span className="flex shrink-0 items-center">
      {words.map((word, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5">{word}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="var(--color-pilipili)" />
          </svg>
        </span>
      ))}
    </span>
  );
  return (
    <div className="relative z-10 -my-5 -rotate-[1.5deg] scale-x-105 overflow-hidden border-y-2 border-usiku bg-mango py-2.5 text-usiku" aria-hidden="true">
      <div className="marquee-track sign text-3xl sm:text-4xl">
        {run}
        {run}
        {run}
        {run}
      </div>
    </div>
  );
}

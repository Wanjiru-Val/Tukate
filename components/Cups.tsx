import { Cup } from "./Drinks";

// Two red cups meeting. Plays once when scrolled into view.
export function Cups({ className = "" }: { className?: string }) {
  return (
    <div data-inview className={`cups relative flex items-end justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 70" className="sparks absolute -top-[28%] left-1/2 w-[46%] -translate-x-1/2">
        <g stroke="var(--color-mango)" strokeWidth="7" strokeLinecap="round">
          <path d="M60 60V26" />
          <path d="M36 62 18 34" />
          <path d="M84 62l18-28" />
        </g>
        <circle cx="60" cy="8" r="6" fill="var(--color-pink)" />
        <circle cx="8" cy="22" r="5" fill="var(--color-sukuma)" />
        <circle cx="112" cy="22" r="5" fill="var(--color-sukuma)" />
      </svg>
      <Cup className="cup-l -mr-[6%] w-[46%]" />
      <Cup className="cup-r -ml-[6%] w-[46%]" />
    </div>
  );
}

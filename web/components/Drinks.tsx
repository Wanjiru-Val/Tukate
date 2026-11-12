// Sticker-style drink drawings for the profile cards.
const ink = "#121018";
const common = { stroke: ink, strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function Drink({ kind, className }: { kind: "cider" | "beer" | "dawa" | "whisky"; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className} aria-hidden="true">
      {kind === "cider" && (
        <g {...common}>
          <path d="M50 12h20v30c0 8 14 14 14 30v66a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V72c0-16 14-22 14-30V12Z" fill="#ffc21a" />
          <rect x="47" y="6" width="26" height="12" rx="3" fill="#ff4141" />
          <rect x="36" y="82" width="48" height="36" fill="#fff8ee" />
          <circle cx="60" cy="100" r="9" fill="#00d26a" />
        </g>
      )}
      {kind === "beer" && (
        <g {...common}>
          <path d="M84 62h14a12 12 0 0 1 12 12v28a12 12 0 0 1-12 12H84" fill="none" />
          <path d="M24 44h60v96a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8V44Z" fill="#ffc21a" />
          <path d="M20 44c-6-14 8-24 18-18 4-14 26-14 30 0 12-6 26 6 18 18Z" fill="#fff8ee" />
          <path d="M42 70v56M66 70v56" stroke="#fff8ee" />
        </g>
      )}
      {kind === "dawa" && (
        <g {...common}>
          <path d="M84 18 62 96" stroke="#c92424" strokeWidth="6" />
          <path d="M26 58h68l-8 82a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8L26 58Z" fill="#fff8ee" />
          <path d="M30 92h60l-4.5 48a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8L30 92Z" fill="#00d26a" />
          <path d="M22 58a22 22 0 0 1 44 0Z" fill="#ffc21a" />
          <path d="M44 58V38" />
        </g>
      )}
      {kind === "whisky" && (
        <g {...common}>
          <path d="M22 46h76l-6 94a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8L22 46Z" fill="#fff8ee" />
          <path d="M25.5 98h69l-2.5 42a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8L25.5 98Z" fill="#ff8a4c" />
          <path d="M36 60v22" stroke="#121018" strokeOpacity="0.25" />
        </g>
      )}
    </svg>
  );
}

// The red party cup from the logo direction.
export function Cup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden="true">
      <g stroke={ink} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M18 22h84l-12 114a8 8 0 0 1-8 7H38a8 8 0 0 1-8-7L18 22Z" fill="#ff3b3b" />
        <rect x="12" y="10" width="96" height="18" rx="9" fill="#ffffff" />
        <path d="M24 58h72M27 84h66M30 110h60" stroke="#c92424" />
      </g>
    </svg>
  );
}

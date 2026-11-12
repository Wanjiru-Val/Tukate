// Placeholder mark: party cup concept 1 (red cup inside a green pin).
// Swap this file when the final logo is chosen.
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Tukate logo">
      <path
        d="M24 2C13.5 2 6 9.8 6 19.6 6 31.5 24 46 24 46s18-14.5 18-26.4C42 9.8 34.5 2 24 2Z"
        fill="#00d26a"
      />
      <path d="M15.5 13h17l-2.6 17.5a2 2 0 0 1-2 1.7h-7.8a2 2 0 0 1-2-1.7L15.5 13Z" fill="#ff3b3b" />
      <rect x="14.5" y="10.5" width="19" height="4" rx="2" fill="#ffffff" />
      <path d="M16.9 19.5h14.2M17.6 24h12.8" stroke="#c92424" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span className="sign" style={{ fontSize: size * 0.95, textTransform: "lowercase", lineHeight: 1 }}>
        tukate
      </span>
    </span>
  );
}

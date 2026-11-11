// Placeholder mark: party cup concept 1 (red cup inside a green pin).
// Swap this file when the final logo is chosen.
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Tukate logo"
    >
      <path
        d="M24 2C13.5 2 6 9.8 6 19.6 6 31.5 24 46 24 46s18-14.500 18-26.400C42 9.800 34.500 2 24 2Z"
        fill="#00d26a"
      />
      <path d="M15.500 13h17l-2.600 17.500a2 2 0 0 1-2 1.700h-7.800a2 2 0 0 1-2-1.700L15.500 13Z" fill="#ff3b3b" />
      <rect x="14.500" y="10.500" width="19" height="4" rx="2" fill="#ffffff" />
      <path d="M16.900 19.500h14.200M17.600 24h12.800" stroke="#c92424" strokeWidth="1.600" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span
        className="font-display font-extrabold tracking-tight text-cream"
        style={{ fontSize: size * 0.78, lineHeight: 1 }}
      >
        tukate
      </span>
    </span>
  );
}

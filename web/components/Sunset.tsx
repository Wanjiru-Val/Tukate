// The sun going down behind a simplified Nairobi skyline.
// --p (0 to 1) is set on the section by Motion.tsx as it scrolls past.

const buildings: [number, number, number, number][] = [
  [0, 205, 92, 60],
  [84, 172, 58, 92],
  [150, 192, 72, 70],
  [286, 150, 70, 112],
  [560, 162, 60, 100],
  [616, 122, 50, 140],
  [950, 182, 80, 80],
  [1022, 150, 60, 112],
  [1090, 194, 112, 70],
];

function windows() {
  // deterministic scatter so server and client agree
  const out: { x: number; y: number }[] = [];
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const towers: [number, number, number, number][] = [
    ...buildings,
    [232, 62, 44, 198],
    [392, 78, 40, 182],
    [692, 54, 46, 206],
    [800, 76, 30, 184],
    [882, 44, 52, 216],
  ];
  for (const [bx, by, bw, bh] of towers) {
    for (let y = by + 10; y < by + bh - 8; y += 14) {
      for (let x = bx + 7; x < bx + bw - 7; x += 11) {
        if (rand() > 0.62) out.push({ x, y });
      }
    }
  }
  return out;
}
const lit = windows();

export function Sunset({ children }: { children: React.ReactNode }) {
  return (
    <section
      data-progress
      data-time="6:34 PM"
      className="sunset relative flex min-h-[34rem] flex-col overflow-hidden pt-20 text-usiku sm:min-h-[42rem]"
      style={{ height: "92vh", maxHeight: "60rem" }}
    >
      <div
        className="sunset-sun pointer-events-none absolute left-[68%] top-[6%] h-40 w-40 rounded-full sm:h-56 sm:w-56"
        style={{ background: "radial-gradient(circle at 50% 40%, #fff3c4 0%, #ffc21a 45%, #ff4141 100%)" }}
        aria-hidden="true"
      />
      <div className="sunset-dark pointer-events-none absolute inset-0 bg-gradient-to-b from-dusk/0 via-dusk/60 to-usiku" aria-hidden="true" />
      <div className="wrap relative z-10">{children}</div>
      <svg
        viewBox="0 0 1200 262"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[46%] w-full sm:h-[52%]"
        aria-hidden="true"
      >
        <g fill="#121018">
          {buildings.map(([x, y, w, h]) => (
            <rect key={x} x={x} y={y} width={w} height={h} />
          ))}
          {/* Times Tower */}
          <rect x="232" y="62" width="44" height="200" />
          <rect x="239" y="46" width="30" height="18" />
          <rect x="252" y="20" width="4" height="28" />
          {/* KICC and its amphitheatre */}
          <rect x="392" y="78" width="40" height="184" />
          <path d="M374 66h76l-12 14h-52z" />
          <rect x="402" y="52" width="20" height="16" />
          <path d="M402 52l10-20 10 20z" />
          <path d="M438 262l34-58h46l34 58z" />
          {/* slanted-roof tower */}
          <path d="M692 262V54l46-22v230z" />
          {/* spired tower */}
          <path d="M792 262l8-186h30l8 186z" />
          <path d="M806 76l9-64 9 64z" />
          {/* tall slab */}
          <rect x="882" y="44" width="52" height="218" />
          <rect x="892" y="32" width="32" height="14" />
          <rect x="0" y="258" width="1200" height="4" />
        </g>
        <g fill="#ffc21a" className="sunset-window">
          {lit.map((w, i) => (
            <rect key={i} x={w.x} y={w.y} width="4" height="6" />
          ))}
        </g>
      </svg>
    </section>
  );
}

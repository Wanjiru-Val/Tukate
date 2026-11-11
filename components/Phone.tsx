// Illustrative app screens used across the site. Names and details are examples.
function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="w-full max-w-[300px] rounded-[2.5rem] border-[6px] border-plum-line bg-usiku p-4 shadow-2xl shadow-black/50"
    >
      <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-plum-line" />
      {children}
    </div>
  );
}

function Avatar({ letter, color }: { letter: string; color: string }) {
  return (
    <span
      className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-usiku font-display text-3xl font-extrabold text-usiku"
      style={{ background: color }}
    >
      {letter}
    </span>
  );
}

export function MatchPhone() {
  return (
    <Frame label="Example match screen: Form imeshika, you and Wanjiku matched">
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-plum px-4 py-7 text-center">
        <div className="flex -space-x-4">
          <Avatar letter="V" color="var(--color-mango)" />
          <Avatar letter="W" color="var(--color-pink)" />
        </div>
        <p className="font-display text-3xl font-extrabold leading-none text-sukuma">
          Form imeshika!
        </p>
        <p className="text-sm text-cream">Wewe na Wanjiku mko ndani.</p>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="rounded-full bg-usiku px-3 py-1.5">300m away</span>
          <span className="rounded-full bg-usiku px-3 py-1.5">Base: Kilimani</span>
          <span className="rounded-full bg-usiku px-3 py-1.5">Kinywaji: Pineapple cider</span>
        </div>
        <span className="w-full rounded-full bg-sukuma py-2.5 text-sm font-bold text-usiku">
          Send message
        </span>
        <span className="w-full rounded-full border-2 border-cream/60 py-2 text-sm font-bold">
          Keep swiping
        </span>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">
        Kutana mahali pa umma · Share your live location
      </p>
    </Frame>
  );
}

export function SwipePhone() {
  return (
    <Frame label="Example profile card with Pass and Super Like buttons">
      <div className="flex flex-col gap-3">
        <div className="relative flex h-64 items-end rounded-3xl bg-gradient-to-br from-pink via-pilipili to-mango p-4">
          <span className="absolute right-3 top-3 rounded-full bg-usiku/80 px-3 py-1 text-xs font-semibold">
            300m away
          </span>
          <div>
            <p className="font-display text-2xl font-extrabold leading-tight text-usiku">
              Wanjiku, 26
            </p>
            <p className="text-sm font-medium text-usiku/80">Base: Kilimani</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-plum px-3 py-1.5">Kinywaji: Pineapple cider</span>
          <span className="rounded-full bg-plum px-3 py-1.5">Rooftops</span>
          <span className="rounded-full bg-plum px-3 py-1.5">Amapiano</span>
        </div>
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="rounded-full border-2 border-cream/60 px-4 py-2 text-sm font-bold">
            Pass
          </span>
          <span className="whitespace-nowrap rounded-full bg-pilipili px-3 py-2 text-sm font-bold text-usiku">
            Super Like
          </span>
          <span className="rounded-full bg-sukuma px-4 py-2 text-sm font-bold text-usiku">
            Cheers
          </span>
        </div>
      </div>
    </Frame>
  );
}

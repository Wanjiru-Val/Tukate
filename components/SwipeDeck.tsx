"use client";

import { useRef, useState } from "react";
import { people, type Person } from "@/lib/content";
import { Drink } from "./Drinks";
import { site } from "@/lib/site";

const THRESHOLD = 100;
const FREE = site.plan.freeSwipesPerDay;
const filters = ["Same Kinywaji", "Same drinking type", "Same party style"];

function Lock() {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" aria-hidden="true">
      <rect x="1" y="5.5" width="10" height="7" rx="1.5" fill="currentColor" />
      <path d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Card({ person }: { person: Person }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-usiku bg-cream text-usiku">
      <div className={`relative flex h-[46%] items-end justify-center border-b-2 border-usiku ${person.pattern}`}>
        <span
          className="absolute left-3 top-3 rounded-md border-2 border-usiku bg-cream px-2 py-0.5 text-xs font-bold"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          {person.distance}
        </span>
        <Drink kind={person.drinkArt} className="h-[92%] translate-y-3 -rotate-6 drop-shadow-[4px_4px_0_rgb(18_16_24)]" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="head text-3xl">
          {person.name}, {person.age}
        </p>
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold" style={{ fontFamily: "var(--font-ui)" }}>
          <span>Base: {person.base}</span>
          <span className="text-cup-ridge">Kinywaji: {person.drink}</span>
        </p>
        <p className="text-[0.95rem] leading-snug text-usiku/80">{person.bio}</p>
      </div>
    </div>
  );
}

export function SwipeDeck() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [leaving, setLeaving] = useState<null | "left" | "right">(null);
  const [match, setMatch] = useState<Person | null>(null);
  const [swipes, setSwipes] = useState(0);
  const hasMatched = useRef(false);
  const origin = useRef({ x: 0, y: 0 });

  const person = people[index % people.length];
  const behind = people[(index + 1) % people.length];

  const left = Math.max(0, FREE - swipes);
  const outOfSwipes = left === 0 && !match;

  function decide(direction: "left" | "right") {
    if (leaving || match || left === 0) return;
    setLeaving(direction);
    window.setTimeout(() => {
      setLeaving(null);
      setDrag({ x: 0, y: 0, active: false });
      setIndex((v) => v + 1);
      setSwipes((v) => v + 1);
      if (direction === "right" && !hasMatched.current) {
        hasMatched.current = true;
        setMatch(person);
      }
    }, 260);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (leaving || match || left === 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, active: true });
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.active) return;
    setDrag({ x: e.clientX - origin.current.x, y: e.clientY - origin.current.y, active: true });
  }
  function onPointerUp() {
    if (!drag.active) return;
    if (drag.x > THRESHOLD) decide("right");
    else if (drag.x < -THRESHOLD) decide("left");
    else setDrag({ x: 0, y: 0, active: false });
  }

  const x = leaving === "right" ? 520 : leaving === "left" ? -520 : drag.x;
  const rotate = leaving === "right" ? 22 : leaving === "left" ? -22 : drag.x / 16;
  const yes = Math.min(1, Math.max(0, drag.x / 80));
  const no = Math.min(1, Math.max(0, -drag.x / 80));

  return (
    <div className="flex w-full max-w-[21rem] flex-col gap-5">
      <div className="flex flex-col gap-2" style={{ fontFamily: "var(--font-ui)" }}>
        <ul className="flex flex-wrap gap-2" aria-label={`Filters, part of ${site.plan.name}`}>
          {filters.map((f) => (
            <li
              key={f}
              className="flex items-center gap-1.5 rounded-md border-2 border-dashed border-usiku/50 px-2 py-1 text-xs font-semibold text-usiku/70"
            >
              <Lock />
              {f}
            </li>
          ))}
        </ul>
        <p className="flex items-baseline justify-between gap-3 text-xs font-semibold text-usiku/75">
          <span>Filters come with {site.plan.name}</span>
          <span aria-live="polite" className="whitespace-nowrap">
            {left} of {FREE} free swipes left today
          </span>
        </p>
      </div>
      <div className="relative aspect-[3/4.1] w-full select-none">
        {/* card behind */}
        <div
          key={`b-${index + 1}`}
          className="absolute inset-0 origin-bottom"
          style={{ transform: "scale(0.94) translateY(14px) rotate(-2deg)" }}
          aria-hidden="true"
        >
          <Card person={behind} />
        </div>
        {/* top card */}
        <div
          key={`t-${index}`}
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          style={{
            transform: `translate3d(${x}px, ${leaving ? 40 : drag.y * 0.25}px, 0) rotate(${rotate}deg)`,
            transition: drag.active ? "none" : "transform 0.26s cubic-bezier(0.2, 0.7, 0.3, 1)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <Card person={person} />
          <span
            className="sign pointer-events-none absolute left-4 top-16 -rotate-12 rounded-md border-4 border-sukuma bg-cream px-2 pt-1 text-4xl text-sukuma"
            style={{ opacity: yes }}
          >
            Cheers
          </span>
          <span
            className="sign pointer-events-none absolute right-4 top-16 rotate-12 rounded-md border-4 border-pilipili bg-cream px-2 pt-1 text-4xl text-pilipili"
            style={{ opacity: no }}
          >
            Pass
          </span>
        </div>

        {match && (
          <div
            role="status"
            className="absolute inset-0 flex flex-col items-start justify-center gap-4 rounded-2xl border-2 border-usiku bg-sukuma p-6 text-usiku shadow-[8px_8px_0_var(--color-usiku)]"
          >
            <p className="sign text-6xl">
              Form
              <br />
              imeshika!
            </p>
            <p className="text-lg font-semibold">Wewe na {match.name} mko ndani.</p>
            <p className="text-[0.95rem]">
              In the real app this is where the chat opens. Here it is only a demo, so {match.name} is
              sadly fictional.
            </p>
            <div className="flex flex-col gap-3 pt-1">
              <a href="#usiku" className="press press-cream" onClick={() => setMatch(null)}>
                See what happens next
              </a>
              <button type="button" className="link-tk self-start" onClick={() => setMatch(null)}>
                Keep swiping
              </button>
            </div>
          </div>
        )}
        {outOfSwipes && (
          <div
            role="status"
            className="absolute inset-0 flex flex-col items-start justify-center gap-4 rounded-2xl border-2 border-usiku bg-mango p-6 text-usiku shadow-[8px_8px_0_var(--color-usiku)]"
          >
            <p className="hand text-3xl">that was swipe number {FREE}</p>
            <p className="sign text-6xl">
              Kesho
              <br />
              tena.
            </p>
            <p className="text-[0.95rem]">
              Free gives you {FREE} swipes a day. {site.plan.name} is {site.plan.currency}{" "}
              {site.plan.price} a month: swipe as much as you like, and choose to see only people
              with your drink, your drinking type and your party style.
            </p>
            <div className="flex flex-col gap-3 pt-1">
              <a href="#bei" className="press press-cream">
                See free and {site.plan.name}
              </a>
              <button type="button" className="link-tk self-start" onClick={() => setSwipes(0)}>
                Start the demo again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button type="button" disabled={left === 0} className="press press-cream flex-1 disabled:opacity-50" onClick={() => decide("left")}>
          Pass
        </button>
        <button type="button" disabled={left === 0} className="press press-red !px-3 disabled:opacity-50" onClick={() => decide("right")}>
          Super Like
        </button>
        <button type="button" disabled={left === 0} className="press press-green flex-1 disabled:opacity-50" onClick={() => decide("right")}>
          Cheers
        </button>
      </div>
    </div>
  );
}

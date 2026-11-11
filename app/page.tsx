import Link from "next/link";
import { StoreButtons } from "@/components/StoreButtons";
import { GroupChat } from "@/components/GroupChat";
import { Marquee } from "@/components/Marquee";
import { SwipeDeck } from "@/components/SwipeDeck";
import { Sunset } from "@/components/Sunset";
import { Cups } from "@/components/Cups";
import { HouseRules } from "@/components/HouseRules";
import { Questions } from "@/components/Questions";
import { counterQuestions, night } from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* 5:47 PM. The plan falls through. */}
      <section data-time="5:47 PM" className="paper overflow-hidden pb-24 pt-10 sm:pt-14">
        <div className="wrap flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <p className="hand text-3xl text-pilipili sm:text-4xl">Friday, 5:47 pm. Nairobi.</p>
            <h1 className="sign text-[33vw] text-usiku sm:text-[19vw] lg:text-[min(18.5vw,16.5rem)]">
              Ingia <span className="text-pilipili shadow-sign-green">Tukate.</span>
            </h1>
          </div>
          <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div className="flex flex-col gap-7">
              <div className="prose-tk flex flex-col gap-4 sm:text-xl">
                <p>
                  Everyone in the group chat said &ldquo;tuko&rdquo; on Tuesday. It is now Friday,
                  a quarter to six, and one of them has a deadline, one is at a cousin&rsquo;s
                  ruracio in Kiambu, and one has been typing since half past five. You still want
                  that drink.
                </p>
                <p>
                  Tukate finds you somebody a few hundred metres away who got left hanging as well
                  and would also like a cold one, somewhere public, tonight. It is for making
                  friends. Nobody is going to ask what you are looking for.
                </p>
              </div>
              <StoreButtons />
              <a href="#swipe" className="link-tk self-start">
                Or scroll, and watch how the night goes
              </a>
            </div>
            <div className="flex justify-center lg:justify-end lg:pr-6">
              <GroupChat />
            </div>
          </div>
        </div>
      </section>

      <Marquee words={["Swipe", "Match", "Cheers", "Ingia Tukate"]} />

      {/* 6:20 PM. You open the app. */}
      <section id="swipe" data-time="6:20 PM" className="paper pb-10 pt-28">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6" data-reveal>
            <p className="hand text-3xl text-pilipili sm:text-4xl">6:20 pm</p>
            <h2 className="head text-5xl sm:text-6xl">Somebody nearby got bounced too.</h2>
            <div className="prose-tk flex flex-col gap-4">
              <p>
                Every card tells you the three things worth knowing before a first round: how far
                away they are, the area they call <strong>Base</strong>, and their{" "}
                <strong>Kinywaji</strong>, which is the drink they order without looking at the
                menu.
              </p>
              <p>
                Swipe right if you would happily share a table with them. Pass if you would not,
                and they will never know. If you are really sure, there is a{" "}
                <strong>Super Like</strong>, which is the app equivalent of waving across the bar.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="hand -rotate-2 self-center text-4xl text-pilipili">go on, drag the card</p>
            <SwipeDeck />
          </div>
        </div>
      </section>

      {/* The sun goes down. */}
      <Sunset>
        <h2 className="sign max-w-3xl text-6xl sm:text-8xl" data-reveal>
          By seven you have somewhere to be.
        </h2>
      </Sunset>

      {/* 6:41 PM onwards. The night itself. */}
      <section id="usiku" data-time="6:41 PM" className="night pb-28 pt-20">
        <div className="wrap grid gap-16 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            <Cups className="mx-auto mt-10 w-56 sm:w-72 lg:mx-0" />
            <h2 className="sign text-7xl text-sukuma sm:text-8xl">Form imeshika!</h2>
            <div className="prose-tk flex flex-col gap-4 text-cream/85">
              <p>
                That is what the screen says when you both swipe right. Roughly: the plan has
                landed. From here the app mostly gets out of your way, because the point was never
                to keep you on your phone.
              </p>
            </div>
          </div>
          <ol className="relative flex flex-col gap-12 pl-8 sm:pl-12">
            <span data-inview className="tl-line absolute bottom-2 left-[5px] top-2 w-[3px] bg-sukuma sm:left-[9px]" aria-hidden="true" />
            {night.map((moment, i) => (
              <li key={moment.time} className="relative flex flex-col gap-2" data-reveal data-time={i > 0 ? moment.time : undefined}>
                <span
                  className="absolute -left-8 top-3 h-3.5 w-3.5 rounded-full border-2 border-usiku bg-mango ring-2 ring-mango sm:-left-12 sm:ml-[3px]"
                  aria-hidden="true"
                />
                <span className="hand text-4xl text-mango">{moment.time}</span>
                <p className="max-w-xl text-xl leading-relaxed sm:text-2xl sm:leading-relaxed">{moment.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* House rules */}
      <section className="night pb-28">
        <div className="wrap flex flex-col gap-10">
          <div data-reveal>
            <HouseRules />
          </div>
          <p className="prose-tk text-cream/85" data-reveal>
            You are meeting a stranger and there may be alcohol involved, so we would rather be
            boring about this than sorry. The longer version, with a checklist for before, during
            and after, is in the{" "}
            <Link href="/safety" className="link-tk text-mango">
              safety guide
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Mbogi Mode */}
      <section className="night pb-28">
        <div className="wrap">
          <div
            className="relative rotate-1 overflow-hidden rounded-md border-2 border-usiku bg-mango px-6 py-12 text-usiku shadow-[10px_10px_0_var(--color-pink)] sm:px-14 sm:py-16"
            data-reveal
          >
            <svg viewBox="0 0 200 200" className="stamp-spin absolute -right-10 -top-10 h-44 w-44 sm:right-8 sm:top-8 sm:h-52 sm:w-52" aria-hidden="true">
              <defs>
                <path id="stamp-circle" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
              </defs>
              <circle cx="100" cy="100" r="97" fill="var(--color-usiku)" />
              <text fill="var(--color-mango)" fontSize="23" fontWeight="800" letterSpacing="3.5" style={{ fontFamily: "var(--font-display)" }}>
                <textPath href="#stamp-circle">COMING LATER · BADO KIDOGO · COMING LATER · </textPath>
              </text>
              <path d="M100 62l10 28 28 10-28 10-10 28-10-28-28-10 28-10z" fill="var(--color-pink)" />
            </svg>
            <div className="relative flex max-w-2xl flex-col gap-5">
              <p className="hand text-4xl">for when one friend is not enough</p>
              <h2 className="sign text-7xl sm:text-9xl">Mbogi Mode</h2>
              <p className="prose-tk font-medium">
                Sometimes it is not one drinking buddy you need, it is reinforcements. Mbogi Mode
                will let your whole crew match with another crew, so that two half-empty tables can
                become one very loud one. We are still building it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="night pb-28">
        <div className="wrap flex flex-col gap-12">
          <h2 className="head text-5xl sm:text-6xl" data-reveal>
            Things people ask us at the counter
          </h2>
          <Questions items={counterQuestions} />
          <Link href="/help" className="link-tk self-start text-mango">
            More questions, answered properly
          </Link>
        </div>
      </section>

      {/* Venues */}
      <section className="paper border-y-2 border-usiku py-16">
        <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-center" data-reveal>
          <div className="flex flex-col gap-3">
            <p className="hand text-3xl text-pilipili">if you own the counter</p>
            <h2 className="head max-w-2xl text-4xl sm:text-5xl">
              Matches need somewhere public to go. It may as well be your place.
            </h2>
          </div>
          <Link href="/venues" className="press press-mango shrink-0">
            List your venue
          </Link>
        </div>
      </section>

      {/* 11:58 PM. Close. */}
      <section data-time="11:58 PM" className="relative overflow-hidden bg-sukuma py-24 text-usiku">
        <div className="wrap flex flex-col items-start gap-8" data-reveal>
          <p className="hand text-4xl">next Friday, then?</p>
          <h2 className="sign text-[33vw] sm:text-[19vw] lg:text-[min(18.5vw,16.5rem)]">
            Ingia <span className="text-cream shadow-sign-ink">Tukate.</span>
          </h2>
          <StoreButtons />
        </div>
      </section>
    </>
  );
}

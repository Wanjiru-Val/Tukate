import Link from "next/link";
import { StoreButtons } from "@/components/StoreButtons";
import { MatchPhone, SwipePhone } from "@/components/Phone";
import { Faq } from "@/components/Faq";
import { homeFaq, safetyPoints, steps } from "@/lib/content";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* 02 Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sukuma/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-pink/15 blur-3xl"
        />
        <div className="container-x relative grid items-center gap-12 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div className="flex flex-col gap-6">
            <p className="eyebrow">{site.tagline}</p>
            <h1 className="text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Ingia <span className="text-sukuma">Tukate.</span>
            </h1>
            <p className="max-w-md text-lg text-muted">
              Find someone nearby who is up for a drink tonight. Friends, not dates.
            </p>
            <StoreButtons />
          </div>
          <div className="flex justify-center md:justify-end">
            <MatchPhone />
          </div>
        </div>
      </section>

      {/* 03 Areas strip */}
      <section aria-label="Launch areas" className="border-y border-plum-line/60 bg-plum/40">
        <div className="container-x flex flex-wrap items-center gap-3 py-5">
          <span className="text-sm font-semibold text-muted">Starting in Nairobi:</span>
          {site.areas.map((area) => (
            <span key={area} className="rounded-full bg-plum px-4 py-1.5 text-sm font-semibold">
              {area}
            </span>
          ))}
        </div>
      </section>

      {/* 04 How it works */}
      <section className="container-x flex flex-col gap-10 py-20">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">How it works</p>
          <h2 className="text-4xl font-extrabold sm:text-5xl">Three steps to cheers.</h2>
        </div>
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="card flex flex-col gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sukuma font-display text-xl font-extrabold text-usiku">
                {step.n}
              </span>
              <h3 className="text-2xl font-extrabold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <Link href="/how-it-works" className="self-start font-semibold text-sukuma hover:underline">
          See the full walkthrough →
        </Link>
      </section>

      {/* 05 Profile */}
      <section className="bg-plum/40">
        <div className="container-x grid items-center gap-12 py-20 md:grid-cols-2">
          <div className="flex justify-center md:order-1 md:justify-start">
            <SwipePhone />
          </div>
          <div className="flex flex-col gap-5 md:order-2">
            <p className="eyebrow">Your profile</p>
            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Your Base. Your Kinywaji. Your vibe.
            </h2>
            <ul className="flex flex-col gap-4 text-base">
              <li>
                <strong className="text-mango">Base</strong>
                <span className="text-muted"> is the area you hang out in, so matches are close by.</span>
              </li>
              <li>
                <strong className="text-mango">Kinywaji</strong>
                <span className="text-muted"> is your usual drink. It breaks the ice before you say a word.</span>
              </li>
              <li>
                <strong className="text-mango">Super Like</strong>
                <span className="text-muted"> lets someone know you really want to link up.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 06 Safety */}
      <section className="container-x flex flex-col gap-10 py-20">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Safe by design</p>
          <h2 className="text-4xl font-extrabold sm:text-5xl">Kutana mahali pa umma.</h2>
          <p className="max-w-xl text-muted">
            A good night out starts with feeling safe. These rules are part of how Tukate works.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {safetyPoints.map((point) => (
            <div key={point.title} className="card flex flex-col gap-2">
              <h3 className="text-xl font-extrabold text-pink">{point.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{point.body}</p>
            </div>
          ))}
        </div>
        <Link href="/safety" className="self-start font-semibold text-sukuma hover:underline">
          Read the safety guide →
        </Link>
      </section>

      {/* 07 Mbogi Mode teaser */}
      <section className="container-x pb-20">
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-mango p-8 text-usiku sm:p-12">
          <span className="rounded-full bg-usiku px-3 py-1 text-xs font-bold uppercase tracking-widest text-mango">
            Coming later
          </span>
          <h2 className="text-4xl font-extrabold sm:text-5xl">Mbogi Mode</h2>
          <p className="max-w-lg text-base font-medium">
            Bring the whole crew. Match your group with another group and make it a proper night
            out.
          </p>
        </div>
      </section>

      {/* 08 Venues */}
      <section className="bg-plum/40">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">For venues</p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Run a bar, rooftop or lounge?</h2>
            <p className="max-w-lg text-muted">
              Become a spot where Tukate matches meet up.
            </p>
          </div>
          <Link href="/venues" className="btn btn-ghost shrink-0">
            List your venue
          </Link>
        </div>
      </section>

      {/* 09 FAQ */}
      <section className="container-x grid gap-10 py-20 md:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Questions</p>
          <h2 className="text-4xl font-extrabold sm:text-5xl">Maswali?</h2>
          <Link href="/help" className="font-semibold text-sukuma hover:underline">
            More answers in Help →
          </Link>
        </div>
        <Faq items={homeFaq} />
      </section>

      {/* 10 Closing CTA */}
      <section className="container-x pb-20">
        <div className="flex flex-col items-start gap-6 rounded-3xl bg-sukuma p-8 text-usiku sm:p-12">
          <h2 className="text-5xl font-extrabold leading-none sm:text-6xl">
            Friday iko. Ingia.
          </h2>
          <Link href="/download" className="btn bg-usiku text-cream">
            Get the app
          </Link>
        </div>
      </section>
    </>
  );
}

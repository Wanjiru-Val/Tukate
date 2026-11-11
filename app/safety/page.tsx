import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { safetyPoints } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safety",
  description: "Kutana mahali pa umma. How Tukate keeps meetups safe, and how to look after yourself.",
};

const before = [
  "Chat in the app first. If something feels off, trust that feeling.",
  "Agree on a public venue you know or can look up.",
  "Tell a friend who you are meeting, where and when.",
  "Charge your phone and plan how you are getting home.",
];
const during = [
  "Share your live location with a friend for the whole meetup.",
  "Keep your drink with you and watch it being poured.",
  "Know your limit. You can always switch to water or a soda.",
  "Leave whenever you want. You do not owe anyone your evening.",
];
const after = [
  "Use a ride you trust to get home. Never drink and drive.",
  "Let your friend know you got home.",
  "Block and report anyone who crossed a line.",
];

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card flex flex-col gap-4">
      <h2 className="text-2xl font-extrabold text-mango">{title}</h2>
      <ul className="flex flex-col gap-3 text-sm leading-relaxed text-cream">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sukuma" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Safety() {
  return (
    <>
      <PageHeader
        eyebrow="Safe by design"
        title="Kutana mahali pa umma."
        lede="Meet in a public place. It is the first rule of Tukate, and the rest of the app is built around it."
      />
      <section className="container-x grid gap-5 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        {safetyPoints.map((point) => (
          <div key={point.title} className="card flex flex-col gap-2">
            <h2 className="text-xl font-extrabold text-pink">{point.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{point.body}</p>
          </div>
        ))}
      </section>
      <section className="container-x flex flex-col gap-6 pb-14">
        <h2 className="text-4xl font-extrabold">Your meetup checklist</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <Checklist title="Before" items={before} />
          <Checklist title="During" items={during} />
          <Checklist title="After" items={after} />
        </div>
      </section>
      <section className="container-x pb-20">
        <div className="flex flex-col gap-3 rounded-3xl border-2 border-pilipili bg-plum p-8">
          <h2 className="text-3xl font-extrabold">Need help right now?</h2>
          <p className="max-w-[65ch] text-sm leading-relaxed text-cream">
            If you are in danger, call the police on <strong>999</strong> or <strong>112</strong>.
            If drinking is becoming a problem for you or someone you know, call the{" "}
            {site.helpline.name} on <strong>{site.helpline.number}</strong>.
          </p>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { HouseRules } from "@/components/HouseRules";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safety",
  description: "Kutana mahali pa umma. How to keep a Tukate meetup as fun as it sounds.",
};

const stages = [
  {
    when: "Before you leave",
    items: [
      "Talk in the app first. If something about the conversation feels off, you are allowed to trust that and stay home.",
      "Agree on a public place that you know, or can at least look up.",
      "Tell a friend who you are meeting, where, and roughly when you will be back.",
      "Charge your phone, and decide how you are getting home before the first drink, not after the fourth.",
    ],
  },
  {
    when: "While you are out",
    items: [
      "Keep your live location shared with that friend for the whole evening.",
      "Watch your drink being poured and keep it with you. If you left it on the table to go and dance, order a fresh one.",
      "Go at your own pace. Nobody worth drinking with will mind if you switch to water.",
      "You can leave whenever you like. You do not owe anyone the rest of your evening.",
    ],
  },
  {
    when: "Getting home",
    items: [
      "Take a ride you trust. If you have been drinking, do not drive, and do not get in with anyone who has.",
      "Let your friend know you are home. “Nimefika” is enough.",
      "If the person crossed a line, block and report them. It helps the next person too.",
    ],
  },
];

export default function Safety() {
  return (
    <div className="night">
      <PageHeader note="the first rule of Tukate" title="Kutana mahali pa umma.">
        <p className="text-cream/85">
          Meet in a public place. Here is the honest version of why: you are about to have a drink
          with someone you have never met. Most nights that is exactly as fun as it sounds, and the
          habits on this page are what keep it that way.
        </p>
      </PageHeader>
      <section className="wrap pb-24 pt-6">
        <HouseRules />
      </section>
      <section className="wrap flex flex-col gap-14 pb-24">
        <h2 className="head text-5xl sm:text-6xl">A checklist for the whole evening</h2>
        <div className="grid gap-12 lg:grid-cols-3">
          {stages.map((stage, i) => (
            <div key={stage.when} className="flex flex-col gap-5" data-reveal style={{ ["--delay" as string]: `${i * 0.1}s` }}>
              <h3 className="hand text-5xl text-mango">{stage.when}</h3>
              <ul className="flex flex-col gap-4 text-lg text-cream/85">
                {stage.items.map((item) => (
                  <li key={item} className="border-l-[3px] border-sukuma pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="wrap pb-28">
        <div className="max-w-3xl border-2 border-pilipili p-7 sm:p-10">
          <h2 className="head text-4xl">If something goes wrong tonight</h2>
          <p className="mt-4 text-lg text-cream/85">
            If you are in danger, call the police on <strong>999</strong> or <strong>112</strong>.
            If drinking has stopped being fun for you or for someone close to you, the{" "}
            {site.helpline.name} is free to call on <strong>{site.helpline.number}</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}

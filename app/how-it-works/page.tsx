import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { MatchPhone, SwipePhone } from "@/components/Phone";

export const metadata: Metadata = {
  title: "How it works",
  description: "From download to your first cheers: how Tukate works, step by step.",
};

const walkthrough = [
  {
    title: "Set up your profile",
    body: "Add a photo, pick your Base (the area you hang out in) and your Kinywaji (your usual drink). You must be 18 or older to join.",
  },
  {
    title: "Swipe on people nearby",
    body: "Each card shows how far away someone is, their Base and their Kinywaji. Tap Pass to skip, or send a Super Like when you really want to link up.",
  },
  {
    title: "Match and chat",
    body: "When you both say yes, you get the match screen: Form imeshika! Tap Send message to start talking, or Keep swiping.",
  },
  {
    title: "Pick a public spot",
    body: "Agree on a bar, rooftop or restaurant. Kutana mahali pa umma: first meetups always happen in public.",
  },
  {
    title: "Share your location and go",
    body: "Send your live location to a friend you trust, then go enjoy yourself. Cheers.",
  },
];

export default function HowItWorks() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="From swipe to cheers."
        lede="Tukate is for finding someone nearby to drink and hang out with. Friends, not dates. Here is the whole flow."
      />
      <section className="container-x grid gap-12 pb-20 lg:grid-cols-[1.3fr_1fr]">
        <ol className="flex flex-col gap-4">
          {walkthrough.map((step, i) => (
            <li key={step.title} className="card flex gap-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sukuma font-display text-xl font-extrabold text-usiku">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-extrabold">{step.title}</h2>
                <p className="max-w-[60ch] text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex flex-col items-center gap-8">
          <SwipePhone />
          <MatchPhone />
        </div>
      </section>
      <section className="container-x pb-20">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-sukuma p-8 text-usiku sm:p-12">
          <h2 className="text-4xl font-extrabold sm:text-5xl">Ready? Ingia Tukate.</h2>
          <Link href="/download" className="btn bg-usiku text-cream">
            Get the app
          </Link>
        </div>
      </section>
    </>
  );
}

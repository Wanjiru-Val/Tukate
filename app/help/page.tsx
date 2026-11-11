import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Faq, type FaqItem } from "@/components/Faq";
import { homeFaq } from "@/lib/content";

export const metadata: Metadata = {
  title: "Help",
  description: "Answers to common questions about Tukate.",
};

const more: FaqItem[] = [
  {
    q: "What do Base and Kinywaji mean?",
    a: "Base is the area you usually hang out in. Kinywaji is your usual drink. Both show on your profile card.",
  },
  {
    q: "What does \"Form imeshika!\" mean?",
    a: "It is what you see when you match with someone. The plan is on.",
  },
  {
    q: "What is a Super Like?",
    a: "A way to tell someone you really want to link up, before they have swiped on you.",
  },
  {
    q: "Where should we meet?",
    a: "Always in a public place such as a bar, rooftop or restaurant. Share your live location with a friend before you go.",
  },
  {
    q: "Someone is making me uncomfortable. What do I do?",
    a: "Block them and report them. If you are in danger, call the police on 999 or 112.",
  },
];

export default function Help() {
  return (
    <>
      <PageHeader eyebrow="Help" title="Maswali? We have answers." />
      <section className="container-x flex max-w-3xl flex-col gap-10 pb-20">
        <Faq items={[...homeFaq, ...more]} />
        <p className="text-sm text-muted">
          Looking for meetup advice? Read the{" "}
          <Link href="/safety" className="font-semibold text-sukuma hover:underline">
            safety guide
          </Link>
          .
        </p>
      </section>
    </>
  );
}

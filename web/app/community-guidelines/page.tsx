import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Community guidelines",
  description: "How people on Tukate are expected to treat each other.",
};

const sections: LegalSection[] = [
  {
    title: "Be who you say you are",
    body: ["Use your own name, your own photo and your real age. One account per person. No impersonating anyone."],
  },
  {
    title: "Friends, not dates",
    body: ["Tukate is for finding company for a drink. Do not use it to pressure anyone for anything else. No means no, the first time."],
  },
  {
    title: "Keep it public",
    body: ["First meetups happen in public places. Do not push anyone to meet at a house or anywhere private, and do not ask for someone's home address."],
  },
  {
    title: "No harassment",
    body: ["No threats, insults, hate speech, sexual messages nobody asked for, or repeated messages to someone who has stopped replying."],
  },
  {
    title: "Nobody has to drink",
    body: ["Do not pressure anyone to drink, or to drink more. A soda is a perfectly good Kinywaji."],
  },
  {
    title: "Not a marketplace",
    body: ["No selling, advertising, promoting events for payment, or asking people for money."],
  },
  {
    title: "Nothing illegal",
    body: ["No drugs, no under-18s, nothing that breaks Kenyan law."],
  },
  {
    title: "If someone breaks these",
    body: [
      "Block them and report them from the Safety button in the chat. You do not need to explain yourself to them.",
      "We review reports and can warn, suspend or remove accounts. If you are in danger, call the police on 999 or 112 first.",
    ],
  },
];

export default function Guidelines() {
  return (
    <LegalPage
      title="Community guidelines"
      intro="These are the house rules in full. They apply to everyone on Tukate, free or paid."
      sections={sections}
    />
  );
}

import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The agreement between you and Tukate.",
};

const sections: LegalSection[] = [
  {
    title: "Who can use Tukate",
    body: ["You must be 18 or older. You must give your real first name and date of birth, and keep one account only."],
  },
  {
    title: "What Tukate is, and is not",
    body: [
      "Tukate introduces people who want company for a drink. It does not sell, serve or deliver alcohol, and it does not run or vouch for any venue.",
      "We do not run background checks on the people who use Tukate. You are responsible for your own safety when you meet someone. Always meet in a public place and tell a friend where you are.",
    ],
  },
  {
    title: "How you agree to behave",
    body: [
      "You agree to follow the community guidelines. In short: no harassment or threats, no fake profiles, no selling or advertising, nothing illegal, and no pressuring anyone to drink or to meet in private.",
      "We may suspend or remove accounts that break these rules, with or without warning, depending on how serious it is.",
    ],
  },
  {
    title: "Free and paid",
    body: [
      `Tukate is free to use with ${site.plan.freeSwipesPerDay} swipes a day. ${site.plan.name} costs ${site.plan.currency} ${site.plan.price} a month and adds filters and removes the daily limit.`,
      "Payment terms, renewals and refunds will be set out here before paid plans go on sale. Nothing can be bought yet.",
    ],
  },
  {
    title: "Your content",
    body: ["Your photo, your card and your messages remain yours. You give us permission to store them and show them to other people on Tukate so the service can work. Do not post anything you do not have the right to share."],
  },
  {
    title: "Drinking",
    body: ["Drink responsibly. Never drink and drive. You are responsible for what and how much you drink."],
  },
  {
    title: "If things go wrong",
    body: [
      "We work to keep Tukate running and safe, but we provide it as it is and cannot promise it will always be available or free of errors.",
      "To the extent the law allows, Tukate is not liable for what happens between people who meet through it. Nothing here limits rights that Kenyan law says cannot be limited.",
    ],
  },
  {
    title: "Ending your account",
    body: ["You can delete your account at any time from the Me tab in the app."],
  },
  {
    title: "Governing law",
    body: ["These terms are governed by the laws of Kenya."],
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of use"
      intro="By creating a Tukate account you agree to these terms. We have tried to write them the way we would explain them across a table."
      sections={sections}
    />
  );
}

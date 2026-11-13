import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Tukate collects about you, why, who sees it, and how to get it back or delete it.",
};

const sections: LegalSection[] = [
  {
    title: "What we collect",
    body: [
      "When you use the Tukate app:",
      [
        "Your email address, used to sign you in.",
        "Your first name and date of birth. Your date of birth is used to check you are 18 or older and to show your age. It is never shown to other people.",
        "Your card: Base, Kinywaji, kind of drink, drinking type, party style, the line you write about yourself, and a photo if you add one.",
        "Your phone's approximate location, only if you allow it, so we can show you people nearby.",
        "Your swipes, your matches and the messages you send.",
        "Reports you make about other people, and reports made about you.",
      ],
      "When you use this website: if you fill in the venue form, the venue name, area, your name, your phone number and anything you add in the notes.",
    ],
  },
  {
    title: "Why we collect it",
    body: [
      [
        "To run the service you signed up for: showing you people nearby, matching and chat.",
        "To keep Tukate for adults only.",
        "To keep people safe, by acting on reports and blocks.",
        "To contact venues that asked to be listed.",
      ],
      "We do not sell your information, and we do not use it for advertising.",
    ],
  },
  {
    title: "What other people can see",
    body: [
      "People who see your card see your first name, your age, your Base, your drinks and style, your line and your photo, plus how far away you are, rounded to the nearest 100 metres.",
      "Nobody else can see your email address, your date of birth or your exact location. Your messages are visible only to you and the person you matched with.",
    ],
  },
  {
    title: "Where it is kept and who handles it",
    body: [
      "Your information is stored in a database run by our hosting provider, Supabase, on servers outside Kenya. Access is restricted so that each person can only reach their own information and the limited card details of others.",
      "We only hand information to anyone else when the law requires it, for example a valid request from a Kenyan court or investigator.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep your information for as long as you have an account. When you delete your account, your card, photo, swipes, matches and messages are deleted.",
      "Venue enquiries are kept until the conversation with that venue is finished, and no longer than 12 months.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Under Kenya's Data Protection Act, 2019 you have the right to be told how your information is used, to see it, to correct it, to object to its use, and to have it deleted. In the app you can do most of this yourself from the Me tab:",
      [
        "Edit your card to correct it.",
        "Download my data gives you everything we hold about you.",
        "Delete my account removes it.",
      ],
      "If you believe your information has been mishandled you can also complain to the Office of the Data Protection Commissioner.",
    ],
  },
  {
    title: "Age",
    body: ["Tukate is only for people aged 18 and over. If we learn that someone under 18 has an account, we delete it."],
  },
  {
    title: "Changes",
    body: ["If we change this policy in a way that matters, we will tell you in the app before the change takes effect."],
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="Tukate introduces people who want company for a drink. To do that we need to know a few things about you. This page says what, why, and what you can do about it."
      sections={sections}
    />
  );
}

// Single place for things that change at launch.
export const site = {
  name: "Tukate",
  slogan: "Ingia Tukate",
  tagline: "Swipe. Match. Cheers.",
  description:
    "Your plans fell through. Tukate finds you somebody nearby who also wants a drink tonight. Friends, not dates. 18+ only.",
  // Fill these in when the apps are published. While empty, store buttons read "Coming soon".
  appStoreUrl: "",
  playStoreUrl: "",
  // Areas the launch is planned for. Edit freely.
  areas: ["Kilimani", "Westlands", "Kileleshwa", "the CBD"],
  // Paid tier. "Tukate Plus" is a working name until the real one is chosen.
  plan: { name: "Tukate Plus", price: 299, currency: "KES", freeSwipesPerDay: 3 },
  // Address of the web app once it is deployed. While empty, no "Open the web app" link is shown.
  webAppUrl: process.env.NEXT_PUBLIC_WEB_APP_URL ?? "",
  // Shown on the privacy and terms pages. Must be filled in before launch.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  legalUpdated: "13 November 2026",
  helpline: { name: "NACADA helpline", number: "1192" },
};

export const legalNav = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/community-guidelines", label: "Community guidelines" },
];

export const nav = [
  { href: "/#usiku", label: "How a night goes" },
  { href: "/safety", label: "Safety" },
  { href: "/venues", label: "For venues" },
  { href: "/help", label: "Help" },
];

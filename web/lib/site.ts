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
  helpline: { name: "NACADA helpline", number: "1192" },
};

export const nav = [
  { href: "/#usiku", label: "How a night goes" },
  { href: "/safety", label: "Safety" },
  { href: "/venues", label: "For venues" },
  { href: "/help", label: "Help" },
];

// All the words on the site live here so they are easy to edit.

export const chat = [
  { from: "me", text: "Form ni gani leo? Tuko?", time: "5:31 PM" },
  { from: "Kev", text: "Aki boss amenipea deadline. Next week for sure", time: "5:38 PM" },
  { from: "Shiko", text: "Niko ruracio ya cousin huko Kiambu. Nisamehe!", time: "5:41 PM" },
  { from: "Mwas", typing: true },
  { from: "me", text: "Sawa basi.", time: "5:47 PM" },
] as const;

export type Person = {
  name: string;
  age: number;
  base: string;
  distance: string;
  drink: string;
  drinkArt: "cider" | "beer" | "dawa" | "whisky";
  pattern: string;
  bio: string;
};

// Example profiles for the demo deck. Not real people.
export const people: Person[] = [
  {
    name: "Wanjiku",
    age: 26,
    base: "Kilimani",
    distance: "300m away",
    drink: "Pineapple cider",
    drinkArt: "cider",
    pattern: "pat-kikoi",
    bio: "I will argue with you about where the best nyama choma in this city is. Come prepared.",
  },
  {
    name: "Otieno",
    age: 29,
    base: "Westlands",
    distance: "1.2km away",
    drink: "Lager, baridi sana",
    drinkArt: "beer",
    pattern: "pat-shuka",
    bio: "Arsenal fan, so I am used to disappointment. Buy me one after the match and I will tell you about 2004.",
  },
  {
    name: "Amina",
    age: 24,
    base: "South B",
    distance: "2km away",
    drink: "Dawa, extra honey",
    drinkArt: "dawa",
    pattern: "pat-dots",
    bio: "Moved up from Mombasa in March. Show me a place in Nairobi that is not inside a mall.",
  },
  {
    name: "Brayo",
    age: 31,
    base: "Kileleshwa",
    distance: "800m away",
    drink: "Whisky, no ice",
    drinkArt: "whisky",
    pattern: "pat-diag",
    bio: "I DJ at weddings on Saturdays. No, I will not play your song.",
  },
];

export const night = [
  {
    time: "6:41 PM",
    text: "You match with Wanjiku, whose Kinywaji is pineapple cider and whose Base is Kilimani, same as yours.",
  },
  {
    time: "6:48 PM",
    text: "A few messages in, you settle on a rooftop you both know. She says the dawa there is honest. You decide to find out.",
  },
  {
    time: "7:10 PM",
    text: "Before you leave the house you share your live location with your sister, who replies “enjoy, usilewe sana.”",
  },
  {
    time: "7:45 PM",
    text: "First round. It turns out she also supports a team that keeps breaking her heart.",
  },
  {
    time: "11:58 PM",
    text: "Home. You text your sister “nimefika.” Wanjiku texts you the name of that other place, for next Friday.",
  },
];

export const rules = [
  {
    sw: "Watu wazima pekee.",
    en: "Eighteen and over. If you are not there yet, the app will still be here when you are.",
  },
  {
    sw: "Kutana mahali pa umma.",
    en: "The first round always happens somewhere public: a bar, a rooftop, a nyama choma joint with plastic chairs. Never somebody’s house.",
  },
  {
    sw: "Mtu ajue uko wapi.",
    en: "Share your live location with a person you trust before you set off. It takes ten seconds and your mother would approve.",
  },
  {
    sw: "Block kwanza, maswali baadaye.",
    en: "If someone makes you uncomfortable you can block and report them, and you owe nobody an explanation.",
  },
  {
    sw: "Maji pia ni kinywaji.",
    en: "Know your limit. Ordering a soda on round three is a power move.",
  },
  {
    sw: "Usiendeshe ukiwa umelewa.",
    en: "If you have been drinking, you are not driving. Call a cab. The car will still be there in the morning.",
  },
];

// What is free and what is paid. Shown as a bar tab on the homepage.
export const freeTab = [
  "Three swipes a day",
  "People in the area you are in",
  "Chat with every match",
  "The house rules, always",
];
export const plusTab = [
  "Swipe as much as you like",
  "See only people with your Kinywaji",
  "Filter by drinking type",
  "Filter by party style",
];

export type Question = { q: string; a: string };

export const counterQuestions: Question[] = [
  {
    q: "So is this a dating app?",
    a: "No. Profiles are about where you hang out and what you drink, and everything is set up around meeting in public for a round. Friends, not dates. Nobody is going to ask what you are looking for.",
  },
  {
    q: "Is it free?",
    a: "Yes, with limits. Free gets you three swipes a day on people in your area. Tukate Plus is KES 299 a month and lets you choose who you see: same drink, same drinking type, same party style.",
  },
  {
    q: "Where does it work?",
    a: "Nairobi first. We are starting with Kilimani, Westlands, Kileleshwa and the CBD, and adding areas as people join.",
  },
  {
    q: "Do I have to drink alcohol?",
    a: "Not at all. Your Kinywaji can be a passion juice or a pot of tea. You are there for the company.",
  },
  {
    q: "Can I bring my friends?",
    a: "Soon. We are building something called Mbogi Mode, where your crew matches with another crew.",
  },
  {
    q: "When can I get it?",
    a: "The app is not in the stores yet. The buttons on this site will turn into download links the day it is.",
  },
];

export const moreQuestions: Question[] = [
  {
    q: "What are Base and Kinywaji?",
    a: "Base is the area you usually hang out in, so the people you see are close enough to actually meet. Kinywaji is your usual drink, the one you order without looking at the menu. Both sit on your profile card.",
  },
  {
    q: "What does “Form imeshika!” mean?",
    a: "It is what the screen says when two people swipe right on each other. Roughly: the plan has landed.",
  },
  {
    q: "What is a Super Like?",
    a: "A louder yes. It tells someone you would really like to link up, before they have swiped on you.",
  },
  {
    q: "Where should we meet?",
    a: "Somewhere public, every time: a bar, a rooftop, a restaurant. Share your live location with a friend before you go.",
  },
  {
    q: "Somebody is making me uncomfortable.",
    a: "Block them and report them. You do not need a reason. If you are in danger, call the police on 999 or 112.",
  },
];

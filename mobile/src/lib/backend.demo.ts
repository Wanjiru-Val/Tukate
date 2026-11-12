// Demo mode: the whole app running on made-up people, held in memory.
// Used when no Supabase keys are set. It follows the same rules as the real
// database (3 free swipes a day, filters only on Plus) so the feel is right.
import {
  AppError, type Backend, type Card, type Filters, type MatchRow, type Message, type Plan, type Profile,
} from "./types";
import { plan as planInfo } from "./theme";

const ME = "demo-me";

type Person = Omit<Card, "liked_you"> & { likesYou: boolean; superLikedYou?: boolean; reply: string };

const PEOPLE: Person[] = [
  { id: "p1", display_name: "Wanjiku", age: 26, base: "Kilimani", kinywaji: "Pineapple cider", drink_type: "cider", drinking_type: "social", party_style: "rooftop", bio: "I will argue with you about where the best nyama choma in this city is. Come prepared.", photo_path: null, distance_m: 300, likesYou: true, reply: "Sasa! There is a rooftop on Argwings Kodhek with honest dawa. 7:30?" },
  { id: "p2", display_name: "Otieno", age: 29, base: "Westlands", kinywaji: "Lager, baridi sana", drink_type: "beer", drinking_type: "all_night", party_style: "club", bio: "Arsenal fan, so I am used to disappointment. Buy me one after the match.", photo_path: null, distance_m: 1200, likesYou: false, reply: "Niaje!" },
  { id: "p3", display_name: "Amina", age: 24, base: "South B", kinywaji: "Dawa, extra honey", drink_type: "cocktails", drinking_type: "one_or_two", party_style: "live_music", bio: "Moved up from Mombasa in March. Show me a place that is not inside a mall.", photo_path: null, distance_m: 2000, likesYou: true, superLikedYou: true, reply: "Hi! Do you know anywhere with live music on a Thursday?" },
  { id: "p4", display_name: "Brayo", age: 31, base: "Kileleshwa", kinywaji: "Whisky, no ice", drink_type: "whisky", drinking_type: "social", party_style: "nyama_choma", bio: "I DJ at weddings on Saturdays. No, I will not play your song.", photo_path: null, distance_m: 800, likesYou: true, reply: "Form ni gani? I know a choma place." },
  { id: "p5", display_name: "Shiko", age: 27, base: "Kilimani", kinywaji: "Gin and tonic", drink_type: "gin", drinking_type: "social", party_style: "rooftop", bio: "Will leave any bar that plays the same playlist twice.", photo_path: null, distance_m: 500, likesYou: false, reply: "Hey!" },
  { id: "p6", display_name: "Kevo", age: 28, base: "Lavington", kinywaji: "Single malt", drink_type: "whisky", drinking_type: "one_or_two", party_style: "quiet_local", bio: "Two drinks, good conversation, home by ten. That is the whole plan.", photo_path: null, distance_m: 1600, likesYou: true, reply: "Evening. Quiet place near Lavington Mall?" },
  { id: "p7", display_name: "Nyambura", age: 25, base: "Westlands", kinywaji: "Red wine", drink_type: "wine", drinking_type: "social", party_style: "live_music", bio: "Benga, rhumba, anything with a real band.", photo_path: null, distance_m: 2400, likesYou: false, reply: "Hi there" },
];

export function createDemoBackend(): Backend {
  let signedIn = false;
  let profile: Profile | null = null;
  let swipedToday = 0;
  const swiped = new Set<string>();
  const blocked = new Set<string>();
  const matches: { id: string; other: string; at: string }[] = [];
  const messages: Message[] = [];
  const authListeners = new Set<(id: string | null) => void>();
  const chatListeners = new Map<string, Set<(m: Message) => void>>();
  let nextId = 1;

  const isPlus = () => profile?.plan === "plus";
  const left = () => (isPlus() ? null : Math.max(0, planInfo.freeSwipesPerDay - swipedToday));
  const wait = (ms = 220) => new Promise((r) => setTimeout(r, ms));

  function push(matchId: string, sender: string, body: string) {
    const m: Message = { id: nextId++, match_id: matchId, sender, body, created_at: new Date().toISOString() };
    messages.push(m);
    chatListeners.get(matchId)?.forEach((cb) => cb(m));
  }

  return {
    mode: "demo",
    async currentUserId() { return signedIn ? ME : null; },
    onAuthChange(cb) { authListeners.add(cb); return () => { authListeners.delete(cb); }; },
    async sendCode() { await wait(); },
    async verifyCode(_email, code) {
      await wait();
      if (code.trim().length < 6) throw new AppError("bad_code");
      signedIn = true;
      authListeners.forEach((cb) => cb(ME));
    },
    async signOut() { signedIn = false; authListeners.forEach((cb) => cb(null)); },

    async getMyProfile() { await wait(80); return profile; },
    async createProfile(input) {
      await wait();
      const born = new Date(input.birth_date);
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      if (born > cutoff) throw new AppError("under_18");
      profile = { id: ME, plan: "free", plan_until: null, ...input };
      return profile;
    },
    async updateProfile(patch) {
      if (!profile) throw new AppError("no_profile");
      profile = { ...profile, ...patch };
      return profile;
    },
    async uploadPhoto(localUri) { return localUri; },
    photoUrl(path) { return path; },
    async setLocation() {},

    async swipesLeft() { return left(); },
    async getDeck(filters: Filters) {
      await wait();
      if (!profile) throw new AppError("no_profile");
      if ((filters.sameDrink || filters.drinkingType || filters.partyStyle) && !isPlus()) {
        throw new AppError("plus_required");
      }
      return PEOPLE
        .filter((p) => !swiped.has(p.id) && !blocked.has(p.id))
        .filter((p) => !filters.sameDrink || p.drink_type === profile!.drink_type)
        .filter((p) => !filters.drinkingType || p.drinking_type === filters.drinkingType)
        .filter((p) => !filters.partyStyle || p.party_style === filters.partyStyle)
        .sort((a, b) => (a.distance_m ?? 0) - (b.distance_m ?? 0))
        .map(({ likesYou: _l, superLikedYou, reply: _r, ...card }) => ({ ...card, liked_you: Boolean(superLikedYou) }));
    },
    async swipe(targetId, direction) {
      await wait(120);
      const remaining = left();
      if (remaining !== null && remaining <= 0) throw new AppError("daily_limit");
      if (swiped.has(targetId)) throw new AppError("already_swiped");
      swiped.add(targetId);
      swipedToday += 1;
      const person = PEOPLE.find((p) => p.id === targetId);
      let matchId: string | null = null;
      if (person && direction !== "pass" && person.likesYou) {
        matchId = `m-${targetId}`;
        matches.unshift({ id: matchId, other: targetId, at: new Date().toISOString() });
      }
      return { matched: matchId !== null, match_id: matchId, swipes_left: left() };
    },

    async getMatches() {
      await wait(120);
      return matches.map((m): MatchRow => {
        const p = PEOPLE.find((x) => x.id === m.other)!;
        const last = [...messages].reverse().find((x) => x.match_id === m.id);
        return {
          match_id: m.id, matched_at: m.at, other_id: p.id, display_name: p.display_name, age: p.age,
          base: p.base, kinywaji: p.kinywaji, photo_path: null,
          last_message: last?.body ?? null, last_message_at: last?.created_at ?? null, last_sender: last?.sender ?? null,
        };
      });
    },
    async getMessages(matchId) { return messages.filter((m) => m.match_id === matchId); },
    async sendMessage(matchId, body) {
      push(matchId, ME, body);
      const m = matches.find((x) => x.id === matchId);
      const person = PEOPLE.find((p) => p.id === m?.other);
      const already = messages.some((x) => x.match_id === matchId && x.sender !== ME);
      if (person && !already) setTimeout(() => push(matchId, person.id, person.reply), 1400);
    },
    subscribeMessages(matchId, cb) {
      if (!chatListeners.has(matchId)) chatListeners.set(matchId, new Set());
      chatListeners.get(matchId)!.add(cb);
      return () => { chatListeners.get(matchId)?.delete(cb); };
    },

    async blockUser(userId) {
      blocked.add(userId);
      const i = matches.findIndex((m) => m.other === userId);
      if (i >= 0) matches.splice(i, 1);
    },
    async reportUser() { await wait(); },
    async deleteAccount() {
      profile = null; signedIn = false; swiped.clear(); matches.length = 0; messages.length = 0; swipedToday = 0;
      authListeners.forEach((cb) => cb(null));
    },
    async demoSetPlan(p: Plan) {
      if (profile) profile = { ...profile, plan: p };
    },
  };
}

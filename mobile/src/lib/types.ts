export type Plan = "free" | "plus";

export type Profile = {
  id: string;
  display_name: string;
  birth_date: string; // YYYY-MM-DD
  base: string;
  kinywaji: string;
  drink_type: string;
  drinking_type: string;
  party_style: string;
  bio: string;
  photo_path: string | null;
  plan: Plan;
  plan_until: string | null;
};

export type NewProfile = Omit<Profile, "id" | "plan" | "plan_until">;
// Shown at sign-up; bump when the terms or privacy policy change.
export const TERMS_VERSION = "2026-11";
export type ProfilePatch = Partial<Omit<NewProfile, "birth_date">>;

export type Card = {
  id: string;
  display_name: string;
  age: number;
  base: string;
  kinywaji: string;
  drink_type: string;
  drinking_type: string;
  party_style: string;
  bio: string;
  photo_path: string | null;
  distance_m: number | null;
  liked_you: boolean;
};

export type MatchRow = {
  match_id: string;
  matched_at: string;
  other_id: string;
  display_name: string;
  age: number;
  base: string;
  kinywaji: string;
  photo_path: string | null;
  last_message: string | null;
  last_message_at: string | null;
  last_sender: string | null;
};

export type Message = { id: number | string; match_id: string; sender: string; body: string; created_at: string };

export type Filters = { sameDrink: boolean; drinkingType: string | null; partyStyle: string | null };
export const NO_FILTERS: Filters = { sameDrink: false, drinkingType: null, partyStyle: null };

export type Direction = "pass" | "cheers" | "super";
export type SwipeResult = { matched: boolean; match_id: string | null; swipes_left: number | null };
export type ReportReason = "harassment" | "fake_profile" | "underage" | "unsafe_meetup" | "other";

// Error codes the database raises, turned into something a person can read.
export type ErrorCode =
  | "daily_limit" | "plus_required" | "already_swiped" | "not_signed_in" | "no_profile"
  | "no_such_person" | "under_18" | "bad_code" | "slow_down" | "network" | "unknown";

export class AppError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
  }
}

export function friendly(e: unknown): string {
  const code = e instanceof AppError ? e.code : "unknown";
  switch (code) {
    case "daily_limit": return "That was your last free swipe for today. Kesho tena.";
    case "plus_required": return "Filters are part of Tukate Plus.";
    case "already_swiped": return "You have already swiped on this person.";
    case "slow_down": return "You are going a bit fast. Give it a minute and try again.";
    case "under_18": return "Tukate is only for people aged 18 and over.";
    case "bad_code": return "That code is not right, or it has expired. Ask for a new one.";
    case "network": return "We could not reach Tukate. Check your connection and try again.";
    case "not_signed_in": return "Please sign in again.";
    default: return e instanceof Error && e.message && e.message !== "unknown"
      ? e.message : "Something went wrong on our side. Please try again.";
  }
}

export interface Backend {
  mode: "live" | "demo";
  currentUserId(): Promise<string | null>;
  onAuthChange(cb: (userId: string | null) => void): () => void;
  sendCode(email: string): Promise<void>;
  verifyCode(email: string, code: string): Promise<void>;
  signOut(): Promise<void>;

  getMyProfile(): Promise<Profile | null>;
  createProfile(input: NewProfile): Promise<Profile>;
  updateProfile(patch: ProfilePatch): Promise<Profile>;
  uploadPhoto(localUri: string): Promise<string>;
  // A short-lived link to a private photo, or null if there is none.
  getPhotoUrl(path: string | null): Promise<string | null>;
  setLocation(lat: number, lng: number): Promise<void>;

  swipesLeft(): Promise<number | null>;
  getDeck(filters: Filters): Promise<Card[]>;
  swipe(targetId: string, direction: Direction): Promise<SwipeResult>;

  getMatches(): Promise<MatchRow[]>;
  getMessages(matchId: string): Promise<Message[]>;
  sendMessage(matchId: string, body: string): Promise<void>;
  subscribeMessages(matchId: string, cb: (m: Message) => void): () => void;

  blockUser(userId: string): Promise<void>;
  reportUser(userId: string, reason: ReportReason, details: string): Promise<void>;
  deleteAccount(): Promise<void>;
  // Everything Tukate holds about the signed-in person.
  exportMyData(): Promise<unknown>;

  // Demo mode only: flips the made-up account to Plus so the paid features can be tried.
  demoSetPlan?(plan: Plan): Promise<void>;
}

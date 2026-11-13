import { sessionStorage } from "./secureStorage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  AppError, type Backend, type Card, type ErrorCode, type MatchRow, type Message, type Profile,
} from "./types";

const KNOWN: ErrorCode[] = [
  "daily_limit", "plus_required", "already_swiped", "not_signed_in", "no_profile", "no_such_person", "slow_down",
];

function toAppError(error: { message?: string; code?: string } | null): AppError {
  const msg = error?.message ?? "";
  const known = KNOWN.find((k) => msg.includes(k));
  if (known) return new AppError(known);
  if (msg.includes("adults_only")) return new AppError("under_18");
  if (/network|fetch/i.test(msg)) return new AppError("network");
  return new AppError("unknown", msg || undefined);
}

function must<T>(res: { data: T | null; error: { message?: string } | null }): T {
  if (res.error) throw toAppError(res.error);
  return res.data as T;
}

const PROFILE_COLS =
  "id, display_name, birth_date, base, kinywaji, drink_type, drinking_type, party_style, bio, photo_path, plan, plan_until";

export function createSupabaseBackend(url: string, anonKey: string): Backend {
  const db: SupabaseClient = createClient(url, anonKey, {
    auth: { storage: sessionStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
  });

  const signed = new Map<string, { url: string; until: number }>();

  async function uid(): Promise<string> {
    const { data } = await db.auth.getSession();
    const id = data.session?.user.id;
    if (!id) throw new AppError("not_signed_in");
    return id;
  }

  return {
    mode: "live",

    async currentUserId() {
      const { data } = await db.auth.getSession();
      return data.session?.user.id ?? null;
    },
    onAuthChange(cb) {
      const { data } = db.auth.onAuthStateChange((_event, session) => cb(session?.user.id ?? null));
      return () => data.subscription.unsubscribe();
    },
    async sendCode(email) {
      const { error } = await db.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
      if (error) throw toAppError(error);
    },
    async verifyCode(email, code) {
      const { error } = await db.auth.verifyOtp({ email, token: code, type: "email" });
      if (error) throw new AppError("bad_code");
    },
    async signOut() {
      await db.auth.signOut();
    },

    async getMyProfile() {
      const id = await uid();
      const res = await db.from("profiles").select(PROFILE_COLS).eq("id", id).maybeSingle();
      return must(res) as Profile | null;
    },
    async createProfile(input) {
      const id = await uid();
      const res = await db.from("profiles")
        .insert({ id, accepted_terms_at: new Date().toISOString(), ...input }).select(PROFILE_COLS).single();
      return must(res) as Profile;
    },
    async updateProfile(patch) {
      const id = await uid();
      const res = await db.from("profiles").update(patch).eq("id", id).select(PROFILE_COLS).single();
      return must(res) as Profile;
    },
    async uploadPhoto(localUri) {
      const id = await uid();
      const file = await (await fetch(localUri)).arrayBuffer();
      const path = `${id}/${Date.now()}.jpg`;
      const { error } = await db.storage.from("photos").upload(path, file, { contentType: "image/jpeg", upsert: true });
      if (error) throw toAppError(error);
      return path;
    },
    async getPhotoUrl(path) {
      if (!path) return null;
      const hit = signed.get(path);
      if (hit && hit.until > Date.now()) return hit.url;
      const { data, error } = await db.storage.from("photos").createSignedUrl(path, 3600);
      if (error || !data) return null;
      signed.set(path, { url: data.signedUrl, until: Date.now() + 50 * 60 * 1000 });
      return data.signedUrl;
    },
    async setLocation(lat, lng) {
      const id = await uid();
      const { error } = await db.from("profiles")
        .update({ lat, lng, located_at: new Date().toISOString() }).eq("id", id);
      if (error) throw toAppError(error);
    },

    async swipesLeft() {
      return must(await db.rpc("swipes_left")) as number | null;
    },
    async getDeck(filters) {
      const res = await db.rpc("get_deck", {
        p_limit: 20,
        p_same_drink: filters.sameDrink,
        p_drinking_type: filters.drinkingType,
        p_party_style: filters.partyStyle,
      });
      return (must(res) ?? []) as Card[];
    },
    async swipe(targetId, direction) {
      return must(await db.rpc("swipe", { p_target: targetId, p_direction: direction }));
    },

    async getMatches() {
      return (must(await db.rpc("get_matches")) ?? []) as MatchRow[];
    },
    async getMessages(matchId) {
      const res = await db.from("messages").select("id, match_id, sender, body, created_at")
        .eq("match_id", matchId).order("created_at", { ascending: true }).limit(500);
      return (must(res) ?? []) as Message[];
    },
    async sendMessage(matchId, body) {
      const id = await uid();
      const { error } = await db.from("messages").insert({ match_id: matchId, sender: id, body });
      if (error) throw toAppError(error);
    },
    subscribeMessages(matchId, cb) {
      const channel = db.channel(`chat:${matchId}`)
        .on("postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
          (payload) => cb(payload.new as Message))
        .subscribe();
      return () => { db.removeChannel(channel); };
    },

    async blockUser(userId) {
      must(await db.rpc("block_user", { p_user: userId }));
    },
    async reportUser(userId, reason, details) {
      must(await db.rpc("report_user", { p_user: userId, p_reason: reason, p_details: details }));
    },
    async deleteAccount() {
      must(await db.rpc("delete_my_account"));
      await db.auth.signOut();
    },
    async exportMyData() {
      return must(await db.rpc("export_my_data"));
    },
  };
}

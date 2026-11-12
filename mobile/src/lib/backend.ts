import type { Backend } from "./types";
import { createSupabaseBackend } from "./backend.supabase";
import { createDemoBackend } from "./backend.demo";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

// With Supabase keys the app talks to the real database. Without them it runs
// in demo mode with made-up people, so it can be tried before anything is set up.
export const backend: Backend = url && key ? createSupabaseBackend(url, key) : createDemoBackend();

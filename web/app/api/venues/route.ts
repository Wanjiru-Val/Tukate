import { NextResponse } from "next/server";

// Receives venue partner enquiries and saves them in the database.
// Needs two server-only settings: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
// The service role key must never be exposed to the browser or put in the app.

const limits = { venue: 120, area: 80, contact: 120, phone: 20, notes: 1000 } as const;
const required = ["venue", "area", "contact", "phone"] as const;

// Simple per-address limit: 5 enquiries an hour. Resets when the server restarts.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const seen = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (seen.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    seen.set(ip, recent);
    return true;
  }
  recent.push(now);
  seen.set(ip, recent);
  if (seen.size > 5000) seen.clear();
  return false;
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 10_000) return NextResponse.json({ error: "That is too much text." }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots fill in the hidden "website" field. Pretend it worked and save nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const clean: Record<string, string> = {};
  for (const key of Object.keys(limits) as (keyof typeof limits)[]) {
    const value = typeof body[key] === "string" ? (body[key] as string).trim() : "";
    if (value.length > limits[key]) {
      return NextResponse.json({ error: `The ${key} field is too long.` }, { status: 400 });
    }
    clean[key] = value;
  }
  for (const key of required) {
    if (!clean[key]) {
      return NextResponse.json({ error: "Please fill in every required field." }, { status: 400 });
    }
  }
  if (!/^\+?[0-9 ()-]{9,20}$/.test(clean.phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json(
      { error: "You have sent several enquiries already. Please try again in an hour." },
      { status: 429 },
    );
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[venue enquiry] not saved: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
    return NextResponse.json(
      { error: "We cannot take enquiries just yet. Please try again soon." },
      { status: 503 },
    );
  }

  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/venue_enquiries`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(clean),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.error("[venue enquiry] save failed", res?.status);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}

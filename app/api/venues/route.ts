import { NextResponse } from "next/server";

// Receives venue partner enquiries.
// TODO before launch: store these somewhere (database, email or a sheet).
// Right now a valid enquiry is only written to the server log.

const limits = { venue: 120, area: 80, contact: 120, phone: 20, notes: 1000 } as const;
const required = ["venue", "area", "contact", "phone"] as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
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

  console.log("[venue enquiry]", JSON.stringify(clean));
  return NextResponse.json({ ok: true });
}

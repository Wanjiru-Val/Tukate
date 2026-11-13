"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-lg border-2 border-usiku bg-white px-4 py-3 text-lg text-usiku placeholder:text-usiku/35 focus:shadow-[4px_4px_0_var(--color-sukuma)] focus:outline-none";
const label = "flex flex-col gap-1.5 font-semibold";

export function VenueForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const res = await fetch("/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Something went wrong on our side. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col gap-3 rounded-xl border-2 border-usiku bg-sukuma p-8 shadow-[8px_8px_0_var(--color-usiku)]">
        <h2 className="sign text-6xl">Asante!</h2>
        <p className="text-lg">We have your details and will be in touch about listing your venue.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative flex flex-col gap-5 rounded-xl border-2 border-usiku bg-mango p-6 shadow-[8px_8px_0_var(--color-usiku)] sm:p-8">
      <label className={label} htmlFor="venue-name">
        What is the place called?
        <input id="venue-name" name="venue" required maxLength={120} className={field} />
      </label>
      <label className={label} htmlFor="venue-area">
        Which part of town?
        <input id="venue-area" name="area" required maxLength={80} className={field} placeholder="Westlands, Kilimani…" />
      </label>
      <label className={label} htmlFor="venue-contact">
        And your name?
        <input id="venue-contact" name="contact" required maxLength={120} className={field} />
      </label>
      <label className={label} htmlFor="venue-phone">
        A number we can reach you on
        <input id="venue-phone" name="phone" type="tel" required maxLength={20} inputMode="tel" className={field} placeholder="+254 7XX XXX XXX" />
      </label>
      {/* Hidden from people; bots fill it in, and the server drops anything that does. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="venue-website">Website</label>
        <input id="venue-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className={label} htmlFor="venue-notes">
        Anything we should know? (optional)
        <textarea id="venue-notes" name="notes" rows={3} maxLength={1000} className={field} />
      </label>
      {status === "error" ? (
        <p role="alert" className="rounded-lg border-2 border-usiku bg-cream px-4 py-3 font-semibold">
          {error}
        </p>
      ) : null}
      <p className="text-sm">
        We use these details only to contact you about listing your venue. See our{" "}
        <a href="/privacy" className="link-tk">
          privacy policy
        </a>
        .
      </p>
      <button type="submit" disabled={status === "sending"} className="press press-green self-start disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send it over"}
      </button>
    </form>
  );
}

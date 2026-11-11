"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border-2 border-plum-line bg-usiku px-4 py-3 text-base text-cream placeholder:text-muted/60 focus:border-sukuma focus:outline-none";

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
        setError(body.error ?? "Something went wrong. Please try again.");
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
      <div className="card flex flex-col gap-2" role="status">
        <h2 className="text-2xl font-extrabold text-sukuma">Asante! We got it.</h2>
        <p className="text-sm text-muted">We will be in touch about listing your venue.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-4" noValidate={false}>
      <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor="venue-name">
        Venue name
        <input id="venue-name" name="venue" required maxLength={120} className={field} placeholder="e.g. Rooftop 254" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor="venue-area">
        Area
        <input id="venue-area" name="area" required maxLength={80} className={field} placeholder="e.g. Westlands" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor="venue-contact">
        Your name
        <input id="venue-contact" name="contact" required maxLength={120} className={field} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor="venue-phone">
        Phone number
        <input
          id="venue-phone"
          name="phone"
          type="tel"
          required
          maxLength={20}
          inputMode="tel"
          className={field}
          placeholder="+254 7XX XXX XXX"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor="venue-notes">
        Anything else? (optional)
        <textarea id="venue-notes" name="notes" rows={3} maxLength={1000} className={field} />
      </label>
      {status === "error" ? (
        <p role="alert" className="text-sm font-semibold text-pilipili">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

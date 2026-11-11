"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";

const KEY = "tukate-age-confirmed";

export function AgeGate() {
  const [state, setState] = useState<"checking" | "ask" | "ok" | "under">("checking");

  useEffect(() => {
    let confirmed = false;
    try {
      confirmed = window.localStorage.getItem(KEY) === "yes";
    } catch {
      // Storage unavailable (private mode): ask every visit.
    }
    setState(confirmed ? "ok" : "ask");
  }, []);

  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const open = state === "ask" || state === "under";
    document.body.style.overflow = open ? "hidden" : "";
    // While the gate is up, the page behind it cannot be tabbed to or clicked.
    const behind = document.querySelectorAll<HTMLElement>("body > header, body > main, body > footer, body > aside");
    behind.forEach((el) => {
      el.inert = open;
    });
    if (open) dialog.current?.querySelector<HTMLElement>("button")?.focus();
    // "ready" starts the hero animation once the gate is out of the way
    document.documentElement.classList.toggle("ready", state === "ok");
    return () => {
      document.body.style.overflow = "";
      behind.forEach((el) => {
        el.inert = false;
      });
    };
  }, [state]);

  if (state === "checking" || state === "ok") return null;

  function confirm() {
    try {
      window.localStorage.setItem(KEY, "yes");
    } catch {
      // ignore
    }
    setState("ok");
  }

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      className="night fixed inset-0 z-50 flex items-center justify-center p-5"
    >
      <div className="paper flex w-full max-w-md -rotate-1 flex-col items-start gap-5 rounded-xl border-2 border-usiku p-8 shadow-[8px_8px_0_var(--color-sukuma)]">
        <LogoMark size={52} />
        {state === "ask" ? (
          <>
            <p className="hand text-2xl text-pilipili">before you come in</p>
            <h2 id="age-title" className="sign text-6xl">
              Uko na miaka 18?
            </h2>
            <p>
              Tukate is about meeting up for a drink, so it is strictly for adults. Are you 18 or
              older?
            </p>
            <div className="flex w-full flex-col gap-3">
              <button type="button" onClick={confirm} className="press press-green w-full">
                Yes, I am 18 or older
              </button>
              <button type="button" onClick={() => setState("under")} className="press press-cream w-full">
                No, not yet
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="age-title" className="sign text-6xl">
              Bado kidogo.
            </h2>
            <p>
              Tukate is only for people aged 18 and over. Come back when you are, and the first
              soda is on us in spirit.
            </p>
            <button type="button" onClick={() => setState("ask")} className="press press-cream w-full">
              I tapped the wrong button
            </button>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const open = state === "ask" || state === "under";
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-usiku/95 p-5 backdrop-blur"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-plum-line bg-plum p-8 text-center">
        <LogoMark size={56} />
        {state === "ask" ? (
          <>
            <h2 id="age-title" className="text-3xl font-extrabold">
              Uko na miaka 18?
            </h2>
            <p className="text-sm text-muted">
              Tukate is about meeting up for drinks, so it is for adults only. Are you 18 or
              older?
            </p>
            <div className="flex w-full flex-col gap-3">
              <button type="button" onClick={confirm} className="btn btn-primary w-full">
                Yes, I am 18 or older
              </button>
              <button
                type="button"
                onClick={() => setState("under")}
                className="btn btn-ghost w-full"
              >
                No, I am under 18
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="age-title" className="text-3xl font-extrabold">
              Bado kidogo.
            </h2>
            <p className="text-sm text-muted">
              Tukate is only for people aged 18 and over. Come back when you are.
            </p>
            <button type="button" onClick={() => setState("ask")} className="btn btn-ghost w-full">
              I tapped the wrong button
            </button>
          </>
        )}
      </div>
    </div>
  );
}

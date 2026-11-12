"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One small script for all page motion:
// - [data-reveal] / [data-inview] get the class "in" when they scroll into view
// - [data-progress] gets --p (0 to 1) as it crosses the screen (drives the sunset)
// - [data-time] sections set the clock in the nav
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const watched = document.querySelectorAll<HTMLElement>("[data-reveal],[data-inview]");
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
      );
      watched.forEach((el) => io!.observe(el));
    } else {
      watched.forEach((el) => el.classList.add("in"));
    }

    const progress = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    const timed = Array.from(document.querySelectorAll<HTMLElement>("[data-time]"));
    const clock = document.getElementById("night-clock");
    const clockWrap = document.getElementById("night-clock-wrap");
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of progress) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -50 || rect.top > vh + 50) continue;
        const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
        el.style.setProperty("--p", p.toFixed(3));
      }
      if (clock && clockWrap) {
        let current = "";
        for (const el of timed) {
          if (el.getBoundingClientRect().top < vh * 0.55) current = el.dataset.time ?? "";
        }
        if (current && clock.textContent !== current) clock.textContent = current;
        clockWrap.hidden = !current;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}

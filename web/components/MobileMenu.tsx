"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

// Phone menu. Closes itself when a link is tapped or the page changes.
export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className="relative lg:hidden">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border-2 border-cream px-3 font-semibold [&::-webkit-details-marker]:hidden">
        Menu
      </summary>
      <nav
        aria-label="Mobile"
        className="absolute right-0 top-13 flex w-60 flex-col rounded-xl border-2 border-usiku bg-cream p-2 text-usiku shadow-[6px_6px_0_var(--color-sukuma)]"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (ref.current) ref.current.open = false;
            }}
            className="rounded-lg px-4 py-3 text-lg font-semibold hover:bg-mango"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}

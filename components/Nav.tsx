import Link from "next/link";
import { Logo } from "./Logo";
import { nav } from "@/lib/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-plum-line/60 bg-usiku/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Tukate home">
          <Logo size={30} />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/download" className="btn btn-primary px-5 py-2 text-sm">
            Get the app
          </Link>
          <details className="relative md:hidden">
            <summary
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full bg-plum text-cream [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M2 4.500h14M2 9h14M2 13.500h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 top-12 flex w-56 flex-col rounded-2xl border border-plum-line bg-plum p-2 shadow-xl"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-base font-medium text-cream hover:bg-usiku"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

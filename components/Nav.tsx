import Link from "next/link";
import { Logo } from "./Logo";
import { nav } from "@/lib/site";

export function Nav() {
  return (
    <header
      className="sticky z-40 border-b-2 border-usiku bg-usiku text-cream"
      style={{ top: 0, paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Tukate home">
            <Logo size={28} />
          </Link>
          {/* Story clock: follows the night as you scroll the homepage */}
          <span
            id="night-clock-wrap"
            hidden
            className="hand whitespace-nowrap text-2xl text-mango"
            aria-hidden="true"
          >
            Fri, <span id="night-clock">5:47 PM</span>
          </span>
        </div>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-[0.95rem] font-medium hover:text-mango">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            <Link
              href="/download"
              className="press press-green !px-4 !py-2 !text-[0.95rem]"
              style={{ ["--shadow" as string]: "var(--color-cream)" }}
            >
              Get the app
            </Link>
          </span>
          <details className="relative lg:hidden">
            <summary
              className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border-2 border-cream px-3 font-semibold [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              Menu
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 top-13 flex w-60 flex-col rounded-xl border-2 border-usiku bg-cream p-2 text-usiku shadow-[6px_6px_0_var(--color-sukuma)]"
            >
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-4 py-3 text-lg font-semibold hover:bg-mango">
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

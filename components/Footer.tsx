import Link from "next/link";
import { Logo } from "./Logo";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-plum-line/60 bg-usiku pb-24 pt-12 md:pb-12">
      <div className="container-x flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="flex max-w-xs flex-col gap-3">
            <Logo size={28} />
            <p className="text-sm text-muted">
              {site.slogan}. {site.tagline}
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-muted hover:text-cream">
                {item.label}
              </Link>
            ))}
            <Link href="/download" className="text-muted hover:text-cream">
              Get the app
            </Link>
          </nav>
        </div>
        <p className="rounded-2xl bg-plum px-5 py-4 text-sm text-cream">
          <strong className="text-mango">18+ only.</strong> Drink responsibly. Never drink and
          drive. Need to talk to someone? Call the {site.helpline.name} on{" "}
          <strong>{site.helpline.number}</strong>.
        </p>
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Tukate. Made in Nairobi.
        </p>
      </div>
    </footer>
  );
}

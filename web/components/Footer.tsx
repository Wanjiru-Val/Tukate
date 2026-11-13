import Link from "next/link";
import { Logo } from "./Logo";
import { legalNav, nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="night border-t-2 border-plum-line pb-28 pt-14 md:pb-14">
      <div className="wrap flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="flex max-w-sm flex-col gap-4">
            <Logo size={30} />
            <p className="text-cream/70">
              Made in Nairobi by people who have also been left on read at 5:47 on a Friday.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2 text-lg">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-mango">
                {item.label}
              </Link>
            ))}
            <Link href="/download" className="hover:text-mango">
              Get the app
            </Link>
          </nav>
          <nav aria-label="Legal" className="flex flex-col gap-2 text-lg">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-mango">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="max-w-3xl border-l-4 border-pilipili pl-5 text-cream/85">
          Tukate is for people aged 18 and over. Please drink responsibly, and never drink and
          drive. If drinking has stopped being fun for you or for someone close to you, the{" "}
          {site.helpline.name} is free to call on <strong>{site.helpline.number}</strong>.
        </p>
        <p className="text-sm text-cream/50">© {new Date().getFullYear()} Tukate</p>
      </div>
    </footer>
  );
}

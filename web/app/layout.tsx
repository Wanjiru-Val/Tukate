import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Reenie_Beanie } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AgeGate } from "@/components/AgeGate";
import { StickyCta } from "@/components/StickyCta";
import { Motion } from "@/components/Motion";
import { site } from "@/lib/site";

// Bricolage carries the whole site: condensed and heavy for signs, regular for reading.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});
// Handwriting for the margins.
const hand = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand-face",
  display: "swap",
});
// Inter is the app's UI font, so it is only used inside app screens.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} · ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: {
    title: `${site.slogan}. ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "en_KE",
  },
};

export const viewport: Viewport = {
  themeColor: "#121018",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${hand.variable} ${inter.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <Nav />
        <main>{children}</main>
        <Footer />
        <StickyCta />
        <AgeGate />
        <Motion />
      </body>
    </html>
  );
}

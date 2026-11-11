import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AgeGate } from "@/components/AgeGate";
import { StickyCta } from "@/components/StickyCta";
import { site } from "@/lib/site";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
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
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <StickyCta />
        <AgeGate />
      </body>
    </html>
  );
}

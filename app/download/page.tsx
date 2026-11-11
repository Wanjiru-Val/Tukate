import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StoreButtons } from "@/components/StoreButtons";
import { MatchPhone } from "@/components/Phone";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get the app",
  description: "Download Tukate for iPhone and Android.",
};

export default function Download() {
  const live = Boolean(site.appStoreUrl || site.playStoreUrl);
  return (
    <>
      <PageHeader
        eyebrow="Get the app"
        title="Ingia Tukate."
        lede={
          live
            ? "Download the app and find someone nearby to cheers with."
            : "The app is not in the stores yet. The download links will appear here as soon as it is."
        }
      />
      <section className="container-x flex flex-col items-start gap-12 pb-20 md:flex-row md:items-center md:justify-between">
        <StoreButtons />
        <MatchPhone />
      </section>
    </>
  );
}

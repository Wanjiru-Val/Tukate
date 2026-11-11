import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StoreButtons } from "@/components/StoreButtons";
import { Cups } from "@/components/Cups";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get the app",
  description: "Download Tukate for iPhone and Android.",
};

export default function Download() {
  const live = Boolean(site.appStoreUrl || site.playStoreUrl);
  return (
    <div className="paper">
      <PageHeader note={live ? "it is one tap from here" : "almost, almost"} title="Ingia Tukate.">
        {live ? (
          <p>Pick your store, set your Base and your Kinywaji, and go and find somebody to cheers with.</p>
        ) : (
          <p>
            The app is not in the stores just yet. We are still putting the finishing touches on
            it. The two buttons below will turn into download links the day it goes live.
          </p>
        )}
      </PageHeader>
      <section className="wrap flex flex-col items-start gap-16 pb-28 md:flex-row md:items-end md:justify-between">
        <StoreButtons />
        <Cups className="w-56 self-center sm:w-72 md:mr-16" />
      </section>
    </div>
  );
}

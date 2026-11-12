import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { VenueForm } from "@/components/VenueForm";

export const metadata: Metadata = {
  title: "For venues",
  description: "List your bar, rooftop or lounge as a place where Tukate matches meet.",
};

export default function Venues() {
  return (
    <div className="paper">
      <PageHeader note="for bars, rooftops, lounges and locals" title="Be where the first round gets bought.">
        <p>
          Every Tukate match ends the same way: two people who have just met need somewhere public
          to sit down, and they would like it to be good. We keep a list of those places. If you
          run one in Nairobi, we would like yours on it.
        </p>
      </PageHeader>
      <section className="wrap grid gap-14 pb-28 lg:grid-cols-[1fr_1.05fr]">
        <div className="prose-tk flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="head text-3xl">What you get</h2>
            <p>
              New faces through the door, in pairs for now and in whole crews once Mbogi Mode
              arrives. They come with a reason to stay for more than one.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="head text-3xl">What we ask</h2>
            <p>
              That you look after people. Tukate only works if a first meetup feels safe, so we
              care about staff who notice things, decent lighting, and a door that will call
              someone a cab.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="head text-3xl">What happens next</h2>
            <p>Fill in the form and one of us will call you. That is the whole process for now.</p>
          </div>
        </div>
        <VenueForm />
      </section>
    </div>
  );
}

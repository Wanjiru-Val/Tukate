import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { VenueForm } from "@/components/VenueForm";

export const metadata: Metadata = {
  title: "For venues",
  description: "List your bar, rooftop or lounge as a Tukate meetup spot.",
};

const reasons = [
  {
    title: "New faces through the door",
    body: "Tukate matches need somewhere public to meet. Your venue can be where they go.",
  },
  {
    title: "A safer first meetup",
    body: "Every Tukate meetup happens in public. Venues that look after their guests are the heart of that.",
  },
  {
    title: "Simple to join",
    body: "Tell us about your venue below and we will get in touch.",
  },
];

export default function Venues() {
  return (
    <>
      <PageHeader
        eyebrow="For venues"
        title="Be where the cheers happens."
        lede="Run a bar, rooftop, lounge or restaurant in Nairobi? List it as a Tukate meetup spot."
      />
      <section className="container-x grid gap-10 pb-20 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col gap-1.5 border-l-4 border-sukuma pl-5">
              <h2 className="text-2xl font-extrabold">{reason.title}</h2>
              <p className="max-w-[55ch] text-sm leading-relaxed text-muted">{reason.body}</p>
            </div>
          ))}
        </div>
        <VenueForm />
      </section>
    </>
  );
}

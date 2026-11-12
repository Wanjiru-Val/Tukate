import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Questions } from "@/components/Questions";
import { counterQuestions, moreQuestions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Help",
  description: "Answers to the questions people ask about Tukate.",
};

export default function Help() {
  return (
    <div className="night">
      <PageHeader note="maswali?" title="Ask us anything.">
        <p className="text-cream/85">
          These are the questions we get most, answered the way we would answer them across a
          counter.
        </p>
      </PageHeader>
      <section className="wrap flex flex-col gap-14 pb-28">
        <Questions items={[...counterQuestions, ...moreQuestions]} />
        <p className="text-lg text-cream/85">
          For advice on meeting up, read the{" "}
          <Link href="/safety" className="link-tk text-mango">
            safety guide
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

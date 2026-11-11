import type { Question } from "@/lib/content";

export function Questions({ items }: { items: Question[] }) {
  return (
    <dl className="grid gap-x-14 gap-y-10 md:grid-cols-2">
      {items.map((item, i) => (
        <div key={item.q} data-reveal style={{ ["--delay" as string]: `${(i % 2) * 0.08}s` }} className="flex flex-col gap-2">
          <dt className="hand text-4xl text-mango">{item.q}</dt>
          <dd className="max-w-[32rem] text-lg text-cream/85">{item.a}</dd>
        </div>
      ))}
    </dl>
  );
}

export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details key={item.q} className="group rounded-2xl bg-plum px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="text-2xl leading-none text-sukuma transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

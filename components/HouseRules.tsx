import { rules } from "@/lib/content";

// Styled after the hand-painted rules board you find behind a bar counter.
export function HouseRules() {
  return (
    <div className="paper relative -rotate-1 rounded-md border-2 border-usiku p-2 shadow-[6px_6px_0_var(--color-pilipili)] sm:shadow-[10px_10px_0_var(--color-pilipili)]">
      <div className="border-4 border-double border-pilipili px-5 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-1 text-center">
          <h2 className="sign text-6xl text-pilipili shadow-sign-ink sm:text-8xl">Sheria za nyumba</h2>
          <p className="hand text-3xl">house rules, and we mean them</p>
        </div>
        <ol className="mt-8 grid gap-x-12 gap-y-7 md:grid-cols-2">
          {rules.map((rule, i) => (
            <li key={rule.sw} className="flex gap-4">
              <span className="sign w-10 shrink-0 text-5xl text-sukuma shadow-sign-ink">{i + 1}</span>
              <div className="flex flex-col gap-1">
                <h3 className="head text-2xl">{rule.sw}</h3>
                <p className="text-usiku/80">{rule.en}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

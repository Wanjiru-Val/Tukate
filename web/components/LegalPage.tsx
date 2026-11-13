import { site } from "@/lib/site";

export type LegalSection = { title: string; body: (string | string[])[] };

// Shared layout for the privacy policy, terms and community guidelines.
export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <div className="paper">
      <article className="wrap flex max-w-3xl flex-col gap-10 pb-28 pt-14 md:pt-20" style={{ marginInline: "auto" }}>
        <header className="flex flex-col gap-4">
          <p className="hand text-3xl text-cup-ridge">last updated {site.legalUpdated}</p>
          <h1 className="sign text-[clamp(3rem,9vw,6.5rem)]">{title}</h1>
          <p className="prose-tk">{intro}</p>
          <p className="max-w-[34rem] border-l-4 border-mango pl-4 text-sm">
            This is a working draft written for launch preparation. It should be reviewed by a
            lawyer familiar with Kenyan law before Tukate opens to the public.
          </p>
        </header>
        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2 className="head text-3xl">{section.title}</h2>
            {section.body.map((block, i) =>
              Array.isArray(block) ? (
                <ul key={i} className="prose-tk flex list-disc flex-col gap-2 pl-6">
                  {block.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="prose-tk">
                  {block}
                </p>
              ),
            )}
          </section>
        ))}
        <section className="flex flex-col gap-3">
          <h2 className="head text-3xl">Contact</h2>
          <p className="prose-tk">
            {site.contactEmail
              ? `Questions or requests about any of this: ${site.contactEmail}.`
              : "A contact address for questions and requests will be published here before launch."}
          </p>
        </section>
      </article>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="container-x flex flex-col gap-4 pb-10 pt-14 md:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="max-w-3xl text-5xl font-extrabold leading-[1] tracking-tight sm:text-6xl">
        {title}
      </h1>
      {lede ? <p className="max-w-xl text-lg text-muted">{lede}</p> : null}
    </section>
  );
}

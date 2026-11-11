export function PageHeader({ note, title, children }: { note: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="wrap flex flex-col gap-5 pb-12 pt-14 md:pt-20">
      <p className="hand text-3xl text-pilipili">{note}</p>
      <h1 className="sign max-w-5xl text-[clamp(3.4rem,11vw,8.5rem)]">{title}</h1>
      {children ? <div className="prose-tk flex flex-col gap-4">{children}</div> : null}
    </section>
  );
}

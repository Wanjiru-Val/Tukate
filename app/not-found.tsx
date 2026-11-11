import Link from "next/link";

export default function NotFound() {
  return (
    <section className="paper">
      <div className="wrap flex flex-col items-start gap-6 py-28">
        <p className="hand text-4xl text-pilipili">404, wrong stage</p>
        <h1 className="sign text-[clamp(4rem,14vw,10rem)]">Umepotea?</h1>
        <p className="prose-tk">
          This page does not exist. It may have gone home early. The rest of the night is still on.
        </p>
        <Link href="/" className="press press-green">
          Take me back
        </Link>
      </div>
    </section>
  );
}

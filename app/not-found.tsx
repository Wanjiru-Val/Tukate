import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-start gap-5 py-28">
      <p className="eyebrow">404</p>
      <h1 className="text-5xl font-extrabold sm:text-6xl">Umepotea?</h1>
      <p className="text-muted">That page does not exist.</p>
      <Link href="/" className="btn btn-primary">
        Back home
      </Link>
    </section>
  );
}

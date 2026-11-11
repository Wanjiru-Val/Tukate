import Link from "next/link";

// Phone-only bar pinned to the bottom of every page.
export function StickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-plum-line/60 bg-usiku/95 px-5 pt-3 backdrop-blur md:hidden"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <Link href="/download" className="btn btn-primary w-full">
        Get the app
      </Link>
    </div>
  );
}

import Link from "next/link";

// Phone-only bar pinned to the bottom of every page.
export function StickyCta() {
  return (
    <div
      className="on-dark fixed inset-x-0 bottom-0 z-30 border-t-2 border-plum-line bg-usiku px-5 pt-3 sm:hidden"
      style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom))" }}
    >
      <Link href="/download" className="press press-green w-full">
        Get the app
      </Link>
    </div>
  );
}

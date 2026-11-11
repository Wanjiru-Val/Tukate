import { site } from "@/lib/site";

function StoreButton({ url, store }: { url: string; store: string }) {
  if (!url) {
    return (
      <span className="inline-flex flex-col rounded-2xl border-2 border-plum-line bg-plum px-5 py-2.5 leading-tight">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-mango">
          Coming soon
        </span>
        <span className="text-base font-bold text-cream">{store}</span>
      </span>
    );
  }
  return (
    <a
      href={url}
      className="inline-flex flex-col rounded-2xl bg-cream px-5 py-2.5 leading-tight text-usiku transition-transform hover:-translate-y-0.5"
    >
      <span className="text-[11px] font-semibold uppercase tracking-widest">
        Get it on
      </span>
      <span className="text-base font-bold">{store}</span>
    </a>
  );
}

export function StoreButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <StoreButton url={site.appStoreUrl} store="App Store" />
      <StoreButton url={site.playStoreUrl} store="Google Play" />
    </div>
  );
}

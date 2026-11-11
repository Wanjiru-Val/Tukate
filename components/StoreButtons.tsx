import { site } from "@/lib/site";

function StoreButton({ url, store }: { url: string; store: string }) {
  const inner = (
    <span className="flex flex-col items-start text-left leading-tight">
      <span className="hand text-lg text-pilipili">{url ? "get it on" : "coming soon to"}</span>
      <span>{store}</span>
    </span>
  );
  if (!url) {
    return (
      <span className="press press-cream" aria-disabled="true">
        {inner}
      </span>
    );
  }
  return (
    <a href={url} className="press press-cream">
      {inner}
    </a>
  );
}

export function StoreButtons() {
  return (
    <div className="flex flex-wrap gap-4">
      <StoreButton url={site.appStoreUrl} store="App Store" />
      <StoreButton url={site.playStoreUrl} store="Google Play" />
    </div>
  );
}

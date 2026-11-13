import { useEffect, useState } from "react";
import { backend } from "./backend";

// Resolves a private photo path to a link the Image component can show.
export function usePhoto(path: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    setUrl(null);
    if (path) backend.getPhotoUrl(path).then((u) => { if (alive) setUrl(u); }).catch(() => {});
    return () => { alive = false; };
  }, [path]);
  return url;
}

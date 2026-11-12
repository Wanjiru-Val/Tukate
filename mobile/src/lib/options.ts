// The choices people make on their profile. The keys match the database.
export const AREAS = [
  "Kilimani", "Westlands", "Kileleshwa", "CBD", "Lavington", "Karen",
  "South B", "South C", "Langata", "Ngong Road", "Parklands", "Roysambu",
] as const;

export const DRINK_TYPES = [
  { key: "beer", label: "Beer" },
  { key: "cider", label: "Cider" },
  { key: "whisky", label: "Whisky" },
  { key: "vodka", label: "Vodka" },
  { key: "gin", label: "Gin" },
  { key: "rum", label: "Rum" },
  { key: "wine", label: "Wine" },
  { key: "cocktails", label: "Cocktails" },
  { key: "no_alcohol", label: "No alcohol" },
] as const;

export const DRINKING_TYPES = [
  { key: "one_or_two", label: "One or two", hint: "Home by ten" },
  { key: "social", label: "Social", hint: "A proper evening" },
  { key: "all_night", label: "All night", hint: "We close the place" },
] as const;

export const PARTY_STYLES = [
  { key: "quiet_local", label: "Quiet local" },
  { key: "rooftop", label: "Rooftop" },
  { key: "nyama_choma", label: "Nyama choma" },
  { key: "live_music", label: "Live music" },
  { key: "club", label: "Club" },
  { key: "house_party", label: "House party" },
] as const;

export function labelOf(list: readonly { key: string; label: string }[], key: string) {
  return list.find((x) => x.key === key)?.label ?? key;
}

export function distanceText(m: number | null | undefined) {
  if (m == null) return "";
  if (m < 100) return "Under 100m away";
  if (m < 1000) return `${m}m away`;
  return `${(m / 1000).toFixed(m < 10000 ? 1 : 0)}km away`;
}

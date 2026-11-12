// The questions that make up a profile. Used when signing up and when editing.
import { View } from "react-native";
import { AREAS, DRINK_TYPES, DRINKING_TYPES, PARTY_STYLES } from "@/lib/options";
import { Chip, Field, Label } from "./kit";

export type ProfileDraft = {
  base: string;
  kinywaji: string;
  drink_type: string;
  drinking_type: string;
  party_style: string;
  bio: string;
};

export const emptyDraft: ProfileDraft = { base: "", kinywaji: "", drink_type: "", drinking_type: "", party_style: "", bio: "" };

export function draftComplete(d: ProfileDraft) {
  return Boolean(d.base && d.kinywaji.trim().length >= 2 && d.drink_type && d.drinking_type && d.party_style);
}

function Choice({ label, options, value, onChange }: { label: string; options: readonly { key: string; label: string }[]; value: string; onChange: (k: string) => void }) {
  return (
    <View style={{ gap: 8 }} accessibilityRole="radiogroup" accessibilityLabel={label}>
      <Label>{label}</Label>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {options.map((o) => (
          <Chip key={o.key} label={o.label} selected={value === o.key} onPress={() => onChange(o.key)} />
        ))}
      </View>
    </View>
  );
}

export function ProfileForm({ value, onChange }: { value: ProfileDraft; onChange: (d: ProfileDraft) => void }) {
  const set = (patch: Partial<ProfileDraft>) => onChange({ ...value, ...patch });
  return (
    <View style={{ gap: 22 }}>
      <Choice label="Base: where do you usually hang out?" options={AREAS.map((a) => ({ key: a, label: a }))} value={value.base} onChange={(base) => set({ base })} />
      <Field
        label="Kinywaji: what do you order without looking at the menu?"
        value={value.kinywaji}
        onChangeText={(kinywaji) => set({ kinywaji })}
        maxLength={40}
        placeholder="Pineapple cider"
      />
      <Choice label="Which kind of drink is that?" options={DRINK_TYPES} value={value.drink_type} onChange={(drink_type) => set({ drink_type })} />
      <Choice label="What kind of drinker are you?" options={DRINKING_TYPES} value={value.drinking_type} onChange={(drinking_type) => set({ drinking_type })} />
      <Choice label="Your kind of night out" options={PARTY_STYLES} value={value.party_style} onChange={(party_style) => set({ party_style })} />
      <Field
        label="One line about you (optional)"
        value={value.bio}
        onChangeText={(bio) => set({ bio })}
        maxLength={160}
        multiline
        placeholder="Arsenal fan, so I am used to disappointment."
        hint={`${value.bio.length}/160`}
        style={{ minHeight: 84, textAlignVertical: "top" }}
      />
    </View>
  );
}

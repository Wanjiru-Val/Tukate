import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { backend } from "@/lib/backend";
import { useSession } from "@/lib/session";
import { friendly } from "@/lib/types";
import { Body, Field, Hand, Head, Label, Notice, Press, Screen } from "@/ui/kit";
import { ProfileForm, draftComplete, emptyDraft, type ProfileDraft } from "@/ui/ProfileForm";

function parseBirthDate(d: string, m: string, y: string): { iso: string | null; error: string } {
  const day = Number(d), month = Number(m), year = Number(y);
  if (!d || !m || y.length < 4) return { iso: null, error: "" };
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || year < 1900) {
    return { iso: null, error: "That does not look like a real date." };
  }
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  if (date > cutoff) return { iso: null, error: "Tukate is only for people aged 18 and over." };
  return { iso: date.toISOString().slice(0, 10), error: "" };
}

export default function Onboarding() {
  const { setProfile } = useSession();
  const [name, setName] = useState("");
  const [d, setD] = useState("");
  const [m, setM] = useState("");
  const [y, setY] = useState("");
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const birth = parseBirthDate(d, m, y);
  const ready = name.trim().length >= 2 && birth.iso && draftComplete(draft);
  const digits = (set: (v: string) => void, max: number) => (t: string) => set(t.replace(/\D/g, "").slice(0, max));

  async function save() {
    if (!birth.iso) return;
    setBusy(true);
    setError("");
    try {
      const created = await backend.createProfile({
        display_name: name.trim(),
        birth_date: birth.iso,
        ...draft,
        kinywaji: draft.kinywaji.trim(),
        bio: draft.bio.trim(),
        photo_path: null,
      });
      setProfile(created);
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 28, gap: 22 }}>
          <View style={{ gap: 8 }}>
            <Hand>two minutes, then you are in</Hand>
            <Head>Set up your card</Head>
            <Body>This is what people see when you come up in their deck.</Body>
          </View>

          <Field label="First name" value={name} onChangeText={setName} maxLength={30} autoComplete="given-name" placeholder="Wanjiku" />

          <View style={{ gap: 6 }}>
            <Label>Date of birth</Label>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}><Field label="Day" value={d} onChangeText={digits(setD, 2)} keyboardType="number-pad" placeholder="DD" /></View>
              <View style={{ flex: 1 }}><Field label="Month" value={m} onChangeText={digits(setM, 2)} keyboardType="number-pad" placeholder="MM" /></View>
              <View style={{ flex: 1.4 }}><Field label="Year" value={y} onChangeText={digits(setY, 4)} keyboardType="number-pad" placeholder="YYYY" /></View>
            </View>
            {birth.error ? <Notice text={birth.error} /> : (
              <Body style={{ fontSize: 13 }}>Only your age is shown to others. It cannot be changed later.</Body>
            )}
          </View>

          <ProfileForm value={draft} onChange={setDraft} />

          {error ? <Notice text={error} /> : null}
          <Press title="Finish and start swiping" onPress={save} disabled={!ready} busy={busy} />
          <Pressable accessibilityRole="button" onPress={() => backend.signOut()} style={{ minHeight: 44, justifyContent: "center" }}>
            <Body style={{ textDecorationLine: "underline" }}>Sign out</Body>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

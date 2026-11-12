import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { backend } from "@/lib/backend";
import { DRINKING_TYPES, PARTY_STYLES, labelOf } from "@/lib/options";
import { isPlus, useSession } from "@/lib/session";
import { colors, fonts, plan } from "@/lib/theme";
import { friendly } from "@/lib/types";
import { Drink, Pattern } from "@/ui/art";
import { Body, Hand, Head, Notice, Press, Screen } from "@/ui/kit";
import { ProfileForm, draftComplete, type ProfileDraft } from "@/ui/ProfileForm";

export default function Me() {
  const { profile, setProfile } = useSession();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!profile) return null;
  const plus = isPlus(profile);
  const photo = backend.photoUrl(profile.photo_path);

  function startEdit() {
    if (!profile) return;
    setDraft({
      base: profile.base, kinywaji: profile.kinywaji, drink_type: profile.drink_type,
      drinking_type: profile.drinking_type, party_style: profile.party_style, bio: profile.bio,
    });
    setEditing(true);
  }
  async function save() {
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      setProfile(await backend.updateProfile({ ...draft, kinywaji: draft.kinywaji.trim(), bio: draft.bio.trim() }));
      setEditing(false);
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  }
  async function pickPhoto() {
    setError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [4, 5], quality: 0.7 });
      if (result.canceled || !result.assets[0]) return;
      setBusy(true);
      const path = await backend.uploadPhoto(result.assets[0].uri);
      setProfile(await backend.updateProfile({ photo_path: path }));
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  }

  if (editing && draft) {
    return (
      <Screen>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 20, gap: 20 }}>
          <Head>Edit your card</Head>
          <ProfileForm value={draft} onChange={setDraft} />
          {error ? <Notice text={error} /> : null}
          <Press title="Save" onPress={save} disabled={!draftComplete(draft)} busy={busy} />
          <Press title="Cancel" color="cream" onPress={() => setEditing(false)} />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingVertical: 20, gap: 22, paddingRight: 4 }}>
        <View style={{ gap: 4 }}>
          <Hand>this is your card</Hand>
          <Head>{profile.display_name}</Head>
        </View>

        <View style={s.card}>
          <Pattern seed={profile.id} style={s.top}>
            {photo ? <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="cover" /> : <Drink type={profile.drink_type} size={130} />}
          </Pattern>
          <View style={{ padding: 14, gap: 6 }}>
            <Text style={s.meta}>Base: {profile.base}</Text>
            <Text style={[s.meta, { color: colors.cupRidge }]}>Kinywaji: {profile.kinywaji}</Text>
            <Text style={s.meta}>{labelOf(DRINKING_TYPES, profile.drinking_type)} · {labelOf(PARTY_STYLES, profile.party_style)}</Text>
            {profile.bio ? <Body style={{ color: colors.inkSoft }}>{profile.bio}</Body> : null}
          </View>
        </View>
        {error ? <Notice text={error} /> : null}
        <View style={{ flexDirection: "row", gap: 14 }}>
          <Press title="Edit card" color="cream" style={{ flex: 1 }} onPress={startEdit} />
          <Press title={photo ? "Change photo" : "Add a photo"} color="cream" style={{ flex: 1 }} busy={busy} onPress={pickPhoto} />
        </View>

        <View style={[s.plan, { backgroundColor: plus ? colors.sukuma : colors.mango }]}>
          <Text style={s.planName}>{plus ? plan.name : "Free"}</Text>
          <Body>
            {plus
              ? "No daily limit, and you can filter by drink, drinking type and party style."
              : `${plan.freeSwipesPerDay} swipes a day, no filters. ${plan.name} is ${plan.currency} ${plan.price} a month.`}
          </Body>
          <Press title={plus ? "Manage plan" : `See ${plan.name}`} color="cream" onPress={() => router.push("/plus")} />
        </View>

        <Press title="House rules and safety" color="cream" onPress={() => router.push("/safety")} />
        <Press title="Sign out" color="cream" onPress={() => backend.signOut()} />

        {confirmDelete ? (
          <View style={{ gap: 12, borderWidth: 2, borderColor: colors.cupRidge, borderRadius: 12, padding: 14 }}>
            <Head style={{ fontSize: 20, lineHeight: 24 }}>Delete your account?</Head>
            <Body>This removes your card, your matches and your chats for good. It cannot be undone.</Body>
            <Press title="Yes, delete everything" color="red" onPress={async () => {
              try { await backend.deleteAccount(); } catch (e) { setError(friendly(e)); }
            }} />
            <Press title="Keep my account" color="cream" onPress={() => setConfirmDelete(false)} />
          </View>
        ) : (
          <Press title="Delete my account" color="cream" onPress={() => setConfirmDelete(true)} />
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { borderWidth: 2, borderColor: colors.usiku, borderRadius: 16, overflow: "hidden", backgroundColor: colors.white },
  top: { height: 170, borderBottomWidth: 2, borderColor: colors.usiku, alignItems: "center", justifyContent: "flex-end" },
  meta: { fontFamily: fonts.uiSemi, fontSize: 15, color: colors.usiku },
  plan: { borderWidth: 2, borderColor: colors.usiku, borderRadius: 14, padding: 16, gap: 12 },
  planName: { fontFamily: fonts.sign, fontSize: 34, letterSpacing: -1, textTransform: "uppercase", color: colors.usiku },
});

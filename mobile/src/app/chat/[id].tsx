import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { backend } from "@/lib/backend";
import { useSession } from "@/lib/session";
import { colors, fonts } from "@/lib/theme";
import { friendly, type Message, type ReportReason } from "@/lib/types";
import { Body, Head, Notice, Press, Screen } from "@/ui/kit";

const REASONS: { key: ReportReason; label: string }[] = [
  { key: "harassment", label: "Harassment or threats" },
  { key: "fake_profile", label: "Fake profile" },
  { key: "underage", label: "Looks under 18" },
  { key: "unsafe_meetup", label: "Unsafe behaviour at a meetup" },
  { key: "other", label: "Something else" },
];

export default function Chat() {
  const { id, name, other } = useLocalSearchParams<{ id: string; name?: string; other?: string }>();
  const { userId } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [menu, setMenu] = useState<"closed" | "open" | "report" | "block">("closed");
  const list = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    backend.getMessages(id).then((m) => { if (alive) setMessages(m); }).catch((e) => setError(friendly(e)));
    const off = backend.subscribeMessages(id, (m) => {
      setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
    });
    return () => { alive = false; off(); };
  }, [id]);

  async function send(body: string) {
    const clean = body.trim();
    if (!clean || !id) return;
    setText("");
    setError("");
    try {
      await backend.sendMessage(id, clean);
      if (backend.mode === "live") setMessages(await backend.getMessages(id));
    } catch (e) {
      setText(clean);
      setError(friendly(e));
    }
  }

  // Sends your current position to a friend outside the app, using the phone's share sheet.
  async function shareLocation() {
    setMenu("closed");
    setNote("");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setNote("Location is switched off for Tukate. Turn it on in your phone settings to share where you are.");
        return;
      }
      const here = await Location.getCurrentPositionAsync({});
      const link = `https://maps.google.com/?q=${here.coords.latitude},${here.coords.longitude}`;
      await Share.share({ message: `I am meeting ${name ?? "someone"} from Tukate. This is where I am: ${link}` });
    } catch {
      setNote("We could not get your location just now. Try again in a moment.");
    }
  }

  async function report(reason: ReportReason) {
    if (!other) return;
    try {
      await backend.reportUser(other, reason, "");
      setMenu("closed");
      setNote("Thank you. Your report has been sent to the Tukate team.");
    } catch (e) {
      setError(friendly(e));
    }
  }
  async function block() {
    if (!other) return;
    try {
      await backend.blockUser(other);
      router.back();
    } catch (e) {
      setError(friendly(e));
    }
  }

  return (
    <Screen style={{ paddingHorizontal: 0 }}>
      <View style={s.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={s.hbtn}>
          <Text style={s.hbtnText}>‹ Back</Text>
        </Pressable>
        <Text style={s.title} numberOfLines={1}>{name ?? "Chat"}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Safety options" onPress={() => setMenu(menu === "closed" ? "open" : "closed")} style={s.hbtn}>
          <Text style={s.hbtnText}>Safety</Text>
        </Pressable>
      </View>

      {menu !== "closed" ? (
        <View style={s.menu}>
          {menu === "open" ? (
            <>
              <Press title="Share my location with a friend" color="green" small onPress={shareLocation} />
              <Press title={`Report ${name ?? "this person"}`} color="cream" small onPress={() => setMenu("report")} />
              <Press title={`Block ${name ?? "this person"}`} color="red" small onPress={() => setMenu("block")} />
            </>
          ) : menu === "report" ? (
            <>
              <Head style={{ fontSize: 20, lineHeight: 24 }}>What happened?</Head>
              {REASONS.map((r) => <Press key={r.key} title={r.label} color="cream" small onPress={() => report(r.key)} />)}
              <Press title="Cancel" color="cream" small onPress={() => setMenu("closed")} />
            </>
          ) : (
            <>
              <Head style={{ fontSize: 20, lineHeight: 24 }}>Block {name ?? "this person"}?</Head>
              <Body>This ends the match and deletes the chat for both of you. They will not be told, and you will not see each other again.</Body>
              <Press title="Yes, block" color="red" small onPress={block} />
              <Press title="Cancel" color="cream" small onPress={() => setMenu("closed")} />
            </>
          )}
        </View>
      ) : null}

      <View style={s.rule}>
        <Text style={s.ruleText}>Kutana mahali pa umma. Meet somewhere public, and tell a friend where you are.</Text>
      </View>
      {note ? <View style={{ padding: 12 }}><Notice text={note} tone="info" /></View> : null}
      {error ? <View style={{ padding: 12 }}><Notice text={error} /></View> : null}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
        <FlatList
          ref={list}
          data={messages}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={{ padding: 16, gap: 8, flexGrow: 1, justifyContent: "flex-end" }}
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={<Body style={{ textAlign: "center", color: colors.inkSoft }}>No messages yet. “Form ni gani?” is a perfectly good opener.</Body>}
          renderItem={({ item }) => {
            const mine = item.sender === userId;
            return (
              <View style={[s.bubble, mine ? s.mine : s.theirs]}>
                <Text style={s.bubbleText}>{item.body}</Text>
              </View>
            );
          }}
        />
        <View style={s.composer}>
          <TextInput
            accessibilityLabel="Message"
            value={text}
            onChangeText={setText}
            placeholder="Write a message"
            placeholderTextColor="rgba(18,16,24,0.4)"
            maxLength={1000}
            multiline
            style={s.input}
          />
          <Press title="Send" small disabled={!text.trim()} onPress={() => send(text)} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8, borderBottomWidth: 2, borderColor: colors.usiku, minHeight: 56 },
  hbtn: { minHeight: 44, minWidth: 64, justifyContent: "center", paddingHorizontal: 8 },
  hbtnText: { fontFamily: fonts.uiSemi, fontSize: 15, color: colors.usiku },
  title: { fontFamily: fonts.head, fontSize: 21, color: colors.usiku, flex: 1, textAlign: "center" },
  menu: { padding: 14, paddingRight: 18, gap: 12, borderBottomWidth: 2, borderColor: colors.usiku, backgroundColor: colors.paper },
  rule: { backgroundColor: colors.usiku, paddingVertical: 8, paddingHorizontal: 14 },
  ruleText: { fontFamily: fonts.uiMedium, fontSize: 12.5, color: colors.cream, textAlign: "center" },
  bubble: { maxWidth: "82%", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 2, borderColor: colors.usiku },
  mine: { alignSelf: "flex-end", backgroundColor: colors.sukuma, borderBottomRightRadius: 4 },
  theirs: { alignSelf: "flex-start", backgroundColor: colors.white, borderBottomLeftRadius: 4 },
  bubbleText: { fontFamily: fonts.ui, fontSize: 16, lineHeight: 22, color: colors.usiku },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: 10, padding: 12, paddingRight: 16, borderTopWidth: 2, borderColor: colors.usiku, backgroundColor: colors.cream },
  input: { flex: 1, maxHeight: 120, minHeight: 44, borderWidth: 2, borderColor: colors.usiku, borderRadius: 10, backgroundColor: colors.white, paddingHorizontal: 12, paddingVertical: 10, fontFamily: fonts.ui, fontSize: 16, color: colors.usiku },
});

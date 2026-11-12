import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { backend } from "@/lib/backend";
import { useSession } from "@/lib/session";
import { colors, fonts } from "@/lib/theme";
import { friendly, type MatchRow } from "@/lib/types";
import { Body, Hand, Head, Notice, Screen } from "@/ui/kit";

export default function Matches() {
  const { userId } = useSession();
  const [rows, setRows] = useState<MatchRow[] | null>(null);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      backend.getMatches()
        .then((r) => { if (alive) { setRows(r); setError(""); } })
        .catch((e) => { if (alive) setError(friendly(e)); });
      return () => { alive = false; };
    }, []),
  );

  return (
    <Screen>
      <View style={{ paddingTop: 12, paddingBottom: 14, gap: 4 }}>
        <Hand>form imeshika</Hand>
        <Head>Your matches</Head>
      </View>
      {error ? <Notice text={error} /> : null}
      {rows === null && !error ? (
        <ActivityIndicator color={colors.usiku} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={rows ?? []}
          keyExtractor={(r) => r.match_id}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          ListEmptyComponent={
            <View style={{ gap: 8, paddingTop: 24 }}>
              <Head style={{ fontSize: 24, lineHeight: 28 }}>Nothing yet.</Head>
              <Body>When you and someone else both say cheers, they show up here and you can start talking.</Body>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Chat with ${item.display_name}`}
              onPress={() => router.push({ pathname: "/chat/[id]", params: { id: item.match_id, name: item.display_name, other: item.other_id } })}
              style={s.row}
            >
              <View style={s.avatar}><Text style={s.initial}>{item.display_name.slice(0, 1)}</Text></View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={s.name}>{item.display_name}, {item.age}</Text>
                <Text style={s.preview} numberOfLines={1}>
                  {item.last_message
                    ? `${item.last_sender === userId ? "You: " : ""}${item.last_message}`
                    : `Base: ${item.base} · Kinywaji: ${item.kinywaji}`}
                </Text>
              </View>
              {!item.last_message ? <Text style={s.new}>Say hi</Text> : null}
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 2, borderColor: colors.usiku, borderRadius: 14, padding: 12, backgroundColor: colors.white, minHeight: 72 },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.usiku, backgroundColor: colors.mango, alignItems: "center", justifyContent: "center" },
  initial: { fontFamily: fonts.sign, fontSize: 24, color: colors.usiku },
  name: { fontFamily: fonts.head, fontSize: 19, color: colors.usiku },
  preview: { fontFamily: fonts.ui, fontSize: 14, color: colors.inkSoft },
  new: { fontFamily: fonts.uiBold, fontSize: 12, color: colors.usiku, backgroundColor: colors.sukuma, borderWidth: 2, borderColor: colors.usiku, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, overflow: "hidden" },
});

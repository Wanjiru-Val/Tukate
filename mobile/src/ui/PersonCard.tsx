import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { backend } from "@/lib/backend";
import { DRINKING_TYPES, PARTY_STYLES, distanceText, labelOf } from "@/lib/options";
import { colors, fonts } from "@/lib/theme";
import type { Card } from "@/lib/types";
import { Drink, Pattern } from "./art";

export function PersonCard({ card }: { card: Card }) {
  const photo = backend.photoUrl(card.photo_path);
  return (
    <View style={s.card} accessible accessibilityLabel={`${card.display_name}, ${card.age}. Base ${card.base}. Kinywaji ${card.kinywaji}. ${card.bio}`}>
      <Pattern seed={card.id} style={s.top}>
        {photo ? (
          <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <View style={s.drink}><Drink type={card.drink_type} size={170} /></View>
        )}
        <View style={s.badges}>
          {card.distance_m != null ? <Text style={s.badge}>{distanceText(card.distance_m)}</Text> : <View />}
          {card.liked_you ? <Text style={[s.badge, { backgroundColor: colors.pilipili }]}>Super Liked you</Text> : null}
        </View>
      </Pattern>
      <View style={s.body}>
        <Text style={s.name} numberOfLines={1}>{card.display_name}, {card.age}</Text>
        <Text style={s.meta}>
          Base: {card.base}  <Text style={{ color: colors.cupRidge }}>Kinywaji: {card.kinywaji}</Text>
        </Text>
        <View style={s.tags}>
          <Text style={s.tag}>{labelOf(DRINKING_TYPES, card.drinking_type)}</Text>
          <Text style={s.tag}>{labelOf(PARTY_STYLES, card.party_style)}</Text>
        </View>
        {card.bio ? <Text style={s.bio} numberOfLines={3}>{card.bio}</Text> : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { flex: 1, borderWidth: 2, borderColor: colors.usiku, borderRadius: 18, overflow: "hidden", backgroundColor: colors.cream },
  top: { flex: 1.05, borderBottomWidth: 2, borderColor: colors.usiku, justifyContent: "flex-end", alignItems: "center" },
  drink: { transform: [{ rotate: "-6deg" }, { translateY: 14 }] },
  badges: { position: "absolute", top: 10, left: 10, right: 10, flexDirection: "row", justifyContent: "space-between" },
  badge: { fontFamily: fonts.uiBold, fontSize: 12, color: colors.usiku, backgroundColor: colors.cream, borderWidth: 2, borderColor: colors.usiku, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, overflow: "hidden" },
  body: { flex: 1, padding: 16, gap: 8 },
  name: { fontFamily: fonts.head, fontSize: 30, lineHeight: 34, color: colors.usiku },
  meta: { fontFamily: fonts.uiSemi, fontSize: 14, lineHeight: 20, color: colors.usiku },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { fontFamily: fonts.uiSemi, fontSize: 12, color: colors.usiku, borderWidth: 1.5, borderColor: colors.usiku, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  bio: { fontFamily: fonts.ui, fontSize: 15, lineHeight: 21, color: colors.inkSoft },
});

import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { backend } from "@/lib/backend";
import { isPlus, useSession } from "@/lib/session";
import { colors, fonts, plan } from "@/lib/theme";
import { Body, Hand, Notice, Press, Screen, Sign } from "@/ui/kit";

const FREE = ["Three swipes a day", "People in the area you are in", "Chat with every match", "The house rules, always"];
const PLUS = ["Swipe as much as you like", "See only people with your drink", "Filter by drinking type", "Filter by party style"];

export default function Plus() {
  const { profile, refreshProfile } = useSession();
  const plus = isPlus(profile);
  const [note, setNote] = useState("");

  async function demoToggle() {
    await backend.demoSetPlan?.(plus ? "free" : "plus");
    await refreshProfile();
    router.back();
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingVertical: 24, gap: 20, paddingRight: 4 }}>
        <Hand>the bill, before you ask</Hand>
        <Sign style={{ fontSize: 50, lineHeight: 48 }}>{plan.name}</Sign>
        <Body style={{ fontSize: 17, lineHeight: 26 }}>
          Free gets you out of the house. {plan.name} lets you be picky: a whisky drinker can choose to
          see only whisky drinkers, and a quiet-pint person is not matched with someone planning to
          close the club.
        </Body>

        <View style={s.bill}>
          <View style={s.line}><Text style={s.tier}>Free</Text><Text style={s.tier}>{plan.currency} 0</Text></View>
          {FREE.map((t) => <Text key={t} style={s.item}>{t}</Text>)}
          <View style={s.rule} />
          <View style={s.line}><Text style={s.tier}>{plan.name}</Text><Text style={s.tier}>{plan.currency} {plan.price} a month</Text></View>
          {PLUS.map((t) => <Text key={t} style={s.item}>{t}</Text>)}
        </View>

        {plus ? <Notice tone="info" text={`You are on ${plan.name}.`} /> : null}
        {note ? <Notice tone="info" text={note} /> : null}

        {backend.mode === "demo" ? (
          <Press title={plus ? "Demo: switch back to Free" : "Demo: try Plus for free"} onPress={demoToggle} />
        ) : !plus ? (
          <Press
            title={`Pay ${plan.currency} ${plan.price} with M-PESA`}
            onPress={() => setNote("Payments are not switched on yet. Nothing has been charged. We will let you know the day M-PESA goes live.")}
          />
        ) : null}
        <Press title="Back" color="cream" onPress={() => router.back()} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  bill: { borderWidth: 2, borderColor: colors.usiku, backgroundColor: colors.white, padding: 18, gap: 6, transform: [{ rotate: "0.6deg" }] },
  line: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 12 },
  tier: { fontFamily: fonts.uiBold, fontSize: 17, color: colors.usiku },
  item: { fontFamily: fonts.ui, fontSize: 15, color: colors.inkSoft },
  rule: { borderTopWidth: 2, borderStyle: "dashed", borderColor: colors.inkSoft, marginVertical: 10 },
});

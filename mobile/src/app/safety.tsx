import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { colors, fonts } from "@/lib/theme";
import { Body, Hand, Press, Screen, Sign } from "@/ui/kit";

const RULES = [
  ["Watu wazima pekee.", "Eighteen and over. No exceptions."],
  ["Kutana mahali pa umma.", "The first round always happens somewhere public: a bar, a rooftop, a nyama choma joint with plastic chairs. Never somebody's house."],
  ["Mtu ajue uko wapi.", "Share your location with a person you trust before you set off. The Safety button in every chat does it in two taps."],
  ["Block kwanza, maswali baadaye.", "If someone makes you uncomfortable you can block and report them, and you owe nobody an explanation."],
  ["Maji pia ni kinywaji.", "Know your limit. Ordering a soda on round three is a power move."],
  ["Usiendeshe ukiwa umelewa.", "If you have been drinking, you are not driving. Call a cab. The car will still be there in the morning."],
];

export default function Safety() {
  return (
    <Screen tone="night">
      <ScrollView contentContainerStyle={{ paddingVertical: 24, gap: 20, paddingRight: 4 }}>
        <View style={{ backgroundColor: colors.cream, borderWidth: 2, borderColor: colors.usiku, padding: 6, transform: [{ rotate: "-0.6deg" }] }}>
          <View style={{ borderWidth: 3, borderColor: colors.pilipili, padding: 16, gap: 16 }}>
            <View style={{ alignItems: "center", gap: 2 }}>
              <Sign style={{ fontSize: 40, lineHeight: 40, color: colors.pilipili, textAlign: "center" }}>Sheria za nyumba</Sign>
              <Hand style={{ color: colors.usiku }}>house rules, and we mean them</Hand>
            </View>
            {RULES.map(([sw, en], i) => (
              <View key={sw} style={{ flexDirection: "row", gap: 12 }}>
                <Text style={{ fontFamily: fonts.sign, fontSize: 32, color: colors.sukuma, width: 26 }}>{i + 1}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontFamily: fonts.head, fontSize: 19, color: colors.usiku }}>{sw}</Text>
                  <Body style={{ fontSize: 15, lineHeight: 22, color: colors.inkSoft }}>{en}</Body>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={{ borderWidth: 2, borderColor: colors.pilipili, padding: 16, gap: 8 }}>
          <Text style={{ fontFamily: fonts.head, fontSize: 21, color: colors.cream }}>If something goes wrong tonight</Text>
          <Body style={{ color: colors.creamSoft }}>
            If you are in danger, call the police on 999 or 112. If drinking has stopped being fun for
            you or someone close to you, the NACADA helpline is free to call on 1192.
          </Body>
        </View>
        <Press title="Back" color="cream" shadow={colors.sukuma} onPress={() => router.back()} />
      </ScrollView>
    </Screen>
  );
}

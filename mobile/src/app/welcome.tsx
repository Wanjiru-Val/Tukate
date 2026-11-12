import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { colors, fonts } from "@/lib/theme";
import { LogoMark } from "@/ui/art";
import { Body, Hand, Press, Screen, Sign } from "@/ui/kit";

export default function Welcome() {
  const [adult, setAdult] = useState(false);
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", paddingVertical: 28, gap: 28 }}>
        <View style={{ gap: 14 }}>
          <LogoMark size={64} />
          <Hand>Friday, 5:47 pm. Nairobi.</Hand>
          <Sign style={{ fontSize: 76, lineHeight: 70 }}>
            Ingia{"\n"}
            <Text style={{ color: colors.pilipili }}>Tukate.</Text>
          </Sign>
          <Body style={{ fontSize: 18, lineHeight: 27 }}>
            Your plans fell through. Somebody a few hundred metres away is in the same position and
            would also like a cold one. Tukate introduces you. It is for making friends, somewhere
            public, tonight.
          </Body>
        </View>

        <View style={{ gap: 16 }}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: adult }}
            onPress={() => setAdult((v) => !v)}
            style={{ flexDirection: "row", gap: 12, alignItems: "center", minHeight: 48 }}
          >
            <View style={{ width: 28, height: 28, borderWidth: 2, borderColor: colors.usiku, borderRadius: 6, backgroundColor: adult ? colors.sukuma : colors.white, alignItems: "center", justifyContent: "center" }}>
              {adult ? <Text style={{ fontFamily: fonts.uiBold, fontSize: 18, color: colors.usiku }}>✓</Text> : null}
            </View>
            <Body style={{ flex: 1 }}>I am 18 or older. Tukate is for adults only.</Body>
          </Pressable>
          <Press title="Get started" disabled={!adult} onPress={() => router.push("/sign-in")} />
          <Body style={{ fontSize: 13, color: colors.inkSoft }}>
            Drink responsibly. Always meet in a public place.
          </Body>
        </View>
      </ScrollView>
    </Screen>
  );
}

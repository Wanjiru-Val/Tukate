import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold } from "@expo-google-fonts/bricolage-grotesque";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { ReenieBeanie_400Regular } from "@expo-google-fonts/reenie-beanie";
import { backend } from "@/lib/backend";
import { SessionProvider, useSession } from "@/lib/session";
import { colors } from "@/lib/theme";
import { DemoBanner } from "@/ui/kit";

// Sends people to the right place whenever their sign-in state changes:
// signed out -> welcome, signed in without a card -> setup, otherwise the app.
function Guard() {
  const { ready, userId, profile } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const first = segments[0] as string | undefined;

  useEffect(() => {
    if (!ready) return;
    const isPublic = first === "welcome" || first === "sign-in";
    if (!userId) {
      if (!isPublic) router.replace("/welcome");
    } else if (!profile) {
      if (first !== "onboarding") router.replace("/onboarding");
    } else if (isPublic || first === "onboarding" || first === undefined) {
      router.replace("/(tabs)");
    }
  }, [ready, userId, profile, first, router]);

  return null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold,
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
    ReenieBeanie_400Regular,
  });
  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.usiku }} />;

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <StatusBar style="dark" />
        <View style={{ flex: 1, backgroundColor: colors.cream }}>
          {backend.mode === "demo" ? <DemoBanner /> : null}
          <Guard />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }} />
        </View>
      </SessionProvider>
    </SafeAreaProvider>
  );
}

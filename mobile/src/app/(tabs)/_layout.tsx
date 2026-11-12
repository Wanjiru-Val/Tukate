import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors, fonts } from "@/lib/theme";

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontFamily: focused ? fonts.head : fonts.uiSemi, fontSize: 15, color: focused ? colors.sukuma : colors.creamSoft }}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.usiku, borderTopColor: colors.plumLine, borderTopWidth: 2, height: 64 },
        tabBarIconStyle: { display: "none" },
        tabBarLabelPosition: "beside-icon",
        tabBarItemStyle: { justifyContent: "center" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Swipe", tabBarLabel: ({ focused }) => <TabLabel label="Swipe" focused={focused} /> }} />
      <Tabs.Screen name="matches" options={{ title: "Matches", tabBarLabel: ({ focused }) => <TabLabel label="Matches" focused={focused} /> }} />
      <Tabs.Screen name="me" options={{ title: "Me", tabBarLabel: ({ focused }) => <TabLabel label="Me" focused={focused} /> }} />
    </Tabs>
  );
}

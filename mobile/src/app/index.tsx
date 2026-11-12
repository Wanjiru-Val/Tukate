import { ActivityIndicator, View } from "react-native";
import { colors } from "@/lib/theme";

// Shown for a moment while the app works out where to send you (see Guard in _layout).
export default function Loading() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.usiku }}>
      <ActivityIndicator color={colors.sukuma} size="large" />
    </View>
  );
}

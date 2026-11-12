// Drawings: the placeholder logo and the drink stickers used on profile cards.
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "@/lib/theme";

const ink = colors.usiku;

export function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="Tukate logo">
      <Path d="M24 2C13.5 2 6 9.8 6 19.6 6 31.5 24 46 24 46s18-14.5 18-26.4C42 9.8 34.5 2 24 2Z" fill={colors.sukuma} />
      <Path d="M15.5 13h17l-2.6 17.5a2 2 0 0 1-2 1.7h-7.8a2 2 0 0 1-2-1.7L15.5 13Z" fill={colors.cup} />
      <Rect x="14.5" y="10.5" width="19" height="4" rx="2" fill="#fff" />
      <Path d="M16.9 19.5h14.2M17.6 24h12.8" stroke={colors.cupRidge} strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

const art: Record<string, "beer" | "cider" | "dawa" | "whisky" | "wine"> = {
  beer: "beer", cider: "cider", whisky: "whisky", rum: "whisky", vodka: "dawa", gin: "dawa",
  cocktails: "dawa", wine: "wine", no_alcohol: "dawa",
};

export function Drink({ type, size = 140 }: { type: string; size?: number }) {
  const kind = art[type] ?? "beer";
  const common = { stroke: ink, strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <Svg width={(size * 120) / 160} height={size} viewBox="0 0 120 160">
      {kind === "cider" && (
        <G {...common}>
          <Path d="M50 12h20v30c0 8 14 14 14 30v66a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V72c0-16 14-22 14-30V12Z" fill={colors.mango} />
          <Rect x="47" y="6" width="26" height="12" rx="3" fill={colors.pilipili} />
          <Rect x="36" y="82" width="48" height="36" fill={colors.cream} />
          <Circle cx="60" cy="100" r="9" fill={colors.sukuma} />
        </G>
      )}
      {kind === "beer" && (
        <G {...common}>
          <Path d="M84 62h14a12 12 0 0 1 12 12v28a12 12 0 0 1-12 12H84" fill="none" />
          <Path d="M24 44h60v96a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8V44Z" fill={colors.mango} />
          <Path d="M20 44c-6-14 8-24 18-18 4-14 26-14 30 0 12-6 26 6 18 18Z" fill={colors.cream} />
        </G>
      )}
      {kind === "dawa" && (
        <G {...common}>
          <Path d="M84 18 62 96" stroke={colors.cupRidge} strokeWidth="6" />
          <Path d="M26 58h68l-8 82a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8L26 58Z" fill={colors.cream} />
          <Path d="M30 92h60l-4.5 48a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8L30 92Z" fill={colors.sukuma} />
          <Path d="M22 58a22 22 0 0 1 44 0Z" fill={colors.mango} />
        </G>
      )}
      {kind === "whisky" && (
        <G {...common}>
          <Path d="M22 46h76l-6 94a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8L22 46Z" fill={colors.cream} />
          <Path d="M25.5 98h69l-2.5 42a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8L25.5 98Z" fill="#FF8A4C" />
        </G>
      )}
      {kind === "wine" && (
        <G {...common}>
          <Path d="M32 20h56c0 34-8 56-28 56S32 54 32 20Z" fill={colors.cream} />
          <Path d="M35 44h50c-3 20-11 32-25 32S38 64 35 44Z" fill={colors.cupRidge} />
          <Path d="M60 76v62M40 146h40" fill="none" />
        </G>
      )}
    </Svg>
  );
}

// Card backdrops inspired by kikoi stripes and shuka checks.
const palettes = [
  [colors.mango, colors.pink, colors.sukuma],
  [colors.pilipili, colors.usiku, colors.pilipili],
  [colors.sukuma, colors.cream, colors.mango],
  [colors.pink, colors.mango, colors.usiku],
];

export function Pattern({ seed, style, children }: { seed: string; style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const p = palettes[h % palettes.length];
  const stripes = Array.from({ length: 12 }, (_, i) => p[i % p.length]);
  return (
    <View style={[{ overflow: "hidden", backgroundColor: p[0] }, style]}>
      <View style={{ position: "absolute", inset: 0, flexDirection: "row" }}>
        {stripes.map((c, i) => (
          <View key={i} style={{ flex: i % 3 === 0 ? 3 : 1, backgroundColor: c }} />
        ))}
      </View>
      {children}
    </View>
  );
}

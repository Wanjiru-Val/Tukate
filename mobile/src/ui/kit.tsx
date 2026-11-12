// Small set of building blocks shared by every screen.
import { useState } from "react";
import {
  ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View,
  type StyleProp, type TextInputProps, type TextProps, type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, space } from "@/lib/theme";

type Tone = "paper" | "night";

export function Screen({ tone = "paper", children, style }: { tone?: Tone; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: tone === "paper" ? colors.cream : colors.usiku }]}>
      <View style={[{ flex: 1, paddingHorizontal: space.lg }, style]}>{children}</View>
    </SafeAreaView>
  );
}

// Painted-sign headline
export function Sign({ style, ...p }: TextProps) {
  return <Text {...p} style={[s.sign, style]} />;
}
export function Head({ style, ...p }: TextProps) {
  return <Text accessibilityRole="header" {...p} style={[s.head, style]} />;
}
// Handwritten margin note
export function Hand({ style, ...p }: TextProps) {
  return <Text {...p} style={[s.hand, style]} />;
}
export function Body({ style, ...p }: TextProps) {
  return <Text {...p} style={[s.body, style]} />;
}
export function Label({ style, ...p }: TextProps) {
  return <Text {...p} style={[s.label, style]} />;
}

type BtnProps = {
  title: string;
  onPress?: () => void;
  color?: "green" | "cream" | "red" | "mango" | "ink";
  shadow?: string;
  disabled?: boolean;
  busy?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};
const fills = { green: colors.sukuma, cream: colors.cream, red: colors.pilipili, mango: colors.mango, ink: colors.usiku };

// A button that presses down into its own shadow.
export function Press({ title, onPress, color = "green", shadow = colors.usiku, disabled, busy, small, style, accessibilityLabel }: BtnProps) {
  const [down, setDown] = useState(false);
  const off = disabled || busy;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!off, busy: !!busy }}
      disabled={off}
      onPress={onPress}
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
      style={[{ opacity: off ? 0.5 : 1 }, style]}
    >
      <View style={[s.btnShadow, { backgroundColor: shadow }]} />
      <View
        style={[
          s.btn,
          small && s.btnSmall,
          { backgroundColor: fills[color], transform: [{ translateX: down ? 4 : 0 }, { translateY: down ? 4 : 0 }] },
        ]}
      >
        {busy ? (
          <ActivityIndicator color={color === "ink" ? colors.cream : colors.usiku} />
        ) : (
          <Text style={[s.btnText, small && { fontSize: 15 }, color === "ink" && { color: colors.cream }]}>{title}</Text>
        )}
      </View>
    </Pressable>
  );
}

export function Field({ label, hint, error, style, ...p }: TextInputProps & { label: string; hint?: string; error?: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Label>{label}</Label>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="rgba(18,16,24,0.35)"
        {...p}
        onFocus={(e) => { setFocus(true); p.onFocus?.(e); }}
        onBlur={(e) => { setFocus(false); p.onBlur?.(e); }}
        style={[s.input, focus && { borderColor: colors.sukuma }, !!error && { borderColor: colors.pilipili }, style]}
      />
      {error ? <Text style={s.error}>{error}</Text> : hint ? <Text style={s.hint}>{hint}</Text> : null}
    </View>
  );
}

export function Chip({ label, selected, onPress, locked, tone = "paper" }: { label: string; selected?: boolean; onPress?: () => void; locked?: boolean; tone?: Tone }) {
  const ink = tone === "paper" ? colors.usiku : colors.cream;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={locked ? `${label}, locked` : label}
      onPress={onPress}
      style={[
        s.chip,
        { borderColor: ink },
        locked && { borderStyle: "dashed", opacity: 0.7 },
        selected && { backgroundColor: colors.sukuma, borderColor: colors.usiku },
      ]}
    >
      <Text style={[s.chipText, { color: selected ? colors.usiku : ink }]}>{locked ? `🔒 ${label}` : label}</Text>
    </Pressable>
  );
}

export function Notice({ text, tone = "error" }: { text: string; tone?: "error" | "info" }) {
  return (
    <View accessibilityRole="alert" style={[s.notice, tone === "info" && { borderColor: colors.usiku, backgroundColor: colors.mango }]}>
      <Text style={s.noticeText}>{text}</Text>
    </View>
  );
}

export function DemoBanner() {
  return (
    <View style={s.demo}>
      <Text style={s.demoText}>Demo mode · made-up people, nothing is saved</Text>
    </View>
  );
}

const s = StyleSheet.create({
  sign: { fontFamily: fonts.sign, fontSize: 56, lineHeight: 54, letterSpacing: -1.5, textTransform: "uppercase", color: colors.usiku },
  head: { fontFamily: fonts.head, fontSize: 30, lineHeight: 34, letterSpacing: -0.6, color: colors.usiku },
  hand: { fontFamily: fonts.hand, fontSize: 30, lineHeight: 32, color: colors.cupRidge },
  body: { fontFamily: fonts.ui, fontSize: 16, lineHeight: 24, color: colors.usiku },
  label: { fontFamily: fonts.uiSemi, fontSize: 14, color: colors.usiku },
  btnShadow: { position: "absolute", left: 4, top: 4, right: -4, bottom: -4, borderRadius: 10 },
  btn: { minHeight: 52, borderRadius: 10, borderWidth: 2, borderColor: colors.usiku, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingVertical: 12 },
  btnSmall: { minHeight: 44, paddingHorizontal: 14, paddingVertical: 8 },
  btnText: { fontFamily: fonts.head, fontSize: 17, color: colors.usiku },
  input: { borderWidth: 2, borderColor: colors.usiku, borderRadius: 10, backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 12, fontFamily: fonts.ui, fontSize: 17, color: colors.usiku },
  hint: { fontFamily: fonts.ui, fontSize: 13, color: colors.inkSoft },
  error: { fontFamily: fonts.uiSemi, fontSize: 13, color: colors.cupRidge },
  chip: { borderWidth: 2, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, minHeight: 40, justifyContent: "center" },
  chipText: { fontFamily: fonts.uiSemi, fontSize: 14 },
  notice: { borderWidth: 2, borderColor: colors.cupRidge, backgroundColor: "#FFE3E0", borderRadius: 10, padding: 12 },
  noticeText: { fontFamily: fonts.uiSemi, fontSize: 14, color: colors.usiku },
  demo: { backgroundColor: colors.mango, paddingVertical: 5, paddingHorizontal: 12, borderBottomWidth: 2, borderColor: colors.usiku },
  demoText: { fontFamily: fonts.uiSemi, fontSize: 12, color: colors.usiku, textAlign: "center" },
});

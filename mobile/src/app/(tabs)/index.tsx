import * as Location from "expo-location";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, PanResponder, ScrollView, StyleSheet, Text, View } from "react-native";
import { backend } from "@/lib/backend";
import { DRINKING_TYPES, PARTY_STYLES, DRINK_TYPES, labelOf } from "@/lib/options";
import { isPlus, useSession } from "@/lib/session";
import { colors, fonts, plan } from "@/lib/theme";
import { AppError, NO_FILTERS, friendly, type Card, type Direction, type Filters } from "@/lib/types";
import { Body, Chip, Hand, Notice, Press, Screen, Sign } from "@/ui/kit";
import { PersonCard } from "@/ui/PersonCard";

const THRESHOLD = 110;

export default function Swipe() {
  const { profile } = useSession();
  const plus = isPlus(profile);
  const [deck, setDeck] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [left, setLeft] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [error, setError] = useState("");
  const [match, setMatch] = useState<{ card: Card; matchId: string } | null>(null);
  const busy = useRef(false);
  const pos = useRef(new Animated.ValueXY()).current;

  const load = useCallback(async (f: Filters) => {
    setLoading(true);
    setError("");
    try {
      const [cards, remaining] = await Promise.all([backend.getDeck(f), backend.swipesLeft()]);
      setDeck(cards);
      setLeft(remaining);
    } catch (e) {
      setError(friendly(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [load, filters, profile?.plan]);

  // Send the phone's rough position once, so "nearby" means nearby.
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const here = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        await backend.setLocation(here.coords.latitude, here.coords.longitude);
      } catch {
        // No location: the app falls back to the person's Base.
      }
    })();
  }, []);

  const top = deck[0];
  const next = deck[1];
  const outOfSwipes = left !== null && left <= 0;

  const decide = useCallback(
    (direction: Direction) => {
      const card = deck[0];
      if (!card || busy.current || outOfSwipes) return;
      busy.current = true;
      const x = direction === "pass" ? -500 : 500;
      Animated.timing(pos, { toValue: { x, y: 40 }, duration: 220, useNativeDriver: false }).start(async () => {
        try {
          const result = await backend.swipe(card.id, direction);
          setLeft(result.swipes_left);
          setDeck((d) => d.slice(1));
          if (result.matched && result.match_id) setMatch({ card, matchId: result.match_id });
        } catch (e) {
          if (e instanceof AppError && e.code === "daily_limit") setLeft(0);
          else if (e instanceof AppError && e.code === "already_swiped") setDeck((d) => d.slice(1));
          else setError(friendly(e));
        } finally {
          pos.setValue({ x: 0, y: 0 });
          busy.current = false;
        }
      });
    },
    [deck, outOfSwipes, pos],
  );

  const decideRef = useRef(decide);
  decideRef.current = decide;
  const lockedRef = useRef(false);
  lockedRef.current = outOfSwipes || !top;

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => !lockedRef.current && Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_e, g) => pos.setValue({ x: g.dx, y: g.dy * 0.25 }),
      onPanResponderRelease: (_e, g) => {
        if (g.dx > THRESHOLD) decideRef.current("cheers");
        else if (g.dx < -THRESHOLD) decideRef.current("pass");
        else Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false, friction: 6 }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    }),
  ).current;

  const rotate = pos.x.interpolate({ inputRange: [-300, 0, 300], outputRange: ["-18deg", "0deg", "18deg"] });
  const yes = pos.x.interpolate({ inputRange: [0, 90], outputRange: [0, 1], extrapolate: "clamp" });
  const no = pos.x.interpolate({ inputRange: [-90, 0], outputRange: [1, 0], extrapolate: "clamp" });

  function toggle(patch: Partial<Filters>) {
    if (!plus) {
      router.push("/plus");
      return;
    }
    setFilters((f) => ({ ...f, ...patch }));
  }

  const myDrink = profile ? labelOf(DRINK_TYPES, profile.drink_type) : "My drink";

  return (
    <Screen style={{ paddingHorizontal: 16 }}>
      <View style={s.header}>
        <Text style={s.wordmark}>tukate</Text>
        <Text style={s.counter} accessibilityLiveRegion="polite">
          {left === null ? plan.name : `${left} of ${plan.freeSwipesPerDay} free swipes left today`}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, paddingBottom: 10 }}>
        <Chip label={`${myDrink} drinkers only`} locked={!plus} selected={filters.sameDrink} onPress={() => toggle({ sameDrink: !filters.sameDrink })} />
        {DRINKING_TYPES.map((t) => (
          <Chip key={t.key} label={t.label} locked={!plus} selected={filters.drinkingType === t.key}
            onPress={() => toggle({ drinkingType: filters.drinkingType === t.key ? null : t.key })} />
        ))}
        {PARTY_STYLES.map((t) => (
          <Chip key={t.key} label={t.label} locked={!plus} selected={filters.partyStyle === t.key}
            onPress={() => toggle({ partyStyle: filters.partyStyle === t.key ? null : t.key })} />
        ))}
      </ScrollView>

      {error ? <Notice text={error} /> : null}

      <View style={s.deck}>
        {loading ? (
          <ActivityIndicator color={colors.usiku} size="large" />
        ) : outOfSwipes ? (
          <View style={[s.panel, { backgroundColor: colors.mango }]}>
            <Hand style={{ color: colors.usiku }}>that was swipe number {plan.freeSwipesPerDay}</Hand>
            <Sign>Kesho{"\n"}tena.</Sign>
            <Body>
              Free gives you {plan.freeSwipesPerDay} swipes a day. {plan.name} is {plan.currency} {plan.price} a month:
              swipe as much as you like, and choose to see only people with your drink, your drinking
              type and your party style.
            </Body>
            <Press title={`See ${plan.name}`} color="cream" onPress={() => router.push("/plus")} />
          </View>
        ) : !top ? (
          <View style={[s.panel, { backgroundColor: colors.cream }]}>
            <Hand>quiet night</Hand>
            <Sign style={{ fontSize: 44, lineHeight: 42 }}>Nobody new nearby.</Sign>
            <Body>
              {filters.sameDrink || filters.drinkingType || filters.partyStyle
                ? "Nobody matches those filters right now. Try loosening them."
                : "You have seen everyone around you for now. Check back later, more people join every day."}
            </Body>
            <Press title="Look again" color="cream" onPress={() => load(filters)} />
          </View>
        ) : (
          <>
            {next ? (
              <View style={[StyleSheet.absoluteFill, { transform: [{ scale: 0.95 }, { translateY: 12 }, { rotate: "-2deg" }] }]} pointerEvents="none">
                <PersonCard card={next} />
              </View>
            ) : null}
            <Animated.View
              {...pan.panHandlers}
              style={[StyleSheet.absoluteFill, { transform: [{ translateX: pos.x }, { translateY: pos.y }, { rotate }] }]}
            >
              <PersonCard card={top} />
              <Animated.Text style={[s.stamp, s.stampYes, { opacity: yes }]}>CHEERS</Animated.Text>
              <Animated.Text style={[s.stamp, s.stampNo, { opacity: no }]}>PASS</Animated.Text>
            </Animated.View>
          </>
        )}

        {match ? (
          <View style={[s.panel, StyleSheet.absoluteFill, { backgroundColor: colors.sukuma }]} accessibilityViewIsModal>
            <Sign>Form{"\n"}imeshika!</Sign>
            <Body style={{ fontFamily: fonts.uiSemi, fontSize: 18 }}>Wewe na {match.card.display_name} mko ndani.</Body>
            <Body>Say hello and pick somewhere public to meet. Kutana mahali pa umma.</Body>
            <Press
              title="Send message"
              color="cream"
              onPress={() => {
                const id = match.matchId;
                setMatch(null);
                router.push({ pathname: "/chat/[id]", params: { id, name: match.card.display_name, other: match.card.id } });
              }}
            />
            <Press title="Keep swiping" color="green" onPress={() => setMatch(null)} />
          </View>
        ) : null}
      </View>

      <View style={s.actions}>
        <Press title="Pass" color="cream" style={{ flex: 1 }} disabled={!top || outOfSwipes || !!match} onPress={() => decide("pass")} />
        <Press title="Super Like" color="red" disabled={!top || outOfSwipes || !!match} onPress={() => decide("super")} />
        <Press title="Cheers" color="green" style={{ flex: 1 }} disabled={!top || outOfSwipes || !!match} onPress={() => decide("cheers")} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", paddingTop: 8, paddingBottom: 10, gap: 12 },
  wordmark: { fontFamily: fonts.sign, fontSize: 30, letterSpacing: -1, color: colors.usiku },
  counter: { fontFamily: fonts.uiSemi, fontSize: 13, color: colors.inkSoft, flexShrink: 1, textAlign: "right" },
  deck: { flex: 1, marginTop: 6, marginBottom: 14, justifyContent: "center", maxWidth: 440, width: "100%", alignSelf: "center" },
  panel: { flex: 1, borderWidth: 2, borderColor: colors.usiku, borderRadius: 18, padding: 22, gap: 14, justifyContent: "center" },
  actions: { flexDirection: "row", gap: 12, paddingBottom: 14, paddingRight: 4, maxWidth: 440, width: "100%", alignSelf: "center" },
  stamp: { position: "absolute", top: 70, fontFamily: fonts.sign, fontSize: 38, paddingHorizontal: 10, paddingTop: 4, borderWidth: 4, borderRadius: 8, backgroundColor: colors.cream, overflow: "hidden" },
  stampYes: { left: 18, color: colors.sukuma, borderColor: colors.sukuma, transform: [{ rotate: "-12deg" }] },
  stampNo: { right: 18, color: colors.pilipili, borderColor: colors.pilipili, transform: [{ rotate: "12deg" }] },
});

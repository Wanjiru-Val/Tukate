import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { backend } from "@/lib/backend";
import { friendly } from "@/lib/types";
import { colors } from "@/lib/theme";
import { Body, Field, Hand, Head, Notice, Press, Screen } from "@/ui/kit";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const validEmail = /^\S+@\S+\.\S+$/.test(email.trim());

  async function send() {
    setBusy(true);
    setError("");
    try {
      await backend.sendCode(email.trim().toLowerCase());
      setSent(true);
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  }
  async function verify() {
    setBusy(true);
    setError("");
    try {
      await backend.verifyCode(email.trim().toLowerCase(), code.trim());
    } catch (e) {
      setError(friendly(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingVertical: 28, gap: 20 }}>
          <Hand>{sent ? "check your inbox" : "first, who is this?"}</Hand>
          <Head>{sent ? "Enter the code we sent you" : "What is your email?"}</Head>
          {!sent ? (
            <>
              <Body>We will email you a six-digit code. No password to remember.</Body>
              <Field
                label="Email address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="you@example.com"
              />
              {error ? <Notice text={error} /> : null}
              <Press title="Send me a code" onPress={send} disabled={!validEmail} busy={busy} />
            </>
          ) : (
            <>
              <Body>
                It went to {email.trim().toLowerCase()}.
                {backend.mode === "demo" ? " This is demo mode, so any six digits will work." : ""}
              </Body>
              <Field
                label="Six-digit code"
                value={code}
                onChangeText={(t) => setCode(t.replace(/\D/g, "").slice(0, 6))}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                placeholder="123456"
              />
              {error ? <Notice text={error} /> : null}
              <Press title="Ingia" onPress={verify} disabled={code.length < 6} busy={busy} />
              <Pressable accessibilityRole="button" onPress={() => { setSent(false); setCode(""); setError(""); }} style={{ minHeight: 44, justifyContent: "center" }}>
                <Body style={{ textDecorationLine: "underline", color: colors.usiku }}>Use a different email</Body>
              </Pressable>
            </>
          )}
          <View />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

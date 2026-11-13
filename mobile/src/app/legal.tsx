import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { Body, Hand, Head, Press, Screen } from "@/ui/kit";

// Plain-language summary. The full terms and privacy policy live on the website.
const SECTIONS: [string, string][] = [
  ["What we collect", "Your email address, first name, date of birth, Base, Kinywaji, drinking type, party style, the line you write about yourself, a photo if you add one, your phone's rough location if you allow it, your swipes, your matches and your chat messages."],
  ["Why we collect it", "To show you people nearby, to check that everyone is 18 or older, to let matches talk to each other, and to keep people safe by acting on reports."],
  ["What other people see", "Your first name, your age (never your date of birth), your Base, your drinks and style, your line, your photo, and how far away you are rounded to the nearest 100 metres. Nobody sees your exact location or your email address."],
  ["Who we share it with", "Nobody sells or receives your information for advertising. It is stored with our database provider and is only handed over if the law requires it."],
  ["Your choices", "You can edit your card, download everything we hold about you, or delete your account from the Me tab at any time. Deleting your account removes your card, swipes, matches and messages."],
  ["The rules", "You must be 18 or older. Meet in public places. No harassment, threats, fake profiles or selling. We can remove accounts that break these rules."],
  ["Drinking", "Tukate introduces people; it does not sell or serve alcohol. Please drink responsibly and never drink and drive."],
];

export default function Legal() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingVertical: 24, gap: 20, paddingRight: 4 }}>
        <Hand>the small print, in normal words</Hand>
        <Head>Terms and your privacy</Head>
        {SECTIONS.map(([title, text]) => (
          <View key={title} style={{ gap: 4 }}>
            <Head style={{ fontSize: 20, lineHeight: 24 }}>{title}</Head>
            <Body>{text}</Body>
          </View>
        ))}
        <Body style={{ fontSize: 13 }}>This is a summary. The full terms and privacy policy are on the Tukate website.</Body>
        <Press title="Back" color="cream" onPress={() => router.back()} />
      </ScrollView>
    </Screen>
  );
}

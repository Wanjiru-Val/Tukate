// Where the sign-in session is kept on the device.
// On phones it goes in the system keychain / keystore (encrypted by the phone).
// Values are split into pieces because the keychain limits the size of each entry.
// In a browser there is no keychain, so it falls back to the browser's own storage.
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const PIECE = 1800;
const safe = (key: string) => key.replace(/[^A-Za-z0-9._-]/g, "_");

async function secureGet(key: string): Promise<string | null> {
  const k = safe(key);
  const count = Number(await SecureStore.getItemAsync(`${k}.n`));
  if (!count) return null;
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const part = await SecureStore.getItemAsync(`${k}.${i}`);
    if (part == null) return null;
    parts.push(part);
  }
  return parts.join("");
}

async function secureRemove(key: string): Promise<void> {
  const k = safe(key);
  const count = Number(await SecureStore.getItemAsync(`${k}.n`));
  for (let i = 0; i < count; i++) await SecureStore.deleteItemAsync(`${k}.${i}`);
  await SecureStore.deleteItemAsync(`${k}.n`);
}

async function secureSet(key: string, value: string): Promise<void> {
  await secureRemove(key);
  const k = safe(key);
  const count = Math.ceil(value.length / PIECE);
  for (let i = 0; i < count; i++) {
    await SecureStore.setItemAsync(`${k}.${i}`, value.slice(i * PIECE, (i + 1) * PIECE));
  }
  await SecureStore.setItemAsync(`${k}.n`, String(count));
}

export const sessionStorage =
  Platform.OS === "web"
    ? AsyncStorage
    : { getItem: secureGet, setItem: secureSet, removeItem: secureRemove };

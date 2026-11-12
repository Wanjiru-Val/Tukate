import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { backend } from "./backend";
import type { Profile } from "./types";

type State = {
  ready: boolean;
  userId: string | null;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  setProfile: (p: Profile | null) => void;
};

const Ctx = createContext<State | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const load = useCallback(async (id: string | null) => {
    setUserId(id);
    if (!id) {
      setProfile(null);
      return;
    }
    try {
      setProfile(await backend.getMyProfile());
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    backend.currentUserId().then(async (id) => {
      if (!alive) return;
      await load(id);
      if (alive) setReady(true);
    });
    const off = backend.onAuthChange((id) => {
      load(id);
    });
    return () => {
      alive = false;
      off();
    };
  }, [load]);

  const refreshProfile = useCallback(async () => {
    setProfile(await backend.getMyProfile());
  }, []);

  const value = useMemo(
    () => ({ ready, userId, profile, refreshProfile, setProfile }),
    [ready, userId, profile, refreshProfile],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession must be used inside SessionProvider");
  return v;
}

export function isPlus(profile: Profile | null) {
  if (!profile || profile.plan !== "plus") return false;
  return !profile.plan_until || new Date(profile.plan_until) > new Date();
}

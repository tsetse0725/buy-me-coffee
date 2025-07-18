"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { User, Profile, BankCard } from "@/app/types/user";

interface DecodedToken {
  userId: number;
  email?: string;
  username?: string;
  exp?: number;
}

interface Ctx {
  user: User | null;
  profile: Profile | null | undefined;
  bankCard: BankCard | null;
  initializing: boolean;

  refreshAuth: () => Promise<void>;
  setUser: (u: User | null) => void;
  setProfile: (p: Profile | null) => void;
  setBankCard: (b: BankCard | null) => void;
}

const UserContext = createContext<Ctx | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [bankCard, setBankCard] = useState<BankCard | null>(null);
  const [initializing, setInit] = useState(true);

  const loadAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setProfile(null);
      setBankCard(null);
      setInit(false);
      return;
    }

    try {
      const { userId, email, username } = jwtDecode<DecodedToken>(token);
      localStorage.setItem("uid", String(userId));

      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const [pRes, bRes] = await Promise.allSettled([
        fetch(`${base}/profiles/${userId}`),
        fetch(`${base}/bankcards/${userId}`),
      ]);

      let prof: Profile | null = null;
      if (pRes.status === "fulfilled" && pRes.value.ok)
        prof = await pRes.value.json();
      setProfile(prof);

      if (bRes.status === "fulfilled" && bRes.value.ok) {
        setBankCard(await bRes.value.json());
      } else {
        setBankCard(null);
      }

      setUser({
        id: userId,
        email: email ?? "unknown@email.com",
        username: username ?? prof?.username ?? "unknown",
        avatarImage: prof?.avatarImage,
      });
    } catch (e) {
      console.warn("Invalid token", e);
      localStorage.removeItem("token");
      setUser(null);
      setProfile(null);
      setBankCard(null);
    } finally {
      setInit(false);
    }
  };

  useEffect(() => {
    loadAuth();
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") loadAuth();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value: Ctx = {
    user,
    profile,
    bankCard,
    initializing,
    refreshAuth: loadAuth,    
    setUser,
    setProfile,
    setBankCard,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useAuth must be inside <UserProvider>");
  return ctx;
}

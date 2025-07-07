/* src/app/_components/UserProvider.tsx */
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

/* ── token payload ───────────────────────── */
interface DecodedToken {
  userId: number;
  email?: string;
  username?: string;
  exp?: number;
}

/* ── context type ────────────────────────── */
interface Ctx {
  user: User | null;
  profile: Profile | null | undefined; // undefined = loading
  bankCard: BankCard | null;
  initializing: boolean;
  setUser: (u: User | null) => void;
  setProfile: (p: Profile | null) => void;
  setBankCard: (b: BankCard | null) => void;
}

const UserContext = createContext<Ctx | undefined>(undefined);

/* ─────────────────────────────────────────── */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [bankCard, setBankCard] = useState<BankCard | null>(null);
  const [initializing, setInitializing] = useState(true);

  /* ── main auth effect ───────────────────── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 token =", token);

    if (!token) {
      console.log("🚫 No token, not logged in");
      setInitializing(false);
      return;
    }

    try {
      const { userId, email, username } = jwtDecode<DecodedToken>(token);
      localStorage.setItem("uid", String(userId));

      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

      Promise.allSettled([
        fetch(`${base}/profiles/${userId}`),
        fetch(`${base}/bankcards/${userId}`),
      ]).then(async (results) => {
        const [pRes, bRes] = results;

        let profileUsername: string | undefined;

        /* ── Profile ─────────────────────── */
        if (pRes.status === "fulfilled" && pRes.value.ok) {
          const prof: Profile = await pRes.value.json();
          setProfile(prof);
          profileUsername = prof.username;
          console.log("📄 setProfile →", prof);
        } else {
          setProfile(null);
          console.log("📄 setProfile → null");
        }

        /* ── BankCard ────────────────────── */
        if (bRes.status === "fulfilled" && bRes.value.ok) {
          const card = await bRes.value.json();
          setBankCard(card);
          console.log("💳 setBankCard →", card);
        }

        /* ── User (username fallback) ─────── */
        const finalUser: User = {
          id: userId,
          email: email ?? "unknown@email.com",
          username: username ?? profileUsername ?? "unknown",
        };
        setUser(finalUser);
        console.log("👤 setUser →", finalUser);

        setInitializing(false);
        console.log("✅ initializing → false");
      });
    } catch (err) {
      console.warn("❌ Invalid token", err);
      localStorage.removeItem("token");
      setInitializing(false);
    }
  }, []);

  /* ───────────────────────────────────────── */
  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        bankCard,
        initializing,
        setUser,
        setProfile,
        setBankCard,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/* ── hook ─────────────────────────────────── */
export function useAuth() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useAuth must be inside <UserProvider>");
  return ctx;
}

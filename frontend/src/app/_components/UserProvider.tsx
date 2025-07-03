"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User { id: number; email: string; }
interface Profile {
  id: number; name: string; avatarImage: string; about: string; socialMediaURL: string;
}
interface BankCard {
  id: number; cardNumber: string; expiryDate: string;
  country: string; firstName: string; lastName: string;
}
interface DecodedToken { userId: number; email: string; exp?: number; }

interface Ctx {
  user: User | null;
  profile: Profile | null;
  bankCard: BankCard | null;
  setUser: (u: User | null) => void;
  setProfile: (p: Profile | null) => void;
  setBankCard: (b: BankCard | null) => void;
}

const UserContext = createContext<Ctx | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bankCard, setBankCard] = useState<BankCard | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { userId, email } = jwtDecode<DecodedToken>(token);
      setUser({ id: userId, email });
      localStorage.setItem("uid", String(userId));

      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

      Promise.allSettled([
        fetch(`${base}/profiles/${userId}`),
        fetch(`${base}/bankcards/${userId}`),
      ]).then(async (r) => {
        if (r[0].status === "fulfilled" && r[0].value.ok) {
          setProfile(await r[0].value.json());
        }
        if (r[1].status === "fulfilled" && r[1].value.ok) {
          setBankCard(await r[1].value.json());
        }
      });
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, profile, setProfile, bankCard, setBankCard }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useAuth must be inside <UserProvider>");
  return ctx;
}

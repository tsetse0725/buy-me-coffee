"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

interface User {
  id: number;
  email: string;
}

interface DecodedToken {
  userId: number;
  email: string;
  exp: number; // optional
}

interface Ctx {
  user: User | null;
  setUser: (u: User | null) => void;
}

const UserContext = createContext<Ctx | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);  // ✅ no 'any'
      setUser({ id: decoded.userId, email: decoded.email });
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useAuth must be inside <UserProvider>");
  return ctx;
}

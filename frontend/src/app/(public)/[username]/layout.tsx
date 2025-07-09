// app/(public)/layout.tsx
"use client";

import { UserProvider } from "@/app/_components/UserProvider";
import Navbar from "@/app/_components/Navbar";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <Navbar />
      <main className="min-h-screen bg-white px-4 py-6">{children}</main>
    </UserProvider>
  );
}

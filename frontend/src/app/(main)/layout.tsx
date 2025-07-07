/* app/MainLayout.tsx */
"use client";

import "../globals.css";
import Header from "../_components/Header";
import Sidebar from "../_components/Sidebar";
import { UserProvider } from "../_components/UserProvider";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname.startsWith("/dashboard");

  return (
    <UserProvider>
      {/* Эхлээд босоо чигт flex ─ Header дээрээ, доор нь үлдсэн хэсэг */}
      <div className="min-h-screen flex flex-col">
        <Header /> {/* 🟢 Лого + профайл бар → бүх өргөнийг эзэлнэ */}

        {/* Header-ийн доорхи контент: sidebar + үндсэн хэсэг */}
        <div className="flex flex-1">
          {showSidebar && <Sidebar />}  {/* ← зүүн талд */
          }
          <main className="flex-1 px-6 py-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}

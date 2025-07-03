/* src/app/(main)/layout.tsx */
import "../globals.css";
import Header     from "../_components/Header";
import Sidebar    from "../_components/Sidebar";
import { UserProvider } from "../_components/UserProvider";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <div className="flex">
        {/* ───── Sidebar ───── */}
        <Sidebar />

        {/* ───── Баруун талын үндсэн хэсэг ───── */}
        <div className="flex-1">
          <Header />
          {children}
        </div>
      </div>
    </UserProvider>
  );
}

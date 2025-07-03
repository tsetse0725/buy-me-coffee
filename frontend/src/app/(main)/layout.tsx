import "../globals.css";
import Header from "../_components/Header";
import { UserProvider } from "../_components/UserProvider";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <Header />
      {children}
    </UserProvider>
  );
}

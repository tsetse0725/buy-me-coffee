import type { ReactNode } from "react";
import Header from "@/app/_components/Header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white px-4 py-6">
        {children}   {/* <div className="max-w-6xl …">-ийг арилгав */}
      </main>
    </>
  );
}
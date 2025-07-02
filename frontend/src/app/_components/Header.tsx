"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b">
      <div className="flex items-center gap-2">
        <span className="text-2xl">☕</span>
        <span className="text-lg font-bold">Buy Me Coffee</span>
      </div>
      <button
        onClick={handleLogout}
        className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
      >
        Log out
      </button>
    </header>
  );
}

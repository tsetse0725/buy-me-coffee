"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./UserProvider";

export default function Header() {
  const { user, profile, setUser } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null; // not logged in

  /* avatar URL — backend + path */
  const backend = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const avatarSrc = profile?.avatarImage
    ? profile.avatarImage.startsWith("http") ? profile.avatarImage
    : `${backend}/${profile.avatarImage}`
    : "/placeholder.jpg";

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <h1 className="font-bold flex items-center gap-2 text-lg">
        <Image src="/coffee.png" alt="logo" width={24} height={24} />
        Buy&nbsp;Me&nbsp;Coffee
      </h1>

      <div className="relative">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 hover:opacity-80">
          <Image src={avatarSrc} alt="avatar" width={32} height={32} className="rounded-full object-cover" />
          <span className="hidden sm:inline">{profile?.name ?? "Guest"}</span>
          <ChevronDown size={16} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-32 border rounded bg-white shadow z-10">
            <button onClick={logout} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./UserProvider";

export default function Navbar() {
  const { user, initializing } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-3 shadow-sm">
      <Link href="/" className="text-lg font-semibold flex items-center gap-2">
        <span role="img" aria-label="coffee">
          ☕
        </span>
        Buy Me Coffee
      </Link>

      {initializing ? null : user ? (
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src={user.avatarImage || "/avatar-placeholder.png"}
            alt={user.username}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <span>{user.username}</span>
        </Link>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/signup"
            className="px-4 py-1.5 rounded-md bg-black text-white hover:bg-gray-800 transition"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-md border hover:bg-gray-100 transition"
          >
            Log in
          </Link>
        </div>
      )}
    </header>
  );
}

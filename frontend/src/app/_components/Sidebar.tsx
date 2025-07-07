/* src/app/_components/Sidebar.tsx */
"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/app/_components/UserProvider";

export default function Sidebar() {
  const { user } = useAuth();          // username эндээс авна

  if (!user) return null;              // ачааллаж дуусаагүй эсвэл нэвтрээгүй үед

  return (
    <div className="space-y-4 p-6 text-sm">
      {/* Dashboard */}
      <Link
        href="/dashboard"
        className="block rounded px-3 py-2 font-medium hover:bg-gray-100"
      >
        Home
      </Link>

      {/* Explore */}
      <Link
        href="/explore"
        className="block rounded px-3 py-2 font-medium hover:bg-gray-100"
      >
        Explore
      </Link>

      {/* View page → /<username>  (prefetch OFF) */}
      <Link
        href={`/${user.username}`}   // ⬅️ зөв dynamic зам
        prefetch={false}             // ⏸ background prefetch-ээс болж console spam гарахгүй
        target="_blank"              // ↗ хүсвэл шинэ tab – авч хаяж болно
        className="flex items-center gap-1 rounded px-3 py-2 font-medium hover:bg-gray-100"
      >
        View&nbsp;page
        <ExternalLink size={14} className="opacity-60" />
      </Link>

      {/* Account settings */}
      <Link
        href="/account"
        className="block rounded px-3 py-2 font-medium hover:bg-gray-100"
      >
        Account settings
      </Link>
    </div>
  );
}

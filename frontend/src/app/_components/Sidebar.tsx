"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/app/_components/UserProvider";

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-4 p-6 text-sm">
      <Link
        href="/dashboard"
        className="block rounded px-3 py-2 font-medium hover:bg-gray-100"
      >
        Home
      </Link>

      <Link
        href="/explore"
        className="block rounded px-3 py-2 font-medium hover:bg-gray-100"
      >
        Explore
      </Link>

<Link
  href={`/${user.username}`}
  prefetch={false}
  className="flex items-center gap-1 rounded px-3 py-2 font-medium hover:bg-gray-100"
>
  View&nbsp;page
  <ExternalLink size={14} className="opacity-60" />
</Link>


      <Link
        href="/account"
        className="block rounded px-3 py-2 font-medium hover:bg-gray-100"
      >
        Account settings
      </Link>
    </div>
  );
}

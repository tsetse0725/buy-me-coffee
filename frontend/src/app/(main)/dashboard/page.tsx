/* src/app/(main)/dashboard/page.tsx */
"use client";

import { useState } from "react";
import { useAuth } from "@/app/_components/UserProvider";
import ProfileSummary from "@/app/_components/ProfileSummary";
import RecentTransactions from "@/app/_components/RecentTransactions";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [range, setRange] = useState<"last30" | "last90" | "all">("last30");

  /* ╭─── Статик demo earnings — бүх сонголтод 450 ───╮ */
  const earnings = {
    last30: 450,
    last90: 450,
    all: 450,
  };
  /* ╰───────────────────────────────────────────────╯ */

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10">
      <ProfileSummary
        user={user}
        profile={profile}
        earnings={earnings}
        range={range}
        setRange={setRange}
      />

      {/* RecentTransactions өөрөө DEMO_DONATIONS-оо (RAW_DONATIONS) ашиглаж байгаа */}
      <RecentTransactions range={range} />
    </div>
  );
}

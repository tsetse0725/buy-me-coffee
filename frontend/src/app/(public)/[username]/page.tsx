"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CoverUploader from "@/app/_components/CoverUploader";
import ProfileCard from "@/app/_components/ProfileCard";
import SupportCard from "@/app/_components/SupportCard";
import { useAuth } from "@/app/_components/UserProvider";
import type { Profile } from "@/app/types/user";

export default function PublicProfilePage() {
  /* ───── URL param ───── */
  const { username } = useParams() as { username: string };

  /* ───── logged‑in user ───── */
  const { user } = useAuth();

  /*
   * viewProfile state
   *   undefined → loading
   *   null       → not found / error
   *   Profile    → data loaded
   */
  const [viewProfile, setViewProfile] = useState<
    Profile | null | undefined
  >(undefined);

  /* ───── fetch profile by username ───── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const base =
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const res = await fetch(`${base}/profiles/by-username/${username}`);

        if (!res.ok) {
          if (!cancelled) setViewProfile(null);
          return;
        }

        const data: Profile = await res.json();
        if (!cancelled) setViewProfile(data);
      } catch {
        if (!cancelled) setViewProfile(null);
      }
    })();

    /* 🧹 abort guard */
    return () => {
      cancelled = true;
    };
  }, [username]);

  /* ───── owner check ───── */
  const isOwner = Boolean(user && user.username === username);

  /* 🔎 Debug log (dev only) */
  if (process.env.NODE_ENV !== "production") {

    console.log({
      urlUsername: username,
      loggedUser: user?.username,
      loggedUserId: user?.id,
      profileUserId: viewProfile?.userId,
      isOwner,
    });
  }

  /* ───── UI states ───── */
  if (viewProfile === undefined) {
    return <div className="p-8 text-center">Loading profile…</div>;
  }

  if (viewProfile === null) {
    if (isOwner) {
      return (
        <div className="p-8 text-center">
          You haven’t created your profile yet. <br />
          <Link href="/profile" className="underline text-blue-600">
            Create it now →
          </Link>
        </div>
      );
    }

    return <div className="p-8 text-center">Profile not found 😢</div>;
  }

  /* ───── main render ───── */
  return (
    <div className="relative w-full">
      {/* Cover photo (editable only by owner) */}
      <CoverUploader isOwner={isOwner} coverImage={viewProfile.coverImage || ""} />

      {/* Profile & Support cards overlay */}
      <div
        className="
          absolute left-1/2 top-full
          -translate-x-1/2 -translate-y-[30%]
          grid grid-cols-1 lg:grid-cols-2 gap-6
          w-full max-w-6xl px-4 z-10
        "
      >
        <ProfileCard profile={viewProfile} isOwner={isOwner} />
        <SupportCard profile={viewProfile} isOwner={isOwner} />
      </div>

      {/* bottom spacer to push content below fixed overlay */}
      <div className="h-32 lg:h-40" />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import CoverUploader from "@/app/_components/CoverUploader";
import ProfileCard from "@/app/_components/ProfileCard";
import SupportCard from "@/app/_components/SupportCard";
import { useAuth } from "@/app/_components/UserProvider";

import type { Profile } from "@/app/types/user";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function PublicProfilePage() {

  const { username } = useParams() as { username: string };


  const { user } = useAuth();


  const [viewProfile, setViewProfile] = useState<Profile | null | undefined>(
    undefined
  );


  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const res = await fetch(`${API}/profiles/by-username/${username}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("404");

        const data: Profile = await res.json();
        if (!cancelled) setViewProfile(data);
      } catch {
        if (!cancelled) setViewProfile(null);
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [username]);


  const isOwner =
    user?.username === username || user?.id === viewProfile?.userId;


  if (process.env.NODE_ENV !== "production") {
    console.log({
      urlUsername: username,
      loggedUser: user?.username,
      loggedUserId: user?.id,
      profileUserId: viewProfile?.userId,
      isOwner,
    });
  }


  if (viewProfile === undefined) {
    return <div className="p-8 text-center">Loading profile…</div>;
  }

  if (viewProfile === null) {
    return isOwner ? (
      <div className="p-8 text-center">
        You haven’t created your profile yet. <br />
        <Link href="/profile" className="underline text-blue-600">
          Create it now →
        </Link>
      </div>
    ) : (
      <div className="p-8 text-center">Profile not found 😢</div>
    );
  }


  return (
    <div className="relative w-full">
      <CoverUploader
        isOwner={isOwner}
        coverImage={viewProfile.coverImage ?? null}
      />

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

      <div className="h-32 lg:h-40" />
    </div>
  );
}

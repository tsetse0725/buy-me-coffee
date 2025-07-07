"use client";

import CoverUploader from "@/app/_components/CoverUploader";
import ProfileCard from "@/app/_components/ProfileCard";
import SupportCard from "@/app/_components/SupportCard";
import { useAuth } from "@/app/_components/UserProvider";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
  const { user, profile } = useAuth();
  const { username } = useParams() as { username: string };

  if (!profile) return null;
  const isOwner = user?.username === username;

  return (
    <div className="relative w-full">
      <CoverUploader isOwner={isOwner} coverImage={profile.coverImage ?? ""} />

      <div
        className="
          absolute left-1/2 top-full
          -translate-x-1/2 -translate-y-[30%]  /* ← энд л доош нь байрлуулж байна */
          grid grid-cols-1 lg:grid-cols-2 gap-6
          w-full max-w-6xl px-4 z-10
        "
      >
        <ProfileCard />
        <SupportCard profile={profile} />
      </div>

      <div className="h-32 lg:h-40" />
    </div>
  );
}

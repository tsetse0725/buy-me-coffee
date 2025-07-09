"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/app/_components/modal";
import EditProfileForm from "@/app/_components/EditProfileForm";
import RecentSupporters from "@/app/_components/RecentSupporters";
import type { Profile } from "@/app/types/user"; // ⬅️ Profile type

type Props = {
  profile: Profile;
  isOwner?: boolean;
};

export default function ProfileCard({ profile, isOwner }: Props) {
  const [open, setOpen] = useState(false);
  const firstName = profile.name?.split(" ")[0] || profile.name;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* ──────────────── TOP CARD ──────────────── */}
      <Card className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={profile.avatarImage || "/default-avatar.jpg"}
              alt={profile.name ?? "Avatar"}
              width={72}
              height={72}
              className="rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-semibold leading-tight">
                {profile.name}
              </h1>
              <p className="text-muted-foreground text-sm break-all">
                buymeacoffee.com/{profile.username}
              </p>
            </div>
          </div>

          {isOwner && (
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              Edit page
            </Button>
          )}
        </div>

        <hr className="border-muted" />

        <div>
          <h2 className="text-lg font-semibold mb-2">About {firstName}</h2>
          <p className="text-muted-foreground whitespace-pre-line">
            {profile.about || "—"}
          </p>
        </div>
      </Card>

      {/* ──────────────── SOCIAL LINK ──────────────── */}
      {profile.socialMediaURL && (
        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Social media URL</h2>
          <Link
            href={profile.socialMediaURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {profile.socialMediaURL}
          </Link>
        </Card>
      )}

      {/* ──────────────── RECENT SUPPORTERS ──────────────── */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Supporters</h2>
        <RecentSupporters />
      </Card>

      {/* ──────────────── MODAL ──────────────── */}
      {isOwner && open && (
        <Modal onClose={() => setOpen(false)}>
          <EditProfileForm onClose={() => setOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

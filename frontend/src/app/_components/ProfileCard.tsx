"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/_components/UserProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/app/_components/modal";
import EditProfileForm from "@/app/_components/EditProfileForm";
import RecentSupporters from "@/app/_components/RecentSupporters";

export default function ProfileCard() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user || !profile) return null;

  const isOwner =
    String(user.id) === String(profile.userId) ||
    user.username === profile.username;

  const firstName = profile.name?.split(" ")[0] || profile.name;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
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

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Supporters</h2>
        <RecentSupporters />
      </Card>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <EditProfileForm onClose={() => setOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

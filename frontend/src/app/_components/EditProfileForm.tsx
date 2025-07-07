"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/app/_components/UserProvider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Props {
  onClose: () => void;
}

export default function EditProfileForm({ onClose }: Props) {
  /* context (hook) — always unconditional */
  const { user, profile, setProfile } = useAuth();

  /* local state hooks — unconditional */
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [social, setSocial] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPrev, setAvatarPrev] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* populate form once profile is available */
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAbout(profile.about);
      setSocial(profile.socialMediaURL ?? "");
      setAvatarPrev(profile.avatarImage);
    }
  }, [profile]);

  /* cleanup blob URL */
  useEffect(() => {
    return () => {
      if (avatarPrev?.startsWith("blob:")) URL.revokeObjectURL(avatarPrev);
    };
  }, [avatarPrev]);

  /* guard AFTER hooks */
  if (!user || !profile) return null;

  /* handlers */
  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPrev(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", name);
      fd.append("about", about);
      fd.append("socialMediaURL", social);
      fd.append("userId", String(user.id));
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await fetch(`${API}/profiles/upload-avatar`, {
        method: "POST",
        body: fd,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setProfile(updated);
      toast.success("Profile updated");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  /* UI */
  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex justify-center">
        <label className="relative cursor-pointer group">
          <Image
            src={avatarPrev || "/default-avatar.jpg"}
            alt="avatar"
            width={100}
            height={100}
            className="rounded-full object-cover border"
          />
          <input type="file" accept="image/*" hidden onChange={handlePick} />
          <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
            📸
          </span>
        </label>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      {/* About */}
      <div className="space-y-2">
        <Label htmlFor="about">About</Label>
        <Textarea
          id="about"
          rows={4}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>

      {/* Social URL */}
      <div className="space-y-2">
        <Label htmlFor="social">Social media URL</Label>
        <Input
          id="social"
          value={social}
          onChange={(e) => setSocial(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

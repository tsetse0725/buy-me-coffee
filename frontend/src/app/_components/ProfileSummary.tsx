"use client";

import { useState } from "react";
import Image from "next/image";
import { CopyIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type UserType = {
  id: number | string;
  email: string;
};

export type ProfileType = {
  name?: string | null;
  avatarImage?: string | null;
} | null;

export interface EarningsTotals {
  last30: number;
  last90: number;
  all: number;
}

interface Props {
  user: UserType;
  profile?: ProfileType;
  earnings: EarningsTotals;
  range: "last30" | "last90" | "all";
  setRange: React.Dispatch<React.SetStateAction<"last30" | "last90" | "all">>;
}

export default function ProfileSummary({
  user,
  profile,
  earnings,
  range,
  setRange,
}: Props) {
  const avatar =
    profile?.avatarImage ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.email
    )}&size=128`;
  const displayName =
    profile?.name ?? (user?.email ? user.email.split("@")[0] : "Guest");

  const [open, setOpen] = useState(false);

  const ranges = [
    { id: "last30" as const, label: "Last 30 days" },
    { id: "last90" as const, label: "Last 90 days" },
    { id: "all" as const, label: "All time" },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://buymecoffee.com/${user.id}`);
    alert("Link copied!");
  };

  const currentTotal =
    range === "last30"
      ? earnings.last30
      : range === "last90"
      ? earnings.last90
      : earnings.all;

  return (
    <section className="border border-gray-300 rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Image
            src={avatar}
            alt="avatar"
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-lg">{displayName}</p>
            <p className="text-sm text-gray-500">buymecoffee.com/{user.id}</p>
          </div>
        </div>
        <Button
          onClick={handleCopy}
          className="bg-black text-white hover:bg-gray-800 flex gap-2"
        >
          <CopyIcon className="w-4 h-4" /> Share page link
        </Button>
      </div>

      <div className="space-y-2 relative">
        <div className="flex items-center gap-4">
          <p className="text-xl font-semibold">Earnings</p>

          <button
            onClick={() => setOpen((v) => !v)}
            className="border border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-1 relative"
          >
            {ranges.find((r) => r.id === range)?.label}
            <ChevronDown size={14} />
          </button>

          {open && (
            <div className="absolute left-24 top-8 w-40 bg-white border rounded shadow z-10 text-sm">
              {ranges.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    setRange(r.id);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                    r.id === range ? "font-medium" : ""
                  }`}
                >
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-5xl font-bold">${currentTotal}</p>
      </div>
    </section>
  );
}

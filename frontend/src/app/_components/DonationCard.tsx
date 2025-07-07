"use client";

import { useState } from "react";
import Image from "next/image";
import type { Donation } from "@/app/types";

/* helper: simpler time‑ago that keeps months & days accurate */
function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000); // seconds
  const MIN = 60,
    HOUR = 60 * MIN,
    DAY = 24 * HOUR,
    MONTH = 30 * DAY,
    YEAR = 365 * DAY;

  if (diff < MIN) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  if (diff < HOUR) {
    const v = Math.floor(diff / MIN);
    return `${v} minute${v !== 1 ? "s" : ""} ago`;
  }
  if (diff < DAY) {
    const v = Math.floor(diff / HOUR);
    return `${v} hour${v !== 1 ? "s" : ""} ago`;
  }
  if (diff < MONTH) {
    const v = Math.floor(diff / DAY);
    return `${v} day${v !== 1 ? "s" : ""} ago`;
  }
  if (diff < YEAR) {
    const v = Math.floor(diff / MONTH);
    return `${v} month${v !== 1 ? "s" : ""} ago`;
  }
  const v = Math.floor(diff / YEAR);
  return `${v} year${v !== 1 ? "s" : ""} ago`;
}

interface Props {
  donation: Donation;
}

export default function DonationCard({ donation }: Props) {
  const [showFull, setShowFull] = useState(false);
  const { donor } = donation;

  /* avatar */
  const avatar = donor.avatarImage || null;
  const initials = donor.username
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* message */
  const MAX = 140;
  const long = donation.specialMessage.length > MAX;
  const msg = showFull ? donation.specialMessage : donation.specialMessage.slice(0, MAX);

  return (
    <div className="border border-gray-300 rounded-xl p-4 flex justify-between items-start gap-4 hover:bg-gray-50">
      {/* left */}
      <div className="flex gap-4 max-w-[70%]">
        {avatar ? (
          <Image src={avatar} alt={donor.username} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">
            {initials}
          </div>
        )}

        <div className="space-y-0.5">
          <p className="font-medium">{donor.username}</p>
          <p className="text-xs text-gray-500">{donation.socialURLOrBuyMeACoffee}</p>
          {donation.specialMessage && (
            <p className="text-sm mt-1 whitespace-pre-wrap">
              {msg}
              {long && (
                <>
                  {!showFull && "… "}
                  <button onClick={() => setShowFull(!showFull)} className="text-blue-600 hover:underline text-xs ml-1">
                    {showFull ? "Show less" : "Show more"}
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* right */}
      <div className="text-right whitespace-nowrap">
        <p className="font-semibold text-green-700">+${donation.amount}</p>
        <p className="text-xs text-gray-400">{timeAgo(new Date(donation.createdAt))}</p>
      </div>
    </div>
  );
}
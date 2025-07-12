"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Donation } from "@/app/types"; 

type Supporter = {
  id: number;
  name: string;
  amount: number;
  message?: string;
  avatar?: string | null;
};

type Props = {
  userId: number;
  initialCount?: number;
};

export default function RecentSupporters({
  userId,
  initialCount = 4,
}: Props) {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const res = await fetch(`${baseUrl}/donations/recent/${userId}`);
        const json = await res.json();
              console.log("✅ Supporters data:", json.donations); 

const formatted = (json.donations as Donation[]).map((d) => ({
  id: d.id,
  name: d.donor?.username || "Anonymous",
  amount: d.amount,
  message: d.specialMessage,
  avatar: d.donor?.profile?.avatarImage ?? null, 
}));

        setSupporters(formatted);
      } catch (err) {
        console.error("❌ Failed to load supporters:", err);
      }
    };

    fetchSupporters();
  }, [userId]);

  const visible = expanded
    ? supporters.length
    : Math.min(initialCount, supporters.length);

  const items = supporters.slice(0, visible);

return (
  <div className="space-y-4">
    {supporters.length === 0 ? (
      <div className="flex flex-col items-center justify-center text-gray-500 py-10">
        <span className="text-3xl">❤️</span>
        <p className="mt-2">Be the first one to support</p>
      </div>
    ) : (
      <>
        {items.map((s) => (
          <div key={s.id} className="flex gap-4">
            <Image
              src={s.avatar || "/default-avatar.jpg"}
              alt={s.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-medium">
                {s.name} bought ${s.amount} coffee
              </p>
              {s.message && (
                <p className="text-muted-foreground text-sm line-clamp-1">
                  {s.message}
                </p>
              )}
            </div>
          </div>
        ))}

        {supporters.length > initialCount && (
          <div className="text-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "See less ˄" : "See more ˅"}
            </Button>
          </div>
        )}
      </>
    )}
  </div>
);

}

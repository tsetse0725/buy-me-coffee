"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Supporter = {
  name: string;
  amount: number;
  message?: string;
  avatar?: string;
};

const supporters: Supporter[] = [
  {
    name: "John Doe",
    amount: 5,
    message: "Thank you for being so awesome everyday!",
    avatar: "/11.jpeg",
  },
  {
    name: "Jake",
    amount: 10,
    avatar: "/22.jpeg",
  },
  {
    name: "Guest",
    amount: 2,
    message:
      "Thank you for being so awesome everyday! You always manage to brighten up my day...",
    avatar: "/33.jpeg",
  },
  {
    name: "Jake",
    amount: 10,
    avatar: "/44.jpeg",
  },
  {
    name: "Alice",
    amount: 7,
    avatar: "/55.jpeg",
  },
  {
    name: "Bob",
    amount: 3,
    avatar: "/66.jpeg",
  },
];

const INITIAL_COUNT = 4;

export default function RecentSupporters() {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded
    ? supporters.length
    : Math.min(INITIAL_COUNT, supporters.length);

  const toggle = () => setExpanded((prev) => !prev);

  const items = supporters.slice(0, visible);

  const hasHidden = supporters.length > visible;

  return (
    <div className="space-y-4">
      {items.map((s, i) => (
        <div key={i} className="flex gap-4">
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

      {supporters.length > INITIAL_COUNT && (
        <div className="text-center pt-2">
          <Button variant="ghost" size="sm" onClick={toggle}>
            {expanded ? "See less" : hasHidden ? "See more" : "See less"}{" "}
            <span className="ml-1">{expanded ? "˄" : "˅"}</span>
          </Button>
        </div>
      )}
    </div>
  );
}

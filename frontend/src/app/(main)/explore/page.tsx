"use client";

import { useEffect, useState } from "react";
import SearchInput from "@/app/_components/SearchInput";
import ExploreList from "./ExploreList";
import type { Profile } from "@/app/types/user";

export default function ExplorePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${base}/profiles`);
        const data = await res.json();
        setProfiles(data); // ← `data.profiles` биш!
      } catch (err) {
        console.error("❌ Failed to fetch profiles:", err);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Explore Creators</h1>

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search by name..."
      />

      <ExploreList profiles={profiles} query={query} />
    </div>
  );
}

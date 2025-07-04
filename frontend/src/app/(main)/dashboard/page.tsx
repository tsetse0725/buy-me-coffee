"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/_components/UserProvider";

interface Donation {
  id: number;
  amount: number;
  specialMessage: string;
  socialURLOrBuyMeACoffee: string;
  donor: { username: string };
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<number>(0);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    if (!user) return;
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    fetch(`${base}/donations/earnings/${user.id}?days=30`)
      .then((r) => r.json())
      .then((d) => setEarnings(d.earnings));

    fetch(`${base}/donations/recent/${user.id}?limit=10`)
      .then((r) => r.json())
      .then((d) => setDonations(d));
  }, [user]);

  if (!user) return null;

  return (
    <div className="p-8">
      <section className="mb-8 border p-6 rounded">
        {user && user.email && (
          <h2 className="text-xl font-semibold mb-1">
            {user.email.split("@")[0]}
          </h2>
        )}

        <p className="text-sm text-gray-500 mb-4">buymecoffee.com/{user.id}</p>

        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">Earnings</h3>
          <select className="border rounded px-2 py-1 text-sm" disabled>
            <option>Last 30 days</option>
          </select>
        </div>

        <p className="text-4xl font-bold mt-2">${earnings}</p>
      </section>

      <section>
        <h3 className="text-lg font-medium mb-3">Recent transactions</h3>
        <div className="space-y-4">
          {donations.map((d) => (
            <div key={d.id} className="border rounded p-4 flex justify-between">
              <div>
                <p className="font-semibold">{d.donor.username}</p>
                <p className="text-xs text-gray-500">
                  {d.socialURLOrBuyMeACoffee}
                </p>
                <p className="mt-1">{d.specialMessage}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">+${d.amount}</p>
                <p className="text-xs text-gray-400">
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(d.createdAt))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

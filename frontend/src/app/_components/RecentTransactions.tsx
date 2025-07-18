"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import DonationCard from "./DonationCard";

interface Props {
  userId: number;
  range: "last30" | "last90" | "all";
}

interface SupporterDonation {
  id: number;
  amount: number;
  specialMessage: string;
  createdAt: string;
  donor: {
    username: string;
    socialURLOrBuyMeACoffee?: string;
    profile?: {
      avatarImage?: string | null;
    };
  };
}

const AMOUNTS = [1, 2, 5, 10] as const;

export default function RecentTransactions({ userId, range }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [donations, setDonations] = useState<SupporterDonation[]>([]);

  const toggle = (amt: number) => {
    setSelected((prev) =>
      prev.includes(amt) ? prev.filter((n) => n !== amt) : [...prev, amt]
    );
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/donations/recent/${userId}`);
        const json = await res.json();
        setDonations(json.donations || []);
      } catch (err) {
        console.error(" Failed to fetch donations:", err);
      }
    };

    fetchDonations();
  }, [userId]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const maxDays = range === "last30" ? 30 : range === "last90" ? 90 : Infinity;

    return donations.filter((d) => {
      const diffMs = now - new Date(d.createdAt).getTime();
      const inRange = diffMs <= maxDays * 24 * 60 * 60 * 1000;
      const inAmount = selected.length === 0 || selected.includes(d.amount);
      return inRange && inAmount;
    });
  }, [donations, selected, range]);

  return (
    <section className="space-y-4 relative">

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Recent transactions</h3>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="border px-3 py-1 rounded flex items-center gap-1 text-sm"
          >
            <ChevronDown size={14} /> Amount
          </button>

          {open && (
            <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow z-10 p-2 space-y-1">
              {AMOUNTS.map((amt) => (
                <label
                  key={amt}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(amt)}
                    onChange={() => toggle(amt)}
                    className="form-checkbox h-4 w-4 rounded focus:ring-0"
                  />
                  ${amt}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>


      <div className="flex flex-col space-y-4">
        {filtered.length ? (
          filtered.map((d) => (
            <DonationCard key={d.id} donation={d} />
          ))
        ) : (
          <>
            {selected.length === 0 ? (
              <div className="border rounded-xl px-6 py-10 text-center text-gray-600 space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <ChevronDown
                    className="h-6 w-6 text-gray-500 rotate-180"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="font-medium">You don’t have any supporters yet</p>
                <p className="text-sm text-gray-500">
                  Share your page with your audience to get started.
                </p>
              </div>
            ) : (
              <p className="italic text-sm text-gray-500">
                No transactions match the selected amount.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

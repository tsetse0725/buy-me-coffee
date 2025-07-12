"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type DonationRes = {
  id: number;
  specialMessage: string | null;
  donor: {
    username: string | null;
    profile: { avatarImage: string | null } | null;
  } | null;
};

export default function DonationSuccessPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [donation, setDonation] = useState<DonationRes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDonation = async () => {
      try {
        const res = await axios.get<DonationRes>(`${API}/donations/${id}`);
        setDonation(res.data);
      } catch (err) {
        console.error("Failed to load donation:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id]);

  if (loading)
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  if (!donation)
    return (
      <div className="text-center mt-20 text-red-500">Donation not found</div>
    );

  const donorName = donation.donor?.username ?? "Guest";
  const donorAvatar =
    donation.donor?.profile?.avatarImage ?? "/default-avatar.png";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-green-500 rounded-full p-4 mb-4">
        <svg
          className="h-8 w-8 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-xl font-semibold mb-6">Donation Complete!</h1>

      <div className="bg-white shadow-md rounded-md p-4 w-full max-w-md text-left">
        <div className="flex items-center gap-3 mb-2">
          <Image
            src={donorAvatar}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <p className="font-semibold">{donorName}:</p>
        </div>
        <p className="text-gray-700">
          {donation.specialMessage ?? "Thank you!"}
        </p>
      </div>

      <button
        onClick={() => router.push("/explore")}
        className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
      >
        Return to explore
      </button>
    </main>
  );
}

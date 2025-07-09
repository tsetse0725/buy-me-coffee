"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/UserProvider";
import QRModal from "@/app/_components/QRModal";
import type { Profile } from "@/app/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

interface Props {
  profile: Profile;
  isOwner?: boolean;
}

export default function SupportCard({ profile }: Props) {
  const { user, profile: myProfile } = useAuth();
  const router = useRouter();                          // 🆕 router

  /* ---------- permission flags ---------- */
  const isLoggedIn = !!user;
  const hasProfileCreated = !!myProfile;
  const isOwner = user?.id === profile.userId;
  const canSupport = isLoggedIn && hasProfileCreated && !isOwner;

  let helper = "";
  if (!isLoggedIn) helper = "Login / Sign up to support";
  else if (!hasProfileCreated) helper = "Create your profile first";
  else if (isOwner) helper = "You can’t support yourself 🙂";

  /* ---------- UI state ---------- */
  const amounts = [1, 2, 5, 10];
  const [selected, setSelected] = useState(5);
  const [url, setURL] = useState("");
  const [message, setMessage] = useState("");

  const [qrURL, setQrURL] = useState("");
  const [qrDonationId, setQrDonationId] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);

  const disabled = !canSupport || !message.trim();

  /* ---------- create donation + show QR ---------- */
  const handleSupport = async () => {
    if (disabled) return;
    try {
      const res = await fetch(`${API_BASE}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selected,
          specialMessage: message,
          socialURLOrBuyMeACoffee: url,
          recipientId: profile.userId,
          donorId: user?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create donation");

      setQrURL(data.paymentUrl);
      setQrDonationId(data.id);
      setShowQR(true);
      setMessage("");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  /* ---------- SSE: listen for PAID ---------- */
  useEffect(() => {
    if (!showQR || !qrDonationId) return;

    const es = new EventSource(`${API_BASE}/donations/stream/${qrDonationId}`);

    es.onmessage = (e) => {
      try {
        const { status } = JSON.parse(e.data);
        if (status === "PAID") {
          es.close();
          router.push(`/donation/success/${qrDonationId}`); // ⬅️ redirect
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE connection error", err);
      es.close();
    };

    return () => es.close();
  }, [showQR, qrDonationId, router]);

  /* ---------- UI ---------- */
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-5">
      <h2 className="text-lg font-semibold mb-4">
        Buy {profile.name} a Coffee
      </h2>

      {/* amount buttons */}
      <div className="flex gap-2 mb-4">
        {amounts.map((amt) => (
          <button
            key={amt}
            onClick={() => setSelected(amt)}
            className={`px-3 py-1 rounded border text-sm transition ${
              amt === selected
                ? "bg-black text-white border-black"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            ☕ ${amt}
          </button>
        ))}
      </div>

      {/* link + message inputs */}
      <input
        value={url}
        onChange={(e) => setURL(e.target.value)}
        placeholder="buymeacoffee.com/"
        className="w-full border rounded px-3 py-2 mb-3 text-sm"
        disabled={!canSupport}
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Please write your message here"
        className="w-full border rounded px-3 py-2 h-24 text-sm"
        disabled={!canSupport}
      />

      {!canSupport && (
        <p className="text-center text-sm text-gray-500 mt-2">{helper}</p>
      )}

      {/* support button */}
      <button
        onClick={handleSupport}
        className={`w-full mt-4 py-2 rounded text-white transition ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
        disabled={disabled}
      >
        Support
      </button>

      {/* QR modal */}
      {showQR && (
        <QRModal
          url={qrURL}
          onClose={() => {
            setShowQR(false);
            setQrDonationId(null);
          }}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Profile } from "@/app/types/user";

type Props = { profile: Profile | null };

export default function SupportCard({ profile }: Props) {
  const amounts = [1, 2, 5, 10];
  const [selected, setSelected] = useState(5);
  const [url, setURL] = useState("");
  const [message, setMessage] = useState("");

  if (!profile) return null; // хамгаалалт

  const handleSupport = () => {
    console.table({ to: profile.username, amount: selected, url, message });
    alert(`🤝 Thanks for supporting ${profile.name}!`);
    setMessage("");
  };

  const disabled = !message.trim();

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-5">
      <h2 className="text-lg font-semibold mb-4">
        Buy {profile.name} a Coffee
      </h2>

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

      <input
        value={url}
        onChange={(e) => setURL(e.target.value)}
        placeholder="buymeacoffee.com/"
        className="w-full border rounded px-3 py-2 mb-3 text-sm"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Please write your message here"
        className="w-full border rounded px-3 py-2 h-24 text-sm"
      />

      <p className="text-purple-600 text-xs mt-2 select-all"></p>

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
    </div>
  );
}

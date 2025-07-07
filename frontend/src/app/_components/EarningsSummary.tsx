"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/** хугацааны сонголтууд */
const ranges = [
  { id: 30, label: "Last 30 days" },
  { id: 90, label: "Last 90 days" },
  { id: 0,  label: "All time" },
];

/** (Демо) дүн — backend-тай бол fetchTotal-ыг API дуудах болгон солино */
const DEMO_TOTAL = { 30: 450, 90: 880, 0: 1200 };

export default function EarningsSummary() {
  const [range, setRange] = useState<number>(30);
  const [total, setTotal] = useState<number>(DEMO_TOTAL[30]);
  const [open,  setOpen]  = useState(false);

  /* range солигдох бүрт дүн авах */
  useEffect(() => {
    const fetchTotal = async (days: number) => {
      /* 🔗 энд API дуудна
            жишээ: const { total } = await fetch(`/api/earnings?days=${days}`).then(r=>r.json())
      */
      return DEMO_TOTAL[days as 0 | 30 | 90];
    };
    fetchTotal(range).then(setTotal);
  }, [range]);

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Earnings</h2>

        {/* dropdown товч */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="border rounded-md px-3 py-1 flex items-center gap-1 text-sm"
          >
            {ranges.find(r => r.id === range)?.label}
            <ChevronDown size={14} />
          </button>

          {open && (
            <div className="absolute left-0 mt-1 w-40 bg-white border rounded shadow p-1 z-10">
              {ranges.map(r => (
                <div
                  key={r.id}
                  onClick={() => { setRange(r.id); setOpen(false); }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50
                              ${range === r.id ? "font-medium" : ""}`}
                >
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* дүн */}
      <p className="text-5xl font-bold">${total}</p>
    </section>
  );
}

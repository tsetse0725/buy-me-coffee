"use client";

import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      {/* Beans */}
      <div className="relative w-24 h-24">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 animate-bean"
            style={{ animationDelay: `${i * 3}s` }}
          >
            <Image src="/bean.png" alt="bean" className="w-6 h-6 mx-auto" />
          </div>
        ))}
      </div>
      <p className="text-xl">Loading</p>

      <style jsx>{`
        @keyframes bean {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .animate-bean {
          animation: bean 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

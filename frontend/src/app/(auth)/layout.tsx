"use client";

import Image from "next/image";
import { UserProvider } from "../_components/UserProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="w-screen h-screen flex">
        <div className="w-1/2 h-full bg-[#FFDD00] flex flex-col items-center justify-center text-center px-8 relative">
          <div className="absolute top-6 left-6 text-black font-semibold text-lg flex items-center">
            <Image
              src="/Logo.png"
              alt="Buy Me Coffee logo"
              width={120}
              height={32}
              priority
            />
          </div>

          <Image
            src="/illustration.png"
            alt="Coffee cup"
            width={160}
            height={160}
            className="w-40 h-40 mb-8"
          />

          <h2 className="text-xl font-bold text-black mb-2">
            Fund your creative work
          </h2>
          <p className="text-black text-sm max-w-xs">
            Accept support. Start a membership. Setup a shop. It’s easier than
            you think.
          </p>
        </div>

        <div className="w-1/2 h-full bg-white flex items-center justify-center">
          {children}
        </div>
      </div>
    </UserProvider>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/app/types";

type Props = {
  profile: Profile;
};

export default function CreatorCard({ profile }: Props) {
  return (
    <Link href={`/${profile.name}`}>
      <div className="border rounded-lg p-4 hover:shadow transition">
        <Image
          src={profile.avatarImage || "/placeholder.png"}
          alt={profile.name || ""}
          width={80}
          height={80}
          className="rounded-full w-20 h-20 object-cover mx-auto"
        />
        <h3 className="text-center font-semibold mt-2">{profile.name}</h3>
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

type Props = {
  username: string;
  name: string;
  avatarImage?: string | null;
  about: string;
  socialMediaURL?: string | null;
};

export default function ExploreCard({
  username,
  name,
  avatarImage,
  about,
  socialMediaURL,
}: Props) {
  return (
    <div className="border rounded-xl p-6 space-y-4 hover:bg-gray-50 transition relative">
      {/* 🟡 View Profile – Баруун дээд буланд */}
      <Link
        href={`/${username}`}
        className="absolute top-4 right-4 bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-800 flex items-center gap-1 hover:bg-gray-200 transition"
      >
        View profile <ExternalLink size={16} />
      </Link>

      {/* 🟢 Profile image + name */}
      <div className="flex items-center gap-4">
        {avatarImage ? (
          <Image
            src={avatarImage}
            alt={name}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
            {name[0]?.toUpperCase()}
          </div>
        )}
        <h2 className="text-xl font-semibold">{name}</h2>
      </div>

      {/* 🔵 About + Social media – 2 багана */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-gray-800 mb-1">About {name}</p>
          <p className="text-sm text-gray-700">{about}</p>
        </div>

        <div className="md:w-1/2">
          <p className="font-medium text-gray-800 mb-1">Social media URL</p>
          {socialMediaURL ? (
            <a
              href={socialMediaURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 break-words text-sm"
            >
              {socialMediaURL}
            </a>
          ) : (
            <p className="text-sm text-gray-400 italic">Not provided</p>
          )}
        </div>
      </div>
    </div>
  );
}

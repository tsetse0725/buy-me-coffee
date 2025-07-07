"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

type Props = {
  isOwner?: boolean;
  coverImage?: string | null;
};

export default function CoverUploader({ isOwner, coverImage }: Props) {
  console.log("[CoverUploader] isOwner =", isOwner, "coverImage =", coverImage);
  const [preview, setPreview] = useState<string>(coverImage || "");
  const [original, setOriginal] = useState<string>(coverImage || "");
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    setFile(f);
  };

  const handleCancel = () => {
    setPreview(original);
    setFile(null);
  };

  const handleSave = async () => {
    if (!file) return;

    console.log("Uploading:", file);

    setOriginal(preview);
    setFile(null);
  };

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="relative w-full aspect-[3/1] bg-gray-100 overflow-hidden">
      {preview && (
        <Image src={preview} alt="Cover" fill className="object-cover" />
      )}

      {isOwner && !file && !preview && (
        <button
          onClick={openPicker}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               flex items-center gap-2 px-4 py-2
               bg-black text-white rounded-md shadow-md
               hover:bg-gray-800 transition"
        >
          <Camera className="w-4 h-4" />
          Add a cover image
        </button>
      )}

      {isOwner && file && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleSave}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Save changes
          </button>
          <button
            onClick={handleCancel}
            className="bg-white text-black px-4 py-2 rounded-md border hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {isOwner && !file && !!original && (
        <button
          onClick={openPicker}
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2
               text-sm text-black bg-gray-100 rounded-md shadow
               hover:bg-gray-200 transition z-10"
        >
          <Camera className="w-4 h-4" />
          Change cover
        </button>
      )}

      {isOwner && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleChange}
        />
      )}
    </div>
  );
}

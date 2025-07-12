"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/_components/UserProvider";

interface Props {
  isOwner?: boolean;
  coverImage?: string | null;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function CoverUploader({ isOwner, coverImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, refreshAuth } = useAuth();

  const [preview, setPreview] = useState<string>(coverImage || "");
  const [original, setOriginal] = useState<string>(coverImage || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 🟡 coverImage prop өөрчлөгдөхөд preview sync хийх
  useEffect(() => {
    setPreview(coverImage || "");
    setOriginal(coverImage || "");
  }, [coverImage]);

  // 🧹 Component unmount үед blob URL цэвэрлэх
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
    if (!file || !user) return;
    try {
      setLoading(true);

      const form = new FormData();
      form.append("cover", file);
      form.append("userId", String(user.id));

      await axios.post(`${API}/profiles/upload-cover`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await refreshAuth(); // ✅ профайл дахин татах
      setOriginal(preview); // preview-г original болгож хадгалах
      setFile(null);
    } catch (err) {
      console.error("❌ Failed to upload cover image:", err);
      alert("⚠️ Cover зураг хадгалахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full aspect-[3/1] bg-gray-100 overflow-hidden">
      {/* ✅ Cover зураг байгаа үед – Preview */}
      {!!preview ? (
        <Image
          src={preview}
          alt="Cover"
          fill
          className="object-cover"
        />
      ) : (
        // 🕳️ Preview байхгүй үед placeholder харуулна
        <div className="w-full h-full bg-gray-100" />
      )}

      {/* 📷 Add товч – preview ч байхгүй, файл ч сонгоогүй үед */}
      {isOwner && !file && !preview && (
        <button
          onClick={openPicker}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20
                     flex items-center gap-2 px-4 py-2
                     bg-black text-white rounded-md shadow-md
                     hover:bg-gray-800 transition"
        >
          <Camera className="w-4 h-4" />
          Add a cover image
        </button>
      )}

      {/* 💾 Save / ❌ Cancel товч – файл сонгогдсон үед */}
      {isOwner && file && (
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-white text-black px-4 py-2 rounded-md border hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 🔄 Change товч – preview байгаа үед */}
      {isOwner && !file && !!original && (
        <button
          onClick={openPicker}
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2
                     text-sm text-black bg-gray-100 rounded-md shadow
                     hover:bg-gray-200 transition z-20"
        >
          <Camera className="w-4 h-4" />
          Change cover
        </button>
      )}

      {/* 📁 File input – зөвхөн эзэмшигчид */}
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

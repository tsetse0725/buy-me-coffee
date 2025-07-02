"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useAuth } from "./UserProvider";

/* ------------------------------------------------------------------
   Zod schema – FileList validation + text fields
   ------------------------------------------------------------------ */
const schema = z.object({
  file: z
    .any()
    .refine((v) => v && v.length > 0, {
      message: "Please choose image",
    }),
  name: z.string().min(1, "Please enter name"),
  about: z.string().min(1, "Please enter info about yourself"),
  social: z.string().url("Please enter a valid URL"),
});

type FormData = z.infer<typeof schema>;

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */
export default function ProfileForm() {
    const { user } = useAuth();            // user.id, user.email, ...
  const userId = user ? String(user.id) : "";
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  /* --------------------------------------------------------------
     Live preview for avatar
     -------------------------------------------------------------- */
  const watchedFile = watch("file");
  useEffect(() => {
    if (!watchedFile || watchedFile.length === 0) return;
    const url = URL.createObjectURL(watchedFile[0]);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [watchedFile]);

  /* --------------------------------------------------------------
     Submit handler
     -------------------------------------------------------------- */
  

     const onSubmit = async (data: FormData) => {
    const file = data.file[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("avatar", file);               // backend expects "avatar"
    fd.append("name", data.name);
    fd.append("about", data.about);
    fd.append("socialMediaURL", data.social);
    fd.append("userId", userId);               // TODO: replace with real user id

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/profiles/upload-avatar`,
        {
          method: "POST",
          body: fd,
        }
      );

      if (!res.ok) throw new Error(await res.text());

      alert("✅ Profile successfully created!");
      reset();
      setPreview(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "unknown";
      alert(`❌ Error: ${message}`);
    }
  };

  /* --------------------------------------------------------------
     Render
     -------------------------------------------------------------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto flex flex-col gap-5">
      {/* Avatar uploader */}
      <label className="self-center cursor-pointer relative">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={160}
            height={160}
            unoptimized
            className="rounded-full object-cover w-40 h-40"
          />
        ) : (
          <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
            <Camera className="text-gray-400" size={32} />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          {...register("file")}
        />
      </label>
      {errors.file && (
        <p className="text-sm text-red-500 text-center -mt-3">⚠️ {errors.file.message as string}</p>
      )}

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Name</label>
        <input
          {...register("name")}
          placeholder="Enter your name here"
          className={`border rounded px-3 py-2 outline-none focus:ring-2 ${
            errors.name ? "border-red-500 focus:ring-red-300" : "focus:ring-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-sm text-red-500">⚠️ {errors.name.message as string}</p>
        )}
      </div>

      {/* About */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">About</label>
        <textarea
          {...register("about")}
          placeholder="Write about yourself here"
          rows={4}
          className={`border rounded px-3 py-2 outline-none focus:ring-2 resize-none ${
            errors.about ? "border-red-500 focus:ring-red-300" : "focus:ring-gray-300"
          }`}
        />
        {errors.about && (
          <p className="text-sm text-red-500">⚠️ {errors.about.message as string}</p>
        )}
      </div>

      {/* Social URL */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Social media URL</label>
        <input
          {...register("social")}
          type="url"
          placeholder="https://"
          className={`border rounded px-3 py-2 outline-none focus:ring-2 ${
            errors.social ? "border-red-500 focus:ring-red-300" : "focus:ring-gray-300"
          }`}
        />
        {errors.social && (
          <p className="text-sm text-red-500">⚠️ {errors.social.message as string}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-2 px-6 py-2 rounded bg-black text-white hover:bg-gray-800"
      >
        Continue
      </button>
    </form>
  );
}

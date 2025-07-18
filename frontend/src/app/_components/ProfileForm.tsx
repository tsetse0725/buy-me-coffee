"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useAuth } from "./UserProvider";

const schema = z.object({
  file: z
    .any()
    .refine((v) => v && v.length > 0, { message: "Please choose image" }),
  name: z.string().min(1, "Please enter name"),
  about: z.string().min(1, "Please enter info about yourself"),
  social: z.string().url("Please enter a valid URL"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onNext: () => void;
}

export default function ProfileForm({ onNext }: Props) {
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";

  const fileRef = useRef<HTMLInputElement | null>(null); 
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const watchedFile = watch("file");

  useEffect(() => {
    if (!watchedFile?.length) return;
    const url = URL.createObjectURL(watchedFile[0]);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [watchedFile]);

  const handleClick = () => {
    fileRef.current?.click(); 
  };

  const onSubmit = async (data: FormData) => {
    const fd = new FormData();
    fd.append("avatar", data.file[0]);
    fd.append("name", data.name);
    fd.append("about", data.about);
    fd.append("socialMediaURL", data.social);
    fd.append("userId", userId);

    try {
      setLoading(true);
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const res = await fetch(`${base}/profiles/upload-avatar`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());

      reset();
      setPreview(null);
      onNext();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto flex flex-col gap-5"
    >

      <div className="self-center cursor-pointer relative" onClick={handleClick}>
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
          ref={(e) => {
            register("file").ref(e);
            fileRef.current = e;
          }}
        />
      </div>
      {errors.file && touchedFields.file && (
        <p className="text-sm text-red-500 text-center -mt-3">
           {String(errors.file.message)}
        </p>
      )}


      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Name</label>
        <input
          {...register("name")}
          placeholder="Enter your name here"
          className={`border rounded px-3 py-2 outline-none focus:ring-2 ${
            errors.name ? "border-red-500 focus:ring-red-300" : "focus:ring-gray-300"
          }`}
        />
        {errors.name && touchedFields.name && (
          <p className="text-sm text-red-500"> {String(errors.name.message)}</p>
        )}
      </div>


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
        {errors.about && touchedFields.about && (
          <p className="text-sm text-red-500"> {String(errors.about.message)}</p>
        )}
      </div>


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
        {errors.social && touchedFields.social && (
          <p className="text-sm text-red-500"> {String(errors.social.message)}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="mt-2 px-6 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-40"
      >
        {loading ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}

"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/_components/UserProvider";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  about: z.string().optional(),
  socialMediaURL: z.string().url("Invalid URL").optional(),
});

type PersonalInfoFormData = z.infer<typeof schema>;

export default function PersonalInfoForm() {
  const { user, profile, refreshAuth } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(profile?.avatarImage || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name || "",
      about: profile?.about || "",
      socialMediaURL: profile?.socialMediaURL || "",
    },
  });


  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        about: profile.about || "",
        socialMediaURL: profile.socialMediaURL || "",
      });
    }
  }, [profile, reset]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(profile?.avatarImage || "");
    }
  }, [file, profile?.avatarImage]);

  const handlePickImage = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
    }
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", data.name);
      if (data.about) formData.append("about", data.about);
      if (data.socialMediaURL) formData.append("socialMediaURL", data.socialMediaURL);
      formData.append("userId", String(user.id));
      if (file) formData.append("avatar", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/upload-avatar`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      await refreshAuth(); 
      setFile(null);
    } catch (err) {
      console.error(" Error updating profile:", err);
      alert(" Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border rounded-lg px-6 py-8 shadow-sm space-y-6 max-w-xl mx-auto"
    >
      <h2 className="text-lg font-semibold">Personal Info</h2>


      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Your photo</span>
        <div
          onClick={handlePickImage}
          className="relative w-32 h-32 cursor-pointer group"
        >
          <Image
            src={preview || "/default-avatar.png"}
            alt="Profile"
            fill
            className="rounded-full object-cover border"
          />
          <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-sm">📷 Change</span>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          {...register("name")}
          id="name"
          placeholder="Your name"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>


      <div>
        <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
          About
        </label>
        <textarea
          {...register("about")}
          id="about"
          placeholder="Tell your supporters a bit about yourself"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>


      <div>
        <label htmlFor="socialMediaURL" className="block text-sm font-medium text-gray-700 mb-1">
          Social media URL
        </label>
        <input
          {...register("socialMediaURL")}
          id="socialMediaURL"
          placeholder="https://"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.socialMediaURL && (
          <p className="text-sm text-red-500 mt-1">{errors.socialMediaURL.message}</p>
        )}
      </div>


      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition w-full disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

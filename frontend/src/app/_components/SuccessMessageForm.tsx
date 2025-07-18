"use client";

import { useEffect } from "react";              
import { useForm } from "react-hook-form";      
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/_components/UserProvider";

const schema = z.object({
  successMessage: z
    .string()
    .min(10, "Message is too short")
    .max(300, "Too long. Keep it under 300 characters."),
});

type FormData = z.infer<typeof schema>;

export default function SuccessMessageForm() {
  const { user, profile, refreshAuth } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      successMessage: profile?.successMessage ?? "",
    },
  });


  useEffect(() => {
    if (profile?.successMessage) {
      reset({ successMessage: profile.successMessage });
    }
  }, [profile?.successMessage, reset]);

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const url = `${apiBase}/profiles/${user.id}`;
    console.log("🔗 Final PATCH URL:", url);

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ successMessage: data.successMessage }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("RESPONSE STATUS:", res.status);
        console.error("RESPONSE TEXT:", errorText);
        throw new Error(`Failed to save: ${errorText}`);
      }

      console.log(" Saved to backend");

      await refreshAuth(); 
    } catch (err) {
      console.error("Error saving message:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border rounded-lg px-6 py-8 shadow-sm space-y-6 max-w-xl mx-auto"
    >
      <h2 className="text-lg font-semibold">Success page</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirmation message
        </label>
        <textarea
          rows={4}
          {...register("successMessage")}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        {errors.successMessage && (
          <p className="text-sm text-red-500 mt-1">
            {errors.successMessage.message}
          </p>
        )}
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="px-6 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition w-full"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

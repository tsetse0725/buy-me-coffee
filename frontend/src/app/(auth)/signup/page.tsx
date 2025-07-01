"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(24, "Max 24 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and _"),
});

type FormData = z.infer<typeof schema>;

export default function UsernameStep() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    router.push(
      `/signup/details?username=${encodeURIComponent(data.username)}`
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-semibold">Create Your Account</h1>
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            placeholder="Enter username here"
            {...register("username")}
            className={`w-full rounded-md border px-4 py-2 outline-none transition ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-md bg-black text-white py-2 disabled:bg-gray-300"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

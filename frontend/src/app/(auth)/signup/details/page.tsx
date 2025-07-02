"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "1 uppercase required")
    .regex(/[a-z]/, "1 lowercase required")
    .regex(/[0-9]/, "1 number required"),
});
type FormData = z.infer<typeof schema>;

export default function SignupDetails() {
  const router = useRouter();
  const params = useSearchParams();

  const username = params.get("username") ?? "";

  /* Хэрвээ username-гүй бол 1-р шат руу буцаана */
  useEffect(() => {
    if (!username) router.replace("/signup");
  }, [username, router]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/signup`,
        { username, ...data },
      );
console.log("✅ ENV:", process.env.NEXT_PUBLIC_API_URL);
      /* token localStorage — түр */
      localStorage.setItem("token", res.data.token);

      /* Амжилттай → home */
      router.replace("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const apiErr = error as AxiosError<{ message?: string }>;
        setErrorMsg(apiErr.response?.data?.message ?? "Signup failed.");
      } else {
        setErrorMsg("Unexpected error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="mb-2 text-2xl font-semibold">Create your account</h1>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            autoComplete="email"
            {...register("email")}
            className={`w-full rounded-md border px-4 py-2 outline-none transition ${
              errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-black"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
            {...register("password")}
            className={`w-full rounded-md border px-4 py-2 outline-none transition ${
              errors.password
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-black"
            }`}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {errorMsg && (
          <p className="text-center text-sm text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full rounded-md bg-black py-2 text-white disabled:bg-gray-300"
        >
          {loading ? "Signing up…" : "Sign up"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/_components/UserProvider";

/* ───── validation schema ───── */
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  /* ───── context ───── */
  const { user, profile, initializing, refreshAuth } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ───── react-hook-form ───── */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  /* ───── redirect logic ───── */
  useEffect(() => {
    if (!initializing && user) {
      if (profile) {
        router.replace("/dashboard");
      } else {
        router.replace("/profile");
      }
    }
  }, [user, profile, initializing, router]);

  /* ───── UI guard ───── */
  if (initializing)
    return <div className="p-6 text-center">Checking session…</div>;
  if (user) return null;

  /* ───── form submit ───── */
  const onSubmit = async (data: FormData) => {
    try {
      setErrorMsg(null);
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        data
      );
      localStorage.setItem("token", res.data.token);

      // ⟳ Profile болон user context-оор шинэчлэх
      await refreshAuth();

      // ✅ Profile байгаа эсэхээр redirect хийх
      if (profile) router.replace("/dashboard");
      else router.replace("/profile");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiErr = err as AxiosError<{ message?: string }>;
        setErrorMsg(apiErr.response?.data?.message ?? "Unable to log in.");
      } else {
        setErrorMsg("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Link
        href="/signup"
        className="absolute top-6 right-6 rounded-md bg-gray-100 px-5 py-2 text-sm font-medium hover:bg-gray-200"
      >
        Sign up
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="mb-2 text-2xl font-semibold">Welcome back</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter email"
            {...register("email")}
            className={`w-full rounded-md border px-4 py-2 outline-none ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
            {...register("password")}
            className={`w-full rounded-md border px-4 py-2 outline-none ${
              errors.password ? "border-red-500" : "border-gray-200"
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
          {loading ? "Logging in…" : "Continue"}
        </button>
      </form>
    </div>
  );
}

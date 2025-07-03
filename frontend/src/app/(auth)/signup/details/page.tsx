"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ---------------- zod schema ---------------- */
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
  const params  = useSearchParams();
  const username = params.get("username") ?? "";

  /* username алга бол эхний алхам руу буцаана */
  useEffect(() => {
    if (!username) router.replace("/signup");
  }, [username, router]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  /* --------------- submit --------------- */
  const onSubmit = async (data: FormData) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/signup`,
        { username, ...data }
      );

      /* 🔑  Токен хадгалахгүй! */
      localStorage.removeItem("token");

      /* ↪️  Login руу, амжилтын query параметртэй */
      router.replace("/login?justSignedUp=1");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiErr = err as AxiosError<{ message?: string }>;
        setErrorMsg(apiErr.response?.data?.message ?? "Signup failed.");
      } else setErrorMsg("Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  /* --------------- UI --------------- */
  return (
    <div className="flex h-full w-full items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="mb-2 text-2xl font-semibold">Create your account</h1>

        {/* email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            {...register("email")}
            className={`w-full rounded-md border px-4 py-2 outline-none ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            autoComplete="new-password"
            {...register("password")}
            className={`w-full rounded-md border px-4 py-2 outline-none ${
              errors.password ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {errorMsg && <p className="text-center text-sm text-red-600">{errorMsg}</p>}

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

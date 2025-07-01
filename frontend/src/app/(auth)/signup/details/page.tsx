"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";

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

export default function DetailsStep() {
  const params = useSearchParams();
  const router = useRouter();
  const username = params.get("username") || "friend";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      console.table({ username, ...data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6"
      >
        <Link
          href="/login"
          className="absolute top-6 right-6 bg-gray-100 px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
        >
          Log in
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            Welcome <span className="lowercase">{username}</span>
          </h1>
          <p className="text-sm text-gray-500">
            Connect email and set a password
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email here"
            {...register("email")}
            className={`w-full rounded-md border px-4 py-2 outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password here"
            {...register("password")}
            className={`w-full rounded-md border px-4 py-2 outline-none ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-sm text-red-500 whitespace-pre-line">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full rounded-md bg-black text-white py-2 disabled:bg-gray-300"
        >
          {loading ? "Loading..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

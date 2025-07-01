"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter(); 
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
    try {
      console.log(" Login data:", data);


      router.push("/");
    } catch (error) {
      console.error(" Login error:", error);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Link href="/signup" className="absolute top-6 right-6 bg-gray-100 px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-200">
        Sign up
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email here"
            autoComplete="email"
            {...register("email")}
            className={`w-full rounded-md border px-4 py-2 outline-none transition
              ${errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-black"}`}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password here"
            autoComplete="current-password"
            {...register("password")}
            className={`w-full rounded-md border px-4 py-2 outline-none transition
              ${errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-black"}`}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={!isValid} className="w-full rounded-md bg-black text-white py-2 disabled:bg-gray-300">
          Continue
        </button>
      </form>
    </div>
  );
}

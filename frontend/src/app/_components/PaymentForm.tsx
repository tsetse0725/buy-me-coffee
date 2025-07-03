"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const schema = z.object({
  country: z.string().min(1, "Select a country"),
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  cardNumber: z
    .string()
    .regex(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "XXXX-XXXX-XXXX-XXXX"),
  month: z.string().regex(/^\d{2}$/, "MM"),
  year: z.string().regex(/^\d{4}$/, "YYYY"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC"),
});
type FormData = z.infer<typeof schema>;

interface Props {
  onBack: () => void;
  onFinish: () => void;
}


function LoadingScreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <div className="relative w-24 h-24">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 animate-bean"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <Image
              src="/bean.png"
              alt="bean"
              width={24}
              height={24}
              className="mx-auto"
            />
          </div>
        ))}
      </div>
      <p className="text-xl">Loading</p>

      <style jsx>{`
        @keyframes bean {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px) scale(0.8);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .animate-bean {
          animation: bean 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}


export default function PaymentForm({ onBack, onFinish }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);


  const submit = async (data: FormData) => {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      await fetch(`${base}/bankcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localStorage.getItem("uid"),
          country: data.country,
          firstName: data.firstName,
          lastName: data.lastName,
          cardNumber: data.cardNumber,
          expiryMonth: Number(data.month),
          expiryYear: Number(data.year),
          cvc: data.cvc,
        }),
      });

      setRedirecting(true);      // 👉 loader
      onFinish?.();
      router.replace("/dashboard");
    } catch {
      alert("Failed to save card");
    } finally {
      setLoading(false);
    }
  };


  if (redirecting) return <LoadingScreen />;


  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="max-w-md mx-auto mt-20 space-y-6 px-4"
    >
      <h2 className="text-2xl font-semibold">How would you like to be paid?</h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter location and payment details
      </p>


      <div>
        <label className="block text-sm font-medium mb-1">Select country</label>
        <select
          {...register("country")}
          defaultValue=""
          className="w-full border rounded-md py-2 px-3"
        >
          <option value="" disabled>
            Select
          </option>
          <option>Mongolia</option>
          <option>United States</option>
          <option>Japan</option>
        </select>
        {errors.country && touchedFields.country && (
          <p className="text-xs text-red-500 mt-1">
            {errors.country.message as string}
          </p>
        )}
      </div>


      {(() => {
        const nameFields = ["firstName", "lastName"] as const;
        return (
          <div className="grid grid-cols-2 gap-4">
            {nameFields.map((f) => (
              <div key={f}>
                <label className="block text-sm font-medium mb-1">
                  {f === "firstName" ? "First name" : "Last name"}
                </label>
                <input
                  {...register(f)}
                  placeholder="Enter your name here"
                  className="w-full border rounded-md py-2 px-3"
                />
                {errors[f] && touchedFields[f] && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[f]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      })()}


      <div>
        <label className="block text-sm font-medium mb-1">
          Enter card number
        </label>
        <input
          {...register("cardNumber")}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="w-full border rounded-md py-2 px-3"
        />
        {errors.cardNumber && touchedFields.cardNumber && (
          <p className="text-xs text-red-500 mt-1">
            {errors.cardNumber.message as string}
          </p>
        )}
      </div>


      <div className="grid grid-cols-3 gap-4">

        <div>
          <label className="block text-sm font-medium mb-1">Expires</label>
          <select
            {...register("month")}
            defaultValue=""
            className="w-full border rounded-md py-2 px-3"
          >
            <option value="" disabled>
              Month
            </option>
            {months.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          {errors.month && touchedFields.month && (
            <p className="text-xs text-red-500 mt-1">
              {errors.month.message as string}
            </p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            {...register("year")}
            defaultValue=""
            className="w-full border rounded-md py-2 px-3"
          >
            <option value="" disabled>
              Year
            </option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          {errors.year && touchedFields.year && (
            <p className="text-xs text-red-500 mt-1">
              {errors.year.message as string}
            </p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">CVC</label>
          <input
            {...register("cvc")}
            placeholder="CVC"
            className="w-full border rounded-md py-2 px-3"
          />
          {errors.cvc && touchedFields.cvc && (
            <p className="text-xs text-red-500 mt-1">
              {errors.cvc.message as string}
            </p>
          )}
        </div>
      </div>


      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-black"
        >
          ‹ Back
        </button>
        <button
          type="submit"
          disabled={!isValid || loading}
          className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Saving…" : "Continue"}
        </button>
      </div>
    </form>
  );
}

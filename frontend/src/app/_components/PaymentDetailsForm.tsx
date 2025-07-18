"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/_components/UserProvider";

const schema = z.object({
  country: z.string().min(1, "Required"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryMonth: z.string().min(1, "Required"),
  expiryYear: z.string().min(1, "Required"),
  cvc: z.string().regex(/^\d{3}$/, "CVC must be 3 digits"),
});

type PaymentFormData = z.infer<typeof schema>;

export default function PaymentDetailsForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "",
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
    },
  });

  // 🔄 Load card info
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bankcards/${user.id}`
        );
        if (!res.ok) return;

        const card: {
          firstName: string;
          lastName: string;
          cardNumber: string;
          expiryMonth: string;
          expiryYear: string;
          cvc?: string;
          country: string;
        } = await res.json();

        setValue("firstName", card.firstName);
        setValue("lastName", card.lastName);
        setValue("cardNumber", card.cardNumber.replace(/-/g, ""));
        setValue("country", card.country);
        setValue("expiryMonth", card.expiryMonth);
        setValue("expiryYear", card.expiryYear);
      } catch {
        console.error(" Failed to fetch card data");
      }
    };

    fetchData();
  }, [user, setValue]);

  const onSubmit = async (data: PaymentFormData) => {
    if (!user?.id) return alert("User not logged in");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bankcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: user.id }),
      });

      if (!res.ok) throw new Error("Failed to save");
      alert(" Bank card saved!");
    } catch (err) {
      console.error(" Save error:", err);
      alert(" Failed to save card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border rounded-lg px-6 py-8 shadow-sm space-y-6 max-w-xl mx-auto"
    >
      <h2 className="text-lg font-semibold">Payment details</h2>


      <div>
        <label className="block text-sm font-medium mb-1">Select country</label>
        <select
          {...register("country")}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">-- Select --</option>
          <option>United States</option>
          <option>Mongolia</option>
          <option>Japan</option>
        </select>
        {errors.country && (
          <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
        )}
      </div>


      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">First name</label>
          <input
            {...register("firstName")}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">Last name</label>
          <input
            {...register("lastName")}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>


      <Controller
        name="cardNumber"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium mb-1">Card number</label>
            <input
              {...field}
              value={field.value.replace(/(\d{4})(?=\d)/g, "$1-")}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                field.onChange(raw);
              }}
              placeholder="1234-5678-1234-5678"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.cardNumber.message}
              </p>
            )}
          </div>
        )}
      />


      <div className="flex gap-4">
        <div className="w-1/3">
          <label className="block text-sm font-medium mb-1">Expires</label>
          <select
            {...register("expiryMonth")}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/3">
          <label className="block text-sm font-medium mb-1">Year</label>
          <select
            {...register("expiryYear")}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <div className="w-1/3">
          <label className="block text-sm font-medium mb-1">CVC</label>
          <input
            {...register("cvc")}
            placeholder="123"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.cvc && (
            <p className="text-sm text-red-500 mt-1">{errors.cvc.message}</p>
          )}
        </div>
      </div>


      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

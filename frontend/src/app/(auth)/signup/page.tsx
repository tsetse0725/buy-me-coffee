"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z.string().min(3, "Min 3 characters"),
});
type FormData = z.infer<typeof schema>;

export default function SignupUsername() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { username: "" },
  });

  const onSubmit = (data: FormData) => {
    router.push(`/signup/details?username=${encodeURIComponent(data.username)}`);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="mb-2 text-2xl font-semibold">Choose a username</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Pick a name"
            autoComplete="off"
            {...register("username")}
            className={`w-full rounded-md border px-4 py-2 outline-none transition ${
              errors.username
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-200 focus:ring-black"
            }`}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-md bg-black py-2 text-white disabled:bg-gray-300"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

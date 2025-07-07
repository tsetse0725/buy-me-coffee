"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../_components/UserProvider";
import ProfileForm from "../../_components/ProfileForm";
import PaymentForm from "../../_components/PaymentForm";

export default function ProfileSetupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const { profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (profile) {
      router.replace("/dashboard");
    }
  }, [profile, router]);

  if (profile) return null;

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4">
      {step === 1 && <ProfileForm onNext={() => setStep(2)} />}
      {step === 2 && (
        <PaymentForm
          onBack={() => setStep(1)}
          onFinish={() => {
            router.replace("/dashboard");
          }}
        />
      )}
    </main>
  );
}

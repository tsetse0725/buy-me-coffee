"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../_components/UserProvider";
import ProfileForm from "../../_components/ProfileForm";
import PaymentForm from "../../_components/PaymentForm";

export default function ProfileSetupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const { profile } = useAuth();            // 🔑 Profile-оо context-оос авна
  const router = useRouter();

  // 🎯 Хэрвээ profile аль хэдийн үүссэн бол шууд dashboard руу үсэрнэ
  useEffect(() => {
    if (profile) {
      router.replace("/dashboard");
    }
  }, [profile, router]);

  // 🔄 Redirect болохоос өмнө ямар нэг юм render хийхгүй
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

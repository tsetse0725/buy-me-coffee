"use client";

import { useState } from "react";
import ProfileForm from "../../_components/ProfileForm";
import PaymentForm from "../../_components/PaymentForm";

export default function ProfileSetupPage() {
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4">
      {step === 1 && <ProfileForm onNext={() => setStep(2)} />}
      {step === 2 && (
        <PaymentForm
          onBack={() => setStep(1)}
          onFinish={() => {

            window.location.href = "/dashboard";
          }}
        />
      )}
    </main>
  );
}

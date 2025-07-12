"use client";

import PersonalInfoForm from "@/app/_components/PersonalForm";
import PasswordForm from "./PasswordForm";
import PaymentDetailsForm from "./PaymentDetailsForm";
import SuccessMessageForm from "./SuccessMessageForm";

export default function AccountForm() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">My account</h1>

      <PersonalInfoForm />
      <PasswordForm/>
      <PaymentDetailsForm/>
      <SuccessMessageForm/>

    </div>
  );
}

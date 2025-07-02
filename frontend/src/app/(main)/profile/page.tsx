import ProfileForm from "@/app/_components/ProfileForm";

export const metadata = {
  title: "Complete your profile • Buy Me Coffee",
};

export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-24">
      <h1 className="text-2xl font-semibold mb-10">
        Complete your profile page
      </h1>
      <ProfileForm />
    </div>
  );
}

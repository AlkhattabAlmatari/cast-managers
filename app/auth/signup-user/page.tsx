import Navbar from "@/components/Navbar";
import SignupUserForm from "@/components/auth/SignupUserForm";

export default function SignupUserPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <SignupUserForm />
      </div>
    </main>
  );
}
import Navbar from "@/components/Navbar";
import SignupCompanyForm from "@/components/auth/SignupCompanyForm";

export default function SignupCompanyPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <SignupCompanyForm />
      </div>
    </main>
  );
}
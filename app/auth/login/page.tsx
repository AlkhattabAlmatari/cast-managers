import Navbar from "@/components/Navbar";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <LoginForm />
      </div>
    </main>
  );
}
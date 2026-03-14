import Link from "next/link";

export default function Navbar() {
  return (
    <header className="relative z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <h1 className="text-2xl font-extrabold text-white">كاست مانجرز</h1>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
          >
            الرئيسية
          </Link>

          <Link
            href="/auth/login"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
          >
            تسجيل الدخول
          </Link>
        </nav>
      </div>
    </header>
  );
}
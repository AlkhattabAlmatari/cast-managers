"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type RoleType = "guest" | "user" | "company";

export default function Navbar() {
  const [role, setRole] = useState<RoleType>("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setRole("guest");
        setLoading(false);
        return;
      }

      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        setRole("user");
        setLoading(false);
        return;
      }

      const companySnap = await getDoc(doc(db, "companies", user.uid));
      if (companySnap.exists()) {
        setRole("company");
        setLoading(false);
        return;
      }

      setRole("guest");
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/auth/login";
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={role === "guest" ? "/" : role === "user" ? "/dashboard/user" : "/dashboard/company"}>
          <span className="text-2xl font-black text-slate-950">كاست مانجرز</span>
        </Link>

        {!loading && (
          <nav className="flex flex-wrap items-center gap-3">
            {role === "guest" && (
              <>
                <Link
                  href="/auth/signup-user"
                  className="rounded-xl px-4 py-2 font-bold text-slate-900 hover:bg-slate-100"
                >
                  تسجيل مستخدم
                </Link>
                <Link
                  href="/auth/signup-company"
                  className="rounded-xl px-4 py-2 font-bold text-slate-900 hover:bg-slate-100"
                >
                  تسجيل شركة
                </Link>
                <Link
                  href="/auth/login"
                  className="rounded-xl bg-slate-950 px-4 py-2 font-bold text-white hover:bg-slate-800"
                >
                  تسجيل الدخول
                </Link>
              </>
            )}

            {role === "user" && (
              <>
                <Link
                  href="/dashboard/user"
                  className="rounded-xl px-4 py-2 font-bold text-slate-900 hover:bg-slate-100"
                >
                  لوحة المستخدم
                </Link>
                <Link
                  href="/profile/user"
                  className="rounded-xl px-4 py-2 font-bold text-slate-900 hover:bg-slate-100"
                >
                  ملفي الشخصي
                </Link>
                <Link
                  href="/profile/user/edit"
                  className="rounded-xl px-4 py-2 font-bold text-slate-900 hover:bg-slate-100"
                >
                  تعديل الملف
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                >
                  تسجيل الخروج
                </button>
              </>
            )}

            {role === "company" && (
              <>
                <Link
                  href="/dashboard/company"
                  className="rounded-xl px-4 py-2 font-bold text-slate-900 hover:bg-slate-100"
                >
                  لوحة الشركة
                </Link>
                <Link
                  href="/company/profile/edit"
                  className="rounded-xl px-4 py-2 font-bold text-slate-900 hover:bg-slate-100"
                >
                  تعديل بيانات الشركة
                </Link>
                <Link
                  href="/company/search"
                  className="rounded-xl px-4 py-2 font-bold text-slate-900 hover:bg-slate-100"
                >
                  البحث عن المواهب
                </Link>
                <Link
                  href="/company/subscription"
                  className="rounded-xl px-4 py-2 font-bold text-slate-900 hover:bg-slate-100"
                >
                  الاشتراك
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                >
                  تسجيل الخروج
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
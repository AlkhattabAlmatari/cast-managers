"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";

type RoleType = "guest" | "user" | "company";

type MenuItem = {
  label: string;
  href?: string;
  action?: "logout";
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [role, setRole] = useState<RoleType>("guest");
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);

      if (!currentUser) {
        setRole("guest");
        setLoadingRole(false);
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (userSnap.exists()) {
          setRole("user");
          setLoadingRole(false);
          return;
        }

        const companySnap = await getDoc(doc(db, "companies", currentUser.uid));
        if (companySnap.exists()) {
          setRole("company");
          setLoadingRole(false);
          return;
        }

        setRole("guest");
      } catch (error) {
        console.error("Navbar role error:", error);
        setRole("guest");
      } finally {
        setLoadingRole(false);
      }
    });

    return () => unsub();
  }, []);

  const menuItems = useMemo<MenuItem[]>(() => {
    if (role === "user") {
      return [
        { label: "لوحة المستخدم", href: "/dashboard/user" },
        { label: "ملفي الشخصي", href: "/profile/user" },
        { label: "تعديل الملف", href: "/profile/user/edit" },
        { label: "تسجيل الخروج", action: "logout" },
      ];
    }

    if (role === "company") {
      return [
        { label: "لوحة الشركة", href: "/dashboard/company" },
        { label: "تعديل بيانات الشركة", href: "/company/profile/edit" },
        { label: "البحث عن مواهب", href: "/company/search" },
        { label: "الاشتراك", href: "/company/subscription" },
        { label: "تسجيل الخروج", action: "logout" },
      ];
    }

    return [
      { label: "الرئيسية", href: "/" },
      { label: "تسجيل كمستخدم", href: "/auth/signup-user" },
      { label: "تسجيل كشركة", href: "/auth/signup-company" },
      { label: "تسجيل الدخول", href: "/auth/login" },
    ];
  }, [role]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDrawerOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMenuClick = async (item: MenuItem) => {
    if (item.action === "logout") {
      await handleLogout();
      return;
    }

    if (item.href) {
      setDrawerOpen(false);
      router.push(item.href);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-black text-slate-950">
            كاست مانجرز
          </Link>

          <div className="flex items-center gap-3">
            {!loadingRole && role === "guest" ? (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/auth/signup-user"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50"
                >
                  تسجيل كمستخدم
                </Link>
                <Link
                  href="/auth/signup-company"
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                >
                  تسجيل كشركة
                </Link>
              </div>
            ) : null}

            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
              aria-label="فتح القائمة"
            >
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 rounded bg-slate-900" />
                <span className="block h-0.5 w-5 rounded bg-slate-900" />
                <span className="block h-0.5 w-5 rounded bg-slate-900" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {drawerOpen ? (
        <div className="fixed inset-0 z-[100]">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-label="إغلاق القائمة"
          />

          <aside className="absolute right-0 top-0 h-full w-[320px] max-w-[88vw] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-blue-700">القائمة</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">
                  {role === "user"
                    ? "حساب المستخدم"
                    : role === "company"
                    ? "حساب الشركة"
                    : "كاست مانجرز"}
                </h2>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50"
              >
                إغلاق
              </button>
            </div>

            <div className="p-4">
              {firebaseUser ? (
                <div className="mb-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="text-sm text-slate-500">الحساب الحالي</p>
                  <p className="mt-1 truncate font-bold text-slate-900">
                    {firebaseUser.email || "مستخدم مسجل"}
                  </p>
                </div>
              ) : null}

              <nav className="space-y-2">
                {menuItems.map((item, index) => {
                  const active =
                    !!item.href &&
                    (pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href)));

                  const isLogout = item.action === "logout";

                  return (
                    <button
                      key={`${item.label}-${index}`}
                      onClick={() => handleMenuClick(item)}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 text-right font-bold transition ${
                        isLogout
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : active
                          ? "bg-slate-950 text-white"
                          : "bg-slate-50 text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span>{isLogout ? "↩" : "←"}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

type UserData = {
  fullName?: string;
  phone?: string;
  city?: string;
  ageRange?: string;
  gender?: string;
  nationality?: string;
  experience?: string;
  email?: string;
};

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData(snap.data() as UserData);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12 text-center text-slate-600">
          جاري تحميل الملف الشخصي...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-700">الملف الشخصي</p>
              <h1 className="mt-3 text-4xl font-black text-slate-950">
                {userData?.fullName || "مستخدم"}
              </h1>
              <p className="mt-3 text-lg text-slate-600">
                {userData?.city || "المدينة غير مضافة"}
              </p>
            </div>

            <button
              onClick={() => router.push("/profile/user/edit")}
              className="rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800"
            >
              تعديل الملف
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <ProfileCard label="الاسم الكامل" value={userData?.fullName} />
            <ProfileCard label="البريد الإلكتروني" value={userData?.email} />
            <ProfileCard label="رقم الجوال" value={userData?.phone} />
            <ProfileCard label="المدينة" value={userData?.city} />
            <ProfileCard label="الفئة العمرية" value={userData?.ageRange} />
            <ProfileCard label="الجنس" value={userData?.gender} />
            <ProfileCard label="الجنسية" value={userData?.nationality} />
            <ProfileCard label="الخبرة" value={userData?.experience} />
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileCard({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">
        {value || "غير مضاف"}
      </p>
    </div>
  );
}
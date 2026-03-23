"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

type UserProfileData = {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  age?: number;
  gender?: string;
  nationality?: string;
  heightCm?: number;
  weightKg?: number;
  categories?: string[];
  experience?: string;
  photoURL?: string;
  views?: number;
  likes?: number;
  ratingAverage?: number;
  ratingCount?: number;
};

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));

        if (!snap.exists()) {
          router.push("/dashboard/user");
          return;
        }

        setUserData(snap.data() as UserProfileData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-5xl px-6 py-12 text-center text-slate-600">
          جاري تحميل الملف الشخصي...
        </div>
      </main>
    );
  }

  if (!userData) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-5xl px-6 py-12 text-center text-slate-600">
          لم يتم العثور على بيانات المستخدم.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col items-center text-center">
              {userData.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt={userData.fullName || "Profile"}
                  className="h-40 w-40 rounded-full object-cover ring-4 ring-slate-100"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-slate-200 text-5xl">
                  👤
                </div>
              )}

              <h1 className="mt-5 text-3xl font-black text-slate-950">
                {userData.fullName || "مستخدم"}
              </h1>

              <p className="mt-2 text-slate-600">
                {(userData.categories ?? []).length > 0
                  ? (userData.categories ?? []).join(" • ")
                  : "غير محدد"}
              </p>

              <div className="mt-6 grid w-full grid-cols-3 gap-3">
                <MiniStat label="المشاهدات" value={String(userData.views || 0)} />
                <MiniStat label="الإعجابات" value={String(userData.likes || 0)} />
                <MiniStat
                  label="التقييم"
                  value={
                    userData.ratingAverage
                      ? `${userData.ratingAverage.toFixed(1)} / 5`
                      : "0 / 5"
                  }
                />
              </div>

              <button
                onClick={() => router.push("/profile/user/edit")}
                className="mt-6 rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800"
              >
                تعديل الملف
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <p className="text-sm font-bold text-blue-700">ملفي الشخصي</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              المعلومات الأساسية
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <InfoCard label="الاسم الكامل" value={userData.fullName} />
              <InfoCard label="البريد الإلكتروني" value={userData.email} />
              <InfoCard label="رقم الجوال" value={userData.phone} />
              <InfoCard label="المدينة" value={userData.city} />
              <InfoCard label="العمر" value={userData.age} />
              <InfoCard label="الطول" value={userData.heightCm ? `${userData.heightCm} سم` : "غير مضاف"} />
              <InfoCard label="الوزن" value={userData.weightKg ? `${userData.weightKg} كجم` : "غير مضاف"} />
              <InfoCard label="الجنس" value={userData.gender} />
              <InfoCard label="الجنسية" value={userData.nationality} />
              <InfoCard
                label="الفئات"
                value={
                  (userData.categories ?? []).length > 0
                    ? (userData.categories ?? []).join(" • ")
                    : "غير مضاف"
                }
              />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">الخبرة / النبذة</p>
              <p className="mt-2 leading-8 text-slate-800">
                {userData.experience || "لا توجد نبذة حالياً"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function InfoCard({
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

"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

type UserData = {
  fullName?: string;
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

export default function UserDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));

        if (!snap.exists()) {
          router.push("/auth/signup-user");
          return;
        }

        setUserData(snap.data() as UserData);
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
          جاري تحميل لوحة المستخدم...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold text-blue-700">لوحة المستخدم</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            أهلاً {userData?.fullName || "بك"}
          </h1>
          <p className="mt-3 text-slate-600">
            هنا تتابع ملفك الشخصي وتراجع بياناتك بسهولة.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StatCard label="المشاهدات" value={String(userData?.views || 0)} />
            <StatCard label="الإعجابات" value={String(userData?.likes || 0)} />
            <StatCard
              label="متوسط التقييم"
              value={
                userData?.ratingAverage
                  ? `${userData.ratingAverage.toFixed(1)} / 5`
                  : "0 / 5"
              }
            />
            <StatCard
              label="عدد المقيمين"
              value={String(userData?.ratingCount || 0)}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">ملخص البيانات</h2>
            <div className="mt-6 grid gap-3 text-slate-700">
              <p>
                <span className="font-bold">المدينة:</span>{" "}
                {userData?.city || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">العمر:</span>{" "}
                {userData?.age || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">الطول:</span>{" "}
                {userData?.heightCm ? `${userData.heightCm} سم` : "غير محدد"}
              </p>
              <p>
                <span className="font-bold">الوزن:</span>{" "}
                {userData?.weightKg ? `${userData.weightKg} كجم` : "غير محدد"}
              </p>
              <p>
                <span className="font-bold">الجنس:</span>{" "}
                {userData?.gender || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">الجنسية:</span>{" "}
                {userData?.nationality || "غير محدد"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">آخر التحديثات</h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                تم تجهيز لوحة المستخدم بشكل مرتب.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                يمكنك الآن الوصول إلى ملفك الشخصي وتعديل بياناتك من القائمة.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                التقييمات والمشاهدات والإعجابات تظهر بشكل مباشر داخل الحساب.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

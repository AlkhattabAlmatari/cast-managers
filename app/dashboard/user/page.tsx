"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
  photoURL?: string;
  views?: number;
  likes?: number;
  rating?: string;
};

export default function UserDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
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
  }, []);

  const completion = useMemo(() => {
    if (!userData) return 0;

    const fields = [
      userData.fullName,
      userData.phone,
      userData.city,
      userData.ageRange,
      userData.gender,
      userData.nationality,
      userData.experience,
      userData.email,
    ];

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [userData]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-12 text-center text-slate-600">
          جاري تحميل لوحة المستخدم...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <p className="text-sm font-bold text-blue-700">لوحة المستخدم</p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">
              أهلًا {userData?.fullName || "بك"}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              هذه لوحتك داخل منصة كاست مانجرز. من هنا تقدر تتابع حالة ملفك، تكمل
              بياناتك، وتعدل معلوماتك وتجهز حسابك بشكل احترافي للشركات.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/profile/user"
                className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800"
              >
                عرض الملف الشخصي
              </Link>

              <Link
                href="/profile/user/edit"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-50"
              >
                تعديل البيانات
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-500">اكتمال الملف</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              {completion}%
            </h2>

            <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              كلما أكملت بياناتك بشكل أفضل، زادت فرص ظهورك للشركات بشكل احترافي.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="عدد المشاهدات" value={String(userData?.views ?? 0)} />
          <StatCard title="عدد الإعجابات" value={String(userData?.likes ?? 0)} />
          <StatCard title="التقييم" value={userData?.rating || "0 / 5"} />
          <StatCard title="حالة الحساب" value="نشط" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <h2 className="text-2xl font-black text-slate-950">معلوماتك السريعة</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoCard label="الاسم الكامل" value={userData?.fullName} />
              <InfoCard label="البريد الإلكتروني" value={userData?.email} />
              <InfoCard label="رقم الجوال" value={userData?.phone} />
              <InfoCard label="المدينة" value={userData?.city} />
              <InfoCard label="الفئة العمرية" value={userData?.ageRange} />
              <InfoCard label="الجنس" value={userData?.gender} />
              <InfoCard label="الجنسية" value={userData?.nationality} />
              <InfoCard label="الخبرة / الموهبة" value={userData?.experience} />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">إجراءات سريعة</h2>

            <div className="mt-6 space-y-3">
              <QuickLink href="/profile/user" label="فتح ملفي الشخصي" />
              <QuickLink href="/profile/user/edit" label="تعديل بياناتي" />
              <QuickLink href="/auth/login" label="تسجيل دخول بحساب آخر" />
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">آخر تحديث</p>
              <p className="mt-3 leading-7 text-slate-700">
                تم تجهيز حسابك بنجاح، والمرحلة القادمة هي تحسين الملف الشخصي وإضافة
                عناصر أكثر احترافية.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-bold text-slate-500">{title}</p>
      <h3 className="mt-3 text-3xl font-black text-slate-950">{value}</h3>
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

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-slate-200 px-4 py-4 font-bold text-slate-900 hover:bg-slate-50"
    >
      {label}
    </Link>
  );
}
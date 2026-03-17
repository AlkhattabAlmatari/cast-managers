"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

type CompanyData = {
  companyName?: string;
  managerName?: string;
  phone?: string;
  city?: string;
  record?: string;
  email?: string;
  subscription?: string;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
};

export default function CompanyDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const ref = doc(db, "companies", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCompanyData(snap.data() as CompanyData);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-12 text-center text-slate-600">
          جاري تحميل لوحة الشركة...
        </div>
      </main>
    );
  }

  const isSubscribed =
    companyData?.subscriptionStatus === "active" ||
    companyData?.subscriptionPlan === "pro";

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <p className="text-sm font-bold text-blue-700">لوحة الشركة</p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">
              {companyData?.companyName || "حساب الشركة"}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              من هنا تقدر تتابع حالة الاشتراك، تعدل بيانات الشركة، وتبدأ في البحث
              عن المواهب بعد التفعيل.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/company/profile/edit"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-50"
              >
                تعديل بيانات الشركة
              </Link>

              <Link
                href={isSubscribed ? "/company/search" : "/company/subscription"}
                className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800"
              >
                {isSubscribed ? "فتح البحث عن المواهب" : "تفعيل الاشتراك"}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-slate-500">حالة الاشتراك</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              {isSubscribed ? "مفعل" : "غير مفعل"}
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              {isSubscribed
                ? "يمكنك الآن استخدام البحث عن المواهب."
                : "الاشتراك مطلوب لتفعيل البحث عن المواهب داخل المنصة."}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="حالة الحساب" value="نشط" />
          <StatCard title="الاشتراك" value={companyData?.subscription || "غير مفعل"} />
          <StatCard title="حالة البحث" value={isSubscribed ? "مفتوح" : "مغلق"} />
          <StatCard title="المدينة" value={companyData?.city || "غير مضافة"} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <h2 className="text-2xl font-black text-slate-950">بيانات الشركة</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoCard label="اسم الشركة" value={companyData?.companyName} />
              <InfoCard label="اسم المسؤول" value={companyData?.managerName} />
              <InfoCard label="البريد الإلكتروني" value={companyData?.email} />
              <InfoCard label="رقم الجوال" value={companyData?.phone} />
              <InfoCard label="المدينة" value={companyData?.city} />
              <InfoCard label="السجل التجاري" value={companyData?.record} />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">إجراءات سريعة</h2>

            <div className="mt-6 space-y-3">
              <QuickLink href="/company/profile/edit" label="تعديل بيانات الشركة" />
              <QuickLink href="/company/subscription" label="صفحة الاشتراك" />
              <QuickLink href="/company/search" label="البحث عن المواهب" />
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
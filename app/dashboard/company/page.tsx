"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

type CompanyData = {
  companyName?: string;
  contactName?: string;
  phone?: string;
  city?: string;
  sector?: string;
  commercialRegistration?: string;
  email?: string;
  status?: string;
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

  const isSubscribed = companyData?.subscriptionStatus === "active";

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
              من هنا تقدر تتابع حالة اشتراكك، جاهزية الحساب، وتفعيل البحث عن
              المواهب داخل المنصة.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={isSubscribed ? "/company/search" : "/company/subscription"}
                className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800"
              >
                {isSubscribed ? "البحث عن المواهب" : "تفعيل الاشتراك"}
              </Link>

              <Link
                href="/company/profile/edit"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-50"
              >
                تعديل بيانات الشركة
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
                ? "اشتراكك مفعل ويمكنك استخدام ميزة البحث عن المواهب."
                : "يلزم تفعيل الاشتراك لاستخدام البحث والوصول إلى ملفات المواهب."}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="حالة الحساب" value="نشط" />
          <StatCard title="التوثيق" value={companyData?.status || "pending"} />
          <StatCard title="الاشتراك" value={companyData?.subscriptionPlan || "none"} />
          <StatCard title="البحث" value={isSubscribed ? "مفتوح" : "مغلق"} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <h2 className="text-2xl font-black text-slate-950">بيانات الشركة</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoCard label="اسم الشركة" value={companyData?.companyName} />
              <InfoCard label="اسم المسؤول" value={companyData?.contactName} />
              <InfoCard label="البريد الإلكتروني" value={companyData?.email} />
              <InfoCard label="رقم الجوال" value={companyData?.phone} />
              <InfoCard label="المدينة" value={companyData?.city} />
              <InfoCard label="القطاع" value={companyData?.sector} />
              <InfoCard
                label="السجل التجاري"
                value={companyData?.commercialRegistration}
              />
              <InfoCard
                label="حالة الاشتراك"
                value={companyData?.subscriptionStatus || "inactive"}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">إجراءات سريعة</h2>

            <div className="mt-6 space-y-3">
              <QuickLink
                href={isSubscribed ? "/company/search" : "/company/subscription"}
                label={isSubscribed ? "فتح البحث عن المواهب" : "تفعيل الاشتراك"}
              />
              <QuickLink href="/company/profile/edit" label="تعديل بيانات الشركة" />
            </div>

            {!isSubscribed && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-700">تنبيه</p>
                <p className="mt-3 leading-7 text-amber-900">
                  لا يمكنك استخدام البحث عن المواهب حتى يتم تفعيل الاشتراك.
                </p>
              </div>
            )}
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
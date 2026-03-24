"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

type CompanyData = {
  companyName?: string;
  managerName?: string;
  city?: string;
  phone?: string;
  email?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  verificationStatus?: "pending" | "approved" | "rejected";
  commercialNumber?: string;
  sector?: string;
  subscriptionStartedAt?: string;
  subscriptionEndsAt?: string;
};

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      try {
        const ref = doc(db, "companies", currentUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          router.push("/auth/signup-company");
          return;
        }

        const data = snap.data() as CompanyData;

        if (
          data.subscriptionStatus === "active" &&
          data.subscriptionEndsAt &&
          new Date(data.subscriptionEndsAt).getTime() < Date.now()
        ) {
          await updateDoc(ref, {
            subscriptionStatus: "inactive",
            subscriptionPlan: "free",
          });

          data.subscriptionStatus = "inactive";
          data.subscriptionPlan = "free";
        }

        setCompanyData(data);
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
          جاري تحميل لوحة الشركة...
        </div>
      </main>
    );
  }

  const verificationLabel =
    companyData?.verificationStatus === "approved"
      ? "موثقة"
      : companyData?.verificationStatus === "rejected"
      ? "مرفوضة"
      : "قيد المراجعة";

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold text-blue-700">لوحة الشركة</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            أهلاً {companyData?.companyName || "بشركتك"}
          </h1>
          <p className="mt-3 text-slate-600">
            من هنا تتابع بيانات الشركة والاشتراك وحالة التحقق.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StatCard label="المدينة" value={companyData?.city || "غير محدد"} />
            <StatCard
              label="مدير الحساب"
              value={companyData?.managerName || "غير محدد"}
            />
            <StatCard
              label="الاشتراك"
              value={companyData?.subscriptionPlan || "غير مشترك"}
            />
            <StatCard label="التحقق" value={verificationLabel} />
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-slate-950">معلومات الاشتراك</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoCard
              label="حالة الاشتراك"
              value={companyData?.subscriptionStatus || "inactive"}
            />
            <InfoCard
              label="تاريخ البداية"
              value={formatDate(companyData?.subscriptionStartedAt)}
            />
            <InfoCard
              label="تاريخ النهاية"
              value={formatDate(companyData?.subscriptionEndsAt)}
            />
          </div>
        </div>

        {companyData?.verificationStatus !== "approved" ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
            <h2 className="text-xl font-black">حالة التحقق</h2>
            <p className="mt-3 leading-8">
              حساب الشركة الآن <span className="font-bold">{verificationLabel}</span>.
              لن تتفعل ميزة البحث عن المواهب إلا بعد الموافقة على التحقق.
            </p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">معلومات الشركة</h2>
            <div className="mt-6 space-y-3 text-slate-700">
              <p>
                <span className="font-bold">اسم الشركة:</span>{" "}
                {companyData?.companyName || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">البريد الإلكتروني:</span>{" "}
                {companyData?.email || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">رقم الجوال:</span>{" "}
                {companyData?.phone || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">المدينة:</span>{" "}
                {companyData?.city || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">القطاع:</span>{" "}
                {companyData?.sector || "غير محدد"}
              </p>
              <p>
                <span className="font-bold">السجل التجاري:</span>{" "}
                {companyData?.commercialNumber || "غير مضاف"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">آخر التحديثات</h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                الاشتراك الآن مربوط بتاريخ بداية ونهاية.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                إذا انتهت المدة، يتم إيقاف الاشتراك تلقائيًا عند الدخول.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                يمكنك تفعيل الاشتراك يدويًا من لوحة الأدمن لمدة 30 يوم.
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "غير مضاف";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "غير مضاف";

  return date.toLocaleDateString("ar-SA");
}

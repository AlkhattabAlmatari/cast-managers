"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

export default function CompanySubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uid, setUid] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUid(user.uid);

      const snap = await getDoc(doc(db, "companies", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        const active =
          data.subscriptionStatus === "active" ||
          data.subscriptionPlan === "pro";
        setIsSubscribed(active);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const handleSubscribe = async () => {
    if (!uid) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "companies", uid), {
        subscriptionStatus: "active",
        subscriptionPlan: "pro",
        subscription: "159 SAR / month",
        subscriptionActivatedAt: new Date().toISOString(),
      });

      alert("تم تفعيل الاشتراك بنجاح");
      router.push("/dashboard/company");
    } catch (error: any) {
      alert(error.message || "تعذر تفعيل الاشتراك");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-5xl px-6 py-12 text-center text-slate-600">
          جاري تحميل صفحة الاشتراك...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold text-blue-700">اشتراك الشركات</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">
            باقة الشركات الاحترافية
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            هذه الباقة تفتح لك ميزة البحث عن المواهب داخل المنصة والوصول إلى ملفات
            المستخدمين بشكل كامل.
          </p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-3xl font-black text-slate-950">159 ريال / شهريًا</h2>

            <ul className="mt-6 space-y-3 text-slate-700">
              <li>• فتح البحث عن المواهب</li>
              <li>• تصفح ملفات المستخدمين</li>
              <li>• البحث حسب المدينة</li>
              <li>• البحث حسب الجنس</li>
              <li>• البحث حسب الفئة العمرية</li>
              <li>• البحث حسب الخبرة / الموهبة</li>
            </ul>

            <div className="mt-8">
              {isSubscribed ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-bold text-emerald-700">
                  اشتراكك مفعل حاليًا
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={saving}
                  className="rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving ? "جاري التفعيل..." : "تفعيل اشتراك 159 ريال"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
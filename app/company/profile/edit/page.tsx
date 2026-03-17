"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

export default function EditCompanyProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uid, setUid] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [record, setRecord] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUid(user.uid);

      const ref = doc(db, "companies", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setCompanyName(data.companyName || "");
        setManagerName(data.managerName || "");
        setPhone(data.phone || "");
        setCity(data.city || "");
        setRecord(data.record || "");
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "companies", uid), {
        companyName,
        managerName,
        phone,
        city,
        record,
        updatedAt: new Date().toISOString(),
      });

      alert("تم تحديث بيانات الشركة بنجاح");
      router.push("/dashboard/company");
    } catch (error: any) {
      alert(error.message || "تعذر تحديث بيانات الشركة");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-12 text-center text-slate-600">
          جاري تحميل بيانات الشركة...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="mb-8">
            <p className="text-sm font-bold text-blue-700">تعديل بيانات الشركة</p>
            <h1 className="mt-3 text-3xl font-black text-slate-950">
              تعديل ملف الشركة
            </h1>
            <p className="mt-3 text-slate-600">
              عدل بيانات الشركة واحفظها لتكون جاهزة للاستخدام داخل المنصة.
            </p>
          </div>

          <form onSubmit={handleSave} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                اسم الشركة
              </label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                اسم المسؤول
              </label>
              <input
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                رقم الجوال
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                المدينة
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              >
                <option value="">اختر المدينة</option>
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="الدمام">الدمام</option>
                <option value="الخبر">الخبر</option>
                <option value="مكة المكرمة">مكة المكرمة</option>
                <option value="المدينة المنورة">المدينة المنورة</option>
                <option value="الطائف">الطائف</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                السجل التجاري
              </label>
              <input
                value={record}
                onChange={(e) => setRecord(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard/company")}
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-900 hover:bg-slate-50"
              >
                رجوع للوحة الشركة
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
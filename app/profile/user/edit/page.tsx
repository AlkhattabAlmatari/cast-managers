"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

export default function EditUserProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uid, setUid] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUid(user.uid);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setFullName(data.fullName || "");
        setPhone(data.phone || "");
        setCity(data.city || "");
        setAgeRange(data.ageRange || "");
        setGender(data.gender || "");
        setNationality(data.nationality || "");
        setExperience(data.experience || "");
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
      await updateDoc(doc(db, "users", uid), {
        fullName,
        phone,
        city,
        ageRange,
        gender,
        nationality,
        experience,
        updatedAt: new Date().toISOString(),
      });

      alert("تم تحديث بيانات المستخدم بنجاح");
      router.push("/dashboard/user");
    } catch (error: any) {
      alert(error.message || "تعذر تحديث البيانات");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-12 text-center text-slate-600">
          جاري تحميل البيانات...
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
            <p className="text-sm font-bold text-blue-700">تعديل الملف الشخصي</p>
            <h1 className="mt-3 text-3xl font-black text-slate-950">
              تعديل بيانات المستخدم
            </h1>
            <p className="mt-3 text-slate-600">
              عدل بياناتك واحفظها لتظهر بشكل صحيح داخل المنصة.
            </p>
          </div>

          <form onSubmit={handleSave} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الاسم الكامل
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                الفئة العمرية
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              >
                <option value="">اختر الفئة العمرية</option>
                <option value="18-25">18 - 25</option>
                <option value="25-30">25 - 30</option>
                <option value="30-40">30 - 40</option>
                <option value="40+">40+</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الجنس
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              >
                <option value="">اختر الجنس</option>
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الجنسية
              </label>
              <input
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الخبرة / النبذة / نوع الموهبة
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="min-h-36 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
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
                onClick={() => router.push("/dashboard/user")}
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-900 hover:bg-slate-50"
              >
                رجوع للوحة المستخدم
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
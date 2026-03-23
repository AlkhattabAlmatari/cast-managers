"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

const saudiCities = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الظهران",
  "الطائف",
  "أبها",
  "خميس مشيط",
  "تبوك",
  "حائل",
  "بريدة",
  "عنيزة",
  "الجبيل",
  "ينبع",
  "نجران",
  "جازان",
  "الأحساء",
  "القطيف",
  "الخرج",
  "الباحة",
  "سكاكا",
  "عرعر",
];

const categoryOptions = [
  "ممثل",
  "مقدم",
  "موديل",
  "منظم فعاليات",
  "كومبارس",
  "بروموتر / معلن",
  "صانع محتوى",
  "مذيع",
  "مضيف / مضيفة فعاليات",
  "فوتوجينيك / إعلان",
];

export default function EditUserProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uid, setUid] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const ages = useMemo(() => {
    return Array.from({ length: 83 }, (_, i) => String(i + 18));
  }, []);

  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          alert("حساب المستخدم غير موجود");
          router.push("/dashboard/user");
          return;
        }

        const data = snap.data();

        setUid(currentUser.uid);
        setFullName(data.fullName || "");
        setPhone(data.phone || "");
        setCity(data.city || "");
        setAge(data.age ? String(data.age) : "");
        setGender(data.gender || "");
        setNationality(data.nationality || "");
        setCategories(Array.isArray(data.categories) ? data.categories : []);
        setExperience(data.experience || "");
        setPhotoURL(data.photoURL || "");
      } catch (error) {
        console.error("Edit user load error:", error);
        alert("تعذر تحميل بيانات المستخدم");
        router.push("/dashboard/user");
      } finally {
        setLoading(false);
      }
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
        age: Number(age),
        gender,
        nationality,
        categories,
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
          </div>

          <form onSubmit={handleSave} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الاسم الكامل
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                رقم الجوال
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                المدينة
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              >
                <option value="">اختر المدينة</option>
                {saudiCities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                العمر
              </label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              >
                <option value="">اختر العمر</option>
                {ages.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الجنس
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
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
                className="w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2 rounded-2xl border border-slate-300 p-4">
              <p className="mb-3 text-sm font-bold text-slate-700">
                الفئات (يمكن اختيار أكثر من فئة)
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {categoryOptions.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={categories.includes(item)}
                      onChange={() => toggleCategory(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الخبرة / النبذة
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="min-h-36 w-full rounded-2xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2 rounded-2xl border border-slate-300 p-4">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                صورة الحساب الحالية
              </label>

              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="mb-4 h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <p className="text-sm text-slate-500">لا توجد صورة حالياً</p>
              )}

              <p className="text-sm text-slate-500">
                الصورة الحالية مأخوذة من حساب Google.
              </p>
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
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-900"
              >
                رجوع
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

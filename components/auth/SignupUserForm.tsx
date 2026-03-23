"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import {
  ages,
  categoryOptions,
  heights,
  nationalities,
  saudiCities,
  weights,
} from "@/lib/userOptions";

export default function SignupUserForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleCategory = (value: string) => {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleGoogleSignup = async () => {
    if (
      !fullName ||
      !phone ||
      !city ||
      !age ||
      !gender ||
      !nationality ||
      !heightCm ||
      !weightKg ||
      categories.length === 0
    ) {
      alert("أكمل جميع البيانات المطلوبة أولاً");
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const companyRef = doc(db, "companies", user.uid);

      const existingCompany = await getDoc(companyRef);
      if (existingCompany.exists()) {
        alert("هذا الحساب مسجل كشركة بالفعل");
        setLoading(false);
        return;
      }

      await setDoc(
        userRef,
        {
          role: "user",
          fullName,
          phone,
          city,
          age: Number(age),
          gender,
          nationality,
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
          categories,
          experience,
          email: user.email || "",
          photoURL: user.photoURL || "",
          views: 0,
          likes: 0,
          rating: "0 / 5",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      alert("تم إنشاء حساب المستخدم بنجاح");
      router.push("/dashboard/user");
    } catch (error: any) {
      alert(error.message || "تعذر التسجيل عبر Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-950">تسجيل مستخدم</h2>
        <p className="mt-3 text-slate-600">
          أكمل بياناتك ثم أنشئ الحساب باستخدام Google
        </p>
      </div>

      <div className="space-y-4">
        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="الاسم الكامل"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="رقم الجوال"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">اختر المدينة</option>
          {saudiCities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        >
          <option value="">اختر العمر</option>
          {ages.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
        >
          <option value="">اختر الطول (سم)</option>
          {heights.map((item) => (
            <option key={item} value={item}>
              {item} سم
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
        >
          <option value="">اختر الوزن (كجم)</option>
          {weights.map((item) => (
            <option key={item} value={item}>
              {item} كجم
            </option>
          ))}
        </select>

        <select
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">اختر الجنس</option>
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>

        <select
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        >
          <option value="">اختر الجنسية</option>
          {nationalities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="rounded-2xl border border-slate-300 p-4">
          <p className="mb-3 text-sm font-bold text-slate-700">
            اختر الفئات (يمكن اختيار أكثر من فئة)
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

        <textarea
          className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="الخبرة / النبذة"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          سيتم استخدام صورة حساب Google الحالية.
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-lg font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء حساب مستخدم باستخدام Google"}
        </button>
      </div>
    </div>
  );
}

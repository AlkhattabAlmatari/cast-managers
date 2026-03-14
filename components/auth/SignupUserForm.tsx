"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export default function SignupUserForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = async () => {
    if (!fullName || !phone || !city || !ageRange || !gender || !nationality) {
      alert("أكمل جميع البيانات المطلوبة أولاً");
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const companyRef = doc(db, "companies", user.uid);

      const existingUser = await getDoc(userRef);
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
          ageRange,
          gender,
          nationality,
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

      if (!existingUser.exists()) {
        alert("تم إنشاء حساب المستخدم بنجاح");
      }

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
          <option>الرياض</option>
          <option>جدة</option>
          <option>الدمام</option>
          <option>الخبر</option>
          <option>مكة المكرمة</option>
          <option>المدينة المنورة</option>
          <option>الطائف</option>
        </select>

        <select
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
        >
          <option value="">اختر الفئة العمرية</option>
          <option value="18-25">18 - 25</option>
          <option value="25-30">25 - 30</option>
          <option value="30-40">30 - 40</option>
          <option value="40+">40+</option>
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

        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="الجنسية"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        />

        <textarea
          className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="الخبرة / النبذة"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-lg font-extrabold text-white hover:bg-slate-800"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء حساب مستخدم باستخدام Google"}
        </button>
      </div>
    </div>
  );
}
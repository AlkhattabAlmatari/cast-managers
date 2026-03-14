"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export default function SignupCompanyForm() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [commercialRegistration, setCommercialRegistration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleCompanySignup = async () => {
    if (!companyName || !contactName || !phone || !city) {
      alert("أكمل جميع البيانات المطلوبة أولاً");
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const companyRef = doc(db, "companies", user.uid);
      const userRef = doc(db, "users", user.uid);

      const existingCompany = await getDoc(companyRef);
      const existingUser = await getDoc(userRef);

      if (existingUser.exists()) {
        alert("هذا الحساب مسجل كمستخدم بالفعل");
        setLoading(false);
        return;
      }

      await setDoc(
        companyRef,
        {
          role: "company",
          companyName,
          contactName,
          phone,
          city,
          sector,
          commercialRegistration,
          email: user.email || "",
          photoURL: user.photoURL || "",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      if (!existingCompany.exists()) {
        alert("تم إنشاء حساب الشركة بنجاح");
      }

      router.push("/dashboard/company");
    } catch (error: any) {
      alert(error.message || "تعذر إنشاء حساب الشركة عبر Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-950">تسجيل شركة</h2>
        <p className="mt-3 text-slate-600">
          أكمل بيانات الشركة ثم أنشئ الحساب باستخدام Google
        </p>
      </div>

      <div className="space-y-4">
        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="اسم الشركة"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="اسم المسؤول"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
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

        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="القطاع"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        />

        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="السجل التجاري"
          value={commercialRegistration}
          onChange={(e) => setCommercialRegistration(e.target.value)}
        />

        <button
          onClick={handleGoogleCompanySignup}
          disabled={loading}
          className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-lg font-extrabold text-white hover:bg-slate-800"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء حساب شركة باستخدام Google"}
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { saudiCities } from "@/lib/userOptions";

const sectorOptions = [
  "إنتاج إعلامي",
  "إعلانات وتسويق",
  "تنظيم فعاليات",
  "إدارة مواهب",
  "تصوير وإخراج",
  "محتوى رقمي",
  "علاقات عامة",
  "خدمات فنية",
  "أخرى",
];

export default function SignupCompanyForm() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [commercialNumber, setCommercialNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (
      !companyName ||
      !managerName ||
      !phone ||
      !city ||
      !sector ||
      !commercialNumber
    ) {
      alert("أكمل جميع البيانات المطلوبة أولاً");
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const companyRef = doc(db, "companies", user.uid);
      const userRef = doc(db, "users", user.uid);

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
          managerName,
          phone,
          city,
          sector,
          commercialNumber,
          website,
          about,
          email: user.email || "",
          subscriptionPlan: "free",
          subscriptionStatus: "inactive",
          verificationStatus: "pending",
          isVerified: false,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      alert("تم إنشاء حساب الشركة بنجاح وهو الآن بانتظار التحقق");
      router.push("/dashboard/company");
    } catch (error: any) {
      alert(error.message || "تعذر إنشاء حساب الشركة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-950">تسجيل شركة</h2>
        <p className="mt-3 text-slate-600">
          أدخل بيانات الشركة، وبعد التسجيل يتم مراجعة الحساب قبل التفعيل الكامل.
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
          placeholder="اسم المدير المسؤول"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
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
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="">اختر القطاع</option>
          {sectorOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="رقم السجل التجاري"
          value={commercialNumber}
          onChange={(e) => setCommercialNumber(e.target.value)}
        />

        <input
          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="الموقع الإلكتروني أو رابط معروف (اختياري)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <textarea
          className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3"
          placeholder="نبذة عن الشركة"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          بعد التسجيل ستكون حالة الشركة <span className="font-bold">قيد المراجعة</span>
          ، ولن يتفعل البحث عن المواهب إلا بعد التحقق والموافقة.
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-lg font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب شركة باستخدام Google"}
        </button>
      </div>
    </div>
  );
}

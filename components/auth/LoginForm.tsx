"use client";

import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export default function LoginForm() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const companyDoc = await getDoc(doc(db, "companies", user.uid));

      if (userDoc.exists()) {
        router.push("/dashboard/user");
        return;
      }

      if (companyDoc.exists()) {
        router.push("/dashboard/company");
        return;
      }

      alert("هذا الحساب غير مسجل داخل المنصة بعد. اختر التسجيل كمستخدم أو كشركة أولاً.");
      router.push("/");
    } catch (error: any) {
      alert(error.message || "تعذر تسجيل الدخول عبر Google");
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black text-slate-950">تسجيل الدخول</h2>
        <p className="mt-3 text-slate-600">
          الدخول إلى المنصة يتم عبر حساب Google فقط
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-lg font-extrabold text-white hover:bg-slate-800"
      >
        الدخول باستخدام Google
      </button>
    </div>
  );
}
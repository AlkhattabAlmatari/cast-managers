"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

type TalentData = {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  age?: number;
  gender?: string;
  nationality?: string;
  experience?: string;
  categories?: string[];
  profileImageUrl?: string;
  photoURL?: string;
  views?: number;
  likes?: number;
  rating?: string;
};

export default function TalentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const talentId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [talent, setTalent] = useState<TalentData | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      try {
        const companySnap = await getDoc(doc(db, "companies", currentUser.uid));

        if (!companySnap.exists()) {
          router.push("/dashboard/company");
          return;
        }

        const talentRef = doc(db, "users", talentId);
        const talentSnap = await getDoc(talentRef);

        if (!talentSnap.exists()) {
          alert("هذا الملف غير موجود");
          router.push("/company/search");
          return;
        }

        const data = talentSnap.data();

        setTalent({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          city: data.city || "",
          age:
            typeof data.age === "number"
              ? data.age
              : data.age
              ? Number(data.age)
              : undefined,
          gender: data.gender || "",
          nationality: data.nationality || "",
          experience: data.experience || "",
          categories: Array.isArray(data.categories)
            ? data.categories
            : data.category
            ? [data.category]
            : [],
          profileImageUrl: data.profileImageUrl || "",
          photoURL: data.photoURL || "",
          views: data.views || 0,
          likes: data.likes || 0,
          rating: data.rating || "0 / 5",
        });

        await updateDoc(talentRef, {
          views: increment(1),
        });
      } catch (error) {
        console.error("Talent profile error:", error);
        alert("تعذر فتح الملف الشخصي");
        router.push("/company/search");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router, talentId]);

  const handleLike = async () => {
    if (!talentId) return;

    try {
      await updateDoc(doc(db, "users", talentId), {
        likes: increment(1),
      });

      setTalent((prev) => ({
        ...prev,
        likes: (prev?.likes || 0) + 1,
      }));
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12 text-center text-slate-600">
          جاري تحميل الملف...
        </div>
      </main>
    );
  }

  if (!talent) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-14 text-center text-slate-600">
          هذا الملف غير موجود
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col items-center text-center">
              {talent.profileImageUrl || talent.photoURL ? (
                <img
                  src={talent.profileImageUrl || talent.photoURL}
                  alt={talent.fullName || "Talent"}
                  className="h-40 w-40 rounded-full object-cover ring-4 ring-slate-100"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-slate-200 text-5xl">
                  👤
                </div>
              )}

              <h1 className="mt-5 text-3xl font-black text-slate-950">
                {talent.fullName || "مستخدم"}
              </h1>

              <p className="mt-2 text-slate-600">
                {(talent.categories ?? []).length > 0
                  ? (talent.categories ?? []).join(" • ")
                  : "غير محدد"}
              </p>

              <div className="mt-6 grid w-full grid-cols-3 gap-3">
                <MiniStat label="المشاهدات" value={String(talent.views || 0)} />
                <MiniStat label="الإعجابات" value={String(talent.likes || 0)} />
                <MiniStat label="التقييم" value={talent.rating || "0 / 5"} />
              </div>

              <button
                onClick={handleLike}
                className="mt-6 rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800"
              >
                إعجاب
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <p className="text-sm font-bold text-blue-700">ملف الموهبة</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              المعلومات الأساسية
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <InfoCard label="الاسم الكامل" value={talent.fullName} />
              <InfoCard label="البريد الإلكتروني" value={talent.email} />
              <InfoCard label="رقم الجوال" value={talent.phone} />
              <InfoCard label="المدينة" value={talent.city} />
              <InfoCard label="العمر" value={talent.age} />
              <InfoCard label="الجنس" value={talent.gender} />
              <InfoCard label="الجنسية" value={talent.nationality} />
              <InfoCard
                label="الفئات"
                value={
                  (talent.categories ?? []).length > 0
                    ? (talent.categories ?? []).join(" • ")
                    : "غير مضاف"
                }
              />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">الخبرة / النبذة</p>
              <p className="mt-2 leading-8 text-slate-800">
                {talent.experience || "لا توجد نبذة حالياً"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">
        {value || "غير مضاف"}
      </p>
    </div>
  );
}

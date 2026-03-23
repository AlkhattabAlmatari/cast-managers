"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, runTransaction } from "firebase/firestore";
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
  heightCm?: number;
  weightKg?: number;
  experience?: string;
  categories?: string[];
  photoURL?: string;
  views?: number;
  likes?: number;
  ratingAverage?: number;
  ratingCount?: number;
  likedBy?: string[];
  ratingsBy?: Record<string, number>;
};

export default function TalentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const talentId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [companyUid, setCompanyUid] = useState("");
  const [talent, setTalent] = useState<TalentData | null>(null);
  const [selectedRating, setSelectedRating] = useState("5");
  const [submittingLike, setSubmittingLike] = useState(false);
  const [submittingRate, setSubmittingRate] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      try {
        setCompanyUid(currentUser.uid);

        const companySnap = await getDoc(doc(db, "companies", currentUser.uid));
        if (!companySnap.exists()) {
          router.push("/dashboard/company");
          return;
        }

        const talentRef = doc(db, "users", talentId);

        await runTransaction(db, async (transaction) => {
          const talentSnap = await transaction.get(talentRef);

          if (!talentSnap.exists()) return;

          const currentViews = talentSnap.data().views || 0;
          transaction.update(talentRef, {
            views: currentViews + 1,
          });
        });

        const talentSnap = await getDoc(talentRef);

        if (!talentSnap.exists()) {
          alert("هذا الملف غير موجود");
          router.push("/company/search");
          return;
        }

        const data = talentSnap.data() as TalentData;
        setTalent({
          ...data,
          categories: Array.isArray(data.categories) ? data.categories : [],
          likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
          ratingsBy: data.ratingsBy || {},
        });

        const existingRating = data.ratingsBy?.[currentUser.uid];
        if (existingRating) {
          setSelectedRating(String(existingRating));
        }
      } catch (error) {
        console.error(error);
        router.push("/company/search");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router, talentId]);

  const handleLike = async () => {
    if (!companyUid || !talentId || submittingLike) return;

    setSubmittingLike(true);

    try {
      const userRef = doc(db, "users", talentId);

      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(userRef);
        if (!snap.exists()) return;

        const data = snap.data() as TalentData;
        const likedBy = Array.isArray(data.likedBy) ? data.likedBy : [];

        if (likedBy.includes(companyUid)) {
          throw new Error("already-liked");
        }

        transaction.update(userRef, {
          likedBy: [...likedBy, companyUid],
          likes: (data.likes || 0) + 1,
        });
      });

      setTalent((prev) =>
        prev
          ? {
              ...prev,
              likedBy: [...(prev.likedBy || []), companyUid],
              likes: (prev.likes || 0) + 1,
            }
          : prev
      );

      alert("تم تسجيل الإعجاب");
    } catch (error: any) {
      if (error.message === "already-liked") {
        alert("أنت سجلت إعجابك مسبقًا لهذا المستخدم");
      } else {
        alert("تعذر تسجيل الإعجاب");
      }
    } finally {
      setSubmittingLike(false);
    }
  };

  const handleRate = async () => {
    if (!companyUid || !talentId || submittingRate) return;

    setSubmittingRate(true);

    try {
      const userRef = doc(db, "users", talentId);

      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(userRef);
        if (!snap.exists()) return;

        const data = snap.data() as TalentData;
        const ratingsBy = data.ratingsBy || {};
        const ratingValue = Number(selectedRating);

        ratingsBy[companyUid] = ratingValue;

        const ratingValues = Object.values(ratingsBy).map(Number);
        const ratingCount = ratingValues.length;
        const ratingAverage =
          ratingCount > 0
            ? ratingValues.reduce((sum, value) => sum + value, 0) / ratingCount
            : 0;

        transaction.update(userRef, {
          ratingsBy,
          ratingCount,
          ratingAverage,
        });
      });

      setTalent((prev) => {
        if (!prev) return prev;

        const updatedRatingsBy = {
          ...(prev.ratingsBy || {}),
          [companyUid]: Number(selectedRating),
        };

        const ratingValues = Object.values(updatedRatingsBy).map(Number);
        const ratingCount = ratingValues.length;
        const ratingAverage =
          ratingCount > 0
            ? ratingValues.reduce((sum, value) => sum + value, 0) / ratingCount
            : 0;

        return {
          ...prev,
          ratingsBy: updatedRatingsBy,
          ratingCount,
          ratingAverage,
        };
      });

      alert("تم حفظ التقييم");
    } catch (error) {
      console.error(error);
      alert("تعذر حفظ التقييم");
    } finally {
      setSubmittingRate(false);
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

  const alreadyLiked = (talent.likedBy || []).includes(companyUid);
  const myRating = talent.ratingsBy?.[companyUid];

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col items-center text-center">
              {talent.photoURL ? (
                <img
                  src={talent.photoURL}
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
                <MiniStat
                  label="التقييم"
                  value={
                    talent.ratingAverage
                      ? `${talent.ratingAverage.toFixed(1)} / 5`
                      : "0 / 5"
                  }
                />
              </div>

              <button
                onClick={handleLike}
                disabled={alreadyLiked || submittingLike}
                className="mt-6 rounded-2xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {alreadyLiked ? "تم الإعجاب" : "إعجاب"}
              </button>

              <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-sm font-bold text-slate-700">
                  {myRating ? "تعديل تقييمك" : "تقييم المستخدم"}
                </p>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3"
                  >
                    <option value="1">1 / 5</option>
                    <option value="2">2 / 5</option>
                    <option value="3">3 / 5</option>
                    <option value="4">4 / 5</option>
                    <option value="5">5 / 5</option>
                  </select>

                  <button
                    onClick={handleRate}
                    disabled={submittingRate}
                    className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60"
                  >
                    {myRating ? "تحديث" : "حفظ"}
                  </button>
                </div>
              </div>
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
              <InfoCard
                label="الطول"
                value={talent.heightCm ? `${talent.heightCm} سم` : "غير مضاف"}
              />
              <InfoCard
                label="الوزن"
                value={talent.weightKg ? `${talent.weightKg} كجم` : "غير مضاف"}
              />
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

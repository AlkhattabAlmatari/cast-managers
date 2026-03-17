"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

type UserTalent = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  ageRange?: string;
  gender?: string;
  nationality?: string;
  experience?: string;
  category?: string;
  photoURL?: string;
};

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

const categories = [
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

export default function CompanySearchPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [users, setUsers] = useState<UserTalent[]>([]);

  const [nameSearch, setNameSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const companySnap = await getDoc(doc(db, "companies", user.uid));

        if (!companySnap.exists()) {
          router.push("/dashboard/company");
          return;
        }

        const companyData = companySnap.data();

        const active =
          companyData.subscriptionStatus === "active" ||
          companyData.subscriptionPlan === "pro";

        setSubscribed(active);

        if (active) {
          const usersSnap = await getDocs(collection(db, "users"));

          const usersData: UserTalent[] = usersSnap.docs.map((doc) => {
            const data = doc.data();

            return {
              id: doc.id,
              fullName: data.fullName || "",
              email: data.email || "",
              phone: data.phone || "",
              city: data.city || "",
              ageRange: data.ageRange || "",
              gender: data.gender || "",
              nationality: data.nationality || "",
              experience: data.experience || "",
              category: data.category || "",
              photoURL: data.photoURL || "",
            };
          });

          setUsers(usersData);
        }
      } catch (error) {
        console.error("Search Error:", error);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesName =
        !nameSearch ||
        user.fullName?.toLowerCase().includes(nameSearch.toLowerCase());

      const matchesCategory =
        !categoryFilter || user.category === categoryFilter;

      const matchesCity =
        !cityFilter || user.city === cityFilter;

      const matchesGender =
        !genderFilter || user.gender === genderFilter;

      const matchesAge =
        !ageFilter || user.ageRange === ageFilter;

      return (
        matchesName &&
        matchesCategory &&
        matchesCity &&
        matchesGender &&
        matchesAge
      );
    });
  }, [users, nameSearch, categoryFilter, cityFilter, genderFilter, ageFilter]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12 text-center text-slate-600">
          جاري تحميل المواهب...
        </div>
      </main>
    );
  }

  if (!subscribed) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-14 text-center">
          <h1 className="mb-4 text-3xl font-black">البحث غير متاح</h1>
          <p className="mb-6 text-slate-600">
            يجب الاشتراك لتفعيل البحث عن المواهب
          </p>

          <button
            onClick={() => router.push("/company/subscription")}
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            الاشتراك الآن
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-black">البحث عن المواهب</h1>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            placeholder="ابحث بالاسم"
            className="rounded-xl border p-3"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option value="">كل الفئات</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option value="">كل المدن</option>
            {saudiCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option value="">كل الأجناس</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>

          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option value="">كل الأعمار</option>
            <option value="18-25">18 - 25</option>
            <option value="25-30">25 - 30</option>
            <option value="30-40">30 - 40</option>
            <option value="40+">40+</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl bg-white p-6 shadow"
              >
                <h2 className="text-xl font-bold">
                  {user.fullName || "مستخدم"}
                </h2>

                <p className="mt-2">📂 {user.category || "غير محدد"}</p>
                <p>📍 {user.city || "غير محدد"}</p>
                <p>👤 {user.gender || "-"}</p>
                <p>🎂 {user.ageRange || "-"}</p>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">الخبرة / النبذة</p>
                  <p>{user.experience || "لا يوجد"}</p>
                </div>

                <div className="mt-4 text-sm">
                  <p>{user.email || "لا يوجد بريد"}</p>
                  <p>{user.phone || "لا يوجد رقم"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              لا يوجد نتائج
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
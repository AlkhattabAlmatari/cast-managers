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
  photoURL?: string;
};

export default function CompanySearchPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [users, setUsers] = useState<UserTalent[]>([]);

  const [searchText, setSearchText] = useState("");
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

  // 🔍 فلترة البحث
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesText =
        !searchText ||
        user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.experience?.toLowerCase().includes(searchText.toLowerCase());

      const matchesCity = !cityFilter || user.city === cityFilter;
      const matchesGender = !genderFilter || user.gender === genderFilter;
      const matchesAge = !ageFilter || user.ageRange === ageFilter;

      return (
        matchesText &&
        matchesCity &&
        matchesGender &&
        matchesAge
      );
    });
  }, [users, searchText, cityFilter, genderFilter, ageFilter]);

  // ⏳ تحميل
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

  // 🔒 إذا غير مشترك
  if (!subscribed) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-14 text-center">
          <h1 className="text-3xl font-black mb-4">
            البحث غير متاح
          </h1>
          <p className="text-slate-600 mb-6">
            يجب الاشتراك لتفعيل البحث عن المواهب
          </p>

          <button
            onClick={() => router.push("/company/subscription")}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            الاشتراك الآن
          </button>
        </section>
      </main>
    );
  }

  // ✅ الصفحة الأساسية
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-black mb-6">
          البحث عن المواهب
        </h1>

        {/* الفلاتر */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="بحث بالاسم أو الخبرة"
            className="border p-3 rounded-xl"
          />

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="border p-3 rounded-xl"
          >
            <option value="">كل المدن</option>
            <option value="الرياض">الرياض</option>
            <option value="جدة">جدة</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="border p-3 rounded-xl"
          >
            <option value="">الجنس</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>

          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="border p-3 rounded-xl"
          >
            <option value="">العمر</option>
            <option value="18-25">18-25</option>
            <option value="25-30">25-30</option>
          </select>
        </div>

        {/* النتائج */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white p-6 rounded-2xl shadow"
              >
                <h2 className="text-xl font-bold">
                  {user.fullName || "مستخدم"}
                </h2>

                <p className="mt-2">📍 {user.city || "غير محدد"}</p>
                <p>👤 {user.gender || "-"}</p>
                <p>🎂 {user.ageRange || "-"}</p>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">الخبرة</p>
                  <p>{user.experience || "لا يوجد"}</p>
                </div>

                <div className="mt-4 text-sm">
                  <p>{user.email}</p>
                  <p>{user.phone}</p>
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
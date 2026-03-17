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
  phone?: string;
  city?: string;
  ageRange?: string;
  gender?: string;
  nationality?: string;
  experience?: string;
  email?: string;
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
        const usersData: UserTalent[] = usersSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<UserTalent, "id">),
        }));
        setUsers(usersData);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesText =
        !searchText ||
        user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.experience?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.city?.toLowerCase().includes(searchText.toLowerCase());

      const matchesCity = !cityFilter || user.city === cityFilter;
      const matchesGender = !genderFilter || user.gender === genderFilter;
      const matchesAge = !ageFilter || user.ageRange === ageFilter;

      return matchesText && matchesCity && matchesGender && matchesAge;
    });
  }, [users, searchText, cityFilter, genderFilter, ageFilter]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-12 text-center text-slate-600">
          جاري تحميل البحث...
        </div>
      </main>
    );
  }

  if (!subscribed) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-14">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-amber-700">ميزة مقفلة</p>
            <h1 className="mt-3 text-4xl font-black text-slate-950">
              البحث عن المواهب غير متاح
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              لتفعيل ميزة البحث والوصول إلى ملفات المستخدمين، يجب الاشتراك في
              باقة الشركات بقيمة 159 ريال شهريًا.
            </p>

            <button
              onClick={() => router.push("/company/subscription")}
              className="mt-8 rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white hover:bg-slate-800"
            >
              الذهاب إلى صفحة الاشتراك
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold text-blue-700">البحث عن المواهب</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">
            ابحث عن المستخدمين المسجلين
          </h1>
          <p className="mt-4 text-slate-600">
            تقدر البحث بالاسم أو المدينة أو الخبرة، مع فلترة حسب الجنس والفئة
            العمرية.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ابحث بالاسم أو الخبرة أو المدينة"
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            />

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            >
              <option value="">كل المدن</option>
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام">الدمام</option>
              <option value="الخبر">الخبر</option>
              <option value="مكة المكرمة">مكة المكرمة</option>
              <option value="المدينة المنورة">المدينة المنورة</option>
              <option value="الطائف">الطائف</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            >
              <option value="">كل الأجناس</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>

            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            >
              <option value="">كل الأعمار</option>
              <option value="18-25">18 - 25</option>
              <option value="25-30">25 - 30</option>
              <option value="30-40">30 - 40</option>
              <option value="40+">40+</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <h3 className="text-2xl font-black text-slate-950">
                  {user.fullName || "مستخدم"}
                </h3>

                <div className="mt-4 space-y-2 text-slate-700">
                  <p><span className="font-bold">المدينة:</span> {user.city || "غير مضافة"}</p>
                  <p><span className="font-bold">الفئة العمرية:</span> {user.ageRange || "غير مضافة"}</p>
                  <p><span className="font-bold">الجنس:</span> {user.gender || "غير مضاف"}</p>
                  <p><span className="font-bold">الجنسية:</span> {user.nationality || "غير مضافة"}</p>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">الخبرة / النبذة</p>
                  <p className="mt-2 leading-7 text-slate-700">
                    {user.experience || "لا توجد نبذة بعد"}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-bold text-slate-500">التواصل</p>
                  <p className="mt-2 text-slate-800">{user.email || "لا يوجد بريد"}</p>
                  <p className="mt-1 text-slate-800">{user.phone || "لا يوجد رقم"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 md:col-span-2 xl:col-span-3">
              <p className="text-lg font-bold text-slate-700">
                لا يوجد نتائج مطابقة حاليًا
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
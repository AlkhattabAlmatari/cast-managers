"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";

type UserTalent = {
  id: string;
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

const ages = Array.from({ length: 83 }, (_, i) => i + 18);

export default function CompanySearchPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [verified, setVerified] = useState(false);
  const [users, setUsers] = useState<UserTalent[]>([]);

  const [nameInput, setNameInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [genderInput, setGenderInput] = useState("");
  const [minAgeInput, setMinAgeInput] = useState("");
  const [maxAgeInput, setMaxAgeInput] = useState("");

  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchGender, setSearchGender] = useState("");
  const [searchMinAge, setSearchMinAge] = useState("");
  const [searchMaxAge, setSearchMaxAge] = useState("");

  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const companyRef = doc(db, "companies", user.uid);
        const companySnap = await getDoc(companyRef);

        if (!companySnap.exists()) {
          router.push("/dashboard/company");
          return;
        }

        const companyData = companySnap.data();

        let active =
          companyData.subscriptionStatus === "active" ||
          companyData.subscriptionPlan === "pro";

        const isVerified = companyData.verificationStatus === "approved";

        if (
          active &&
          companyData.subscriptionEndsAt &&
          new Date(companyData.subscriptionEndsAt).getTime() < Date.now()
        ) {
          await updateDoc(companyRef, {
            subscriptionStatus: "inactive",
            subscriptionPlan: "free",
          });

          active = false;
        }

        setSubscribed(active);
        setVerified(isVerified);

        if (active && isVerified) {
          const usersSnap = await getDocs(collection(db, "users"));

          const usersData: UserTalent[] = usersSnap.docs.map((docItem) => {
            const data = docItem.data();

            return {
              id: docItem.id,
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
              heightCm:
                typeof data.heightCm === "number"
                  ? data.heightCm
                  : data.heightCm
                  ? Number(data.heightCm)
                  : undefined,
              weightKg:
                typeof data.weightKg === "number"
                  ? data.weightKg
                  : data.weightKg
                  ? Number(data.weightKg)
                  : undefined,
              experience: data.experience || "",
              categories: Array.isArray(data.categories) ? data.categories : [],
              photoURL: data.photoURL || "",
            };
          });

          setUsers(usersData);
        }
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleSearch = () => {
    setSearchName(nameInput);
    setSearchCategory(categoryInput);
    setSearchCity(cityInput);
    setSearchGender(genderInput);
    setSearchMinAge(minAgeInput);
    setSearchMaxAge(maxAgeInput);
    setSearched(true);
  };

  const handleReset = () => {
    setNameInput("");
    setCategoryInput("");
    setCityInput("");
    setGenderInput("");
    setMinAgeInput("");
    setMaxAgeInput("");

    setSearchName("");
    setSearchCategory("");
    setSearchCity("");
    setSearchGender("");
    setSearchMinAge("");
    setSearchMaxAge("");

    setSearched(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesName =
        !searchName ||
        user.fullName?.toLowerCase().includes(searchName.toLowerCase());

      const matchesCategory =
        !searchCategory || (user.categories || []).includes(searchCategory);

      const matchesCity = !searchCity || user.city === searchCity;
      const matchesGender = !searchGender || user.gender === searchGender;

      const minAge = searchMinAge ? Number(searchMinAge) : null;
      const maxAge = searchMaxAge ? Number(searchMaxAge) : null;

      const matchesMinAge =
        minAge === null || (typeof user.age === "number" && user.age >= minAge);

      const matchesMaxAge =
        maxAge === null || (typeof user.age === "number" && user.age <= maxAge);

      return (
        matchesName &&
        matchesCategory &&
        matchesCity &&
        matchesGender &&
        matchesMinAge &&
        matchesMaxAge
      );
    });
  }, [
    users,
    searchName,
    searchCategory,
    searchCity,
    searchGender,
    searchMinAge,
    searchMaxAge,
  ]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12 text-center text-slate-600">
          جاري تحميل البحث...
        </div>
      </main>
    );
  }

  if (!verified) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-14 text-center">
          <h1 className="mb-4 text-3xl font-black">الشركة غير موثقة بعد</h1>
          <p className="mb-6 text-slate-600">
            يجب اعتماد الشركة أولًا قبل تفعيل البحث عن المواهب.
          </p>
        </section>
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

        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="ابحث بالاسم"
              className="rounded-xl border p-3"
            />

            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
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
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
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
              value={genderInput}
              onChange={(e) => setGenderInput(e.target.value)}
              className="rounded-xl border p-3"
            >
              <option value="">كل الأجناس</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>

            <select
              value={minAgeInput}
              onChange={(e) => setMinAgeInput(e.target.value)}
              className="rounded-xl border p-3"
            >
              <option value="">من عمر</option>
              {ages.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>

            <select
              value={maxAgeInput}
              onChange={(e) => setMaxAgeInput(e.target.value)}
              className="rounded-xl border p-3"
            >
              <option value="">إلى عمر</option>
              {ages.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handleSearch}
              className="rounded-xl bg-slate-950 px-6 py-3 font-bold text-white hover:bg-slate-800"
            >
              بحث
            </button>

            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-900 hover:bg-slate-50"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        {!searched ? (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm ring-1 ring-slate-200">
            اختر الفلاتر ثم اضغط على <span className="font-bold">بحث</span>.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="rounded-2xl bg-white p-6 shadow">
                  <div className="mb-4 flex items-center gap-4">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.fullName || "Talent"}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-2xl">
                        👤
                      </div>
                    )}

                    <div>
                      <h2 className="text-xl font-bold">
                        {user.fullName || "مستخدم"}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {(user.categories ?? []).length > 0
                          ? (user.categories ?? []).join(" • ")
                          : "غير محدد"}
                      </p>
                    </div>
                  </div>

                  <p>📍 {user.city || "غير محدد"}</p>
                  <p>👤 {user.gender || "-"}</p>
                  <p>🎂 {user.age || "-"}</p>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">الخبرة / النبذة</p>
                    <p>{user.experience || "لا يوجد"}</p>
                  </div>

                  <div className="mt-4 text-sm">
                    <p>{user.email || "لا يوجد بريد"}</p>
                    <p>{user.phone || "لا يوجد رقم"}</p>
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={() => router.push(`/company/talent/${user.id}`)}
                      className="inline-block rounded-xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800"
                    >
                      عرض الملف
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm ring-1 ring-slate-200">
                لا يوجد نتائج مطابقة
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

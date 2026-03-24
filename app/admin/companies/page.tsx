"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";
import { ADMIN_EMAIL } from "@/lib/admin";

type CompanyItem = {
  id: string;
  companyName?: string;
  managerName?: string;
  phone?: string;
  email?: string;
  city?: string;
  sector?: string;
  commercialNumber?: string;
  verificationStatus?: string;
  isVerified?: boolean;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
  subscriptionStartedAt?: string;
  subscriptionEndsAt?: string;
  createdAt?: string;
};

export default function AdminCompaniesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [savingId, setSavingId] = useState("");

  const loadCompanies = async () => {
    const snap = await getDocs(collection(db, "companies"));
    const data: CompanyItem[] = snap.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<CompanyItem, "id">),
    }));

    setCompanies(data);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }

      if ((currentUser.email || "").toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);

      try {
        await loadCompanies();
      } catch (error) {
        console.error("Admin load companies error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const updateCompany = async (
    companyId: string,
    data: Partial<CompanyItem>
  ) => {
    setSavingId(companyId);

    try {
      await updateDoc(doc(db, "companies", companyId), {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      await loadCompanies();
    } catch (error) {
      console.error("Admin update error:", error);
      alert("تعذر تحديث الشركة");
    } finally {
      setSavingId("");
    }
  };

  const approveCompany = async (companyId: string) => {
    await updateCompany(companyId, {
      verificationStatus: "approved",
      isVerified: true,
    });
  };

  const rejectCompany = async (companyId: string) => {
    await updateCompany(companyId, {
      verificationStatus: "rejected",
      isVerified: false,
    });
  };

  const activateSubscription = async (companyId: string) => {
    const startedAt = new Date();
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 30);

    await updateCompany(companyId, {
      subscriptionStatus: "active",
      subscriptionPlan: "pro",
      subscriptionStartedAt: startedAt.toISOString(),
      subscriptionEndsAt: endsAt.toISOString(),
    });
  };

  const deactivateSubscription = async (companyId: string) => {
    await updateCompany(companyId, {
      subscriptionStatus: "inactive",
      subscriptionPlan: "free",
      subscriptionStartedAt: "",
      subscriptionEndsAt: "",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-12 text-center text-slate-600">
          جاري تحميل لوحة الأدمن...
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h1 className="text-3xl font-black text-slate-950">غير مصرح لك</h1>
          <p className="mt-4 text-slate-600">
            هذا القسم مخصص للأدمن فقط.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-bold text-blue-700">لوحة الأدمن</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            إدارة الشركات
          </h1>
          <p className="mt-3 text-slate-600">
            من هنا تراجع الشركات وتوثقها وتفعل الاشتراك لمدة 30 يوم.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          {companies.length > 0 ? (
            companies.map((company) => (
              <div
                key={company.id}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-black text-slate-950">
                      {company.companyName || "شركة بدون اسم"}
                    </h2>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 text-slate-700">
                      <InfoRow label="اسم المسؤول" value={company.managerName} />
                      <InfoRow label="البريد" value={company.email} />
                      <InfoRow label="الجوال" value={company.phone} />
                      <InfoRow label="المدينة" value={company.city} />
                      <InfoRow label="القطاع" value={company.sector} />
                      <InfoRow
                        label="السجل التجاري"
                        value={company.commercialNumber}
                      />
                      <InfoRow
                        label="التوثيق"
                        value={company.verificationStatus}
                      />
                      <InfoRow
                        label="الاشتراك"
                        value={company.subscriptionStatus}
                      />
                      <InfoRow
                        label="بداية الاشتراك"
                        value={formatDate(company.subscriptionStartedAt)}
                      />
                      <InfoRow
                        label="نهاية الاشتراك"
                        value={formatDate(company.subscriptionEndsAt)}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                    <h3 className="text-lg font-black text-slate-950">
                      الإجراءات
                    </h3>

                    <div className="mt-4 space-y-3">
                      <button
                        onClick={() => approveCompany(company.id)}
                        disabled={savingId === company.id}
                        className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        قبول التوثيق
                      </button>

                      <button
                        onClick={() => rejectCompany(company.id)}
                        disabled={savingId === company.id}
                        className="w-full rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        رفض التوثيق
                      </button>

                      <button
                        onClick={() => activateSubscription(company.id)}
                        disabled={savingId === company.id}
                        className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-60"
                      >
                        تفعيل اشتراك 30 يوم
                      </button>

                      <button
                        onClick={() => deactivateSubscription(company.id)}
                        disabled={savingId === company.id}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                      >
                        إيقاف الاشتراك
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
              <p className="text-slate-600">لا توجد شركات حالياً</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-900">
        {String(value || "غير مضاف")}
      </p>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "غير مضاف";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "غير مضاف";

  return date.toLocaleDateString("ar-SA");
}

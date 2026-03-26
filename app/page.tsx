import Link from "next/link";
import Navbar from "@/components/Navbar";
import FloatingWorkBackground from "@/components/FloatingWorkBackground";
import MotionSection from "@/components/MotionSection";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 text-slate-900">
      <Navbar />
      <FloatingWorkBackground />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              منصة احترافية للسوق السعودي
            </span>

            <h2 className="text-5xl font-black leading-tight text-slate-950">
              منصة تربط بين
              <span className="block text-blue-700">الشركات والمواهب</span>
              بشكل حديث وعملي
            </h2>

            <p className="max-w-xl text-lg leading-8 text-slate-600">
              كاست مانجرز منصة تساعد المستخدمين على إنشاء ملفاتهم الشخصية بشكل
              احترافي، وتساعد الشركات على الوصول إلى المواهب المناسبة بسرعة
              ووضوح داخل السوق السعودي.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/signup-user"
                className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-extrabold text-white transition hover:bg-slate-800"
              >
                التسجيل كمستخدم
              </Link>

              <Link
                href="/auth/signup-company"
                className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-extrabold text-white transition hover:bg-slate-800"
              >
                التسجيل كشركة
              </Link>

              <Link
                href="/auth/login"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-extrabold text-slate-900 transition hover:bg-slate-50"
              >
                تسجيل الدخول
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
                <p className="text-2xl font-black text-slate-950">+100</p>
                <p className="text-sm text-slate-500">مواهب متنوعة</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
                <p className="text-2xl font-black text-slate-950">+25</p>
                <p className="text-sm text-slate-500">شركات مسجلة</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
                <p className="text-2xl font-black text-slate-950">24/7</p>
                <p className="text-sm text-slate-500">وصول مستمر</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-white/30 bg-white/70 p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="mb-2 text-sm font-bold text-slate-500">
                    ملف موهبة
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl">
                      🎭
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">
                        ممثل • مقدم • موديل • منظم
                      </p>
                      <p className="text-sm text-slate-500">الرياض • عمر 25</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="mb-2 text-sm font-bold text-slate-500">
                    حساب شركة
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl">
                      🏢
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">
                        شركة إنتاج وإعلانات
                      </p>
                      <p className="text-sm text-slate-500">جدة • قطاع إعلامي</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                  <p className="mb-1 text-sm text-slate-300">ميزة قوية</p>
                  <p className="text-xl font-black">
                    بحث ذكي حسب الفئة والعمر والمدينة ونوع الحساب
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MotionSection delay={0.1}>
        <section className="relative z-10 border-t border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-black text-slate-950">
                كيف تعمل المنصة؟
              </h3>
              <p className="mt-3 text-lg text-slate-600">
                خطوات بسيطة وواضحة لكل طرف داخل المنصة
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 text-3xl">1️⃣</div>
                <h4 className="mb-3 text-xl font-extrabold">أنشئ حسابك</h4>
                <p className="leading-8 text-slate-600">
                  المستخدم ينشئ ملفه الشخصي، والشركة تنشئ حسابها وتضيف بياناتها
                  الأساسية بشكل واضح ومنظم.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 text-3xl">2️⃣</div>
                <h4 className="mb-3 text-xl font-extrabold">أكمل بياناتك</h4>
                <p className="leading-8 text-slate-600">
                  المستخدم يضيف خبراته ومعلوماته، والشركة تضيف مجالها ووصفها
                  واحتياجها حتى تصبح النتائج أدق وأفضل.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 text-3xl">3️⃣</div>
                <h4 className="mb-3 text-xl font-extrabold">
                  ابدأ الاكتشاف والبحث
                </h4>
                <p className="leading-8 text-slate-600">
                  الشركات تبحث عن المواهب، والمستخدمون يكتشفون الشركات وفرص
                  التعاون بشكل مباشر وسهل.
                </p>
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

      <MotionSection delay={0.2}>
        <section className="relative z-10 bg-slate-100 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-black text-slate-950">
                لماذا تختار كاست مانجرز؟
              </h3>
              <p className="mt-3 text-lg text-slate-600">
                لأننا نبني تجربة واضحة ومناسبة لاحتياج السوق
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-4 text-2xl font-black text-slate-950">
                  للمستخدمين
                </h3>
                <ul className="space-y-4 leading-8 text-slate-600">
                  <li>• إنشاء ملف شخصي احترافي</li>
                  <li>• عرض المهارات والخبرات بشكل مرتب</li>
                  <li>• الظهور للشركات داخل المنصة</li>
                  <li>• إدارة الحساب وتحديث البيانات بسهولة</li>
                  <li>• إبراز المواهب مثل التمثيل والتقديم والتنظيم والموديل</li>
                </ul>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-4 text-2xl font-black text-slate-950">
                  للشركات
                </h3>
                <ul className="space-y-4 leading-8 text-slate-600">
                  <li>• إنشاء حساب شركة واضح واحترافي</li>
                  <li>• البحث عن المواهب حسب الفلاتر</li>
                  <li>• الوصول السريع إلى ملفات المستخدمين</li>
                  <li>• إدارة الحساب والبيانات من لوحة الشركة</li>
                  <li>• تجهيز النظام لاحقًا لتوثيق الشركة واعتمادها</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

      <MotionSection delay={0.3}>
        <section className="relative z-10 bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-black text-slate-950">
                ماذا توفر المنصة؟
              </h3>
              <p className="mt-3 text-lg text-slate-600">
                تجربة منظمة، واضحة، وقابلة للتطوير
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <h4 className="mb-3 text-lg font-extrabold">حسابات منفصلة</h4>
                <p className="text-slate-600">
                  تسجيل مختلف للمستخدمين والشركات.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <h4 className="mb-3 text-lg font-extrabold">بحث ذكي</h4>
                <p className="text-slate-600">
                  فلاتر واضحة حسب المدينة والفئة العمرية ونوع الحساب.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <h4 className="mb-3 text-lg font-extrabold">ملفات حقيقية</h4>
                <p className="text-slate-600">
                  حفظ بيانات المستخدم والشركة بشكل فعلي داخل النظام.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <h4 className="mb-3 text-lg font-extrabold">قابل للتطوير</h4>
                <p className="text-slate-600">
                  جاهز لاحقًا لإضافة التوثيق، الصور، الإشعارات، ولوحة الإدارة.
                </p>
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

      <MotionSection delay={0.4}>
        <section className="relative z-10 bg-slate-100 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-black text-slate-950">
                كيف تبدأ؟
              </h3>
              <p className="mt-3 text-lg text-slate-600">
                ابدأ الآن بخطوات سريعة وواضحة
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 text-3xl">📝</div>
                <h4 className="mb-3 text-xl font-extrabold">سجّل حسابك</h4>
                <p className="leading-8 text-slate-600">
                  اختر هل تريد التسجيل كمستخدم أو كشركة وابدأ مباشرة.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 text-3xl">📂</div>
                <h4 className="mb-3 text-xl font-extrabold">أكمل ملفك</h4>
                <p className="leading-8 text-slate-600">
                  أضف بياناتك الأساسية حتى يصبح حسابك جاهزًا للاستخدام.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-4 text-3xl">🚀</div>
                <h4 className="mb-3 text-xl font-extrabold">ابدأ الاستخدام</h4>
                <p className="leading-8 text-slate-600">
                  ادخل إلى لوحتك وتحرك داخل المنصة بشكل فعلي ومنظم.
                </p>
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

      <MotionSection delay={0.5}>
        <footer className="relative z-10 border-t border-slate-200 bg-slate-950 py-10 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-xl font-extrabold">كاست مانجرز</h4>
              <p className="mt-2 text-sm text-slate-300">
                منصة سعودية تربط بين الشركات والمواهب بطريقة حديثة وعملية.
              </p>
            </div>

            <div className="text-sm text-slate-300">
              ©️ 2026 كاست مانجرز — جميع الحقوق محفوظة
            </div>
          </div>
        </footer>
      </MotionSection>
    </main>
  );
}

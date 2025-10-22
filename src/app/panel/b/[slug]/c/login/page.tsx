"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Business {
  id: number;
  name: string;
  slug: string;
}

export default function BusinessCustomerLogin() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [business, setBusiness] = useState<Business | null>(null);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`/api/business/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setBusiness(data.business);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchBusiness();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password, businessSlug: slug }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(`customerUser_${slug}`, JSON.stringify(data.user));
        localStorage.setItem(`currentBusiness_${slug}`, JSON.stringify(business));
        router.push(`/panel/b/${slug}/c/home`);
      } else {
        setError(data.error || "خطا در ورود");
      }
    } catch {
      setError("خطا در برقراری ارتباط");
    } finally {
      setLoading(false);
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ورود مشتری</h1>
            <p className="text-slate-600 text-sm">به باشگاه {business.name} خوش آمدید</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">
                شماره موبایل
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="09124580298"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-left"
                dir="ltr"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">
                رمز عبور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-left"
                dir="ltr"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 space-y-3">
            <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors">
              ثبت‌نام
            </button>
            <button className="w-full text-slate-600 hover:text-slate-700 text-sm py-2 rounded-lg hover:bg-slate-50 transition-colors">
              فراموشی رمز عبور
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


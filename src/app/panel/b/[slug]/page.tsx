"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Business {
  id: number;
  name: string;
  slug: string;
  phone: string;
  address: string | null;
}

export default function BusinessHomePage() {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const slug = params.slug as string;

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`/api/business/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setBusiness(data.business);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching business:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <main className="w-full max-w-md text-center space-y-8">
        {/* Business Header */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            {business.name}
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            به باشگاه {business.name} خوش آمدید
          </p>
        </div>

        {/* CTA Buttons - Side by side */}
        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          <Link href={`/panel/b/${slug}/c/login`}>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-4 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <span className="text-base">پنل مشتریان</span>
            </button>
          </Link>

          <Link href={`/panel/b/${slug}/b/login`}>
            <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-2 border-slate-200">
              <span className="text-base">پنل اعضا</span>
            </button>
          </Link>
        </div>

        {/* Powered by */}
        <div className="flex items-center justify-center gap-2 pt-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <span className="text-xs text-slate-500">قدرت گرفته از</span>
          <img src="/logob.svg" alt="Powered by" className="h-5 opacity-70" />
        </div>
      </main>
    </div>
  );
}


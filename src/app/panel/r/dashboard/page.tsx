"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Tab = "users" | "businesses";

interface Reseller {
  id: number;
  username: string;
  name: string;
  email: string | null;
  phone: string | null;
  commission_rate: number;
}

export default function ResellerDashboard() {
  const [user, setUser] = useState<Reseller | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("resellerUser");
    if (!userData) {
      router.push("/panel/r/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("resellerUser");
    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold">پنل نمایندگی</h1>
                <p className="text-sm opacity-90">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                کمیسیون: {user.commission_rate}%
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">خروج</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "users"
                  ? "bg-white text-violet-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              مشتریان من
            </button>
            <button
              onClick={() => setActiveTab("businesses")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "businesses"
                  ? "bg-white text-violet-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              کسب‌وکارهای من
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === "users" && <UsersTab resellerId={user.id} />}
        {activeTab === "businesses" && <BusinessesTab resellerId={user.id} />}
      </div>
    </div>
  );
}

function UsersTab({ resellerId }: { resellerId: number }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">مدیریت مشتریان</h2>
        <div className="flex gap-3 mb-6">
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + افزودن مشتری
          </button>
        </div>
        <div className="text-slate-500 text-center py-8">
          لیست مشتریان شما در اینجا نمایش داده می‌شود
        </div>
      </div>
    </div>
  );
}

function BusinessesTab({ resellerId }: { resellerId: number }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">مدیریت کسب‌وکارها</h2>
        <div className="flex gap-3 mb-6">
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + افزودن کسب‌وکار
          </button>
        </div>
        <div className="text-slate-500 text-center py-8">
          لیست کسب‌وکارهای شما در اینجا نمایش داده می‌شود
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Tab = "users" | "businesses" | "resellers";

interface SuperAdmin {
  id: number;
  username: string;
  name: string;
  email: string | null;
}

export default function SuperAdminDashboard() {
  const [user, setUser] = useState<SuperAdmin | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("superadminUser");
    if (!userData) {
      router.push("/panel/a/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("superadminUser");
    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold">پنل مدیر کل</h1>
                <p className="text-sm opacity-90">{user.name}</p>
              </div>
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

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "users"
                  ? "bg-white text-red-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              مشتریان
            </button>
            <button
              onClick={() => setActiveTab("businesses")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "businesses"
                  ? "bg-white text-red-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              کسب‌وکارها
            </button>
            <button
              onClick={() => setActiveTab("resellers")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "resellers"
                  ? "bg-white text-red-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              نمایندگان
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "businesses" && <BusinessesTab />}
        {activeTab === "resellers" && <ResellersTab />}
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">مدیریت مشتریان</h2>
        <div className="flex gap-3 mb-6">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + افزودن مشتری
          </button>
        </div>
        <div className="text-slate-500 text-center py-8">
          لیست مشتریان در اینجا نمایش داده می‌شود
        </div>
      </div>
    </div>
  );
}

function BusinessesTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">مدیریت کسب‌وکارها</h2>
        <div className="flex gap-3 mb-6">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + افزودن کسب‌وکار
          </button>
        </div>
        <div className="text-slate-500 text-center py-8">
          لیست کسب‌وکارها در اینجا نمایش داده می‌شود
        </div>
      </div>
    </div>
  );
}

function ResellersTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4">مدیریت نمایندگان</h2>
        <div className="flex gap-3 mb-6">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + افزودن نماینده
          </button>
        </div>
        <div className="text-slate-500 text-center py-8">
          لیست نمایندگان در اینجا نمایش داده می‌شود
        </div>
      </div>
    </div>
  );
}


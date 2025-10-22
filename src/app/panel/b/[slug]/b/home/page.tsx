"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { BrowserQRCodeReader } from "@zxing/browser";

type Tab = "home" | "customers" | "scan" | "profile";

interface BusinessUser {
  id: number;
  business_id: number;
  username: string;
  name: string;
  role: string;
  business: {
    id: number;
    name: string;
    slug: string;
    phone: string;
  };
}

interface CustomerData {
  userId: number;
  phone: string;
  name: string;
  businessId: number;
  businessSlug: string;
  type: string;
}

export default function BusinessStaffHome() {
  const params = useParams();
  const slug = params.slug as string;
  const [user, setUser] = useState<BusinessUser | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("scan");
  const [scannedData, setScannedData] = useState<CustomerData | null>(null);
  const [phoneSearch, setPhoneSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem(`businessUser_${slug}`);
    if (!userData) {
      router.push(`/panel/b/${slug}/b/login`);
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router, slug]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const reader = new BrowserQRCodeReader();
      const result = await reader.decodeFromImageElement(img);
      URL.revokeObjectURL(imageUrl);
      
      const data = JSON.parse(result.getText());
      
      if (data.type === "customer" && data.businessSlug === slug) {
        setScannedData(data);
      } else {
        alert(`این QR مربوط به کسب‌وکار دیگری است!`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در خواندن QR code");
    }

    if (e.target) e.target.value = '';
  };

  const handlePhoneSearch = () => {
    // Simulate finding customer by phone
    if (phoneSearch === "09124580298") {
      setScannedData({
        userId: 1,
        phone: "09124580298",
        name: "کاربر آزمایشی",
        businessId: user?.business_id || 0,
        businessSlug: slug,
        type: "customer"
      });
    } else {
      alert("مشتری یافت نشد");
    }
  };

  const handleVerify = () => {
    if (!scannedData) return;
    alert(`✅ امتیاز برای ${scannedData.name} ثبت شد!`);
    setScannedData(null);
    setPhoneSearch("");
  };

  const handleLogout = () => {
    localStorage.removeItem(`businessUser_${slug}`);
    router.push(`/panel/b/${slug}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Simple Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-base font-semibold text-slate-800">{user.business.name}</h1>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto pb-24">
        {activeTab === "home" && <HomeTab user={user} />}
        {activeTab === "customers" && <CustomersTab />}
        {activeTab === "scan" && (
          <ScanTab 
            scannedData={scannedData}
            setScannedData={setScannedData}
            phoneSearch={phoneSearch}
            setPhoneSearch={setPhoneSearch}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            handlePhoneSearch={handlePhoneSearch}
            handleVerify={handleVerify}
          />
        )}
        {activeTab === "profile" && <ProfileTab user={user} handleLogout={handleLogout} />}
      </div>

      {/* Clean Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-2xl mx-auto flex items-center h-16 px-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all ${
              activeTab === "home" ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            <svg className="w-5 h-5" fill={activeTab === "home" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === "home" ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">خانه</span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all ${
              activeTab === "customers" ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            <svg className="w-5 h-5" fill={activeTab === "customers" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === "customers" ? 0 : 2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-[10px] font-medium">مشتریان</span>
          </button>

          <button
            onClick={() => {
              setScannedData(null);
              setActiveTab("scan");
            }}
            className="flex flex-col items-center -mt-8"
          >
            <div className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
              activeTab === "scan"
                ? "bg-gradient-to-br from-emerald-500 to-teal-600 scale-110"
                : "bg-white border-2 border-emerald-200"
            }`}>
              <svg className={`w-7 h-7 ${activeTab === "scan" ? "text-white" : "text-emerald-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className={`text-[10px] font-bold mt-1 ${activeTab === "scan" ? "text-emerald-600" : "text-slate-600"}`}>
              ثبت
            </span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all ${
              activeTab === "profile" ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            <svg className="w-5 h-5" fill={activeTab === "profile" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === "profile" ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium">پروفایل</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function HomeTab({ user }: { user: BusinessUser }) {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-sm text-slate-600 mb-1">سلام</h2>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{user.name}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">۰</div>
            <div className="text-xs text-slate-600">امروز</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">۰</div>
            <div className="text-xs text-slate-600">این هفته</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">۰</div>
            <div className="text-xs text-slate-600">این ماه</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomersTab() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">مشتریان</h2>
        <div className="text-center py-12 text-slate-400">
          <svg className="w-16 h-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-sm">مشتری‌ای وجود ندارد</p>
        </div>
      </div>
    </div>
  );
}

function ScanTab({
  scannedData,
  setScannedData,
  phoneSearch,
  setPhoneSearch,
  fileInputRef,
  handleFileUpload,
  handlePhoneSearch,
  handleVerify
}: {
  scannedData: CustomerData | null;
  setScannedData: (data: CustomerData | null) => void;
  phoneSearch: string;
  setPhoneSearch: (phone: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneSearch: () => void;
  handleVerify: () => void;
}) {
  if (scannedData) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{scannedData.name}</h3>
              <p className="text-sm text-slate-500" dir="ltr">{scannedData.phone}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">امتیاز فعلی:</span>
              <span className="text-2xl font-bold text-emerald-600">۱,۵۰۰</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>آخرین خرید:</span>
              <span>۳ روز پیش</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleVerify}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              ✓ ثبت امتیاز
            </button>
            <button
              onClick={() => setScannedData(null)}
              className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-2xl transition-colors"
            >
              لغو
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Quick Phone Search */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">شماره موبایل</h3>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
            placeholder="09123456789"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-left text-lg"
            dir="ltr"
          />
          <button
            onClick={handlePhoneSearch}
            className="px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">یا</p>
      </div>

      {/* QR Scan Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-8 rounded-3xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">اسکن QR Code</p>
            <p className="text-sm opacity-90">سریع‌ترین روش</p>
          </div>
        </div>
      </button>

      <div className="bg-blue-50/50 rounded-2xl p-3 text-center">
        <p className="text-xs text-blue-700">
          💡 کاربر تستی: <span className="font-mono font-bold">09124580298</span>
        </p>
      </div>
    </div>
  );
}

function ProfileTab({ user, handleLogout }: { user: BusinessUser; handleLogout: () => void }) {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{user.name?.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.business.name}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-2xl transition-colors"
        >
          خروج از حساب
        </button>
      </div>
    </div>
  );
}

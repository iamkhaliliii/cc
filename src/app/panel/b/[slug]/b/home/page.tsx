"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { BrowserQRCodeReader } from "@zxing/browser";

type Tab = "home" | "customers" | "scan" | "settings" | "profile";

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
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [scannedData, setScannedData] = useState<CustomerData | null>(null);
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
        setActiveTab("scan");
      } else if (data.businessSlug !== slug) {
        alert(`این QR مربوط به ${data.businessSlug || 'کسب‌وکار دیگری'} است!`);
      }
    } catch (error) {
      console.error("Error reading QR:", error);
      alert("خطا در خواندن QR code");
    }

    if (e.target) {
      e.target.value = '';
    }
  };

  const handleVerifyCustomer = async () => {
    if (!scannedData) return;
    alert(`✅ کاربر ${scannedData.name} تایید شد!\nشماره: ${scannedData.phone}`);
    setScannedData(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(`businessUser_${slug}`);
    router.push(`/panel/b/${slug}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-right text-sm font-medium text-slate-700">
            {user.business.name}
          </h1>
        </div>
      </header>

      {/* Content Area */}
      <div className="h-[calc(100vh-9rem)] overflow-y-auto">
        {activeTab === "home" && <HomeTab user={user} />}
        {activeTab === "customers" && <CustomersTab />}
        {activeTab === "scan" && <ScanTab scannedData={scannedData} setScannedData={setScannedData} fileInputRef={fileInputRef} handleFileUpload={handleFileUpload} handleVerifyCustomer={handleVerifyCustomer} />}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "profile" && <ProfileTab user={user} handleLogout={handleLogout} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="flex justify-around items-center h-20 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "home" ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">خانه</span>
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "customers" ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs font-medium">مشتریان</span>
          </button>

          <button
            onClick={() => {
              setScannedData(null);
              setActiveTab("scan");
            }}
            className={`flex flex-col items-center justify-center gap-1 -mt-6 transition-all ${
              activeTab === "scan" ? "scale-110" : "scale-100"
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
              activeTab === "scan" 
                ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white" 
                : "bg-white text-emerald-600 border-2 border-emerald-200"
            }`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <span className={`text-xs font-bold mt-1 ${
              activeTab === "scan" ? "text-emerald-600" : "text-slate-600"
            }`}>ثبت امتیاز</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "settings" ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium">تنظیمات</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "profile" ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">پروفایل</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function HomeTab({ user }: { user: BusinessUser }) {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-1">{user.business.name}</h2>
        <p className="text-sm opacity-90">خوش آمدید {user.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">۰</div>
            <p className="text-xs text-slate-600">تراکنش امروز</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">۰</div>
            <p className="text-xs text-slate-600">مشتریان فعال</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomersTab() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">لیست مشتریان</h2>
        <div className="text-slate-500 text-center py-8">
          مشتری‌ای وجود ندارد
        </div>
      </div>
    </div>
  );
}

function ScanTab({ 
  scannedData, 
  setScannedData, 
  fileInputRef, 
  handleFileUpload,
  handleVerifyCustomer 
}: { 
  scannedData: CustomerData | null;
  setScannedData: (data: CustomerData | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVerifyCustomer: () => void;
}) {
  return (
    <div className="p-4 space-y-4">
      {!scannedData && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-4">
          <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">ثبت امتیاز مشتری</h3>
            <p className="text-slate-600 text-sm">
              QR code مشتری را اسکن کنید
            </p>
          </div>
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
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            اسکن QR Code
          </button>
        </div>
      )}

      {scannedData && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">QR اسکن شد!</h3>
              <p className="text-sm text-slate-600">اطلاعات مشتری</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">نام:</span>
              <span className="font-bold text-slate-800">{scannedData.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">شماره:</span>
              <span className="font-medium text-slate-800" dir="ltr">{scannedData.phone}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleVerifyCustomer}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition-all"
            >
              ✓ تایید و ثبت
            </button>
            <button
              onClick={() => setScannedData(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              لغو
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">تنظیمات</h2>
        <div className="text-slate-500 text-center py-8">
          تنظیمات در اینجا نمایش داده می‌شود
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, handleLogout }: { user: BusinessUser; handleLogout: () => void }) {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-bold">{user.name?.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
            <p className="text-sm text-slate-600">{user.role}</p>
            <p className="text-xs text-slate-500">{user.business.name}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-50 rounded-xl p-4 border border-red-200 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-medium text-red-600">خروج</span>
      </button>
    </div>
  );
}

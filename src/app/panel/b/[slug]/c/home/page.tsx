"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";

type Tab = "home" | "points" | "qrcode" | "profile";

interface User {
  id: number;
  phone: string;
  name: string;
  email: string | null;
  points: number;
  created_at: string;
  updated_at: string;
}

interface Business {
  id: number;
  name: string;
  slug: string;
}

export default function CustomerHome() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem(`customerUser_${slug}`);
    const businessData = localStorage.getItem(`currentBusiness_${slug}`);
    
    if (!userData || !businessData) {
      router.push(`/panel/b/${slug}/c/login`);
    } else {
      setUser(JSON.parse(userData));
      setBusiness(JSON.parse(businessData));
    }
  }, [router, slug]);

  if (!user || !business) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-right text-sm font-medium text-slate-700">
            باشگاه مشتریان {business.name}
          </h1>
        </div>
      </header>

      {/* Content Area */}
      <div className="h-[calc(100vh-9rem)] overflow-y-auto">
        {activeTab === "home" && <HomeTab user={user} business={business} />}
        {activeTab === "points" && <PointsTab user={user} business={business} />}
        {activeTab === "qrcode" && <QRCodeTab user={user} business={business} />}
        {activeTab === "profile" && <ProfileTab user={user} business={business} slug={slug} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "home"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">خانه</span>
          </button>

          <button
            onClick={() => setActiveTab("points")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "points"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">امتیاز</span>
          </button>

          <button
            onClick={() => setActiveTab("qrcode")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "qrcode"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span className="text-xs font-medium">کد من</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "profile"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">پروفایل</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function HomeTab({ user, business }: { user: User; business: Business }) {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">سلام،</p>
            <h2 className="text-2xl font-bold">{user.name}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-3">
          <p className="text-sm opacity-90 mb-1">امتیاز شما در {business.name}</p>
          <p className="text-3xl font-bold">{user.points?.toLocaleString('fa-IR')} امتیاز</p>
        </div>
        <p className="text-xs opacity-75 text-center">باشگاه {business.name}</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">دسترسی سریع</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">جوایز</p>
          </button>

          <button className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">تاریخچه</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">فعالیت‌های اخیر</h3>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-center py-4">فعالیتی وجود ندارد</p>
        </div>
      </div>
    </div>
  );
}

function PointsTab({ user, business }: { user: User; business: Business }) {
  return (
    <div className="p-4 space-y-6">
      {/* Points Summary */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-xs opacity-75 mb-2">{business.name}</p>
        <div className="text-center">
          <p className="text-sm opacity-90 mb-2">موجودی امتیاز</p>
          <p className="text-5xl font-bold mb-4">{user.points?.toLocaleString('fa-IR')}</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90">معادل تخفیف</p>
            <p className="text-xl font-bold">{(user.points * 1000).toLocaleString('fa-IR')} تومان</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QRCodeTab({ user, business }: { user: User; business: Business }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = useState(1);
  const [showDownloadHint, setShowDownloadHint] = useState(false);

  useEffect(() => {
    if (canvasRef.current && user && user.id) {
      const qrData = JSON.stringify({
        userId: user.id,
        phone: user.phone,
        name: user.name,
        businessId: business.id,
        businessSlug: business.slug,
        type: "customer"
      });

      console.log('Generating QR code with data:', qrData);

      QRCode.toCanvas(
        canvasRef.current,
        qrData,
        {
          width: 280,
          margin: 2,
          color: {
            dark: "#1e40af",
            light: "#ffffff"
          },
          errorCorrectionLevel: 'H'
        },
        (error) => {
          if (error) {
            console.error("QR Code generation error:", error);
          } else {
            console.log("QR Code generated successfully");
          }
        }
      );
    }
  }, [user, business]);

  const handleBrightnessToggle = () => {
    setBrightness(brightness === 1 ? 1.5 : 1);
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `qr-${business.slug}-${user.phone}.png`;
          a.click();
          URL.revokeObjectURL(url);
          setShowDownloadHint(true);
          setTimeout(() => setShowDownloadHint(false), 3000);
        }
      });
    }
  };

  return (
    <div className="p-4 space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 max-w-sm w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">کد من</h2>
          <p className="text-slate-600 text-sm">{business.name}</p>
        </div>

        <div 
          className="bg-white p-6 rounded-2xl border-4 border-blue-100 mb-6 flex items-center justify-center"
          style={{ filter: `brightness(${brightness})` }}
        >
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleBrightnessToggle}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>{brightness === 1 ? "افزایش روشنایی" : "کاهش روشنایی"}</span>
          </button>

          <button
            onClick={handleDownloadQR}
            className="w-full bg-white border-2 border-blue-200 text-blue-600 font-medium py-2.5 px-4 rounded-lg hover:bg-blue-50 transition-colors"
          >
            ذخیره QR Code
          </button>
        </div>

        {showDownloadHint && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center">
            ✓ QR code ذخیره شد!
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileTab({ user, business, slug }: { user: User; business: Business; slug: string }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem(`customerUser_${slug}`);
    localStorage.removeItem(`currentBusiness_${slug}`);
    router.push(`/panel/b/${slug}`);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center">
            <span className="text-3xl text-white font-bold">
              {user.name?.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-slate-500 text-sm" dir="ltr">{user.phone}</p>
            <p className="text-slate-400 text-xs">{business.name}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">ایمیل</span>
            <span className="text-slate-800 font-medium">{user.email || "ثبت نشده"}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600">امتیاز کل</span>
            <span className="text-blue-600 font-bold">{user.points?.toLocaleString('fa-IR')}</span>
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
        <span className="font-medium text-red-600">خروج از حساب</span>
      </button>
    </div>
  );
}


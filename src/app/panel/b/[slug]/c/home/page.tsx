"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import CreditCard from "@/components/CreditCard";

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
    <div className="p-4 space-y-5">
      {/* Premium Credit Card */}
      <CreditCard
        userName={user.name}
        businessName={business.name}
        points={user.points}
        userId={user.id}
        phone={user.phone}
      />

      {/* Old card backup */}
      <div className="relative group hidden">
        {/* Card Shadow Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-[28px] blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-[24px] p-6 text-white shadow-2xl aspect-[1.586/1] overflow-hidden transform group-hover:scale-[1.02] transition-all duration-300">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tl from-white to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full opacity-40"></div>
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-30"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full opacity-25"></div>
          </div>

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top Section */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wide opacity-80 mb-1.5 font-medium">باشگاه مشتریان</p>
                <h2 className="text-xl font-bold tracking-tight">{business.name}</h2>
              </div>
              <div className="bg-white/15 backdrop-blur-lg px-3 py-1.5 rounded-full border border-white/20">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>

            {/* Chip Simulation */}
            <div className="w-12 h-9 bg-gradient-to-br from-amber-200 to-amber-400 rounded-md opacity-90 my-2">
              <div className="w-full h-full grid grid-cols-3 gap-[1px] p-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-amber-500/40 rounded-[1px]"></div>
                ))}
              </div>
            </div>

            {/* Middle Section - Points */}
            <div className="mt-auto mb-4">
              <p className="text-xs opacity-80 mb-1.5 tracking-wide">موجودی امتیاز</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black tracking-tight tabular-nums">{user.points?.toLocaleString('fa-IR')}</p>
                <p className="text-base opacity-90 font-medium">امتیاز</p>
              </div>
              <div className="mt-2 text-xs opacity-70">
                معادل {(user.points * 1000).toLocaleString('fa-IR')} تومان تخفیف
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex items-end justify-between pt-3 border-t border-white/20">
              <div>
                <p className="text-[10px] opacity-70 mb-1 tracking-wide">نام دارنده</p>
                <p className="text-sm font-bold tracking-wide">{user.name}</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] opacity-70 mb-1 tracking-wide">شماره کارت</p>
                <p className="text-xs font-mono font-bold tracking-widest" dir="ltr">
                  {user.id.toString().padStart(6, '0')}
                </p>
              </div>
            </div>
          </div>

          {/* Holographic Shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Glass Effect Border */}
          <div className="absolute inset-0 rounded-[24px] border border-white/30"></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:scale-105">
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-emerald-600">+۵۰</p>
            <p className="text-[10px] text-slate-500 mt-1">این ماه</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:scale-105">
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-orange-600">۳</p>
            <p className="text-[10px] text-slate-500 mt-1">جوایز</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:scale-105">
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-blue-600">۱۲</p>
            <p className="text-[10px] text-slate-500 mt-1">خرید</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
          دسترسی سریع
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="group bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-2xl p-5 border border-blue-100 hover:border-blue-200 transition-all hover:shadow-lg">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">جوایز من</p>
            <p className="text-xs text-slate-500 mt-1">۳ جایزه در دسترس</p>
          </button>

          <button className="group bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-2xl p-5 border border-emerald-100 hover:border-emerald-200 transition-all hover:shadow-lg">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">تاریخچه</p>
            <p className="text-xs text-slate-500 mt-1">۱۲ تراکنش</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
          آخرین فعالیت‌ها
        </h3>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 font-medium">فعالیتی ثبت نشده</p>
              <p className="text-xs text-slate-400 mt-1">خریدهای شما اینجا نمایش داده می‌شود</p>
            </div>
          </div>
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


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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 transition-colors">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-right text-sm font-medium text-slate-700 dark:text-slate-200">
            باشگاه مشتریان {business.name}
          </h1>
        </div>
      </header>

      {/* Content Area */}
      <div className={`h-[calc(100vh-9rem)] ${activeTab === "points" ? "" : "overflow-y-auto"}`}>
        <div className="max-w-lg mx-auto h-full">
          {activeTab === "home" && <HomeTab user={user} business={business} />}
          {activeTab === "points" && <PointsTab user={user} business={business} />}
          {activeTab === "qrcode" && <QRCodeTab user={user} business={business} />}
          {activeTab === "profile" && <ProfileTab user={user} business={business} slug={slug} />}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg transition-colors">
        <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "home"
                ? "text-blue-600 dark:text-blue-500"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-xs font-medium">کارت</span>
          </button>

          <button
            onClick={() => setActiveTab("points")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
              activeTab === "points"
                ? "text-blue-600 dark:text-blue-500"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
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
                ? "text-blue-600 dark:text-blue-500"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
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
                ? "text-blue-600 dark:text-blue-500"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
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
        businessId={business.id}
        businessSlug={business.slug}
        backgroundImage="/Background.png"
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

          </div>

        </div>
      </div>


      {/* Recent Activity */}
      <div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
          آخرین فعالیت‌ها
        </h3>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">فعالیتی ثبت نشده</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">خریدهای شما اینجا نمایش داده می‌شود</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PointsTab({ user, business }: { user: User; business: Business }) {
  return (
    <div className="h-full flex flex-col">
      {/* Points Summary - Fixed */}
      <div className="flex-shrink-0 p-4 pb-0">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-[1.586/1]">
        {/* Background Image like CreditCard */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/Background.png)' }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full p-4 sm:p-6 flex flex-col justify-between text-white">
          {/* Top */}
          <div className="flex items-start justify-between">
            {/* Left - Name + Badge (Mobile) / Name (Desktop) */}
            <div className="text-right sm:text-right">
              {/* Mobile - Name + Badge */}
              <div className="sm:hidden">
                <p className="text-base font-bold mb-2">{business.name}</p>
                <div className="inline-flex bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full items-center gap-1.5 border border-white/30 shadow-lg">
                  <span className="text-base">🥈</span>
                  <span className="text-xs text-white">سطح: <span className="font-bold">نقره‌ای</span></span>
                </div>
              </div>
              
              {/* Desktop - Name */}
              <p className="hidden sm:block text-lg font-bold">{business.name}</p>
            </div>
            
            {/* Right - Points (Mobile) / Badge (Desktop) */}
            <div className="text-left sm:text-left">
              {/* Mobile - Points */}
              <div className="sm:hidden p-2">
                <p className="text-sm opacity-90 mb-1">موجودی امتیاز</p>
                <p className="text-6xl font-bold tracking-tighter">{user.points?.toLocaleString('fa-IR')}</p>
              </div>
              
              {/* Desktop - Badge only */}
              <div className="hidden sm:flex bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full items-center gap-1.5 border border-white/30 shadow-lg">
                <span className="text-base">🥈</span>
                <span className="text-xs text-white">سطح: <span className="font-bold">نقره‌ای</span></span>
              </div>
            </div>
          </div>

          {/* Center - Points (Desktop only) */}
          <div className="hidden sm:block text-center mb-16">
            <p className="text-base opacity-90 mb-0">موجودی امتیاز</p>
            <p className="text-6xl md:text-7xl font-bold">{user.points?.toLocaleString('fa-IR')}</p>
          </div>

          {/* Spacer */}
          <div></div>
        </div>

        {/* Bottom Actions Bar with Blur */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/20 rounded-b-3xl">
          <div className="flex items-center justify-between gap-2 sm:gap-2 px-3 sm:px-4 py-3 sm:py-4">
            {/* Transfer Points */}
            <button className="flex-1 flex flex-col items-center gap-1.5 sm:gap-1.5 text-white hover:opacity-80 transition-opacity">
              <div className="w-11 h-11 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-[10px] font-medium">انتقال امتیاز</span>
            </button>

            {/* Add Points */}
            <button className="flex-1 flex flex-col items-center gap-1.5 sm:gap-1.5 text-white hover:opacity-80 transition-opacity">
              <div className="w-11 h-11 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-[10px] font-medium">افزایش امتیاز</span>
            </button>

            {/* Spend Points */}
            <button className="flex-1 flex flex-col items-center gap-1.5 sm:gap-1.5 text-white hover:opacity-80 transition-opacity">
              <div className="w-11 h-11 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-[10px] font-medium">خرج کردن</span>
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Points History - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 px-1">تاریخچه امتیازات</h3>
        
        <div className="space-y-2">
          {/* Sample transactions - In real app, this would come from backend */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors min-h-[80px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                  افزایش امتیاز <span className="text-xs  mr-1 font-normal text-slate-400 dark:text-slate-500">۲ روز پیش</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">فروشگاه میخک نقره‌ای</p>
              </div>
            </div>
            <div className="text-left">
              <span className="text-base font-bold text-green-600 dark:text-green-400 block mb-0.5 tracking-tighter">۵۰۰ +</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400">معتبر تا ۲۵ اسفند ۱۴۰۴</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors min-h-[80px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                  خرج امتیاز <span className="text-xs  mr-1 font-normal text-slate-400 dark:text-slate-500">۵ روز پیش</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">فروشگاه میخک نقره‌ای</p>
              </div>
            </div>
            <span className="text-base font-bold text-slate-800 dark:text-white tracking-tighter">۲۰۰ -</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors min-h-[80px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                  انتقال امتیاز <span className="text-xs  mr-1 font-normal text-slate-400 dark:text-slate-500">۱ هفته پیش</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">انتقال به بهروز مبارکی</p>
              </div>
            </div>
            <span className="text-base font-bold text-slate-800 dark:text-white tracking-tighter">۳۰۰ -</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors min-h-[80px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white mb-2">
                  افزایش امتیاز <span className="text-xs  mr-1 font-normal text-slate-400 dark:text-slate-500">۲ هفته پیش</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">هدیه روز تولد</p>
              </div>
            </div>
            <div className="text-left">
              <span className="text-base font-bold text-green-600 dark:text-green-400 block mb-0.5 tracking-tighter">۱٬۲۰۰ +</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400">معتبر تا ۱۵ بهمن ۱۴۰۴</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function QRCodeTab({ user, business }: { user: User; business: Business }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

      QRCode.toCanvas(
        canvasRef.current,
        qrData,
        {
          width: 240,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff"
          },
          errorCorrectionLevel: 'H'
        }
      );
    }
  }, [user, business]);

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
    <div className="p-4 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Card-like vertical layout */}
      <div className="relative w-full max-w-md">
        {/* Card Shadow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-[28px] blur-xl opacity-40"></div>
        
        <div 
          className="relative bg-cover bg-center rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundImage: 'url(/Background.png)' }}
        >
          {/* Dark overlay with blur */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-xs"></div>

          {/* Content */}
          <div className="relative z-10 p-8 flex flex-col items-center text-white">
            {/* Top Info */}
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-wide opacity-80 mb-1">کد شناسایی</p>
              <h2 className="text-xl font-bold">{business.name}</h2>
            </div>

            {/* QR Code - Center */}
            <div className="bg-white p-4 rounded-2xl shadow-2xl mb-6">
              <canvas ref={canvasRef} className="block" />
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <p className="text-sm font-bold mb-1">{user.name}</p>
              <p className="text-xs opacity-80" dir="ltr">{user.phone}</p>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2">
              <button
                onClick={handleDownloadQR}
                className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium py-3 rounded-xl transition-all border border-white/30"
              >
                ذخیره QR Code
              </button>
            </div>

            {showDownloadHint && (
              <div className="mt-3 bg-green-500/90 text-white px-4 py-2 rounded-lg text-sm">
                ✓ ذخیره شد!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, business, slug }: { user: User; business: Business; slug: string }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`customerUser_${slug}`);
    localStorage.removeItem(`currentBusiness_${slug}`);
    router.push(`/panel/b/${slug}`);
  };

  return (
    <div className="p-4 space-y-4">
      {/* User Info Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
        <div className="text-center">
          {/* Avatar with first letter */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">
                {user.name.charAt(0)}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{user.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm" dir="ltr">{user.phone}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <button className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-medium text-slate-700 dark:text-slate-200">پشتیبانی</span>
          </div>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-slate-700 dark:text-slate-200">درباره باشگاه</span>
          </div>
          <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={toggleDarkMode}
          className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="font-medium text-slate-700 dark:text-slate-200">حالت شب / روز</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">{isDark ? 'شب' : 'روز'}</span>
            <div className={`w-12 h-6 rounded-full relative transition-colors ${isDark ? 'bg-blue-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isDark ? 'right-1' : 'left-1'}`}></div>
            </div>
          </div>
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-medium text-red-600 dark:text-red-400">خروج از حساب</span>
      </button>
    </div>
  );
}


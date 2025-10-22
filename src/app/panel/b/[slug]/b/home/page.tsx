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
  const [scanning, setScanning] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem(`businessUser_${slug}`);
    if (!userData) {
      router.push(`/panel/b/${slug}/b/login`);
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router, slug]);

  useEffect(() => {
    let isActive = true;
    let controls: { stop: () => void } | null = null;

    const startScanning = async () => {
      if (scanning && videoRef.current && cameraMode) {
        try {
          if (!codeReaderRef.current) {
            codeReaderRef.current = new BrowserQRCodeReader();
          }

          controls = await codeReaderRef.current.decodeFromVideoDevice(
            undefined,
            videoRef.current,
            (result) => {
              if (result && isActive) {
                try {
                  const data = JSON.parse(result.getText());
                  if (data.type === "customer" && data.businessSlug === slug) {
                    setScannedData(data);
                    setScanning(false);
                    setCameraMode(false);
                  } else if (data.businessSlug !== slug) {
                    alert(`این QR مربوط به کسب‌وکار دیگری است!`);
                  }
                } catch (err) {
                  console.error("Invalid QR:", err);
                }
              }
            }
          );
        } catch (error) {
          console.error("Scanner error:", error);
          setScanning(false);
          setCameraMode(false);
        }
      }
    };

    if (scanning && cameraMode) {
      startScanning();
    }

    return () => {
      isActive = false;
      if (controls) {
        try {
          controls.stop();
        } catch (e) {
          console.log("Error stopping:", e);
        }
      }
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    };
  }, [scanning, cameraMode, slug]);

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

  const handleStartCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } } 
      });
      setCameraMode(true);
      setScanning(true);
    } catch (error) {
      console.error("Camera error:", error);
      alert("دسترسی به دوربین رد شد");
    }
  };

  const handleStopCamera = () => {
    setScanning(false);
    setCameraMode(false);
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm font-medium text-slate-700">
            {user.business.name}
          </h1>
        </div>
      </header>

      {/* Sidebar Menu */}
      <div className={`fixed inset-0 z-30 pointer-events-none ${menuOpen ? 'pointer-events-auto' : ''}`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <div className={`fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-40 transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
            {/* Sidebar Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">منوی مدیریت</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm opacity-90">{user.business.name}</p>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-140px)]">
              <button className="w-full text-right px-4 py-3 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-3 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">گزارش‌گیری</span>
              </button>

              <button className="w-full text-right px-4 py-3 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-3 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">تنظیمات امتیاز</span>
              </button>

              <button className="w-full text-right px-4 py-3 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-3 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span className="text-sm font-medium text-slate-700">مدیریت جوایز</span>
              </button>

              <button className="w-full text-right px-4 py-3 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-3 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">مدیریت کارمندان</span>
              </button>

              <button className="w-full text-right px-4 py-3 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-3 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-sm font-medium text-slate-700">تاریخچه تراکنش‌ها</span>
              </button>

              <div className="border-t border-slate-200 my-3"></div>

              <button className="w-full text-right px-4 py-3 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-3 group">
                <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-700">راهنما و پشتیبانی</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="h-[calc(100vh-9rem)] overflow-y-auto">
        {activeTab === "home" && <HomeTab user={user} />}
        {activeTab === "customers" && <CustomersTab />}
        {activeTab === "scan" && (
          <ScanTab 
            scanning={scanning}
            cameraMode={cameraMode}
            scannedData={scannedData}
            setScannedData={setScannedData}
            fileInputRef={fileInputRef}
            videoRef={videoRef}
            handleFileUpload={handleFileUpload}
            handleStartCamera={handleStartCamera}
            handleStopCamera={handleStopCamera}
            handleVerifyCustomer={handleVerifyCustomer}
          />
        )}
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
  scanning,
  cameraMode,
  scannedData, 
  setScannedData, 
  fileInputRef,
  videoRef,
  handleFileUpload,
  handleStartCamera,
  handleStopCamera,
  handleVerifyCustomer 
}: { 
  scanning: boolean;
  cameraMode: boolean;
  scannedData: CustomerData | null;
  setScannedData: (data: CustomerData | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStartCamera: () => void;
  handleStopCamera: () => void;
  handleVerifyCustomer: () => void;
}) {
  return (
    <div className="p-4 space-y-4">
      {/* Camera Scanner */}
      {scanning && cameraMode && !scannedData && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">در حال اسکن...</h3>
            <p className="text-sm text-slate-600">QR را در کادر قرار دهید</p>
          </div>
          
          <div className="relative rounded-xl overflow-hidden bg-black mb-4">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[400px]"
              playsInline
              autoPlay
              muted
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-emerald-500 rounded-2xl"></div>
            </div>
          </div>

          <button
            onClick={handleStopCamera}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-6 rounded-xl border border-red-200 transition-colors"
          >
            لغو اسکن
          </button>
        </div>
      )}

      {/* File Upload / Initial State */}
      {!scanning && !scannedData && (
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
          <div className="space-y-3">
            <button
              onClick={handleStartCamera}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              دوربین مستقیم
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 border-2 border-slate-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              انتخاب از گالری
            </button>
          </div>
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

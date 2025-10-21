"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

export default function CustomerHome() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("customerUser");
    if (!userData) {
      router.push("/customer/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Content Area */}
      <div className="h-[calc(100vh-5rem)] overflow-y-auto">
        {activeTab === "home" && <HomeTab user={user} />}
        {activeTab === "points" && <PointsTab user={user} />}
        {activeTab === "qrcode" && <QRCodeTab user={user} />}
        {activeTab === "profile" && <ProfileTab user={user} />}
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

function HomeTab({ user }: { user: User }) {
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
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm opacity-90 mb-1">امتیاز شما</p>
          <p className="text-3xl font-bold">{user.points?.toLocaleString('fa-IR')} امتیاز</p>
        </div>
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

function PointsTab({ user }: { user: User }) {
  return (
    <div className="p-4 space-y-6">
      {/* Points Summary */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="text-center">
          <p className="text-sm opacity-90 mb-2">موجودی امتیاز</p>
          <p className="text-5xl font-bold mb-4">{user.points?.toLocaleString('fa-IR')}</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs opacity-90">معادل تخفیف</p>
            <p className="text-xl font-bold">{(user.points * 1000).toLocaleString('fa-IR')} تومان</p>
          </div>
        </div>
      </div>

      {/* How to Earn */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">روش‌های کسب امتیاز</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-800">خرید از فروشگاه‌ها</p>
              <p className="text-sm text-slate-500">هر ۱۰۰۰ تومان = ۱ امتیاز</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-800">معرفی به دوستان</p>
              <p className="text-sm text-slate-500">هر نفر = ۵۰ امتیاز</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QRCodeTab({ user }: { user: User }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = useState(1);
  const [showDownloadHint, setShowDownloadHint] = useState(false);

  useEffect(() => {
    if (canvasRef.current && user && user.id) {
      // Generate QR code with user ID
      const qrData = JSON.stringify({
        userId: user.id,
        phone: user.phone,
        name: user.name,
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
  }, [user]);

  // Increase brightness for scanning
  const handleBrightnessToggle = () => {
    setBrightness(brightness === 1 ? 1.5 : 1);
  };

  // Download QR code as image
  const handleDownloadQR = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `qr-code-${user.phone}.png`;
          a.click();
          URL.revokeObjectURL(url);
          setShowDownloadHint(true);
          setTimeout(() => setShowDownloadHint(false), 3000);
        }
      });
    }
  };

  // Share QR code (mobile)
  const handleShareQR = async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((b) => {
          if (b) resolve(b);
        });
      });

      const file = new File([blob], `qr-code-${user.phone}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'کد QR من',
          text: 'کد QR باشگاه مشتریان'
        });
      } else {
        // Fallback to download
        handleDownloadQR();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      handleDownloadQR();
    }
  };

  return (
    <div className="p-4 space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* QR Code Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">کد من</h2>
          <p className="text-slate-600 text-sm">
            این کد را در فروشگاه‌ها اسکن کنید
          </p>
        </div>

        {/* QR Code Display */}
        <div 
          className="bg-white p-6 rounded-2xl border-4 border-blue-100 mb-6 flex items-center justify-center"
          style={{ filter: `brightness(${brightness})` }}
        >
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>

        {/* User Info */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">نام:</span>
            <span className="font-bold text-slate-800">{user.name}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">شماره تماس:</span>
            <span className="font-medium text-slate-800" dir="ltr">{user.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">امتیاز فعلی:</span>
            <span className="font-bold text-blue-600">{user.points?.toLocaleString('fa-IR')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleBrightnessToggle}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{brightness === 1 ? "افزایش روشنایی" : "کاهش روشنایی"}</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadQR}
              className="bg-white border-2 border-blue-200 text-blue-600 font-medium py-2.5 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-sm">ذخیره</span>
            </button>

            <button
              onClick={handleShareQR}
              className="bg-white border-2 border-purple-200 text-purple-600 font-medium py-2.5 px-4 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-sm">اشتراک</span>
            </button>
          </div>
        </div>

        {showDownloadHint && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center animate-in fade-in">
            ✓ QR code ذخیره شد!
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-sm w-full">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">نحوه استفاده:</p>
            <p>این کد QR را در هنگام خرید به فروشنده نشان دهید تا امتیاز کسب کنید.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user }: { user: User }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("customerUser");
    router.push("/");
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
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

      {/* Menu Items */}
      <div className="space-y-2">
        <button className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="font-medium text-slate-700">ویرایش پروفایل</span>
          </div>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-medium text-slate-700">تنظیمات</span>
          </div>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

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
    </div>
  );
}


"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { BrowserQRCodeReader } from "@zxing/browser";

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
  const [scannedData, setScannedData] = useState<CustomerData | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem(`businessUser_${slug}`);
    if (!userData) {
      router.push(`/business/${slug}/business/login`);
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
      console.log('Scanned QR:', data);
      
      if (data.type === "customer" && data.businessSlug === slug) {
        setScannedData(data);
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
    router.push(`/business/${slug}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">{user.business.name}</h1>
            <p className="text-sm text-slate-600">{user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">اسکن QR Code</h2>
          <p className="text-sm opacity-90">کد مشتری را اسکن کنید</p>
        </div>

        {/* File Upload */}
        {!scannedData && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-4">
            <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">اسکن QR Code مشتری</h3>
              <p className="text-slate-600 text-sm">
                از گالری عکس QR code مشتری را انتخاب کنید
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              عکس گرفتن یا انتخاب از گالری
            </button>
          </div>
        )}

        {/* Scanned Result */}
        {scannedData && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">اسکن موفق!</h3>
                <p className="text-sm text-slate-600">اطلاعات مشتری</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">نام:</span>
                <span className="font-bold text-slate-800">{scannedData.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">شماره تماس:</span>
                <span className="font-medium text-slate-800" dir="ltr">{scannedData.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">شناسه کاربر:</span>
                <span className="font-medium text-slate-800">{scannedData.userId}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerifyCustomer}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ✓ تایید و ثبت
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-6 rounded-xl transition-colors"
              >
                اسکن مجدد
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


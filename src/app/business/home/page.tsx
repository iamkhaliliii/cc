"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";

interface BusinessUser {
  id: number;
  business_id: number;
  username: string;
  name: string;
  role: string;
  business: {
    id: number;
    name: string;
    phone: string;
  };
}

interface CustomerData {
  userId: number;
  phone: string;
  name: string;
  type: string;
}

export default function BusinessHome() {
  const [user, setUser] = useState<BusinessUser | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<CustomerData | null>(null);
  const [verifying, setVerifying] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("businessUser");
    if (!userData) {
      router.push("/business/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  useEffect(() => {
    if (scanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.type === "customer") {
              setScannedData(data);
              setScanning(false);
              scannerRef.current?.clear();
              scannerRef.current = null;
            }
          } catch (error) {
            console.error("Invalid QR code:", error);
          }
        },
        (error) => {
          // Silent error handling for scanning
          console.log(error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  const handleStartScan = () => {
    setScannedData(null);
    setScanning(true);
  };

  const handleStopScan = () => {
    setScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      scannerRef.current = null;
    }
  };

  const handleVerifyCustomer = async () => {
    if (!scannedData) return;
    
    setVerifying(true);
    try {
      // Simulate verification - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`✅ کاربر ${scannedData.name} تایید شد!\nشماره: ${scannedData.phone}`);
      setScannedData(null);
    } catch (error) {
      alert("خطا در تایید کاربر");
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("businessUser");
    router.push("/");
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
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">اسکن QR Code</h2>
              <p className="text-sm opacity-90">کد مشتری را اسکن کنید</p>
            </div>
          </div>
        </div>

        {/* Scanner Section */}
        {!scanning && !scannedData && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-4">
            <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">آماده اسکن</h3>
              <p className="text-slate-600 text-sm">
                دکمه زیر را بزنید و QR code مشتری را اسکن کنید
              </p>
            </div>
            <button
              onClick={handleStartScan}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              شروع اسکن
            </button>
          </div>
        )}

        {/* Scanner Active */}
        {scanning && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">در حال اسکن...</h3>
              <p className="text-sm text-slate-600">QR code را در مقابل دوربین قرار دهید</p>
            </div>
            <div id="qr-reader" className="w-full"></div>
            <button
              onClick={handleStopScan}
              className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-6 rounded-xl border border-red-200 transition-colors"
            >
              لغو اسکن
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
                disabled={verifying}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {verifying ? "در حال تایید..." : "✓ تایید و ثبت"}
              </button>
              <button
                onClick={handleStartScan}
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


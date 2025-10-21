"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [permissionError, setPermissionError] = useState<string>("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("businessUser");
    if (!userData) {
      router.push("/business/login");
    } else {
      setUser(JSON.parse(userData));
    }

    // Check camera permissions
    checkCameraPermissions();
  }, [router]);

  const checkCameraPermissions = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError("دوربین مستقیم پشتیبانی نمی‌شود. از حالت آپلود تصویر استفاده کنید.");
        setCameraPermission('denied');
        setUseFallbackMode(true);
        return;
      }

      // Request permission first to get device labels on mobile
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.log('Initial permission request:', err);
      }

      // Get list of video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(device => device.kind === 'videoinput');
      setVideoDevices(videoInputs);

      // Try to use back camera on mobile
      const backCamera = videoInputs.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      
      if (backCamera) {
        setSelectedDeviceId(backCamera.deviceId);
      } else if (videoInputs.length > 0) {
        // On mobile, prefer the last camera (usually back camera)
        setSelectedDeviceId(videoInputs[videoInputs.length - 1].deviceId);
      }

      try {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(result.state as 'granted' | 'denied' | 'prompt');

        result.onchange = () => {
          setCameraPermission(result.state as 'granted' | 'denied' | 'prompt');
        };
      } catch {
        console.log('Permission API not supported, will request on scan');
        setCameraPermission('prompt');
      }
    } catch (error) {
      console.log('Error checking permissions:', error);
      setCameraPermission('prompt');
    }
  };

  useEffect(() => {
    let isActive = true;
    let controls: { stop: () => void } | null = null;

    const startScanning = async () => {
      if (scanning && videoRef.current) {
        try {
          if (!codeReaderRef.current) {
            codeReaderRef.current = new BrowserQRCodeReader();
          }

          console.log('Starting scanner with deviceId:', selectedDeviceId);
          
          // Use deviceId if available, otherwise let browser choose (preferring back camera)
          const deviceToUse = selectedDeviceId || undefined;
          
          controls = await codeReaderRef.current.decodeFromVideoDevice(
            deviceToUse,
            videoRef.current,
            (result) => {
              if (result && isActive) {
                try {
                  const data = JSON.parse(result.getText());
                  console.log('QR Code scanned:', data);
                  if (data.type === "customer") {
                    setScannedData(data);
                    setScanning(false);
                  } else {
                    console.log('Invalid QR type:', data.type);
                  }
                } catch (err) {
                  console.error("Invalid QR code format:", err);
                }
              }
            }
          );

          console.log('Scanner started successfully');

          // Ensure video plays on mobile - do this after decoding starts
          await new Promise(resolve => setTimeout(resolve, 100));
          if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.play().catch((e) => {
              console.log('Video play error:', e);
            });
          }
        } catch (error) {
          console.error("Error starting scanner:", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          setPermissionError(`خطا در شروع دوربین: ${errorMessage}`);
          setScanning(false);
          
          // If camera fails, suggest fallback
          if (errorMessage.includes('Permission') || errorMessage.includes('NotAllowed')) {
            setPermissionError("دسترسی به دوربین رد شد. از حالت آپلود تصویر استفاده کنید.");
          }
        }
      }
    };

    if (scanning) {
      startScanning();
    }

    return () => {
      isActive = false;
      if (controls) {
        try {
          controls.stop();
        } catch (e) {
          console.log("Error stopping controls:", e);
        }
      }
      // Stop all video tracks
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    };
  }, [scanning, selectedDeviceId]);

  const handleStartScan = async () => {
    setScannedData(null);
    setPermissionError("");

    console.log('handleStartScan - current permission:', cameraPermission);
    console.log('handleStartScan - selected device:', selectedDeviceId);

    // Request camera permission first
    if (cameraPermission !== 'granted') {
      try {
        console.log('Requesting camera permission...');
        // Request with facingMode for mobile back camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        console.log('Permission granted! Stream:', stream.getTracks());
        
        // Stop the stream immediately, we just needed permission
        stream.getTracks().forEach(track => track.stop());
        
        // Update permission state
        setCameraPermission('granted');
        
        // Get updated device list with labels
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        console.log('Available cameras:', videoInputs);
        setVideoDevices(videoInputs);
        
        // Select back camera if available
        const backCamera = videoInputs.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
        );
        
        let selectedDevice = '';
        if (backCamera && backCamera.deviceId) {
          selectedDevice = backCamera.deviceId;
          console.log('Selected back camera:', backCamera.label);
        } else if (videoInputs.length > 0) {
          selectedDevice = videoInputs[videoInputs.length - 1].deviceId;
          console.log('Selected last camera:', videoInputs[videoInputs.length - 1].label);
        }
        
        setSelectedDeviceId(selectedDevice);
        
        // Start scanning with delay to ensure state is updated
        setTimeout(() => {
          console.log('Starting scan with device:', selectedDevice);
          setScanning(true);
        }, 200);
      } catch (error) {
        console.error('Camera permission denied:', error);
        setPermissionError("دسترسی به دوربین رد شد. لطفاً از تنظیمات مرورگر دسترسی دوربین را فعال کنید.");
        setCameraPermission('denied');
      }
    } else {
      // Already have permission, just start scanning
      if (!selectedDeviceId && videoDevices.length > 0) {
        // If no device selected, select one
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        setSelectedDeviceId(backCamera?.deviceId || videoDevices[videoDevices.length - 1].deviceId);
        setTimeout(() => setScanning(true), 100);
      } else {
        setScanning(true);
      }
    }
  };

  const handleStopScan = () => {
    setScanning(false);
    // Cleanup will happen in useEffect cleanup
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new BrowserQRCodeReader();
      const result = await reader.decodeFromImageUrl(URL.createObjectURL(file));
      
      try {
        const data = JSON.parse(result.getText());
        if (data.type === "customer") {
          setScannedData(data);
          setPermissionError("");
        } else {
          setPermissionError("QR code معتبر نیست");
        }
      } catch {
        setPermissionError("QR code معتبر نیست");
      }
    } catch (error) {
      console.error("Error reading QR from image:", error);
      setPermissionError("خطا در خواندن QR code از تصویر");
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

        {/* Permission Error with Instructions */}
        {permissionError && (
          <div className="space-y-3">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800 mb-1">خطا در دسترسی</h4>
                  <p className="text-sm text-red-700">{permissionError}</p>
                  {cameraPermission === 'denied' && (
                    <button
                      onClick={checkCameraPermissions}
                      className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium underline"
                    >
                      تلاش مجدد
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Camera Permission Guide */}
            {cameraPermission === 'denied' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  راهنمای فعال‌سازی دوربین
                </h4>
                
                {/* Chrome/Android Guide */}
                <div className="mb-4 text-sm">
                  <p className="font-semibold text-blue-800 mb-2">📱 برای Chrome (Android):</p>
                  <ol className="text-blue-700 space-y-1 mr-4 list-decimal">
                    <li>روی آیکون قفل 🔒 یا اطلاعات ⓘ کنار آدرس سایت کلیک کنید</li>
                    <li>گزینه "دوربین" یا "Camera" را پیدا کنید</li>
                    <li>آن را روی "مجاز" یا "Allow" قرار دهید</li>
                    <li>صفحه را رفرش کنید (F5 یا کشیدن به پایین)</li>
                  </ol>
                </div>

                {/* Safari/iOS Guide */}
                <div className="text-sm">
                  <p className="font-semibold text-blue-800 mb-2">🍎 برای Safari (iPhone):</p>
                  <ol className="text-blue-700 space-y-1 mr-4 list-decimal">
                    <li>روی "aA" کنار آدرس سایت در بالا ضربه بزنید</li>
                    <li>گزینه "Website Settings" را انتخاب کنید</li>
                    <li>روی "Camera" ضربه بزنید</li>
                    <li>گزینه "Allow" را انتخاب کنید</li>
                    <li>صفحه را رفرش کنید</li>
                  </ol>
                  <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                    <p className="text-xs text-blue-900">
                      <strong>نکته:</strong> اگر گزینه دوربین نمایش داده نشد، ابتدا روی دکمه "شروع اسکن" کلیک کنید تا درخواست دسترسی نمایش داده شود.
                    </p>
                  </div>
                </div>

                {/* Alternative Option */}
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <button
                    onClick={() => setUseFallbackMode(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    استفاده از حالت آپلود تصویر به جای دوربین مستقیم
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Camera Permission Status */}
        {cameraPermission === 'checking' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-sm text-blue-800">در حال بررسی دسترسی دوربین...</p>
            </div>
          </div>
        )}

        {/* File Upload Option (Fallback) */}
        {useFallbackMode && !scannedData && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-4">
            <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">آپلود تصویر QR Code</h3>
              <p className="text-slate-600 text-sm">
                از گالری خود عکس QR code مشتری را انتخاب کنید
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
            
            {/* Switch back to camera mode */}
            {cameraPermission !== 'denied' && (
              <button
                onClick={() => setUseFallbackMode(false)}
                className="w-full text-slate-600 hover:text-slate-700 text-sm font-medium py-2 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                بازگشت به حالت دوربین مستقیم
              </button>
            )}
          </div>
        )}

        {/* Scanner Section */}
        {!scanning && !scannedData && !useFallbackMode && cameraPermission !== 'checking' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
              cameraPermission === 'granted' ? 'bg-emerald-100' : 
              cameraPermission === 'denied' ? 'bg-red-100' : 'bg-yellow-100'
            }`}>
              <svg className={`w-12 h-12 ${
                cameraPermission === 'granted' ? 'text-emerald-600' : 
                cameraPermission === 'denied' ? 'text-red-600' : 'text-yellow-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {cameraPermission === 'granted' ? 'آماده اسکن' : 
                 cameraPermission === 'denied' ? 'دسترسی دوربین لازم است' :
                 'درخواست دسترسی دوربین'}
              </h3>
              <p className="text-slate-600 text-sm">
                {cameraPermission === 'granted' ? 'دکمه زیر را بزنید و QR code مشتری را اسکن کنید' :
                 cameraPermission === 'denied' ? 'لطفاً از تنظیمات مرورگر دسترسی دوربین را فعال کنید' :
                 'برای اسکن QR code به دوربین نیاز است'}
              </p>
            </div>
            <button
              onClick={handleStartScan}
              disabled={cameraPermission === 'denied'}
              className={`w-full font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                cameraPermission === 'denied' 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {cameraPermission === 'granted' ? 'شروع اسکن' : 
               cameraPermission === 'prompt' ? 'درخواست دسترسی و شروع' :
               'دسترسی دوربین غیرفعال'}
            </button>

            {/* Switch to Upload Mode */}
            {cameraPermission !== 'denied' && (
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setUseFallbackMode(true)}
                  className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  ترجیح میدهم از گالری انتخاب کنم
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scanner Active */}
        {scanning && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold text-slate-800 mb-2">در حال اسکن...</h3>
              <p className="text-sm text-slate-600">QR code را در مقابل دوربین قرار دهید</p>
            </div>
            
            {/* Video Preview */}
            <div className="relative rounded-xl overflow-hidden bg-black mb-4">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[400px]"
                playsInline
                autoPlay
                muted
                style={{ objectFit: 'cover' }}
              />
              {/* Scan Frame Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-4 border-emerald-500 rounded-2xl shadow-lg">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                </div>
              </div>
            </div>

            {/* Camera Switch */}
            {videoDevices.length > 1 && (
              <div className="mb-3">
                <select
                  value={selectedDeviceId}
                  onChange={(e) => {
                    setSelectedDeviceId(e.target.value);
                    handleStopScan();
                    setTimeout(() => setScanning(true), 100);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                >
                  {videoDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `دوربین ${videoDevices.indexOf(device) + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleStopScan}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-6 rounded-xl border border-red-200 transition-colors"
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


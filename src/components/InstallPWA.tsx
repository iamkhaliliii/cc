"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPWA() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as { standalone?: boolean }).standalone === true;
    
    if (isInstalled) {
      return;
    }

    // Check if prompt was dismissed before
    const promptDismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = promptDismissed ? parseInt(promptDismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    
    // Show again after 7 days
    if (daysSinceDismissed < 7) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(userAgent);
    
    setIsIOS(iOS);

    // For Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show custom prompt after 3 seconds
    if (iOS) {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) {
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleDismiss}
      />
      
      {/* Popup - Compact & Clean Design */}
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-sm">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
          
          {/* Compact Header */}
          <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-4">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all z-10"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon & Title - Horizontal Layout */}
            <div className="flex items-center gap-3 pr-8">
              <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon-192x192.png" alt="App Icon" className="w-10 h-10 rounded-lg" />
              </div>
              <div className="flex-1 text-white">
                <h3 className="text-base font-bold leading-tight mb-0.5">نصب اپلیکیشن</h3>
                <p className="text-xs opacity-90">دسترسی سریع‌تر و آفلاین</p>
              </div>
            </div>
          </div>

          {/* Compact Content */}
          <div className="p-4">
            {isIOS ? (
              // iOS Instructions - Minimal
              <div className="space-y-2.5 mb-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-xs">۱</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      دکمه <strong className="text-blue-600 dark:text-blue-400">Share</strong> پایین صفحه را بزنید
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                  </svg>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-xs">۲</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      گزینه <strong className="text-purple-600 dark:text-purple-400">&quot;Add to Home Screen&quot;</strong> را بزنید
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            ) : (
              // Android/Chrome - Minimal
              <div className="mb-4">
                <div className="flex items-center justify-around gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">سریع‌تر</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">آفلاین</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">راحت‌تر</span>
                  </div>
                </div>
              </div>
            )}

            {/* Compact Action Buttons */}
            <div className="flex gap-2">
              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95"
                >
                  نصب
                </button>
              )}
              
              <button
                onClick={handleDismiss}
                className={`${!isIOS && deferredPrompt ? 'flex-none px-4' : 'flex-1'} bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium py-2.5 rounded-xl transition-all text-sm active:scale-95`}
              >
                {isIOS ? 'متوجه شدم' : 'بعداً'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#2F01B0' }}>
      {/* Background Image - Full screen on mobile, contained on desktop */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src="/bg.png" 
          alt="background"
          className="min-w-full min-h-full md:w-auto md:h-auto md:max-w-4xl object-cover opacity-60"
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Frosted Glass Card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-[3rem] p-8 shadow-2xl border border-white/20">
          {/* Glassmorphic Card Icon */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-3xl"></div>
              <div className="relative w-48 h-32 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform -rotate-12 flex items-center justify-center">
                {/* Card details - subtle */}
                <div className="absolute top-6 left-6 w-10 h-8 bg-white/30 rounded"></div>
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="h-2 bg-white/20 rounded w-3/4"></div>
                  <div className="h-2 bg-white/20 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/lincard.svg" alt="Linkard" className="h-12" />
          </div>

          {/* Text */}
          <p className="text-white text-center mb-12 leading-relaxed opacity-90">
            به سامانه باشگاه مشتریان خوش آمدید
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowMenu(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all text-lg"
          >
            ورود
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:items-center md:justify-center md:min-h-screen md:p-12">
        <div className="relative max-w-2xl w-full bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl p-16">
          {/* Glassmorphic Card Icon */}
          <div className="flex justify-center mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/40 to-purple-500/40 blur-3xl"></div>
              <div className="relative w-64 h-40 bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/30 shadow-2xl transform -rotate-12 flex items-center justify-center">
                {/* Card details */}
                <div className="absolute top-8 left-8 w-14 h-10 bg-white/30 rounded-lg"></div>
                <div className="absolute bottom-8 left-8 right-8 space-y-3">
                  <div className="h-3 bg-white/20 rounded w-3/4"></div>
                  <div className="h-2 bg-white/20 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-10">
            <img src="/lincard.svg" alt="Linkard" className="h-16" />
          </div>

          {/* Text */}
          <p className="text-white text-center text-xl mb-12 leading-relaxed opacity-90">
            به سامانه باشگاه مشتریان خوش آمدید
          </p>

          {/* CTA */}
          <button
            onClick={() => setShowMenu(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-5 px-12 rounded-full text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            ورود
          </button>
        </div>
      </div>

      {/* Bottom Sheet Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">انتخاب پنل</h3>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Panel Links */}
              <Link href="/panel/b/mikhak" onClick={() => setShowMenu(false)}>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl hover:from-blue-100 hover:to-purple-100 transition-all active:scale-98">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">میخک نقره‌ای</p>
                    <p className="text-sm text-slate-600">کسب‌وکار</p>
                  </div>
                </div>
              </Link>

              <Link href="/panel/a/login" onClick={() => setShowMenu(false)}>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl hover:from-red-100 hover:to-orange-100 transition-all active:scale-98">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">مدیر کل</p>
                    <p className="text-sm text-slate-600">مدیریت سیستم</p>
                  </div>
                </div>
              </Link>

              <Link href="/panel/r/login" onClick={() => setShowMenu(false)}>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl hover:from-violet-100 hover:to-purple-100 transition-all active:scale-98">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">نمایندگی</p>
                    <p className="text-sm text-slate-600">پنل نمایندگان</p>
                  </div>
                </div>
              </Link>

              <Link href="/panel/b/mikhak/c/login" onClick={() => setShowMenu(false)}>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl hover:from-emerald-100 hover:to-teal-100 transition-all active:scale-98">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">مشتری میخک</p>
                    <p className="text-sm text-slate-600">ورود مشتریان</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

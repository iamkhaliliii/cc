"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import FuturisticPattern from "./FuturisticPattern";

// Load OCR-A font
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'OCR-A';
      src: url('/fonts/OCR-A.woff2') format('woff2'),
           url('/fonts/OCR-A.woff') format('woff'),
           url('/fonts/OCR-A.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

interface CreditCardProps {
  userName: string;
  businessName: string;
  points: number;
  userId: number;
  phone: string;
  businessId: number;
  businessSlug: string;
  expiryDate?: string;
  backgroundImage?: string;
}

export default function CreditCard({
  userName,
  businessName,
  points,
  userId,
  phone,
  businessId,
  businessSlug,
  expiryDate = "12/27",
  backgroundImage = "/Background.png"
}: CreditCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate exactly 16-digit card number
  const phoneDigits = phone.substring(1);
  const userIdPadded = userId.toString().padStart(6, '0');
  const cardNumber = phoneDigits + userIdPadded;
  const formattedCardNumber = cardNumber.match(/.{1,4}/g)?.join(' ') || '';

  // Generate QR code for back of card
  useEffect(() => {
    if (qrCanvasRef.current && isFlipped) {
      // Clear first
      const ctx = qrCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, qrCanvasRef.current.width, qrCanvasRef.current.height);
      }

      const qrData = JSON.stringify({
        userId,
        phone,
        name: userName,
        businessId,
        businessSlug,
        type: "customer"
      });

      QRCode.toCanvas(
        qrCanvasRef.current,
        qrData,
        {
          width: 80,
          margin: 0,
          color: {
            dark: "#000000",
            light: "#ffffff"
          }
        }
      );
    } else if (qrCanvasRef.current && !isFlipped) {
      // Clear when flipped back to front
      const ctx = qrCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, qrCanvasRef.current.width, qrCanvasRef.current.height);
      }
    }
  }, [isFlipped, userId, phone, userName, businessId, businessSlug]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Card with 3D flip */}
      <div 
        className="relative w-full aspect-[1.586/1] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ 
          perspective: '1000px',
          WebkitPerspective: '1000px'
        }}
      >
      <div 
        className="relative w-full h-full transition-transform duration-700"
        style={{ 
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          WebkitTransform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.7s',
          WebkitTransition: '-webkit-transform 0.7s'
        }}
      >
        {/* Front of Card */}
        <div 
          className="absolute w-full h-full" 
          style={{ 
            WebkitBackfaceVisibility: 'hidden', 
            backfaceVisibility: 'hidden',
            MozBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg) translateZ(1px)',
            WebkitTransform: 'rotateY(0deg) translateZ(1px)',
            visibility: isFlipped ? 'hidden' : 'visible',
            opacity: isFlipped ? 0 : 1,
            transition: 'opacity 0s 0.35s, visibility 0s 0.35s',
            zIndex: 2
          }}
        >
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
            {/* Futuristic Pattern Background */}
            <FuturisticPattern />

            {/* Card Content */}
            <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white">
              {/* Top Section */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-90">باشگاه</p>
                  <p className="text-lg font-bold mt-1">{businessName}</p>
                </div>
                {/* Chip SVG */}
                <img 
                  src="/Smart-Chip-CPU-by-Merlin2525.svg" 
                  alt="chip"
                  className="w-10 h-12 opacity-99  rotate-90"
                />
              </div>

              {/* Card Number with Emboss Effect */}
              <div className="my-1 flex items-center justify-between w-full gap-1 sm:gap-2 md:gap-3">
                {cardNumber.match(/.{1,4}/g)?.map((group, index) => (
                  <span 
                    key={index}
                    className="text-3xl sm:text-2xl md:text-4xl emboss-text select-none flex-1 text-center"
                    style={{ fontFamily: "'OCR-A', monospace" }}
                    dir="ltr"
                  >
                    {group}
                  </span>
                ))}
              </div>

              {/* Bottom Section - Name and Expiry */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wide text-white/70 font-medium">نام دارنده</p>
                  <p className="text-sm font-bold uppercase tracking-wide mt-0.5 text-white">{userName}</p>
                </div>
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wide text-white/70 font-medium">تاریخ انقضا</p>
                  <p className="text-sm tracking-wide mt-0.5 text-white" style={{ fontFamily: "'OCR-A', monospace" }} dir="ltr">{expiryDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute w-full h-full" 
          style={{ 
            WebkitBackfaceVisibility: 'hidden', 
            backfaceVisibility: 'hidden',
            MozBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
            WebkitTransform: 'rotateY(180deg) translateZ(1px)',
            visibility: isFlipped ? 'visible' : 'hidden',
            opacity: isFlipped ? 1 : 0,
            transition: 'opacity 0s 0.35s, visibility 0s 0.35s',
            zIndex: 1
          }}
        >
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
            {/* Silver Metallic Background with Linear Gradients */}
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: `
                  linear-gradient(135deg, hsla(0,0%,100%,.5) 0%, transparent 8%),
                  linear-gradient(225deg, hsla(0,0%,100%,.6) 0%, transparent 12%),
                  linear-gradient(45deg, hsla(0,0%,100%,.5) 0%, transparent 7%),
                  linear-gradient(315deg, hsla(0,0%,100%,.5) 0%, transparent 5%),
                  repeating-linear-gradient(45deg, hsla(0,0%,0%,0) 0%, hsla(0,0%,0%,0) 3%, hsla(0,0%,0%,.1) 3.5%, hsla(0,0%,0%,0) 4%),
                  repeating-linear-gradient(45deg, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0) 6%, hsla(0,0%,100%,.1) 7.5%, hsla(0,0%,100%,0) 9%),
                  repeating-linear-gradient(45deg, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0) 1.2%, hsla(0,0%,100%,.2) 2.2%, hsla(0,0%,100%,0) 3.2%),
                  linear-gradient(45deg, hsla(0,0%,90%,1) 0%, hsla(0,0%,85%,1) 50%, hsla(0,0%,60%,1) 100%)
                `
              }}
            ></div>

            {/* Card Content */}
            <div className="relative z-10 h-full">
              {/* Black Magnetic Strip */}
              <div className="absolute top-0 left-0 w-full h-12 bg-black"></div>

              {/* Main Content Area */}
              <div className="absolute top-16 left-0 right-0 bottom-0 px-6 flex justify-between">
                {/* Left Side - Text & CVV */}
                <div className="flex flex-col justify-between py-4 max-w-[60%]">
                  {/* Text */}
                  <div className="text-slate-800 leading-relaxed">
                    <p className="mb-1.5 font-medium text-[10px] md:text-xs lg:text-sm">
                      این کارت متعلق به {businessName} می‌باشد.
                    </p>
                    <p className="opacity-75 text-[9px] md:text-[10px] lg:text-xs">
                      استفاده از این کارت منوط به قوانین باشگاه مشتریان است.
                    </p>
                  </div>

                  {/* CVV - Scales with screen */}
                  <div className="text-right">
                    <p className="text-[8px] md:text-[9px] lg:text-[10px] text-slate-600 mb-1">CVV</p>
                    <div className="bg-white rounded px-2.5 md:px-3 lg:px-4 py-1 md:py-1.5 inline-block border border-slate-300 shadow-sm">
                      <p className="text-black font-mono font-bold text-xs md:text-sm lg:text-base tracking-wide">***</p>
                    </div>
                  </div>
                </div>

                {/* Right Side - QR */}
                <div className="flex flex-col items-end py-4">
                  {/* QR Code - Scales proportionally */}
                  <div className="bg-white p-1.5 md:p-2 lg:p-2.5 rounded-lg shadow-lg">
                    <canvas ref={qrCanvasRef} className="w-20 md:w-24 lg:w-28"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Card Info Bar Below */}
      <div className="mt-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors">
        {/* Right - Points Display */}
        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">موجودی امتیاز</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{points.toLocaleString('fa-IR')}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">امتیاز</p>
          </div>
        </div>

        {/* Left - Flip Action */}
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors">
            <img 
              src="/flip.svg" 
              alt="flip"
              className="w-5 h-5 opacity-50 group-hover:opacity-70 dark:opacity-60 dark:group-hover:opacity-80 transition-opacity dark:invert"
            />
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
            چرخش کارت
          </span>
        </button>
      </div>
    </div>
  );
}


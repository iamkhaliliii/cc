"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

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
    }
  }, [isFlipped, userId, phone, userName, businessId, businessSlug]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Card with 3D flip */}
      <div 
        className="relative w-full aspect-[1.586/1] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        {/* Front of Card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>

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
                  className="w-8 h-10 opacity-90  rotate-90"
                />
              </div>


              {/* Card Number with Emboss Effect */}
              <div className="my-1 flex items-center justify-between w-full gap-1 sm:gap-2 md:gap-3">
                {cardNumber.match(/.{1,4}/g)?.map((group, index) => (
                  <span 
                    key={index}
                    className="text-3xl sm:text-2xl md:text-4xl font-mono emboss-text select-none flex-1 text-center"
                    dir="ltr"
                  >
                    {group}
                  </span>
                ))}
              </div>

              {/* Bottom Info */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wide opacity-80">نام دارنده</p>
                  <p className="text-sm font-bold uppercase tracking-wide mt-0.5">{userName}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wide opacity-80 text-left">تاریخ انقضا</p>
                  <p className="text-sm font-mono tracking-wide mt-0.5" dir="ltr">{expiryDate}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
            {/* Background Image - Same as front */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              {/* Dark overlay for back */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Card Content */}
            <div className="relative z-10 h-full">
              {/* Black Magnetic Strip */}
              <div className="absolute top-0 left-0 w-full h-12 bg-black"></div>

              {/* Main Content Area */}
              <div className="absolute top-16 left-0 right-0 bottom-0 px-6 flex justify-between">
                {/* Left Side - Text & CVV */}
                <div className="flex flex-col justify-between py-4 max-w-[60%]">
                  {/* Text */}
                  <div className="text-white leading-relaxed">
                    <p className="mb-1.5 opacity-90 font-medium text-[10px] md:text-xs lg:text-sm">
                      این کارت متعلق به {businessName} می‌باشد.
                    </p>
                    <p className="opacity-75 text-[9px] md:text-[10px] lg:text-xs">
                      استفاده از این کارت منوط به قوانین باشگاه مشتریان است.
                    </p>
                  </div>

                  {/* CVV - Scales with screen */}
                  <div className="text-right">
                    <p className="text-[8px] md:text-[9px] lg:text-[10px] text-white/60 mb-1">CVV</p>
                    <div className="bg-white/90 rounded px-2.5 md:px-3 lg:px-4 py-1 md:py-1.5 inline-block">
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
      <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        {/* Right - Points Display */}
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-0.5">موجودی امتیاز</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-bold text-blue-600">{points.toLocaleString('fa-IR')}</p>
            <p className="text-xs text-slate-600">امتیاز</p>
          </div>
        </div>

        {/* Left - Flip Action */}
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors group"
        >
          <div className="w-8 h-8 bg-slate-50 group-hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors">
            <img 
              src="/flip.svg" 
              alt="flip"
              className="w-5 h-5 opacity-40 group-hover:opacity-60"
              style={{ filter: 'grayscale(100%)' }}
            />
          </div>
          <span className="text-[10px] font-medium">
            چرخش کارت
          </span>
        </button>
      </div>
    </div>
  );
}


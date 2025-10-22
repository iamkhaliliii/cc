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
    <div 
      className="relative w-full max-w-md mx-auto aspect-[1.586/1] cursor-pointer perspective-1000"
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
            <div className="relative z-10 h-full p-6">
              {/* Black Magnetic Strip */}
              <div className="absolute top-0 left-0 w-full h-12 bg-black"></div>

              {/* Middle Section */}
              <div className="absolute top-16 left-0 right-0 px-6 flex items-start justify-between">
                {/* CVV */}
                <div className="w-28">
                  <p className="text-[9px] uppercase text-white/70 mb-1">CVV</p>
                  <div className="bg-white/90 rounded-md h-9 px-3 flex items-center justify-end">
                    <p className="text-black font-mono font-bold text-lg tracking-widest">***</p>
                  </div>
                </div>

                {/* QR Code */}
                <div>
                  <p className="text-[9px] uppercase text-white/70 mb-1 text-left">کد QR</p>
                  <div className="bg-white p-1.5 rounded-lg shadow-lg">
                    <canvas ref={qrCanvasRef} className="w-20 h-20"></canvas>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-[10px] leading-relaxed">
                <p className="mb-1.5 opacity-90 font-medium">
                  این کارت متعلق به {businessName} می‌باشد.
                </p>
                <p className="opacity-75 text-[9px]">
                  استفاده از این کارت منوط به قوانین و مقررات باشگاه مشتریان است.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


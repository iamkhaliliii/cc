"use client";

import { useState } from "react";

interface CreditCardProps {
  userName: string;
  businessName: string;
  points: number;
  userId: number;
  phone: string;
  expiryDate?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
}

export default function CreditCard({
  userName,
  businessName,
  points,
  userId,
  phone,
  expiryDate = "12/27",
  gradientFrom = "from-slate-800",
  gradientVia = "via-slate-700",
  gradientTo = "to-slate-900"
}: CreditCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Generate exactly 16-digit card number
  // phone without 0: 10 digits + userId padded to 6 digits = 16 digits
  const phoneDigits = phone.substring(1); // Remove leading 0
  const userIdPadded = userId.toString().padStart(6, '0');
  const cardNumber = phoneDigits + userIdPadded; // Exactly 16 digits
  const formattedCardNumber = cardNumber.match(/.{1,4}/g)?.join(' ') || '';

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
              style={{ backgroundImage: 'url(/Background.png)' }}
            >
              {/* Overlay gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} opacity-70`}></div>
            </div>

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
                  className="w-12 h-14 opacity-95 drop-shadow-lg"
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
          <div className="relative w-full h-full bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Black Strip */}
            <div className="absolute top-8 left-0 w-full h-14 bg-black"></div>

            {/* CVV */}
            <div className="absolute top-28 left-0 right-0 px-6">
              <div className="bg-white rounded-lg h-10 p-3 flex items-center justify-end">
                <p className="text-xs uppercase text-slate-400 absolute left-3 top-1">CVV</p>
                <p className="text-black font-mono font-bold tracking-widest">***</p>
              </div>
            </div>

            {/* Terms */}
            <div className="absolute bottom-6 left-6 right-6 text-white text-[8px] leading-relaxed opacity-80">
              <p className="mb-2">
                این کارت متعلق به {businessName} می‌باشد. استفاده غیرمجاز از این کارت جرم است.
              </p>
              <p>
                استفاده از این کارت منوط به قوانین و مقررات باشگاه مشتریان است.
              </p>
            </div>

            {/* Signature Strip Pattern */}
            <div className="absolute top-44 left-6 right-6 h-8 bg-slate-100/90 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


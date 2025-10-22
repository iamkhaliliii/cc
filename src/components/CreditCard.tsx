"use client";

import { useState } from "react";

interface CreditCardProps {
  userName: string;
  businessName: string;
  points: number;
  userId: number;
  phone: string;
  expiryDate?: string;
}

export default function CreditCard({
  userName,
  businessName,
  points,
  userId,
  phone,
  expiryDate = "12/27"
}: CreditCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Generate 16-digit card number from phone (11 digits) + userId (padded to 5 digits)
  const cardNumber = phone.substring(1) + userId.toString().padStart(5, '0'); // 10 + 5 = 15, add one more
  const formattedCardNumber = cardNumber.padEnd(16, '0').match(/.{1,4}/g)?.join(' ') || '';

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
          <div className="relative w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            {/* Decorative Strips */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -right-10 top-0 bottom-0 w-[200px] bg-gradient-to-b from-red-600 to-red-700 transform skew-x-[20deg] shadow-lg"></div>
              <div className="absolute -right-16 top-0 bottom-0 w-[180px] bg-gradient-to-b from-red-500 to-red-600 transform skew-x-[-15deg]"></div>
            </div>

            {/* Card Content */}
            <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white">
              {/* Top Section */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-90">باشگاه</p>
                  <p className="text-lg font-bold mt-1">{businessName}</p>
                </div>
                <svg width="40" height="40" viewBox="0 0 17.5 16.2" className="opacity-90">
                  <path 
                    d="M3.2 0l5.4 5.6L14.3 0l3.2 3v9L13 16.2V7.8l-4.4 4.1L4.5 8v8.2L0 12V3l3.2-3z" 
                    fill="white"
                  />
                </svg>
              </div>

              {/* Chip */}
              <div className="w-14 h-11 bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 rounded-lg relative overflow-hidden shadow-md">
                <div className="absolute inset-0 grid grid-cols-3 gap-[1px] p-1.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-amber-600/30 rounded-[1px]"></div>
                  ))}
                </div>
                <div className="absolute inset-3 border border-amber-700/40 rounded-md"></div>
              </div>

              {/* Contactless Wave */}
              <svg 
                viewBox="0 3.71 26.959 38.787" 
                width="27" 
                height="39" 
                fill="white" 
                className="opacity-40 absolute left-24 top-28"
              >
                <path d="M19.709 3.719c.266.043.5.187.656.406 4.125 5.207 6.594 11.781 6.594 18.938 0 7.156-2.469 13.73-6.594 18.937-.195.336-.57.531-.957.492a.9946.9946 0 0 1-.851-.66c-.129-.367-.035-.777.246-1.051 3.855-4.867 6.156-11.023 6.156-17.718 0-6.696-2.301-12.852-6.156-17.719-.262-.317-.301-.762-.102-1.121.204-.36.602-.559 1.008-.504z"/>
                <path d="M13.74 7.563c.231.039.442.164.594.343 3.508 4.059 5.625 9.371 5.625 15.157 0 5.785-2.113 11.097-5.625 15.156-.363.422-1 .472-1.422.109-.422-.363-.472-1-.109-1.422 3.211-3.711 5.156-8.551 5.156-13.843 0-5.293-1.949-10.133-5.156-13.844-.27-.309-.324-.75-.141-1.114.188-.367.578-.582.985-.542h.093z"/>
              </svg>

              {/* Card Number with Emboss Effect */}
              <div className="my-3">
                <p className="text-2xl sm:text-3xl font-mono tracking-[0.3em] emboss-text select-none" dir="ltr">
                  {formattedCardNumber}
                </p>
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

              {/* Mastercard Logo */}
              <div className="absolute left-6 bottom-6 flex">
                <div className="w-8 h-8 rounded-full bg-red-600"></div>
                <div className="w-8 h-8 rounded-full bg-amber-500 -ml-4 opacity-80"></div>
              </div>

              {/* Points Badge */}
              <div className="absolute top-6 left-6 bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-2 rounded-full shadow-lg">
                <p className="text-xs font-bold">{points.toLocaleString('fa-IR')} امتیاز</p>
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


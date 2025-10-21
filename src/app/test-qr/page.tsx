"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function TestQR() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const testData = JSON.stringify({
        userId: 1,
        phone: "09124580298",
        name: "کاربر آزمایشی",
        type: "customer"
      });

      console.log('Test QR Data:', testData);

      QRCode.toCanvas(
        canvasRef.current,
        testData,
        {
          width: 300,
          margin: 2,
          color: {
            dark: "#1e40af",
            light: "#ffffff"
          },
          errorCorrectionLevel: 'H'
        },
        (error) => {
          if (error) {
            console.error("QR Code error:", error);
          } else {
            console.log("QR Code generated successfully!");
          }
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">تست QR Code</h1>
        
        <div className="bg-white p-6 rounded-2xl border-4 border-blue-100 mb-6 flex items-center justify-center">
          <canvas ref={canvasRef} />
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-sm">
          <p className="font-bold mb-2">داده‌های QR:</p>
          <pre className="text-xs bg-slate-100 p-3 rounded overflow-auto" dir="ltr">
{`{
  "userId": 1,
  "phone": "09124580298",
  "name": "کاربر آزمایشی",
  "type": "customer"
}`}
          </pre>
        </div>

        <p className="text-center text-sm text-slate-600 mt-4">
          این QR را با صفحه business اسکن کنید
        </p>
      </div>
    </div>
  );
}


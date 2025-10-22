# راهنمای PWA - Progressive Web App

## 🎯 ویژگی‌های پیاده‌سازی شده

### ✅ تنظیمات انجام شده

1. **نصب next-pwa**: پکیج next-pwa برای تبدیل Next.js به PWA
2. **فایل Manifest**: `/public/manifest.json` با تنظیمات فارسی و RTL
3. **آیکون‌ها**: آیکون‌های 192x192 و 512x512 برای نمایش در صفحه اصلی
4. **Service Worker**: کش استراتژی برای فونت‌ها، تصاویر، API و... 
5. **Metadata**: تنظیمات PWA در `layout.tsx`
6. **کامپوننت نصب**: پاپ‌آپ خودکار "Add to Home Screen" برای موبایل

---

## 📱 نحوه کار

### Android / Chrome
- پس از ورود به سایت، پس از 3 ثانیه پاپ‌آپ نصب نمایش داده می‌شود
- با کلیک روی "نصب اپلیکیشن"، PWA به صفحه اصلی گوشی اضافه می‌شود
- اپلیکیشن به صورت Full Screen بدون نوار مرورگر اجرا می‌شود

### iOS / Safari  
- پس از ورود به سایت، پاپ‌آپ راهنمای نصب نمایش داده می‌شود
- راهنمای گام‌به‌گام برای استفاده از Share Button → Add to Home Screen
- پس از نصب، اپلیکیشن مانند یک اپ Native کار می‌کند

### قابلیت‌های هوشمند پاپ‌آپ
- ✅ تشخیص خودکار iOS و Android
- ✅ نمایش پاپ‌آپ فقط برای کاربران موبایل
- ✅ عدم نمایش پاپ‌آپ اگر قبلاً نصب شده باشد
- ✅ عدم نمایش مجدد تا 7 روز پس از Dismiss کردن
- ✅ ذخیره وضعیت در localStorage

---

## 🗂️ فایل‌های ایجاد شده

### `/public/manifest.json`
```json
{
  "name": "باشگاه مشتریان",
  "short_name": "باشگاه مشتریان",
  "display": "standalone",
  "orientation": "portrait",
  "lang": "fa",
  "dir": "rtl",
  ...
}
```

### `/public/icon-192x192.png` و `/public/icon-512x512.png`
- آیکون‌های اپلیکیشن برای نمایش در صفحه اصلی
- ایجاد شده از `Background.png`

### `/src/components/InstallPWA.tsx`
- کامپوننت React برای نمایش پاپ‌آپ نصب
- تشخیص خودکار سیستم‌عامل و نمایش UI مناسب
- مدیریت BeforeInstallPrompt API برای Android

### `/next.config.ts`
- تنظیمات next-pwa
- Cache Strategy برای انواع فایل‌ها
- Runtime Caching برای بهینه‌سازی

---

## 🔧 Cache Strategy

### فونت‌ها (Google Fonts)
- **استراتژی**: CacheFirst
- **مدت**: 1 سال
- **دلیل**: فونت‌ها تغییر نمی‌کنند

### تصاویر (jpg, png, svg, ...)
- **استراتژی**: StaleWhileRevalidate  
- **مدت**: 24 ساعت
- **دلیل**: نمایش سریع + آپدیت در پس‌زمینه

### API Calls
- **استراتژی**: NetworkFirst
- **مدت**: 24 ساعت
- **Timeout**: 10 ثانیه
- **دلیل**: داده تازه اولویت دارد، در صورت آفلاین از کش استفاده شود

### فایل‌های JS/CSS
- **استراتژی**: StaleWhileRevalidate
- **مدت**: 24 ساعت
- **دلیل**: بارگذاری سریع + آپدیت در پس‌زمینه

---

## 🧪 تست PWA

### بررسی کامل PWA
1. در Chrome DevTools → Application → Manifest را بررسی کنید
2. Service Workers را در Application → Service Workers چک کنید
3. Lighthouse → PWA Audit را اجرا کنید

### تست موبایل
```bash
# اجرای سرور local با HTTPS (الزامی برای PWA)
npm run dev

# یا deploy روی سرور production با SSL
```

### تست نصب
1. سایت را در Chrome/Safari موبایل باز کنید
2. منتظر پاپ‌آپ نصب بمانید (3 ثانیه)
3. روی "نصب" یا "Add to Home Screen" کلیک کنید
4. آیکون را در صفحه اصلی پیدا کنید
5. اپلیکیشن را باز کنید (باید Full Screen باشد)

---

## 📊 بهبودهای Performance

### قبل از PWA
- بارگذاری کامل در هر بازدید
- نیاز به اینترنت برای همه فایل‌ها
- باز شدن در مرورگر با نوار آدرس

### بعد از PWA
- ✅ فایل‌ها از کش بارگذاری می‌شوند (سریع‌تر)
- ✅ کار آفلاین (برای صفحات بازدید شده)
- ✅ Full Screen بدون نوار مرورگر
- ✅ آیکون در صفحه اصلی
- ✅ احساس Native App

---

## 🚀 Deploy و Production

### فایل‌های auto-generated
این فایل‌ها توسط next-pwa به صورت خودکار در build ایجاد می‌شوند:
- `/public/sw.js` - Service Worker
- `/public/workbox-*.js` - Workbox Runtime
- و فایل‌های map آن‌ها

**نکته**: این فایل‌ها در `.gitignore` اضافه شده‌اند

### Build برای Production
```bash
npm run build
npm start
```

Service Worker فقط در production فعال است (`NODE_ENV=production`)

---

## ⚙️ تنظیمات اختیاری

### تغییر رنگ Theme
در `/public/manifest.json`:
```json
"theme_color": "#2563eb"  // آبی
"background_color": "#ffffff"  // سفید
```

### تغییر نام اپلیکیشن
در `/public/manifest.json`:
```json
"name": "نام کامل",
"short_name": "نام کوتاه"
```

### غیرفعال کردن پاپ‌آپ نصب
در `/src/app/panel/b/[slug]/c/home/page.tsx`:
```tsx
// خط زیر را comment کنید
<InstallPWA />
```

### تغییر زمان نمایش پاپ‌آپ
در `/src/components/InstallPWA.tsx`:
```tsx
// خط 48 - از 3000 به عدد دلخواه (میلی‌ثانیه)
setTimeout(() => {
  setShowInstallPrompt(true);
}, 3000);  // 3 ثانیه
```

### تغییر مدت Dismiss
در `/src/components/InstallPWA.tsx`:
```tsx
// خط 27 - از 7 به تعداد روز دلخواه
if (daysSinceDismissed < 7) {
  return;
}
```

---

## 🐛 Troubleshooting

### پاپ‌آپ نمایش داده نمی‌شود
- بررسی کنید که قبلاً dismiss نکرده باشید (localStorage را پاک کنید)
- بررسی کنید که اپلیکیشن نصب نشده باشد
- Console مرورگر را برای خطاها بررسی کنید

### Service Worker ثبت نمی‌شود
- مطمئن شوید در production mode هستید
- HTTPS فعال باشد (یا localhost)
- Cache مرورگر را پاک کنید

### آیکون نمایش داده نمی‌شود
- فایل‌های `icon-*.png` در `/public` وجود داشته باشند
- مسیر در `manifest.json` صحیح باشد
- مرورگر را refresh کنید

### پس از نصب، اپلیکیشن باز نمی‌شود
- `start_url` در manifest را بررسی کنید
- مطمئن شوید سرویس در دسترس است
- Cache و داده‌های سایت را پاک کنید و دوباره نصب کنید

---

## 📚 منابع

- [Next PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google Workbox](https://developers.google.com/web/tools/workbox)

---

## ✅ Checklist نصب موفق

- [x] next-pwa نصب شده
- [x] manifest.json ایجاد شده
- [x] آیکون‌ها ایجاد شده
- [x] next.config.ts پیکربندی شده
- [x] metadata در layout.tsx اضافه شده
- [x] InstallPWA کامپوننت ایجاد شده
- [x] InstallPWA به صفحه مشتری اضافه شده
- [x] .gitignore آپدیت شده
- [x] README آپدیت شده

**همه چیز آماده است! 🎉**


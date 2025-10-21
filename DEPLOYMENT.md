# راهنمای دیپلوی - باشگاه مشتریان

## نیازمندی‌های دیپلوی

### 1. Volume برای دیتابیس

این اپلیکیشن از SQLite برای ذخیره‌سازی داده استفاده می‌کند. برای اینکه داده‌ها بعد از restart شدن container از بین نروند، **حتماً** باید یک volume به مسیر `/data` متصل شود.

#### مثال Docker Run:
```bash
docker run -d \
  -p 3000:3000 \
  -v /path/on/host:/data \
  --name customer-club \
  your-image-name
```

#### مثال Docker Compose:
```yaml
version: '3.8'
services:
  app:
    image: your-image-name
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
    environment:
      - DATA_DIR=/data
```

#### مثال Kubernetes:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: customer-club-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: customer-club
spec:
  template:
    spec:
      containers:
      - name: app
        image: your-image-name
        ports:
        - containerPort: 3000
        env:
        - name: DATA_DIR
          value: "/data"
        volumeMounts:
        - name: data
          mountPath: /data
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: customer-club-data
```

### 2. متغیرهای محیطی

| متغیر | پیش‌فرض | توضیحات |
|-------|---------|----------|
| `DATA_DIR` | `/data` | مسیر دایرکتوری ذخیره دیتابیس |
| `PORT` | `3000` | پورت سرور |
| `NODE_ENV` | `production` | محیط اجرا |

### 3. ساخت کاربر تستی

بعد از اولین اجرا، برای ساخت کاربر تستی به این آدرس بروید:

```
http://your-domain:3000/api/seed
```

**اطلاعات کاربر تستی:**
- موبایل: `09124580298`
- رمز عبور: `0298`
- امتیاز: `1500`

### 4. نکات مهم

1. ✅ **حتماً volume را mount کنید** - در غیر این صورت تمام داده‌ها با هر restart از بین می‌روند
2. ✅ **Permission صحیح** - مطمئن شوید که دایرکتوری `/data` قابل نوشتن توسط user `nextjs` (UID 1001) است
3. ✅ **Backup منظم** - از فایل دیتابیس در `/data/customer-club.db` backup تهیه کنید
4. ⚠️ **SQLite Limitations** - SQLite برای تعداد کاربر کم مناسب است. برای scale بالا به PostgreSQL یا MySQL مهاجرت کنید

### 5. Health Check

برای بررسی سلامت سرویس:

```bash
curl http://localhost:3000/
```

اگر پاسخ 200 دریافت کردید، سرویس سالم است.

### 6. لاگ‌ها

برای مشاهده لاگ‌ها:

```bash
docker logs customer-club -f
```

باید خط زیر را ببینید که نشان‌دهنده اتصال موفق به دیتابیس است:
```
Database path: /data/customer-club.db
✅ Database initialized successfully
```

---

## پشتیبانی

برای مشکلات و سوالات، یک issue در GitHub باز کنید.


# Mahmoud English (تطبيق محمود إنجلش)

تطبيق تعليمي تفاعلي متكامل للغة الإنجليزية مع ركن إسلامي، وترجمة الكاميرا الحية، وقاموس مصور ناطق، ودروس واختبارات ولعبة تعليمية. التطبيق مبني بتقنيات الويب الحديثة (React + TypeScript + Vite) وجاهز للتحزيم كتطبيق أندرويد أصلي باستخدام **Capacitor**.

---

## 📱 خطوات بناء تطبيق الأندرويد (Android Build Steps)

### المتطلبات الأساسية (Prerequisites)
1. **Node.js** (إصدار 20 أو أحدث).
2. **JDK** (Java Development Kit 21 أو 17).
3. **Android Studio** مع Android SDK وأدوات البناء (Command-line Tools).

---

### 1. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 2. إعداد متغيرات البيئة (Environment Variables)
قم بإنشاء ملف `.env` (أو استخدم متغيّر البيئة في نظامك):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. بناء تطبيق الويب (Build Web Assets)
```bash
npm run build
```
سيتم توليد الملفات الثابتة المحسّنة في مجلد `dist`.

### 4. مزامنة أندرويد عبر Capacitor (Capacitor Sync)
إذا لم يكن مجلد `android` مضافاً مسبقاً، قم بإضافته:
```bash
npx cap add android
```
ثم قم بمزامنة الملفات والأصول:
```bash
npx cap sync android
```

### 5. فتح المشروع في Android Studio أو بناء APK مباشرة
- **لفتح المشروع في Android Studio:**
  ```bash
  npx cap open android
  ```
- **لبناء ملف APK (Debug) مباشرة عبر الطرفية:**
  ```bash
  cd android
  ./gradlew assembleDebug
  ```
ستجد ملف الـ APK الناتج في المسار:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 البناء التلقائي عبر GitHub Actions

يتوفر ملف سير عمل جاهز داخل `.github/workflows/android.yml`:
1. عند كل `push` لفرع `main` أو تشغيل يدوي من تبويب **Actions** (`workflow_dispatch`).
2. يقوم سير العمل بتجهيز Node 20 و Java 21.
3. يبني الويب باستخدام مفتاح `GEMINI_API_KEY` السري (الموجود في GitHub Secrets).
4. يقوم بمزامنة Capacitor وبناء ملف `app-debug.apk`.
5. يرفع ملف الـ APK كـ **Artifact** جاهز للتحميل والتثبيت المباشر على الهاتف.

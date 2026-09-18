# تطبيق Mahmoud English — تطبيق أندرويد أصلي (Kotlin & Jetpack Compose)

تم تحويل وتطوير تطبيق **Mahmoud English** كتطبيق أندرويد أصلي متكامل مبني بلغة **Kotlin** وأحدث مكتبات **Jetpack Compose (Material 3)**.

---

## 📱 البنية الهندسية للتطبيق (Architecture)

1. **لغة البرمجة**: Kotlin مع Jetpack Compose و Material 3.
2. **إدارة الحالة**: Android ViewModel + Kotlin Coroutines & StateFlow.
3. **محرك النطق الصوتي (TTS)**: `TextToSpeechHelper` يدعم الإنجليزية (US) والعربية (ar) مع نطق ثنائي متسلسل للكلمة وترجمتها.
4. **دعم الاتجاه العربي الأصيل (RTL)**: عبر `CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl)`.
5. **السمات والمظهر البصري**:
   - `SAGE_CREAM`: مظهر المريمية والورق الهادئ المريح للعين.
   - `WARM_PARCHMENT`: وضع قراءة الورق الدافئ.
   - `NIGHT_FOREST`: وضع الغابة الليلية الداكن الهادئ.
6. **العتاد والصلاحيات**:
   - الكاميرا: `android.permission.CAMERA` و `CameraX` API.
   - الميكروفون: `android.permission.RECORD_AUDIO`.
   - الإنترنت: `android.permission.INTERNET`.

---

## 📂 شجرة ملفات الأندرويد

```
android/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
├── gradle/
│   └── libs.versions.toml
└── app/
    ├── build.gradle.kts
    └── src/
        └── main/
            ├── AndroidManifest.xml
            ├── res/
            │   └── values/
            │       ├── colors.xml
            │       ├── strings.xml
            │       └── themes.xml
            └── java/com/mahmoudenglish/app/
                ├── MainActivity.kt
                ├── model/
                │   └── Models.kt
                ├── data/
                │   └── DefaultData.kt
                ├── utils/
                │   └── TextToSpeechHelper.kt
                ├── viewmodel/
                │   └── MahmoudEnglishViewModel.kt
                ├── ui/
                │   ├── theme/
                │   │   ├── Color.kt
                │   │   ├── Theme.kt
                │   │   └── Type.kt
                │   ├── components/
                │   │   ├── AppHeader.kt
                │   │   ├── BottomNavBar.kt
                │   │   └── MemoryBackupDialog.kt
                │   └── screens/
                │       ├── CameraTranslatorScreen.kt
                │       ├── SpeakingVocabScreen.kt
                │       ├── ChatTutorScreen.kt
                │       ├── LessonsAndQuizzesScreen.kt
                │       ├── EducationalGameScreen.kt
                │       └── ArabicTipsScreen.kt
```

---

## 🚀 كيفية التشغيل في Android Studio:

1. افتح **Android Studio**.
2. اختر **Open** ثم حدد مجلد `android/`.
3. انتظر انتهاء مزامنة Gradle (`Gradle Sync`).
4. اضغط على **Run 'app'** لتشغيل التطبيق على هاتفك المحمول أو في المحاكي (Emulator).
5. لبناء ملف الحزمة القابل للتثبيت (APK):
   ```bash
   ./gradlew assembleDebug
   ```
   الملف سينتج في: `app/build/outputs/apk/debug/app-debug.apk`

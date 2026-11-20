# ServDeal Android
Native Android client built with Kotlin and Jetpack Compose. This is not a WebView wrapper.

## Backend
The app connects directly to the existing ServDeal Express API at:
`https://servdeal-backend.onrender.com/api/v1/`
The website and Android app use the same MongoDB-backed API, accounts, services and booking records.

## Build
Open this `android/` folder in Android Studio (JDK 17, Android SDK 35), or run:
`gradle assembleDebug`

APK output:
`app/build/outputs/apk/debug/app-debug.apk`

GitHub Actions builds the debug APK on pushes affecting `android/**` and on manual dispatch. The APK is published as a workflow artifact.

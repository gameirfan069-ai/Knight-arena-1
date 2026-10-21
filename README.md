# KnightArena Chess — corrected Android APK project

## Build APK with GitHub Actions
1. Upload the **contents of this folder** to the root of your GitHub repository. Do not upload this ZIP as a ZIP file.
2. Ensure `.github/workflows/android-apk.yml` is included.
3. Open the repository's **Actions** tab.
4. Select **Build KnightArena Android APK**, then **Run workflow**.
5. When the run succeeds, download the `KnightArena-debug-apk` artifact and extract `app-debug.apk`.

## What's fixed
- Root `package.json` now describes the React/Vite chess client instead of the backend server.
- The APK workflow installs and builds from the repository root, matching `index.html`, `src/`, and `capacitor.config.json`.
- `src/main.jsx` was empty in the uploaded ZIP; it now contains a simple local chess UI using `chess.js`.

## Limitations
This is a debug APK for testing. The current app supports local play only. Online multiplayer, matchmaking, persistent ratings, and server-side game clocks are not implemented. GitHub Actions must run successfully before an APK exists.

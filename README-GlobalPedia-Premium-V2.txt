GLOBALPEDIA PREMIUM V2

The previous patch was too strict about JSX formatting. This V2 intentionally updates only app/globals.css, so it is robust against formatting changes.

Run from:
C:\Users\FALCON SOLUTION\Downloads\faaaah

Command:
powershell -ExecutionPolicy Bypass -File .\upgrade-globalpedia-v2.ps1

Then:
npm run build

git add .
git commit -m "feat: premium visual upgrade v2"
git push origin main

The upgrade adds:
- cinematic image zoom and grading
- stronger hero lighting
- premium hover physics
- article image zoom and overlays
- animated world map
- region image polish
- viewport reveal animations
- subtle oversized GlobalPedia background mark
- reduced-motion support
- automatic CSS backup

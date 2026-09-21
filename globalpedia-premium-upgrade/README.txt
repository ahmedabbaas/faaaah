GLOBALPEDIA PREMIUM UPGRADE

This patch upgrades the current GlobalPedia frontend.

1. Put upgrade-globalpedia.ps1 in the root of the project.
2. Open CMD in the project folder.
3. Run:
   powershell -ExecutionPolicy Bypass -File .\upgrade-globalpedia.ps1
4. Verify:
   npm run build
5. Push:
   git add .
   git commit -m "feat: premium visual upgrade"
   git push origin main

Changes:
- cinematic scroll progress bar
- mouse ambient glow on desktop
- hero vignette
- live world index glass card
- hero metric pills
- scroll reveal animations
- enhanced category cards
- stronger article image overlays and hover depth
- cinematic region-card motion
- animated world-map sweep
- reduced-motion support

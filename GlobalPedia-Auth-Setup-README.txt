GLOBALPEDIA AUTH SETUP

This enables real Clerk-based authentication.

Adds:
- /sign-in
- /sign-up
- ClerkProvider
- Clerk middleware
- working Sign In link
- premium dark auth styling
- backup copies of existing files

Run from:
C:\Users\FALCON SOLUTION\Downloads\faaaah

powershell -ExecutionPolicy Bypass -File .\enable-globalpedia-auth.ps1

Then connect Clerk through the Vercel Marketplace so the required environment variables are available:
- CLERK_SECRET_KEY
- CLERK_PUBLISHABLE_KEY

Then:
npm run build
git add .
git commit -m "feat: enable GlobalPedia authentication"
git push origin main


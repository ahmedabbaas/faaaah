$ErrorActionPreference = "Stop"

Write-Host "GlobalPedia Auth setup starting..." -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
    throw "Run this script from the GlobalPedia project root."
}

Write-Host "Installing Clerk..." -ForegroundColor Cyan
npm install @clerk/nextjs

if (Test-Path "app\layout.tsx") { Copy-Item "app\layout.tsx" "app\layout.before-auth.tsx" -Force }
if (Test-Path "app\components\GlobalPediaHome.tsx") { Copy-Item "app\components\GlobalPediaHome.tsx" "app\components\GlobalPediaHome.before-auth.tsx" -Force }

$layout = @'
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobalPedia | Knowledge Without Boundaries",
  description:
    "Explore science, history, technology, geography, culture, and space through GlobalPedia.",
  applicationName: "GlobalPedia",
  keywords: [
    "GlobalPedia",
    "encyclopedia",
    "knowledge",
    "science",
    "history",
    "technology",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
'@
Set-Content "app\layout.tsx" $layout -Encoding utf8

$middleware = @'
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
'@
Set-Content "middleware.ts" $middleware -Encoding utf8

New-Item -ItemType Directory -Force "app\sign-in\[[...sign-in]]" | Out-Null
$signIn = @'
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="authPage">
      <div className="authBackdrop" />
      <div className="authShell">
        <a className="authBrand" href="/">Global<span>Pedia</span></a>
        <SignIn />
      </div>
    </main>
  );
}
'@
Set-Content "app\sign-in\[[...sign-in]]\page.tsx" $signIn -Encoding utf8

New-Item -ItemType Directory -Force "app\sign-up\[[...sign-up]]" | Out-Null
$signUp = @'
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="authPage">
      <div className="authBackdrop" />
      <div className="authShell">
        <a className="authBrand" href="/">Global<span>Pedia</span></a>
        <SignUp />
      </div>
    </main>
  );
}
'@
Set-Content "app\sign-up\[[...sign-up]]\page.tsx" $signUp -Encoding utf8

$homePath = "app\components\GlobalPediaHome.tsx"
$home = Get-Content $homePath -Raw
if ($home.Contains('<button className="signButton">Sign In</button>')) {
    $home = $home.Replace('<button className="signButton">Sign In</button>', '<a className="signButton" href="/sign-in">Sign In</a>')
}
Set-Content $homePath $home -Encoding utf8

$cssPath = "app\globals.css"
$css = Get-Content $cssPath -Raw
if (-not $css.Contains("/* GLOBALPEDIA AUTH */")) {
$css += @'

/* GLOBALPEDIA AUTH */
.authPage{
  min-height:100vh;
  display:grid;
  place-items:center;
  position:relative;
  overflow:hidden;
  background:#040b12;
  color:#f5f8fb;
  padding:32px 20px;
}
.authBackdrop{
  position:absolute;
  inset:0;
  background:
    radial-gradient(circle at 30% 30%,rgba(25,147,235,.15),transparent 34%),
    radial-gradient(circle at 75% 70%,rgba(120,83,240,.11),transparent 30%),
    linear-gradient(135deg,#03101a,#071723 55%,#040b12);
}
.authBackdrop:after{
  content:"";
  position:absolute;
  inset:0;
  background-image:
    linear-gradient(rgba(87,170,224,.035) 1px,transparent 1px),
    linear-gradient(90deg,rgba(87,170,224,.035) 1px,transparent 1px);
  background-size:55px 55px;
  mask-image:linear-gradient(180deg,rgba(0,0,0,.85),transparent);
}
.authShell{
  position:relative;
  z-index:2;
  display:grid;
  justify-items:center;
  gap:18px;
}
.authBrand{
  color:#fff;
  font-size:31px;
  font-weight:900;
  letter-spacing:-.055em;
  text-decoration:none;
}
.authBrand span{color:#27a5ff}
.authShell .cl-rootBox{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
@media(max-width:600px){.authPage{padding:20px 12px}}
'@
Set-Content $cssPath $css -Encoding utf8
}

@"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
"@ | Set-Content ".env.example" -Encoding utf8

Write-Host "" 
Write-Host "GlobalPedia authentication files created successfully." -ForegroundColor Green
Write-Host "Connect Clerk in the Vercel Marketplace, then run: npm run build" -ForegroundColor Cyan

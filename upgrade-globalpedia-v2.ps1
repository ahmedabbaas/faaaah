$ErrorActionPreference = "Stop"

$cssPath = "app\globals.css"

if (-not (Test-Path $cssPath)) {
    throw "Missing $cssPath. Run this from the GlobalPedia project root."
}

$css = Get-Content $cssPath -Raw
$marker = "/* GLOBALPEDIA PREMIUM V2 */"

if ($css.Contains($marker)) {
    Write-Host "Premium V2 is already applied. Nothing to do." -ForegroundColor Yellow
    exit 0
}

$backup = "app\globals.before-premium-v2.css"
if (-not (Test-Path $backup)) {
    Copy-Item $cssPath $backup
    Write-Host "Backup created: $backup" -ForegroundColor DarkGray
}

$css += @'

/* GLOBALPEDIA PREMIUM V2 */
:root{
  --premium-glow:rgba(38,169,255,.16);
  --premium-border:rgba(105,181,232,.16);
}

body{
  background:
    radial-gradient(circle at 10% 8%,rgba(24,119,190,.08),transparent 28%),
    radial-gradient(circle at 90% 18%,rgba(110,76,220,.06),transparent 25%),
    var(--bg);
}

main{position:relative;isolation:isolate}
main:before{
  content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:
    radial-gradient(420px 260px at 12% 18%,rgba(32,167,255,.055),transparent 70%),
    radial-gradient(500px 320px at 88% 64%,rgba(117,90,255,.045),transparent 70%);
}

.heroMain{box-shadow:0 30px 100px rgba(0,0,0,.38)}
.heroImage{transform:scale(1.035);animation:premiumHeroZoom 18s ease-in-out infinite alternate}
.heroOverlay{
  background:
    linear-gradient(90deg,rgba(2,9,16,.99) 0%,rgba(2,10,17,.86) 25%,rgba(2,10,17,.28) 62%,rgba(2,10,17,.46) 100%),
    linear-gradient(0deg,rgba(2,8,14,.94) 0%,transparent 50%);
}
.heroMain:after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(circle at 72% 44%,transparent 0 19%,rgba(2,8,14,.08) 42%,rgba(2,8,14,.72) 100%),
    linear-gradient(180deg,rgba(255,255,255,.025),transparent 22%);
}
.heroContent{animation:premiumHeroIn 1s cubic-bezier(.18,.8,.22,1) both}
.heroContent h1{text-shadow:0 0 35px rgba(30,155,255,.11)}
.heroSearch{
  box-shadow:
    0 20px 70px rgba(0,0,0,.28),
    0 0 0 1px rgba(54,173,255,.08) inset,
    0 0 40px rgba(34,168,255,.045);
  transition:transform .35s ease,box-shadow .35s ease,border-color .35s ease;
}
.heroSearch:focus-within{
  transform:translateY(-2px);border-color:rgba(77,186,255,.95);
  box-shadow:
    0 22px 75px rgba(0,0,0,.3),
    0 0 0 1px rgba(62,178,255,.16) inset,
    0 0 55px rgba(34,168,255,.12);
}
.popular button{position:relative;overflow:hidden}
.popular button:before{
  content:"";position:absolute;top:0;bottom:0;left:-65%;width:42%;transform:skewX(-20deg);
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent);transition:left .55s ease;
}
.popular button:hover:before{left:125%}

.categoryCard{
  position:relative;overflow:hidden;transform:translateZ(0);
  transition:transform .35s cubic-bezier(.2,.75,.2,1),border-color .35s ease,box-shadow .35s ease,background .35s ease;
}
.categoryCard:after{
  content:"";position:absolute;inset:-60%;background:radial-gradient(circle at 35% 20%,rgba(61,179,255,.15),transparent 28%);
  opacity:0;transition:opacity .35s ease;pointer-events:none;
}
.categoryCard:hover,.categoryCard[aria-pressed="true"]{
  transform:translateY(-6px) scale(1.012);border-color:rgba(62,174,255,.48);
  box-shadow:0 18px 45px rgba(0,0,0,.24),0 0 30px rgba(39,145,220,.05);
}
.categoryCard:hover:after,.categoryCard[aria-pressed="true"]:after{opacity:1}
.categoryIcon{transition:transform .35s ease,box-shadow .35s ease}
.categoryCard:hover .categoryIcon{transform:translateY(-3px) scale(1.06);box-shadow:0 0 0 1px rgba(66,173,255,.12),0 12px 30px rgba(24,112,182,.14)}

.articleCard{
  position:relative;transform:translateZ(0);
  transition:transform .42s cubic-bezier(.2,.75,.2,1),border-color .35s ease,box-shadow .42s ease;
}
.articleCard:hover{transform:translateY(-8px) scale(1.008);border-color:rgba(65,175,255,.48);box-shadow:0 28px 65px rgba(0,0,0,.34)}
.articleImageWrap{overflow:hidden}
.articleImageWrap:after{
  content:"";position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 42%,rgba(2,7,13,.48) 100%),linear-gradient(130deg,rgba(48,171,255,.12),transparent 38%,rgba(130,86,255,.09));
  pointer-events:none;
}
.articleImageWrap img{transform:scale(1.001);filter:saturate(.92) contrast(1.04);transition:transform .9s cubic-bezier(.16,.78,.18,1),filter .5s ease}
.articleCard:hover .articleImageWrap img{transform:scale(1.09);filter:saturate(1.04) contrast(1.06)}
.articleTag{box-shadow:0 7px 24px rgba(0,0,0,.18);transition:transform .35s ease,box-shadow .35s ease}
.articleCard:hover .articleTag{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,.28)}

.factsPanel,.worldPanel{box-shadow:0 20px 50px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.025);transition:transform .35s ease,border-color .35s ease}
.factsPanel:hover,.worldPanel:hover{transform:translateY(-3px);border-color:rgba(78,170,227,.24)}
.worldMap{overflow:hidden;box-shadow:inset 0 0 55px rgba(22,131,220,.12),0 18px 40px rgba(0,0,0,.17)}
.worldMap:before{animation:premiumMapDrift 7s ease-in-out infinite alternate}
.worldMap:after{animation:premiumMapSweep 4.8s ease-in-out infinite}

.regionCard{position:relative;overflow:hidden;transition:transform .42s cubic-bezier(.2,.75,.2,1),border-color .35s ease,box-shadow .42s ease}
.regionCard:before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(145deg,rgba(47,175,255,.16),transparent 36%,rgba(0,0,0,.26));pointer-events:none}
.regionCard:hover{transform:translateY(-8px) scale(1.015);border-color:rgba(57,172,255,.45);box-shadow:0 24px 55px rgba(0,0,0,.3)}
.regionCard img{filter:saturate(.9) contrast(1.04)}
.regionCard:hover img{transform:scale(1.09);filter:saturate(1.02) contrast(1.08)}

.aboutSection{overflow:hidden}
.aboutSection:after{
  content:"GLOBALPEDIA";position:absolute;right:-5%;bottom:-12%;font-size:clamp(120px,20vw,320px);
  line-height:.8;font-weight:900;letter-spacing:-.08em;color:rgba(255,255,255,.018);pointer-events:none;
}
.aboutCopy,.aboutStat{position:relative;z-index:2}
.footer{border-top:1px solid rgba(104,171,213,.08)}

@supports (animation-timeline:view()) {
  .categorySection,.contentSection,.regionSection,.aboutSection,.categoryCard,.articleCard,.regionCard{
    animation:premiumReveal linear both;animation-timeline:view();animation-range:entry 0% cover 24%;
  }
}
@supports not (animation-timeline:view()) {
  .categorySection,.contentSection,.regionSection,.aboutSection{animation:premiumSectionIn .8s ease both}
}

@keyframes premiumHeroZoom{from{transform:scale(1.035)}to{transform:scale(1.09)}}
@keyframes premiumHeroIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes premiumSectionIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes premiumReveal{from{opacity:.1;transform:translateY(34px) scale(.985)}to{opacity:1;transform:none}}
@keyframes premiumMapDrift{from{transform:translateX(-8px) skewX(-10deg)}to{transform:translateX(8px) skewX(-6deg)}}
@keyframes premiumMapSweep{0%,100%{opacity:.28;transform:rotate(37deg) translateX(-6px) scaleX(.73)}50%{opacity:.9;transform:rotate(37deg) translateX(16px) scaleX(.83)}}

@media (max-width:760px){
  .heroImage{animation:none;transform:scale(1.04)}
  .heroMain:after{background:linear-gradient(180deg,transparent 22%,rgba(2,8,14,.72) 100%)}
  .aboutSection:after{font-size:26vw;right:-3%;bottom:0}
  .categoryCard:hover{transform:translateY(-3px)}
  .articleCard:hover,.regionCard:hover{transform:translateY(-4px)}
}
@media (prefers-reduced-motion:reduce){
  .heroImage,.heroContent,.categorySection,.contentSection,.regionSection,.aboutSection,.categoryCard,.articleCard,.regionCard,.worldMap:before,.worldMap:after{
    animation:none!important;transform:none!important;
  }
}
'@

Set-Content -Path $cssPath -Value $css -Encoding utf8

Write-Host ""
Write-Host "GlobalPedia Premium V2 applied successfully." -ForegroundColor Green
Write-Host "Backup: $backup" -ForegroundColor DarkGray
Write-Host "Now run: npm run build" -ForegroundColor Cyan

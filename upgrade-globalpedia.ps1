$ErrorActionPreference = "Stop"

$componentPath = "app/components/GlobalPediaHome.tsx"
$cssPath = "app/globals.css"

if (-not (Test-Path $componentPath)) { throw "Missing $componentPath" }
if (-not (Test-Path $cssPath)) { throw "Missing $cssPath" }

$component = Get-Content $componentPath -Raw
$css = Get-Content $cssPath -Raw

function Replace-Once([string]$text, [string]$old, [string]$new, [string]$label) {
    if ($text.Contains($new)) { return $text }
    if (-not $text.Contains($old)) { throw "Could not find expected source block: $label" }
    return $text.Replace($old, $new)
}

$component = Replace-Once $component `
'  const inputRef = useRef<HTMLInputElement>(null);' `
'  const inputRef = useRef<HTMLInputElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);' `
'state declaration'

$oldEffect = @'
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
'@
$newEffect = @'
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
      document.documentElement.style.setProperty("--my", `${event.clientY}px`);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    onScroll();

    const observer = new IntersectionObserver((items) => {
      items.forEach((item) => {
        if (item.isIntersecting) item.target.classList.add("is-visible");
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
'@
$component = Replace-Once $component $oldEffect $newEffect 'motion effect'

$component = Replace-Once $component `
'    <main>
      <a className="skipLink"' `
'    <main>
      <div className="scrollProgress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
      <div className="cursorGlow" aria-hidden="true" />
      <a className="skipLink"' `
'global motion indicators'

$component = Replace-Once $component `
'        <div className="heroOverlay" />
        <div className="starField"' `
'        <div className="heroOverlay" />
        <div className="heroVignette" aria-hidden="true" />
        <div className="starField"' `
'hero vignette'

$component = Replace-Once $component `
'          <div className="popular"><span>Popular:</span>' `
'          <div className="heroMetrics" aria-label="GlobalPedia highlights">
            <span><strong>195+</strong> COUNTRIES</span>
            <span><strong>50K+</strong> ARTICLES</span>
            <span><strong>20+</strong> LANGUAGES</span>
          </div>
          <div className="popular"><span>Popular:</span>' `
'hero metrics'

$component = Replace-Once $component `
'        <div className="heroAside" aria-hidden="true">' `
'        <div className="heroSignal" aria-hidden="true">
          <span className="signalDot" />
          <span>LIVE WORLD INDEX</span>
          <small>Knowledge • Discovery • Context</small>
        </div>
        <div className="heroAside" aria-hidden="true">' `
'live signal'

$component = Replace-Once $component `
'      <section id="categories" className="categorySection sectionWrap">' `
'      <section id="categories" className="categorySection sectionWrap reveal">' `
'categories reveal'

$component = Replace-Once $component `
'{categoryCards.map((item) => (
            <button key={item.label}' `
'{categoryCards.map((item, index) => (
            <button key={item.label}' `
'category index'

$component = Replace-Once $component `
'              <span className="categoryIcon"><svg' `
'              <span className="categoryIndex">{String(index + 1).padStart(2, "0")}</span>
              <span className="categoryIcon"><svg' `
'category index badge'

$component = Replace-Once $component `
'      <section id="featured" className="contentSection sectionWrap">' `
'      <section id="featured" className="contentSection sectionWrap reveal">' `
'featured reveal'

$oldArticleImage = @'
                <div className="articleImageWrap"><img src={entry.image} alt="" loading="lazy" /><div className={`articleTag tag-${entry.accent}`}>{entry.category.toUpperCase()}</div></div>
'@
$newArticleImage = @'
                <div className="articleImageWrap">
                  <img src={entry.image} alt="" loading="lazy" />
                  <div className="articleImageShade" aria-hidden="true" />
                  <div className={`articleTag tag-${entry.accent}`}>{entry.category.toUpperCase()}</div>
                  <span className="articleNumber">{entry.number}</span>
                </div>
'@
$component = Replace-Once $component $oldArticleImage $newArticleImage 'article image treatment'

$component = Replace-Once $component `
'      <section id="regions" className="regionSection sectionWrap">' `
'      <section id="regions" className="regionSection sectionWrap reveal">' `
'regions reveal'

$component = Replace-Once $component `
'      <section id="about" className="aboutSection sectionWrap">' `
'      <section id="about" className="aboutSection sectionWrap reveal">' `
'about reveal'

$marker = '/* GLOBALPEDIA PREMIUM MOTION UPGRADE */'
if (-not $css.Contains($marker)) {
$css += @'

/* GLOBALPEDIA PREMIUM MOTION UPGRADE */
:root{--mx:50vw;--my:40vh}
.scrollProgress{position:fixed;top:0;left:0;right:0;height:3px;z-index:120;background:linear-gradient(90deg,#22a8ff,#7fd6ff,#9a6cff);transform-origin:left center;box-shadow:0 0 18px rgba(34,168,255,.7)}
.cursorGlow{position:fixed;left:var(--mx);top:var(--my);width:320px;height:320px;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;z-index:1;background:radial-gradient(circle,rgba(34,168,255,.09),rgba(34,168,255,.025) 36%,transparent 70%);filter:blur(8px)}
.heroVignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 73% 44%,transparent 0 23%,rgba(1,7,12,.18) 58%,rgba(1,5,9,.78) 100%);z-index:2}
.heroMetrics{display:flex;flex-wrap:wrap;gap:9px;margin-top:20px}
.heroMetrics span{display:inline-flex;align-items:baseline;gap:7px;padding:8px 12px;border:1px solid rgba(126,190,235,.16);border-radius:999px;background:rgba(6,20,32,.44);backdrop-filter:blur(10px);color:#7f94a4;font-size:9px;letter-spacing:.1em}
.heroMetrics strong{color:#eaf5fb;font-size:12px;letter-spacing:0}
.heroSignal{position:absolute;right:6vw;top:18%;z-index:6;display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:9px;row-gap:3px;padding:11px 13px;border:1px solid rgba(113,190,239,.18);border-radius:12px;background:rgba(5,17,28,.44);backdrop-filter:blur(13px);box-shadow:0 20px 60px rgba(0,0,0,.23);font-size:9px;letter-spacing:.12em;color:#b9cad6}
.heroSignal small{grid-column:2;color:#678092;font-size:8px;letter-spacing:.03em}
.signalDot{width:8px;height:8px;border-radius:50%;background:#2fe09a;box-shadow:0 0 0 0 rgba(47,224,154,.6);animation:pulseDot 1.8s infinite}
.categorySection,.contentSection,.regionSection,.aboutSection{position:relative}
.categorySection:before,.contentSection:before,.regionSection:before,.aboutSection:before{content:"";position:absolute;top:0;left:50%;width:48%;height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgba(71,176,255,.5),transparent);opacity:.7}
.categoryCard{position:relative;overflow:hidden;transition:transform .35s cubic-bezier(.2,.7,.2,1),border-color .35s,box-shadow .35s}
.categoryCard:before{content:"";position:absolute;inset:-50%;background:radial-gradient(circle at 30% 20%,rgba(74,180,255,.13),transparent 28%);opacity:0;transition:opacity .35s}
.categoryCard:hover:before,.categoryCard[aria-pressed=true]:before{opacity:1}
.categoryIndex{position:absolute;top:9px;right:10px;color:#506575;font-size:8px;font-weight:700;letter-spacing:.12em}
.articleCard{position:relative}
.articleCard:after{content:"";position:absolute;inset:0;border-radius:12px;pointer-events:none;box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
.articleImageWrap:before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,transparent 40%,rgba(2,8,13,.52))}
.articleImageShade{position:absolute;inset:0;z-index:1;background:linear-gradient(125deg,rgba(32,167,255,.10),transparent 35%,rgba(121,87,255,.10));mix-blend-mode:screen;opacity:.75}
.articleNumber{position:absolute;right:12px;top:11px;z-index:3;font-size:10px;font-weight:800;color:rgba(255,255,255,.75);letter-spacing:.08em}
.articleText{position:relative;z-index:2}
.articleCard:hover .articleTag{transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,.22)}
.articleTag{transition:transform .3s ease,box-shadow .3s ease}
.regionCard{transition:transform .4s cubic-bezier(.2,.7,.2,1),border-color .4s,box-shadow .4s}
.regionCard:hover{transform:translateY(-7px) scale(1.01);border-color:rgba(53,174,255,.48);box-shadow:0 18px 45px rgba(0,0,0,.28)}
.regionCard:before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(135deg,rgba(43,167,255,.18),transparent 35%,rgba(0,0,0,.24))}
.worldMap{box-shadow:inset 0 0 50px rgba(22,118,232,.08);border:1px solid rgba(67,166,231,.08)}
.worldMap:after{animation:mapSweep 5s ease-in-out infinite}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.reveal.is-visible{opacity:1;transform:none}
@keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(47,224,154,.6)}50%{box-shadow:0 0 0 7px rgba(47,224,154,0)}}
@keyframes mapSweep{0%,100%{opacity:.35;transform:rotate(37deg) translateX(-2px) scaleX(.75)}50%{opacity:.85;transform:rotate(37deg) translateX(14px) scaleX(.82)}}
@media (max-width:760px){.cursorGlow{display:none}.heroSignal{right:4vw;top:94px}.heroMetrics span{font-size:8px}.heroMetrics strong{font-size:11px}.heroMetrics{gap:6px}.heroSignal small{display:none}}
@media (prefers-reduced-motion:reduce){.scrollProgress,.cursorGlow,.heroSignal,.heroMetrics,.articleCard,.categoryCard,.regionCard,.worldMap:after{animation:none!important}.reveal{opacity:1;transform:none;transition:none!important}}
'@
}

Set-Content -Path $componentPath -Value $component -Encoding utf8
Set-Content -Path $cssPath -Value $css -Encoding utf8

Write-Host "GlobalPedia premium visual upgrade applied." -ForegroundColor Green
Write-Host "Run: npm run build"

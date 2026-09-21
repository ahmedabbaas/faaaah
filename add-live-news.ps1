$ErrorActionPreference = "Stop"

$componentPath = "app\components\GlobalPediaHome.tsx"
$cssPath = "app\globals.css"

if (-not (Test-Path $componentPath)) { throw "Missing $componentPath. Run from the GlobalPedia project root." }
if (-not (Test-Path $cssPath)) { throw "Missing $cssPath. Run from the GlobalPedia project root." }

$component = Get-Content $componentPath -Raw
$css = Get-Content $cssPath -Raw

if ($component.Contains("/* GLOBALPEDIA LIVE NEWS WIRED */")) {
    Write-Host "Live News is already wired. Nothing to do." -ForegroundColor Yellow
    exit 0
}

$backupComponent = "app\components\GlobalPediaHome.before-live-news.tsx"
$backupCss = "app\globals.before-live-news.css"
if (-not (Test-Path $backupComponent)) { Copy-Item $componentPath $backupComponent }
if (-not (Test-Path $backupCss)) { Copy-Item $cssPath $backupCss }

function Replace-One([string]$text, [string]$old, [string]$new, [string]$label) {
    if ($text.Contains($new)) { return $text }
    if (-not $text.Contains($old)) { throw "Could not find expected source block: $label" }
    return $text.Replace($old, $new)
}

$component = Replace-One $component `
'type IconName = "countries" | "history" | "science" | "technology" | "culture" | "nature" | "health" | "arts";\n' `
'type IconName = "countries" | "history" | "science" | "technology" | "culture" | "nature" | "health" | "arts";\n\ntype NewsItem = {\n  id: string;\n  title: string;\n  description: string;\n  link: string;\n  source: string;\n  publishedAt: string;\n  category: string;\n};\n' `
'News type'

$component = Replace-One $component `
'  const inputRef = useRef<HTMLInputElement>(null);\n' `
'  const inputRef = useRef<HTMLInputElement>(null);\n  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);\n  const [newsUpdatedAt, setNewsUpdatedAt] = useState("");\n  const [newsLoading, setNewsLoading] = useState(true);\n  const [newsRefreshing, setNewsRefreshing] = useState(false);\n  const [newsError, setNewsError] = useState("");\n\n  const loadLiveNews = async (manual = false) => {\n    try {\n      setNewsError("");\n      if (manual) setNewsRefreshing(true);\n      const response = await fetch("/api/news", { cache: "no-store" });\n      if (!response.ok) throw new Error(`News request failed: ${response.status}`);\n      const data = (await response.json()) as { news?: NewsItem[]; updatedAt?: string };\n      setLiveNews(Array.isArray(data.news) ? data.news : []);\n      setNewsUpdatedAt(data.updatedAt || new Date().toISOString());\n    } catch {\n      setNewsError("Live news is temporarily unavailable.");\n    } finally {\n      setNewsLoading(false);\n      setNewsRefreshing(false);\n    }\n  };\n\n  useEffect(() => {\n    void loadLiveNews();\n    const timer = window.setInterval(() => void loadLiveNews(), 10 * 60 * 1000);\n    return () => window.clearInterval(timer);\n  }, []);\n' `
'Live news logic'

$component = Replace-One $component `
'[["Home", "#top"], ["Explore", "#categories"], ["Categories", "#categories"], ["Countries", "#regions"], ["Random", "#featured"], ["About", "#about"]]' `
'[["Home", "#top"], ["News", "#latest-news"], ["Explore", "#categories"], ["Categories", "#categories"], ["Countries", "#regions"], ["Random", "#featured"], ["About", "#about"]]' `
'News navigation link'

$liveNewsSection = @'
      <section id="latest-news" className="liveNewsSection sectionWrap">
        <div className="sectionHeading">
          <div className="liveNewsTitle">
            <span className="sectionKicker livePulse">●</span>
            <h2>Latest News</h2>
            <span className="liveBadge">LIVE</span>
          </div>
          <div className="newsControls">
            <span>{newsUpdatedAt ? `Updated ${new Date(newsUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Updating..."}</span>
            <button onClick={() => void loadLiveNews(true)} disabled={newsRefreshing} aria-label="Refresh latest news">
              {newsRefreshing ? "Refreshing…" : "↻ Refresh"}
            </button>
          </div>
        </div>

        {newsError ? (
          <div className="newsState">{newsError}</div>
        ) : newsLoading ? (
          <div className="newsGrid">
            {[1, 2, 3, 4, 5, 6].map((item) => <div className="newsSkeleton" key={item} />)}
          </div>
        ) : liveNews.length ? (
          <div className="newsGrid">
            {liveNews.slice(0, 12).map((item) => (
              <a className="liveNewsCard" href={item.link} target="_blank" rel="noreferrer" key={item.id}>
                <div className="liveNewsTop">
                  <span className="liveNewsCategory">{item.category}</span>
                  <span className="liveNewsTime">{new Date(item.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="liveNewsBottom"><span>{item.source}</span><span>Read story ↗</span></div>
              </a>
            ))}
          </div>
        ) : (
          <div className="newsState">No live stories available right now.</div>
        )}
      </section>

'@
$anchor = '      <section id="featured" className="contentSection sectionWrap">'
$component = Replace-One $component $anchor ($liveNewsSection + $anchor) 'Latest News section anchor'

$liveCss = @'

/* GLOBALPEDIA LIVE NEWS WIRED */
.liveNewsSection{
  position:relative;
  background:radial-gradient(circle at 82% 20%,rgba(31,158,245,.06),transparent 28%),#06121d;
  border-bottom:1px solid var(--line);
}
.liveNewsTitle{display:flex;align-items:center;gap:10px}
.livePulse{font-size:9px;color:#2fe09a;text-shadow:0 0 14px rgba(47,224,154,.9);animation:livePulse 1.5s ease-in-out infinite}
.liveBadge{padding:4px 7px;border:1px solid rgba(47,224,154,.25);border-radius:999px;color:#6ee7b7;background:rgba(47,224,154,.06);font-size:8px;font-weight:800;letter-spacing:.12em}
.newsControls{display:flex;align-items:center;gap:10px;color:#718695;font-size:10px}
.newsControls button{border:1px solid rgba(74,165,219,.2);border-radius:999px;padding:8px 12px;background:rgba(10,28,42,.72);color:#9fc1d3;transition:.25s ease}
.newsControls button:hover:not(:disabled){transform:translateY(-2px);border-color:rgba(66,176,255,.55);color:#fff}
.newsControls button:disabled{opacity:.5;cursor:wait}
.newsGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.liveNewsCard{position:relative;display:block;min-height:190px;overflow:hidden;padding:16px;border:1px solid rgba(83,133,169,.14);border-radius:13px;background:linear-gradient(180deg,rgba(12,30,44,.94),rgba(8,22,34,.96));transition:transform .4s cubic-bezier(.2,.75,.2,1),border-color .35s,box-shadow .4s}
.liveNewsCard:before{content:"";position:absolute;inset:-45%;background:radial-gradient(circle at 20% 0%,rgba(39,171,255,.13),transparent 28%);opacity:0;transition:opacity .35s;pointer-events:none}
.liveNewsCard:hover{transform:translateY(-7px);border-color:rgba(61,173,255,.44);box-shadow:0 24px 55px rgba(0,0,0,.28)}
.liveNewsCard:hover:before{opacity:1}
.liveNewsTop,.liveNewsBottom{display:flex;align-items:center;justify-content:space-between;gap:10px}
.liveNewsCategory{color:#42b2ff;text-transform:uppercase;letter-spacing:.12em;font-size:8px;font-weight:800}
.liveNewsTime{color:#61798a;font-size:9px}
.liveNewsCard h3{position:relative;z-index:1;margin:15px 0 9px;color:#f2f7fb;font-size:17px;line-height:1.16;letter-spacing:-.03em}
.liveNewsCard p{position:relative;z-index:1;margin:0;color:#8498a8;font-size:11px;line-height:1.55;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.liveNewsBottom{position:absolute;left:16px;right:16px;bottom:15px;color:#6f8697;font-size:9px}
.liveNewsBottom span:last-child{color:#32aaff}
.newsState{padding:30px;border:1px dashed rgba(83,133,169,.2);border-radius:13px;color:#8196a6;text-align:center;background:rgba(8,23,35,.55)}
.newsSkeleton{height:190px;border-radius:13px;border:1px solid rgba(83,133,169,.1);background:linear-gradient(110deg,#091a27 8%,#102738 18%,#091a27 33%);background-size:200% 100%;animation:newsShimmer 1.4s linear infinite}
@keyframes livePulse{0%,100%{opacity:.55;transform:scale(.82)}50%{opacity:1;transform:scale(1.15)}}
@keyframes newsShimmer{to{background-position-x:-200%}}
@media(max-width:1050px){.newsGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.newsGrid{grid-template-columns:1fr}.newsControls{flex-wrap:wrap;justify-content:flex-end}.liveNewsCard{min-height:180px}}
@media(prefers-reduced-motion:reduce){.livePulse,.newsSkeleton{animation:none!important}}
'@

$css += $liveCss

Set-Content -Path $componentPath -Value $component -Encoding utf8
Set-Content -Path $cssPath -Value $css -Encoding utf8

Write-Host "" 
Write-Host "GlobalPedia Live News wired successfully." -ForegroundColor Green
Write-Host "News loads immediately and refreshes every 10 minutes while the page is open." -ForegroundColor Cyan
Write-Host "Backups: $backupComponent and $backupCss" -ForegroundColor DarkGray
Write-Host "Next: npm run build" -ForegroundColor Cyan

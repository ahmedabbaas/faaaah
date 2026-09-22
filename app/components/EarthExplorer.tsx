"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

type Country = {
  code: string;
  name: string;
  capital: string;
  region: string;
  population: number;
};

type City = {
  country: string;
  name: string;
  lat: string;
  lng: string;
};

type Feature = {
  id?: string;
  properties?: Record<string, string | number | undefined>;
  geometry?: {
    type: string;
    coordinates: unknown;
  };
};

type GlobeInstance = {
  backgroundColor(value: string): GlobeInstance;
  backgroundImageUrl(value: string | null): GlobeInstance;
  globeImageUrl(value: string): GlobeInstance;
  bumpImageUrl(value: string): GlobeInstance;
  globeMaterial(): { bumpScale: number; specular?: unknown; shininess?: number };
  showAtmosphere(value: boolean): GlobeInstance;
  atmosphereColor(value: string): GlobeInstance;
  atmosphereAltitude(value: number): GlobeInstance;
  polygonsData(value: Feature[]): GlobeInstance;
  polygonCapColor(value: string | ((feature: Feature) => string)): GlobeInstance;
  polygonSideColor(value: string | ((feature: Feature) => string)): GlobeInstance;
  polygonStrokeColor(value: string | ((feature: Feature) => string)): GlobeInstance;
  polygonAltitude(value: number | ((feature: Feature) => number)): GlobeInstance;
  polygonLabel(value: (feature: Feature) => string): GlobeInstance;
  onPolygonClick(value: (feature: Feature, event: MouseEvent, coords: { lat: number; lng: number; altitude: number }) => void): GlobeInstance;
  onPolygonHover(value: (feature: Feature | null, previous: Feature | null) => void): GlobeInstance;
  polygonsTransitionDuration(value: number): GlobeInstance;
  pointOfView(value?: { lat?: number; lng?: number; altitude?: number }, ms?: number): GlobeInstance | { lat: number; lng: number; altitude: number };
  onZoom(value: (pov: { lat: number; lng: number; altitude: number }) => void): GlobeInstance;
  htmlElementsData(value: Array<Record<string, unknown>>): GlobeInstance;
  htmlLat(value: string | ((item: Record<string, unknown>) => number)): GlobeInstance;
  htmlLng(value: string | ((item: Record<string, unknown>) => number)): GlobeInstance;
  htmlAltitude(value: string | ((item: Record<string, unknown>) => number)): GlobeInstance;
  htmlElement(value: (item: Record<string, unknown>) => HTMLElement): GlobeInstance;
  controls(): {
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableZoom: boolean;
    zoomSpeed: number;
    minDistance: number;
    maxDistance: number;
    enableDamping: boolean;
    dampingFactor: number;
  };
  pauseAnimation(): GlobeInstance;
};

declare global {
  interface Window {
    Globe?: new (element: HTMLElement) => GlobeInstance;
    topojson?: {
      feature: (topology: unknown, object: unknown) => { features: Feature[] };
    };
  }
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";
const CITIES_URL = "https://raw.githubusercontent.com/joelacus/world-cities/main/world_cities_15000.json";
const EARTH_IMAGE = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_IMAGE = "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png";
const NIGHT_SKY = "https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export default function EarthExplorer({ compact = false }: { compact?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const countriesRef = useRef<Country[]>([]);
  const cityCacheRef = useRef<City[]>([]);
  const selectedRef = useRef<Country | null>(null);
  const focusRef = useRef({ lat: 20, lng: 0 });
  const [globeScriptReady, setGlobeScriptReady] = useState(false);
  const [topoScriptReady, setTopoScriptReady] = useState(false);
  const scriptReady = globeScriptReady && topoScriptReady;
  const [countries, setCountries] = useState<Country[]>([]);
  const [selected, setSelected] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [altitude, setAltitude] = useState(2.6);
  const [hoveredName, setHoveredName] = useState("");
  const [theme, setTheme] = useState("dark");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Loading Earth…");
  const [dataReady, setDataReady] = useState(false);

  const filteredCountries = useMemo(() => {
    const term = normalize(search);
    if (!term) return countries.slice(0, 8);
    return countries.filter((country) => normalize(country.name).includes(term)).slice(0, 8);
  }, [countries, search]);

  const countryFromFeature = (feature: Feature) => {
    const props = feature.properties || {};
    const rawCode = String(props.iso_a2 || props.ISO_A2 || props.ISO_A2_EH || "");
    const rawName = String(props.name || props.NAME || props.ADMIN || "");
    const byCode = rawCode
      ? countriesRef.current.find((country) => country.code.toUpperCase() === rawCode.toUpperCase())
      : undefined;
    if (byCode) return byCode;
    return countriesRef.current.find((country) => normalize(country.name) === normalize(rawName));
  };

  const loadCities = async (countryCode: string) => {
    if (cityCacheRef.current.length === 0) {
      const response = await fetch(CITIES_URL);
      if (!response.ok) throw new Error("City data unavailable");
      cityCacheRef.current = (await response.json()) as City[];
    }
    const next = cityCacheRef.current
      .filter((city) => city.country === countryCode)
      .filter((city) => Number.isFinite(Number(city.lat)) && Number.isFinite(Number(city.lng)))
      .slice(0, 70);
    setCities(next);
    return next;
  };

  const buildCityMarkers = (items: City[]) =>
    items.map((city) => ({
      kind: "city",
      name: city.name,
      lat: Number(city.lat),
      lng: Number(city.lng),
    }));

  const syncHtmlLabels = () => {
    const globe = globeRef.current;
    const currentCountry = selectedRef.current;
    if (!globe || !currentCountry) {
      globe?.htmlElementsData([]);
      return;
    }

    const cityMarkers = altitude < 1.05 ? buildCityMarkers(cities) : [];
    const countryMarker = {
      kind: "country",
      name: currentCountry.name,
      lat: focusRef.current.lat,
      lng: focusRef.current.lng,
    };

    globe
      .htmlElementsData([countryMarker, ...cityMarkers])
      .htmlLat((item) => Number(item.lat))
      .htmlLng((item) => Number(item.lng))
      .htmlAltitude((item) => item.kind === "country" ? 0.03 : 0.02)
      .htmlElement((item) => {
        const wrapper = document.createElement("div");
        wrapper.className = item.kind === "country" ? "earthCountryLabel" : "earthCityLabel";
        wrapper.textContent = String(item.name);
        if (item.kind === "city") {
          wrapper.setAttribute("title", "Zoom into " + String(item.name));
          wrapper.onclick = (event) => {
            event.stopPropagation();
            const lat = Number(item.lat);
            const lng = Number(item.lng);
            setSelectedCity(String(item.name));
            focusRef.current = { lat, lng };
            globe.pointOfView({ lat, lng, altitude: 0.28 }, 1000);
          };
        }
        return wrapper;
      });
  };

  const focusCountry = async (country: Country) => {
    selectedRef.current = country;
    setSelected(country);
    setSelectedCity("");
    setSearch("");
    setStatus("Finding cities in " + country.name + "…");

    try {
      const countryCities = await loadCities(country.code);
      const preferred =
        countryCities.find((city) => normalize(city.name) === normalize(country.capital)) ||
        countryCities[0];

      const lat = preferred ? Number(preferred.lat) : 20;
      const lng = preferred ? Number(preferred.lng) : 0;
      focusRef.current = { lat, lng };
      const globe = globeRef.current;

      globe?.pointOfView({ lat, lng, altitude: preferred ? 0.72 : 1.25 }, 1200);
      setStatus(preferred ? "Country selected · scroll further to see cities" : "Country selected");
    } catch {
      setStatus("Country selected · city data unavailable");
    }
  };

  useEffect(() => {
    try {
      const saved = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(saved);
    } catch {
      setTheme("dark");
    }

    const observer = new MutationObserver(() => {
      const next = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(next);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!scriptReady || !mountRef.current || globeRef.current || !window.Globe || !window.topojson) return;

    const WorldGlobe = window.Globe;
    const world = new WorldGlobe(mountRef.current);

    world
      .globeImageUrl(EARTH_IMAGE)
      .bumpImageUrl(BUMP_IMAGE)
      .backgroundImageUrl(theme === "dark" ? NIGHT_SKY : null)
      .showAtmosphere(true)
      .atmosphereAltitude(0.18)
      .polygonsTransitionDuration(260);

    const material = world.globeMaterial();
    material.bumpScale = 12;
    if ("shininess" in material) material.shininess = 18;

    const controls = world.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.22;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.7;
    controls.minDistance = 115;
    controls.maxDistance = 420;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    world
      .onZoom((pov) => {
        setAltitude(pov.altitude);
        syncHtmlLabels();
      })
      .onPolygonHover((feature) => {
        const country = feature ? countryFromFeature(feature) : undefined;
        setHoveredName(country?.name || "");
      })
      .onPolygonClick((feature, _event, coords) => {
        const country = countryFromFeature(feature);
        if (!country) return;
        focusRef.current = { lat: coords.lat, lng: coords.lng };
        selectedRef.current = country;
        setSelected(country);
        setSelectedCity("");
        void loadCities(country.code)
          .then(() => {
            world.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 0.66 }, 900);
            setStatus("Zoomed to " + country.name + " · scroll to city level");
          })
          .catch(() => setStatus("Country selected"));
      });

    globeRef.current = world;
    setStatus("Preparing country boundaries…");

    Promise.all([
      fetch(GEO_URL).then((response) => {
        if (!response.ok) throw new Error("Country data unavailable");
        return response.json();
      }),
      fetch("/api/countries").then((response) => {
        if (!response.ok) throw new Error("Country profile service unavailable");
        return response.json();
      }),
    ])
      .then(([topology, countryPayload]) => {
        const features = window.topojson?.feature(topology, (topology as { objects?: { countries?: unknown } }).objects?.countries).features || [];
        const list = Array.isArray(countryPayload.countries) ? countryPayload.countries : [];
        countriesRef.current = list;
        setCountries(list);

        const base = theme === "light" ? "#ffffff" : "#15263a";
        const selectedColor = theme === "light" ? "#6b7ce8" : "#6e83ff";

        world
          .polygonsData(features)
          .polygonAltitude((feature) => {
            const country = countryFromFeature(feature);
            return country?.code === selectedRef.current?.code ? 0.075 : 0.018;
          })
          .polygonCapColor((feature) => {
            const country = countryFromFeature(feature);
            return country?.code === selectedRef.current?.code ? selectedColor : base;
          })
          .polygonSideColor(() => theme === "light" ? "rgba(68,82,112,.16)" : "rgba(103,142,184,.28)")
          .polygonStrokeColor(() => theme === "light" ? "rgba(82,99,132,.38)" : "rgba(127,165,205,.42)")
          .polygonLabel((feature) => {
            const country = countryFromFeature(feature);
            return country
              ? "<strong>" + country.name + "</strong><br/><span>Click to focus · scroll to zoom</span>"
              : "";
          });

        setDataReady(true);
        setStatus("Ready · drag to rotate · wheel to zoom · click any country");
      })
      .catch(() => {
        setStatus("Earth data could not be loaded. Refresh to retry.");
      });

    const resize = () => {
      if (!mountRef.current || !globeRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      if (width > 0 && height > 0) {
        // Globe.gl observes its host element dimensions automatically.
      }
    };

    window.addEventListener("resize", resize);
    world.pointOfView({ lat: 18, lng: 0, altitude: compact ? 2.1 : 2.6 }, 0);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      globeRef.current?.pauseAnimation();
      globeRef.current = null;
    };
  }, [scriptReady]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe
      .backgroundColor(theme === "light" ? "#f5f7fb" : "#070d16")
      .backgroundImageUrl(theme === "dark" ? NIGHT_SKY : null)
      .atmosphereColor(theme === "light" ? "#84a9d4" : "#5b8fd0");

    if (dataReady) {
      const base = theme === "light" ? "#ffffff" : "#15263a";
      const selectedColor = theme === "light" ? "#6b7ce8" : "#6e83ff";
      globe
        .polygonCapColor((feature) => {
          const country = countryFromFeature(feature);
          return country?.code === selectedRef.current?.code ? selectedColor : base;
        })
        .polygonSideColor(() => theme === "light" ? "rgba(68,82,112,.16)" : "rgba(103,142,184,.28)")
        .polygonStrokeColor(() => theme === "light" ? "rgba(82,99,132,.38)" : "rgba(127,165,205,.42)");
    }
  }, [theme, dataReady]);

  useEffect(() => {
    if (!globeRef.current) return;
    syncHtmlLabels();
  }, [cities, selected, altitude]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/globe.gl@2.46.2/dist/globe.gl.min.js"
        strategy="afterInteractive"
        onLoad={() => setGlobeScriptReady(true)}
        onError={() => setStatus("3D engine could not be loaded. Refresh to retry.")}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js"
        strategy="afterInteractive"
        onLoad={() => setTopoScriptReady(true)}
        onError={() => setStatus("Country geometry engine could not be loaded. Refresh to retry.")}
      />

      <section className={"earthExplorer" + (compact ? " earthExplorerCompact" : "")} aria-label="Interactive 3D Earth Explorer">
        <div className="earthExplorerHead">
          <div>
            <span>GLOBALPEDIA · 3D EARTH</span>
            <h2>Explore the planet in <em>real space.</em></h2>
            <p>Drag to rotate. Scroll to zoom. Click a country, then zoom closer to reveal its cities.</p>
          </div>
          {!compact && (
            <div className="earthStatus">
              <span className="earthLiveDot" />
              <strong>{status}</strong>
            </div>
          )}
        </div>

        <div className="earthWorkspace">
          <div className="earthStage">
            <div ref={mountRef} className="earthCanvas" />
            {!scriptReady && <div className="earthLoading">Starting 3D engine…</div>}
            {scriptReady && !dataReady && <div className="earthLoading">Loading country geometry…</div>}

            <div className="earthControlsHint">
              <span>✦</span>
              <span>Drag · Rotate</span>
              <span>Wheel · Zoom</span>
              <span>Click · Focus</span>
            </div>

            {hoveredName && (
              <div className="earthHoverCard">
                <small>COUNTRY</small>
                <strong>{hoveredName}</strong>
              </div>
            )}

            {altitude < 1.05 && selected && (
              <div className="earthZoomBadge">
                <span>CITY LEVEL</span>
                <strong>{selectedCity || selected.name}</strong>
                <small>{selectedCity ? "Click another city to zoom further" : "City labels are now visible"}</small>
              </div>
            )}
          </div>

          <aside className="earthSidePanel">
            <div className="earthSearch">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a country…"
                aria-label="Find a country"
              />
            </div>

            {!search && !selected && (
              <div className="earthIntroPanel">
                <span>HOW TO EXPLORE</span>
                <h3>Start anywhere.</h3>
                <p>Click a country on the globe. The camera will move in, then city labels appear as you zoom closer.</p>
                <div className="earthQuickSteps">
                  <div><b>01</b><span>Rotate with left mouse</span></div>
                  <div><b>02</b><span>Scroll to zoom</span></div>
                  <div><b>03</b><span>Click a country</span></div>
                  <div><b>04</b><span>Zoom to cities</span></div>
                </div>
              </div>
            )}

            {search && (
              <div className="earthCountryResults">
                {filteredCountries.length ? filteredCountries.map((country) => (
                  <button key={country.code} onClick={() => void focusCountry(country)}>
                    <strong>{country.name}</strong>
                    <span>{country.capital} · {country.region}</span>
                  </button>
                )) : <span className="earthNoResult">No country found.</span>}
              </div>
            )}

            {selected && (
              <div className="earthCountryPanel">
                <span>FOCUSED COUNTRY</span>
                <h3>{selected.name}</h3>
                <p>{selected.capital} · {selected.region}</p>
                <div className="earthStats">
                  <div><span>Population</span><strong>{new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(selected.population)}</strong></div>
                  <div><span>Camera</span><strong>{altitude < 1.05 ? "City level" : "Country"}</strong></div>
                  <div><span>Cities</span><strong>{cities.length || "Loading…"}</strong></div>
                </div>
                <button className="earthResetButton" onClick={() => {
                  setSelected(null);
                  setSelectedCity("");
                  selectedRef.current = null;
                  setCities([]);
                  setAltitude(compact ? 2.1 : 2.6);
                  globeRef.current?.pointOfView({ lat: 18, lng: 0, altitude: compact ? 2.1 : 2.6 }, 900);
                }}>
                  Reset to world
                </button>
              </div>
            )}

            <div className="earthSourceNote">
              Country geometry: Natural Earth via World Atlas. City coordinates: GeoNames-derived world cities. City dataset is CC BY 4.0.
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

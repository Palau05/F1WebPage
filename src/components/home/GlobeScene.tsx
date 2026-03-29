"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import { circuits2026, getCurrentOrNextRace } from "@/lib/data/circuits";
import { getFlagEmoji, countryToNumericISO } from "@/lib/data/country-flags";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const LONG_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${LONG_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

interface GlobePoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  country: string;
  raceName: string;
  date: string;
  round: number;
  isCompleted: boolean;
  isNextRace: boolean;
}

interface GeoFeature {
  id?: string | number;
  properties: Record<string, unknown>;
  [key: string]: unknown;
}

export default function GlobeScene() {
  const router = useRouter();
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [selectedPoint, setSelectedPoint] = useState<GlobePoint | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [geoData, setGeoData] = useState<{ features: GeoFeature[] } | null>(null);
  const doubleClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickIdRef = useRef<string | null>(null);

  const points: GlobePoint[] = useMemo(() => {
    const now = new Date();
    const nextRace = getCurrentOrNextRace();
    return circuits2026.map((c) => ({
      id: c.id,
      lat: c.lat,
      lng: c.lng,
      label: c.city,
      country: c.country,
      raceName: c.raceName,
      date: c.date,
      round: c.round,
      isCompleted: new Date(c.date) < now,
      isNextRace: c.id === nextRace?.id,
    }));
  }, []);

  const hoveredPoint = useMemo(
    () => points.find((p) => p.id === hoveredPointId) || null,
    [points, hoveredPointId]
  );

  const activePoint = selectedPoint || hoveredPoint;
  const highlightedCountryId = useMemo(() => {
    if (!activePoint) return null;
    return countryToNumericISO[activePoint.country] ?? null;
  }, [activePoint]);

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 64,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Load GeoJSON
  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((topoData) => {
        import("topojson-client").then(({ feature }) => {
          const countries = feature(
            topoData,
            topoData.objects.countries
          ) as unknown as { features: GeoFeature[] };
          setGeoData(countries);
        });
      })
      .catch(() => {});
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (globeRef.current?.controls) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
  }, []);

  // Store callbacks in refs so HTML elements can access latest state
  const selectedRef = useRef(selectedPoint);
  selectedRef.current = selectedPoint;
  const routerRef = useRef(router);
  routerRef.current = router;

  const handleGlobeClick = useCallback(() => {
    setSelectedPoint(null);
  }, []);

  // HTML element factory — creates a red dot with click/hover events baked in
  const htmlElementFn = useCallback(
    (d: object) => {
      const p = d as GlobePoint;

      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.cursor = "pointer";
      wrapper.style.width = "0";
      wrapper.style.height = "0";

      // Outer glow ring
      const glow = document.createElement("div");
      glow.className = "globe-dot";
      glow.style.position = "absolute";
      glow.style.width = p.isNextRace ? "32px" : "24px";
      glow.style.height = p.isNextRace ? "32px" : "24px";
      glow.style.borderRadius = "50%";
      glow.style.top = "50%";
      glow.style.left = "50%";
      glow.style.transform = "translate(-50%, -50%)";
      glow.style.background = p.isNextRace
        ? "radial-gradient(circle, rgba(0,230,118,0.4) 0%, transparent 70%)"
        : "radial-gradient(circle, rgba(225,6,0,0.3) 0%, transparent 70%)";
      glow.style.pointerEvents = "none";
      glow.style.transition = "all 200ms cubic-bezier(0.2, 1, 0.3, 1)";
      wrapper.appendChild(glow);

      // Dot
      const dot = document.createElement("div");
      dot.className = "globe-dot";
      const size = p.isNextRace ? 13 : 10;
      const dotColor = p.isNextRace ? "#00e676" : p.isCompleted ? "#af8781" : "#e10600";
      const dotShadow = p.isNextRace ? "rgba(0,230,118,0.6)" : p.isCompleted ? "rgba(175,135,129,0.4)" : "rgba(225,6,0,0.5)";
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = dotColor;
      dot.style.boxShadow = `0 0 8px 2px ${dotShadow}`;
      dot.style.position = "absolute";
      dot.style.top = "50%";
      dot.style.left = "50%";
      dot.style.transform = "translate(-50%, -50%)";
      dot.style.transition = "all 200ms cubic-bezier(0.2, 1, 0.3, 1)";
      dot.style.pointerEvents = "auto";
      wrapper.appendChild(dot);

      // Hover
      dot.addEventListener("mouseenter", () => {
        dot.style.width = "14px";
        dot.style.height = "14px";
        dot.style.backgroundColor = "#e10600";
        dot.style.boxShadow = "0 0 14px 4px rgba(225,6,0,0.6)";
        glow.style.width = "32px";
        glow.style.height = "32px";
        setHoveredPointId(p.id);
      });

      dot.addEventListener("mouseleave", () => {
        const isSelected = selectedRef.current?.id === p.id;
        if (!isSelected) {
          dot.style.width = `${size}px`;
          dot.style.height = `${size}px`;
          dot.style.backgroundColor = dotColor;
          dot.style.boxShadow = `0 0 8px 2px ${dotShadow}`;
          glow.style.width = "24px";
          glow.style.height = "24px";
        }
        setHoveredPointId(null);
      });

      // Click — single=select, double=navigate
      dot.addEventListener("click", (e) => {
        e.stopPropagation();

        if (lastClickIdRef.current === p.id && doubleClickTimerRef.current) {
          clearTimeout(doubleClickTimerRef.current);
          doubleClickTimerRef.current = null;
          lastClickIdRef.current = null;
          routerRef.current.push(`/race/${p.id}`);
          return;
        }

        lastClickIdRef.current = p.id;
        setSelectedPoint(p);

        dot.style.width = "16px";
        dot.style.height = "16px";
        dot.style.backgroundColor = "#ffffff";
        dot.style.boxShadow = "0 0 18px 5px rgba(225,6,0,0.7)";
        glow.style.width = "36px";
        glow.style.height = "36px";

        if (doubleClickTimerRef.current) clearTimeout(doubleClickTimerRef.current);
        doubleClickTimerRef.current = setTimeout(() => {
          lastClickIdRef.current = null;
          doubleClickTimerRef.current = null;
        }, 400);
      });

      return wrapper;
    },
    // Intentionally not depending on selectedPoint/hoveredPoint to avoid re-creating DOM elements
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleInfoCardClick = useCallback(() => {
    if (selectedPoint) {
      router.push(`/race/${selectedPoint.id}`);
    }
  }, [selectedPoint, router]);

  const polygonColor = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      if (highlightedCountryId != null && Number(feature.id) === highlightedCountryId) {
        return "rgba(225, 6, 0, 0.35)";
      }
      return "rgba(30, 30, 40, 0.6)";
    },
    [highlightedCountryId]
  );

  const polygonStrokeColor = useCallback(
    (feat: object) => {
      const feature = feat as GeoFeature;
      if (highlightedCountryId != null && Number(feature.id) === highlightedCountryId) {
        return "rgba(225, 6, 0, 0.8)";
      }
      return "rgba(80, 80, 100, 0.3)";
    },
    [highlightedCountryId]
  );

  const infoPoint = selectedPoint || hoveredPoint;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#e10600"
        atmosphereAltitude={0.15}
        onGlobeClick={handleGlobeClick}
        // HTML dots
        htmlElementsData={points}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.015}
        htmlElement={htmlElementFn}
        htmlTransitionDuration={0}
        // Country polygons
        polygonsData={geoData?.features || []}
        polygonCapColor={polygonColor}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={polygonStrokeColor}
        polygonAltitude={(feat: object) => {
          const feature = feat as GeoFeature;
          return highlightedCountryId != null && Number(feature.id) === highlightedCountryId
            ? 0.005
            : 0.001;
        }}
      />

      {/* Side info card */}
      {infoPoint && (
        <div
          key={infoPoint.id}
          className={`
            absolute right-6 top-1/2 -translate-y-1/2 w-72 z-20
            ${selectedPoint ? "pointer-events-auto" : "pointer-events-none"}
          `}
          style={{
            animation: "fadeSlideIn 250ms cubic-bezier(0.2, 1, 0.3, 1) forwards",
          }}
        >
          <div
            className={`
              bg-surface-container/95 backdrop-blur-md relative
              ${selectedPoint ? "cursor-pointer hover:bg-surface-container-high/95 transition-colors" : ""}
            `}
            onClick={selectedPoint ? handleInfoCardClick : undefined}
          >
            {/* Red accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container" />

            <div className="p-5">
              {/* Flag + Country */}
              <div className="flex items-center gap-3 mb-4 pl-2">
                <span className="text-4xl leading-none">{getFlagEmoji(infoPoint.country)}</span>
                <div>
                  <p className="label-engineering text-outline">
                    {infoPoint.country.toUpperCase()}
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-lg font-bold italic text-on-surface leading-tight">
                    {infoPoint.raceName}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="pl-2 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="label-engineering text-outline">LOCATION</span>
                  <span className="text-sm text-on-surface">{infoPoint.label}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="label-engineering text-outline">DATE</span>
                  <span className="text-sm text-on-surface">
                    {formatDateLong(infoPoint.date)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="label-engineering text-outline">ROUND</span>
                  <span className="text-sm text-on-surface">
                    {String(infoPoint.round).padStart(2, "0")} / 24
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {infoPoint.isCompleted ? (
                    <span className="inline-block px-3 py-1 bg-surface-container-high text-tertiary text-xs font-semibold tracking-wider font-[family-name:var(--font-display)]">
                      COMPLETED
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container text-xs font-semibold tracking-wider font-[family-name:var(--font-display)]">
                      UPCOMING
                    </span>
                  )}

                  {selectedPoint && (
                    <span className="text-xs text-primary font-[family-name:var(--font-display)] font-semibold">
                      VIEW DETAILS →
                    </span>
                  )}
                </div>

                {!selectedPoint && (
                  <p className="text-xs text-on-surface-variant pt-1">
                    Click to select — Double-click to open
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

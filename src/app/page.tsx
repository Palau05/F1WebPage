"use client";

import dynamic from "next/dynamic";

const GlobeScene = dynamic(() => import("@/components/globe/GlobeScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-6.5rem)] flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="w-16 h-1 bg-primary-container mx-auto mb-4 animate-pulse" />
        <p className="label-engineering text-on-surface-variant">INITIALIZING GLOBE</p>
      </div>
    </div>
  ),
});

const MobileRaceList = dynamic(
  () => import("@/components/globe/MobileRaceList"),
  { ssr: true }
);

export default function HomePage() {
  return (
    <div className="relative">
      {/* Desktop: 3D Globe — subtract navbar (4rem) + footer (2.5rem) */}
      <div className="hidden md:block h-[calc(100vh-6.5rem)]">
        <GlobeScene />
      </div>

      {/* Mobile: Race List */}
      <div className="md:hidden">
        <MobileRaceList />
      </div>
    </div>
  );
}

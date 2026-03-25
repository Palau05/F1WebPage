import { getCircuitPath } from "@/lib/data/circuit-paths";

interface CircuitLayoutProps {
  circuitId: string;
  className?: string;
}

export default function CircuitLayout({ circuitId, className = "" }: CircuitLayoutProps) {
  const { path, viewBox } = getCircuitPath(circuitId);

  return (
    <div className={`relative bg-surface-container-lowest overflow-hidden ${className}`}>
      {/* SVG fills the entire container */}
      <div className="absolute inset-0 p-2 flex items-center justify-center">
        <svg
          viewBox={viewBox}
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Track glow */}
          <path
            d={path}
            stroke="#ffffff"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.12"
            fill="none"
          />
          {/* Track */}
          <path
            d={path}
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-4 z-10">
        <span className="label-engineering text-outline">TRACK LAYOUT</span>
      </div>
    </div>
  );
}

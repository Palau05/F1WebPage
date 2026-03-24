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
      <div className="absolute inset-0 p-6 flex items-center justify-center">
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
            stroke="#e10600"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.1"
            fill="none"
          />
          {/* Track asphalt */}
          <path
            d={path}
            stroke="#3a3a48"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Track racing line */}
          <path
            d={path}
            stroke="#d4d0e0"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* DRS zone accent */}
          <path
            d={path}
            stroke="#e10600"
            strokeWidth="3"
            strokeLinecap="butt"
            strokeLinejoin="round"
            strokeDasharray="12 60"
            strokeDashoffset="6"
            fill="none"
            opacity="0.6"
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

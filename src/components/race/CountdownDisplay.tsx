"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface CountdownDisplayProps {
  targetDate: string;
}

export default function CountdownDisplay({ targetDate }: CountdownDisplayProps) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetDate);

  if (isPast) {
    return (
      <p className="font-[family-name:var(--font-display)] text-xl font-bold italic text-on-surface">
        RACE COMPLETED
      </p>
    );
  }

  const units = [
    { value: days, label: "DAYS" },
    { value: hours, label: "HRS" },
    { value: minutes, label: "MIN" },
    { value: seconds, label: "SEC" },
  ];

  return (
    <div className="flex gap-4 md:gap-6">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <p className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-bold text-primary-container">
            {String(unit.value).padStart(2, "0")}
          </p>
          <p className="label-engineering text-on-surface-variant mt-1">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}

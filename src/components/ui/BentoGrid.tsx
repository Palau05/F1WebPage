import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export default function BentoGrid({
  children,
  className = "",
  columns = 3,
}: BentoGridProps) {
  const colClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={`grid gap-[0.9rem] ${colClass[columns]} ${className}`}
    >
      {children}
    </div>
  );
}

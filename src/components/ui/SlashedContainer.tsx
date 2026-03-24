import { ReactNode } from "react";

interface SlashedContainerProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "small" | "right";
}

export default function SlashedContainer({
  children,
  className = "",
  variant = "default",
}: SlashedContainerProps) {
  const clipClass =
    variant === "small"
      ? "clip-slashed-sm"
      : variant === "right"
        ? "clip-slashed-right"
        : "clip-slashed";

  return (
    <div className={`${clipClass} ${className}`}>
      {children}
    </div>
  );
}

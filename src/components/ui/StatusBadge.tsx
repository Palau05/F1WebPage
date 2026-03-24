interface StatusBadgeProps {
  status: "completed" | "upcoming" | "live";
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const styles = {
    completed: "bg-surface-container-high text-tertiary",
    upcoming: "bg-secondary-container text-secondary",
    live: "bg-primary-container text-on-primary-container animate-pulse",
  };

  const labels = {
    completed: "COMPLETED",
    upcoming: "UPCOMING",
    live: "LIVE",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1
        font-[family-name:var(--font-display)] text-xs font-semibold tracking-wider uppercase
        ${styles[status]} ${className}
      `}
    >
      {status === "live" && <span className="w-1.5 h-1.5 bg-on-primary-container inline-block" />}
      {labels[status]}
    </span>
  );
}

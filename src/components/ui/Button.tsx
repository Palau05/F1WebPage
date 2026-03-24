import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "px-5 py-2.5 font-[family-name:var(--font-display)] text-sm font-semibold tracking-wider transition-all transition-gearbox duration-200 cursor-pointer";

  const variants = {
    primary:
      "bg-primary-container text-on-primary-container hover:shadow-[0_2px_0_0_#ffb4a8]",
    secondary:
      "bg-surface-container-highest text-on-surface clip-slashed hover:bg-surface-bright",
    ghost:
      "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

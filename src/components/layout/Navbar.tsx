"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "GLOBE" },
  { href: "/calendar", label: "CALENDAR" },
  { href: "/standings", label: "STANDINGS" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-md" />

      {/* Bottom neon line */}
      <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-container/60 to-transparent" />

      <div className="relative flex items-center justify-between px-6 h-16">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 bg-primary-container/10 border border-primary-container/30 flex items-center justify-center clip-slashed overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-60" />
            <span className="font-[family-name:var(--font-display)] text-sm font-bold text-primary-container">
              F1
            </span>
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg font-bold italic text-on-surface tracking-tight group-hover:text-primary transition-colors duration-300">
            COMMAND CENTER
          </span>
        </Link>

        {/* Navigation Links — pill container */}
        <div className="flex items-center gap-0.5 bg-surface-container/40 border border-white/5 px-1 py-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative group px-5 py-1.5
                  font-[family-name:var(--font-display)] text-sm font-semibold tracking-wider
                  transition-all duration-300 ease-[cubic-bezier(0.2,1,0.3,1)]
                  ${
                    isActive
                      ? "text-on-primary-container bg-primary-container/15 border border-primary-container/25"
                      : "text-on-surface/50 hover:text-on-surface border border-transparent hover:border-white/8 hover:bg-white/4"
                  }
                `}
              >
                {/* Top neon glow */}
                <span
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-container to-transparent transition-opacity duration-500 ${
                    isActive ? "opacity-80" : "opacity-0 group-hover:opacity-50"
                  }`}
                />

                {link.label}

                {/* Bottom neon glow */}
                <span
                  className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-container to-transparent transition-opacity duration-500 ${
                    isActive ? "opacity-30" : "opacity-0 group-hover:opacity-20"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-white/5 bg-surface-container/40 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 bg-green-500" />
            </span>
            <span className="label-engineering text-tertiary">SYSTEMS ONLINE</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

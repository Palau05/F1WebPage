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
    <nav className="sticky top-0 z-50 bg-surface-container-low">
      <div className="flex items-center justify-between px-6 h-16">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-container clip-slashed flex items-center justify-center">
            <span className="text-on-primary-container font-[family-name:var(--font-display)] text-sm font-bold">
              F1
            </span>
          </div>
          <span className="font-[family-name:var(--font-display)] text-lg font-bold italic text-on-surface tracking-tight">
            COMMAND CENTER
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
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
                  relative px-4 py-2 font-[family-name:var(--font-display)] text-sm font-semibold tracking-wider
                  transition-colors transition-gearbox
                  ${
                    isActive
                      ? "text-primary-container"
                      : "text-on-surface/60 hover:text-on-surface"
                  }
                `}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-container" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className="label-engineering text-tertiary flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 inline-block animate-pulse" />
            SYSTEMS ONLINE
          </div>
        </div>
      </div>
    </nav>
  );
}

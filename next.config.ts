import type { NextConfig } from "next";

// Content-Security-Policy. Kept one directive per line for readability and
// joined into a single header value below. Notes on the non-obvious entries:
// - 'unsafe-inline'/'unsafe-eval' in script-src: Next.js injects inline runtime
//   scripts and the Three.js/react-globe.gl stack needs eval for WebGL shaders.
// - unpkg.com: the home globe loads earth textures + world-atlas geodata there.
// - blob:: three-globe creates worker/texture blobs at runtime.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://unpkg.com",
  "font-src 'self' data:",
  "connect-src 'self' https://unpkg.com https://api.jolpi.ca",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework via the X-Powered-By header.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

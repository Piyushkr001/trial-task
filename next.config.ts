// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Next 15+ replacement for experimental.serverComponentsExternalPackages
  serverExternalPackages: ["pdfjs-dist", "jszip", "pdfkit"],

  // (optional) keep or remove the experimental block if you have other flags
  experimental: {},
};

export default nextConfig;

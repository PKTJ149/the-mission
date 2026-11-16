import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Let the dev server answer pages opened on 127.0.0.1 (used to compare with staging at 100% zoom).
  allowedDevOrigins: ["127.0.0.1"],
  // Hide the dev-only "N" badge so screenshots compare cleanly with staging (errors still show).
  devIndicators: false,
};

export default nextConfig;

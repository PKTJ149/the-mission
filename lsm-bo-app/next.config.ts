import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Let the dev server answer pages opened on 127.0.0.1 (used to compare with staging at 100% zoom).
  allowedDevOrigins: ["127.0.0.1"],
  // Hide the dev-only "N" badge so screenshots compare cleanly with staging (errors still show).
  devIndicators: false,
  // The original's "/" sends a signed-in user to /dashboard; our mockup has no session, so "/" opens
  // the login page instead.
  async redirects() {
    // Mockup flow (PK): start at the login page, which signs straight in to /dashboard
    return [{ source: "/", destination: "/login", permanent: false }];
  },
};

export default nextConfig;

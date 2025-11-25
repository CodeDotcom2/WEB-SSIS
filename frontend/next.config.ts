import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "../backend/app/static",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

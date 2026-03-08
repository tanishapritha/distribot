import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["db", "ai", "discovery"],
};

export default nextConfig;

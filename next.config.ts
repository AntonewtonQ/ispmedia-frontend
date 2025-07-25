import type { NextConfig } from "next";


const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: true,
  // ... outras configs
});

const nextConfig: NextConfig = {
  /* config options here */

};

export default nextConfig;

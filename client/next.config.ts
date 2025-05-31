import type { NextConfig } from "next";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend/api/:path*", // << ใช้ชื่อ container
      },
    ];
  },
  images: {
    domains: ["example.com"],
  },
};

export default nextConfig;

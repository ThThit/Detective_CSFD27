import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: ["underhand-unsubtle-carload.ngrok-free.dev"],
  experimental: {
    // Let the client router cache reuse dynamic route payloads for 60s so
    // repeat navigations within that window don't re-hit the server.
    staleTimes: {
      dynamic: 60,
    },
  },
};

export default nextConfig;

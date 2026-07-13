import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: ["underhand-unsubtle-carload.ngrok-free.dev"],
};

export default nextConfig;

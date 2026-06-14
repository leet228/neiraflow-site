import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Самодостаточный сервер для будущего деплоя на VPS (.next/standalone)
  output: "standalone",
};

export default nextConfig;

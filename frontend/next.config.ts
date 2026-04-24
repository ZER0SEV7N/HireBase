import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*'] //Permitir solicitudes desde cualquier origen durante el desarrollo
};

export default nextConfig;

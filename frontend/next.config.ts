import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.9'] //Permitir solicitudes desde cualquier origen durante el desarrollo
};

export default nextConfig;

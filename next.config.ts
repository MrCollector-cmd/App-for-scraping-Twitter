import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Puedes agregar lógica aquí para personalizar el comportamiento del Webpack si lo necesitas
    return config;
  },
};

export default nextConfig;

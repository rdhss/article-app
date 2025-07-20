import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ['cdn.pixabay.com', 's3.sellerpintar.com', 'res.cloudinary.com'],
  },
};

export default nextConfig;

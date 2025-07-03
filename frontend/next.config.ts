/* next.config.ts */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Хялбар хувилбар — зөвшөөрөх домэйнүүдийн жагсаалт
    domains: ["res.cloudinary.com", "localhost"],

    /* Хэрвээ порт, path, протоколыг илүү нарийвчлан заах бол:
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
    ],
    */
  },
};

export default nextConfig;

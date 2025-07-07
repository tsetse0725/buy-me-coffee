import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "png.pngtree.com",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com", // ✅ Нэмсэн хэсэг
      },
{
  protocol: "https",
  hostname: "i.pinimg.com",
}
,
{
  protocol: "https",
  hostname: "previews.123rf.com",
},
{
  protocol: "https",
  hostname: "thumbs.dreamstime.com",
},
    ],
  },
};

export default nextConfig;

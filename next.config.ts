import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iua0ldc1zqsxr4iy.public.blob.vercel-storage.com",
        port: "",
        pathname: "/products/images/**",
      },
    ],
  },
};

export default nextConfig;

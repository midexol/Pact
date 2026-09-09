import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/docs/:path*",
        destination: "https://pact-docs.vercel.app/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;


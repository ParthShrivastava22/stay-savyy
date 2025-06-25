import type { NextConfig } from "next";
import { URL } from "url";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://jiv2e92huv.ufs.sh/**")],
  },
};

export default nextConfig;

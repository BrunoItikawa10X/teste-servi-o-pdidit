import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Allow camera/microphone usage within iframes (Permissions-Policy)
          { key: "Permissions-Policy", value: "camera=*, microphone=*" },
          // Legacy header for older browsers
          { key: "Feature-Policy", value: "camera *; microphone *" },
        ],
      },
    ];
  },
};

export default nextConfig;

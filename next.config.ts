import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "1";
const nextConfig: NextConfig = {
  ...(pages ? { output: "export" as const, basePath: "/Helbor-Marketing" } : {}),
  /* config options here */
  ...(!pages ? { cacheComponents: true, partialPrefetching: true } : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

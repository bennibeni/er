import { fileURLToPath } from "node:url";

const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.ER_CHECK ? ".next-check" : ".next",
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
};

export default nextConfig;

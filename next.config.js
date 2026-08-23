/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.DEPLOY_TARGET === "render" ? "export" : "standalone",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  sassOptions: {
    silenceDeprecations: ["import"],
  },
};

module.exports = nextConfig;

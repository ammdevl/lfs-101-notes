/** @type {import('next').NextConfig} */
const nextConfig = {
  // Always produce a fully static export in ./out so any host
  // (Render, Netlify, `npx serve out`) can publish it as-is.
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  sassOptions: {
    silenceDeprecations: ["import"],
  },
};

module.exports = nextConfig;

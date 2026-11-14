/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: "export",
  // Only the GitHub Pages preview sets this (the site lives under /GycioBiciukis/ there)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // Export pages as folder/index.html so plain static hosting serves clean URLs
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    additionalData: `@import "_variables.scss"; @import "_breakpoints.scss"; @import "_colors.scss";`,
  },
};

module.exports = nextConfig;

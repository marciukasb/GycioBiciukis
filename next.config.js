/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: "export",
  // Export pages as folder/index.html so plain static hosting serves clean URLs
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    additionalData: `@import "_variables.scss"; @import "_breakpoints.scss"; @import "_colors.scss";`,
  },
};

module.exports = nextConfig;

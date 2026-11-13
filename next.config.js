/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: "export",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    additionalData: `@import "_variables.scss"; @import "_breakpoints.scss"; @import "_colors.scss";`,
  },
};

module.exports = nextConfig;

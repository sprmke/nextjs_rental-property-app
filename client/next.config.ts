import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};


const {
  createVanillaExtractPlugin,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

export default withVanillaExtract(nextConfig);

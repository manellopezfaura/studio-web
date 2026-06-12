import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "swiper",
      "gsap",
      "framer-motion",
      "phosphor-react",
    ],
  },
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);

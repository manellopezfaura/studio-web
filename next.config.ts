import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: [
      "swiper",
      "gsap",
      "framer-motion",
      "phosphor-react",
    ],
  },
  productionBrowserSourceMaps: false,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/hera",
          destination: "https://saas-landing-eight-theta.vercel.app/hera/",
        },
        {
          source: "/hera/:path*",
          destination:
            "https://saas-landing-eight-theta.vercel.app/hera/:path*",
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);

import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  eslint: {
    // skip ESLint during `next build` on Netlify
    ignoreDuringBuilds: true,
  },
  typescript: {
    // skip TypeScript type-check errors during `next build`
    ignoreBuildErrors: true,
  },
};

export default withMDX(nextConfig);

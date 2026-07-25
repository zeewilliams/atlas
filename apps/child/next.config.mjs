/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@atlas/curriculum", "@atlas/ai", "@atlas/store"],
};

export default nextConfig;

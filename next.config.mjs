/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 600,
      static: 600,
    },
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  reactStrictMode: false,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [100, 75],
  },
  env: {
    NEXT_PUBLIC_CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || "",
  },
};

module.exports = nextConfig;

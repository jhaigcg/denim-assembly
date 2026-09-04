/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Product photography is served from /public in this phase. When a CDN is
    // introduced, add its host here and switch <img> back to next/image.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

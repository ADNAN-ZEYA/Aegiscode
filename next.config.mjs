/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',       // <--- REQUIRED: Generates the HTML files for Firebase
  images: {
    unoptimized: true,    // <--- REQUIRED: Fixes image loading on Firebase
  },
};

export default nextConfig;
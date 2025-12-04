
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/book", destination: "/" },
      { source: "/services", destination: "/" },
    ];
  },
};

export default nextConfig;

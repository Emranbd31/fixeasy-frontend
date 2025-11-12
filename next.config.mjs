
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Prevent Watchpack from probing Windows system files (pagefile/hiberfil/swapfile)
  // which can produce EINVAL lstat errors on some systems. Quiet these in dev.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = Object.assign({}, config.watchOptions, {
        ignored: [
          '**/node_modules/**',
          'C:\\pagefile.sys',
          'C:\\hiberfil.sys',
          'C:\\swapfile.sys'
        ],
      });
    }
    return config;
  },
};

export default nextConfig;

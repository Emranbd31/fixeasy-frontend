
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Prevent Watchpack from probing Windows system files (pagefile/hiberfil/swapfile)
  // which can produce EINVAL lstat errors on some systems. Quiet these in dev.
  webpack: (config, { dev }) => {
    if (dev) {
      // Add common Windows system files and a regex to quietly ignore probes
      // that Watchpack sometimes performs against the root of C:\ which
      // produce EINVAL lstat errors on some machines.
      const ignored = [
        '**/node_modules/**',
        'C:\\pagefile.sys',
        'C:\\hiberfil.sys',
        'C:\\swapfile.sys',
        'C:\\DumpStack.log.tmp',
      ];

      config.watchOptions = Object.assign({}, config.watchOptions, {
        ignored,
      });
    }
    return config;
  },
};

export default nextConfig;

const path = require('path');
const Module = require('module');

const stubPath = path.join(__dirname, 'stubs');
if (!process.env.NODE_PATH?.includes(stubPath)) {
  process.env.NODE_PATH = [stubPath, process.env.NODE_PATH]
    .filter(Boolean)
    .join(path.delimiter);
  Module._initPaths();
}

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

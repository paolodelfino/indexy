/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    ppr: true,
    serverActions: { bodySizeLimit: `1TB` },
  },
};

export default nextConfig;

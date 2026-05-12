/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.app.github.dev",
        "*.github.dev",
        "*.preview.app.github.dev",
        "*.vercel.app",
      ],
    },
  },
};

export default nextConfig;

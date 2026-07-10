/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages user-site (krishpranav.github.io) => static export.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ["three"],
  // Repo lives beside another lockfile in the home dir; pin the root explicitly.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;

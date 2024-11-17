/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enables static site generation
    distDir: 'dist', // Specifies the output directory for the build
    images: {
        unoptimized: true, // Disables Next.js image optimization for compatibility
    },
    eslint: {
        ignoreDuringBuilds: true, // Suppress ESLint errors during the build
    },
    typescript: {
        ignoreBuildErrors: true, // Suppress TypeScript errors during the build
    },
};

export default nextConfig;

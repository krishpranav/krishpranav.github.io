const WindiCSS = require('windicss-webpack-plugin');
const { withAxiom } = require('next-axiom');

const ContentSecurityPolicy = `
  child-src *.google.com streamable.com;
  connect-src *;
  default-src 'self';
  font-src 'self';
  img-src * blob: data:;
  media-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.splitbee.io;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  worker-src 'self' 'unsafe-inline' blob:;
`;

/**
 * @type {import('next').NextConfig}
 */
const config = {
  output: 'standalone', // ✅ Fix invalid "export" issue
  images: {
    unoptimized: true, // ✅ Required for static export
    domains: [
      'cdn.discordapp.com', // ✅ Discord
      'raw.githubusercontent.com', // ✅ GitHub
      'i.scdn.co', // ✅ Spotify
      'cdn-cf-east.streamable.com', // ✅ Streamable
      'source.unsplash.com',
      'images.unsplash.com', // ✅ Unsplash
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\n/g, '') },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.plugins.push(new WindiCSS());

    config.module.rules.push({
      test: /\.(glsl|vs|fs|frag|vert)$/,
      use: ['raw-loader'],
    });

    return config;
  },
};

module.exports = withAxiom(config);

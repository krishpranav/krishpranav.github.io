const WindiCSS = require('windicss-webpack-plugin');
const { withAxiom } = require('next-axiom');

const isGithubPages = process.env.GITHUB_ACTIONS || false;
const repoName = 'your-repo-name'; // Change this to your GitHub repo name

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
	output: 'export', // Needed for static site deployment
	assetPrefix: isGithubPages ? `/${repoName}/` : '',
	basePath: isGithubPages ? `/${repoName}` : '',
	trailingSlash: true, // Ensures all paths end with a slash for static hosting

	images: {
		domains: [
			'cdn.discordapp.com',
			'raw.githubusercontent.com',
			'i.scdn.co',
			'cdn-cf-east.streamable.com',
			'source.unsplash.com',
			'images.unsplash.com',
		],
		unoptimized: true, // GitHub Pages doesn't support Next.js image optimization
	},

	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: ContentSecurityPolicy.replace(/\n/g, ''),
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin',
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=31536000; includeSubDomains; preload',
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
					},
				],
			},
		];
	},

	reactStrictMode: true,
	swcMinify: true,

	webpack: (config, { dev, isServer }) => {
		config.plugins.push(new WindiCSS());

		config.module.rules.push({
			test: /\.(glsl|vs|fs|frag|vert)$/,
			use: ['ts-shader-loader'],
		});

		return config;
	},
};

module.exports = withAxiom(config);

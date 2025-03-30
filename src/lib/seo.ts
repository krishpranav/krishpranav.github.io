import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';

import type { ComponentProps } from 'react';

export function useSeoProps(
	props: Partial<ComponentProps<typeof NextSeo>> = {},
): Partial<ComponentProps<typeof NextSeo>> {
	const router = useRouter();

	const title = 'krisna pranav ─ developer';
	const description = "Hey 👋 I'm Krisna, Software Engineer";

	return {
		title,
		description,
		canonical: `https://krishpranav.github.io/${router.asPath}`,
		openGraph: {
			title,
			description,
			site_name: 'krishpranav.github.io',
			url: `https://krishpranav.github.io/${router.asPath}`,
			type: 'website',
			images: [
				{
					url: 'https://krishpranav.github.io/banner.png',
					alt: description,
					width: 1280,
					height: 720,
				},
			],
		},
		twitter: {
			cardType: 'summary_large_image',
			handle: '@krishpranav5',
			site: '@krishpranav5',
		},
		...props,
	};
}

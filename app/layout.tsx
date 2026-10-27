import type { Metadata, Viewport } from "next";
import { Geist_Mono, Onest } from "next/font/google";
import { identity } from "@/lib/resume";
import { SITE, seoDescription, seoTitle } from "@/lib/seo";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-geist-mono",
  display: "swap",
});

const title = seoTitle;
const description = seoDescription;

export const metadata: Metadata = {
  metadataBase: new URL(identity.links.site),
  title,
  description,
  applicationName: identity.name,
  authors: [{ name: identity.name, url: identity.links.site }],
  creator: identity.name,
  publisher: identity.name,
  // One URL form everywhere: the canonical, og:url, the sitemap and the structured data.
  alternates: { canonical: SITE },
  // Full snippets and large image previews in search results.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  openGraph: {
    title,
    description,
    url: SITE,
    siteName: identity.name,
    locale: "en_US",
    type: "profile",
  },
  twitter: { card: "summary_large_image", title, description, creator: identity.links.xHandle, site: identity.links.xHandle },
};

// The paper token (oklch 99.3% 0.002 270) as hex, for the browser chrome.
export const viewport: Viewport = {
  themeColor: "#fcfcfd",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${onest.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Before paint: CSS hides reveal targets only when a script will show them. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

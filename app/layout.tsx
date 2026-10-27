import type { Metadata, Viewport } from "next";
import { Geist_Mono, Onest } from "next/font/google";
import { identity } from "@/lib/resume";
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

const title = `${identity.name}, Senior AI/ML Engineer in Singapore`;
const description =
  "I’m Krisna, a senior AI/ML engineer at Turing, building agent infrastructure from Singapore. I’ve been coding since 6th grade.";

export const metadata: Metadata = {
  metadataBase: new URL(identity.links.site),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: identity.links.site,
    siteName: identity.name,
    locale: "en_US",
    type: "profile",
  },
  twitter: { card: "summary_large_image", title, description },
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

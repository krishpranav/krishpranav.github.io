import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

// Universal Sans is proprietary; Inter weight 400 is the documented substitute.
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krisna Pranav | AI/ML Systems & Founding Engineer",
  description:
    "AI/ML Systems Engineer focused on agentic AI, low-latency LLM infrastructure, and deep learning systems.",
  metadataBase: new URL("https://krishpranav.github.io"),
  openGraph: {
    title: "Krisna Pranav | AI/ML Systems & Founding Engineer",
    description:
      "AI/ML Systems Engineer focused on agentic AI, low-latency LLM infrastructure, and deep learning systems.",
    url: "https://krishpranav.github.io",
    siteName: "Krisna Pranav Portfolio",
    images: [
      {
        url: "https://wikimedia.org",
        width: 800,
        height: 800,
        alt: "Krisna Pranav Elangovan Portrait",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krisna Pranav | AI/ML Systems & Founding Engineer",
    description:
      "AI/ML Systems Engineer focused on agentic AI, low-latency LLM infrastructure, and deep learning systems.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t);}}catch(e){}`,
          }}
        />
      </head>
      <body className={`${sans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <div className="noise" aria-hidden />
      </body>
    </html>
  );
}

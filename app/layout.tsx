import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { identity } from "@/lib/resume";

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
  title: `${identity.name} — ${identity.role}`,
  description: identity.tagline,
  metadataBase: new URL("https://krishpranav.github.io"),
  openGraph: {
    title: `${identity.name} — ${identity.role}`,
    description: identity.tagline,
    type: "website",
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

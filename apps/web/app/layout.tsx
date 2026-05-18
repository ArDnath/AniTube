import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: { default: "AniTube — Watch Anime Online", template: "%s | AniTube" },
  description:
    "Stream your favourite anime series and movies. Discover trending, popular, and top-rated anime all in one place.",
  keywords: [
    "anime",
    "watch anime",
    "anime streaming",
    "anime online",
    "trending anime",
  ],
  authors: [{ name: "Ariyaman Debnath" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AniTube",
  },
  openGraph: {
    title: "AniTube — Watch Anime Online",
    description: "Stream trending, popular, and top-rated anime.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AniTube",
    description: "Your ultimate anime streaming destination.",
  },
};

export const viewport: Viewport = {
  themeColor: "#C4B5FD",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('app-storage');
                const parsed = t ? JSON.parse(t) : {};
                const theme = parsed?.state?.theme ?? 'system';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (theme === 'system' && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch {}
            `,
          }}
        />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon-192x192.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white dark:bg-gray-950`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

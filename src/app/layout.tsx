import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/marketing/Analytics";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vedascholars.com'),
  title: "Veda Scholars | Education to Employment",
  description: "Guiding students from education to their dream careers.",
  openGraph: {
    title: "Veda Scholars | Education to Employment",
    description: "Guiding students from education to their dream careers.",
    url: 'https://vedascholars.com',
    siteName: 'Veda Scholars',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        alt: 'Veda Scholars – Education to Employment Consultancy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Veda Scholars | Education to Employment",
    description: "Guiding students from education to their dream careers.",
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body
        className="antialiased bg-white text-slate-900 font-body flex flex-col min-h-screen"
      >
        <Analytics />
        <Header />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

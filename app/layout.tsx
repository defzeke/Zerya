import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Zerya Blooms",
    template: "%s | Zerya Blooms",
  },
  description:
    "Botanical minimalism for the intentional aesthete. Serving love that blooms.",
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "Zerya Blooms",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className="bg-cream text-charcoal font-sans antialiased min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

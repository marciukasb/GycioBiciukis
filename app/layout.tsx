import { Caveat, Fraunces, Nunito } from "next/font/google";
import "./globals.scss";
import Navigation from "@/app/_components/Navigation/Navigation";
import Footer from "@/app/_components/Footer/Footer";
import { SITE_NAME, SITE_URL } from "@/app/_data/site";

const nunito = Nunito({ subsets: ["latin", "latin-ext"] });
const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-serif" });
export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: { "application/rss+xml": [{ url: "/rss.xml", title: SITE_NAME }] },
  },
};

const caveat = Caveat({ subsets: ["latin", "latin-ext"], variable: "--font-hand" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt" className={`${fraunces.variable} ${caveat.variable}`}>
      <body className={nunito.className}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}

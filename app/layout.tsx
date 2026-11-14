import { Kalam, Nunito, Young_Serif } from "next/font/google";
import "./globals.scss";
import Navigation from "@/app/_components/Navigation/Navigation";
import Footer from "@/app/_components/Footer/Footer";
import Newsletter from "@/app/_components/Newsletter/Newsletter";
import { SITE_NAME, SITE_URL } from "@/app/_data/site";
import { BASE_PATH } from "@/app/utils/assetPath";

const nunito = Nunito({ subsets: ["latin", "latin-ext"] });
// Fraunces and Caveat were dropped: they draw ū/Ū/Ė incorrectly
const youngSerif = Young_Serif({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-serif" });
export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: { "application/rss+xml": [{ url: "/rss.xml", title: SITE_NAME }] },
  },
  // Keep the GitHub Pages preview out of search results until the real site launches
  ...(BASE_PATH && { robots: { index: false, follow: false } }),
};

const kalam = Kalam({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-hand" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt" className={`${youngSerif.variable} ${kalam.variable}`}>
      <body className={nunito.className}>
        <Navigation />
        {children}
        <Footer>
          <Newsletter />
        </Footer>
      </body>
    </html>
  );
}

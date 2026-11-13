import { Caveat, Fraunces, Nunito } from "next/font/google";
import "./globals.scss";
import Navigation from "@/app/_components/Navigation/Navigation";
import Footer from "@/app/_components/Footer/Footer";

const nunito = Nunito({ subsets: ["latin", "latin-ext"] });
const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-serif" });
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

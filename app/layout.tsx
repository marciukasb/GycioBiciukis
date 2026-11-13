import { Inter } from "next/font/google";
import "./globals.scss";
import Navigation from "@/app/_components/Navigation/Navigation";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

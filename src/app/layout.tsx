import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from './fonts'
import HeaderClient from "@/components/HeaderClient";
import Footer from "@/components/footer";
import {cookies} from "next/headers";


export const metadata: Metadata = {
  title: "NegoSud",
  description: "NegoSud, vendeur de bibine",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={montserrat.className}
      >
      <HeaderClient />
        {children}
      <Footer/>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from './fonts'
import HeaderClient from "@/components/HeaderClient";


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
    <html lang="en">
      <body
        className={montserrat.className}
      >
      <HeaderClient pathname={""} />
        {children}
      </body>
    </html>
  );
}

export { montserrat };

import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from './fonts'


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
        {children}
      </body>
    </html>
  );
}

export { montserrat };

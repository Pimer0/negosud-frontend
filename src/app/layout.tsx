import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from './fonts'
import Footer from "@/components/footer";
import { PanierProvider } from "@/context/PanierContext";
import { SessionProvider } from "@/context/SessionProvider";
import SessionHeader from "@/components/SessionHeader";

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
        <body className={montserrat.className}>
        <SessionProvider>
            <PanierProvider>
                <SessionHeader />
                    {children}
                    <Footer />
            </PanierProvider>
        </SessionProvider>
        </body>
        </html>
    );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Syne } from "next/font/google";
import { Toaster } from "sonner";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Import Inter font with next/font
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

// Import Syne font with next/font
const syne = Syne({
    subsets: ["latin"],
    variable: "--font-syne",
    display: "swap",
    weight: ["600", "700"],
});

export const metadata: Metadata = {
    title: "SkillSwap",
    description: "Une plateforme d'échange de compétences",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${syne.variable} antialiased min-h-screen flex flex-col`}
            >
                <div className="flex flex-col flex-1 max-w-screen-xl mx-auto w-full min-h-screen">
                    <AuthProvider>
                        <Header />
                        <main className="flex-1">{children}</main>
                    </AuthProvider>
                    <Footer />
                </div>
                <Toaster richColors />
            </body>
        </html>
    );
}

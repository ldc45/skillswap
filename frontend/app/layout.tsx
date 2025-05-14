import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
            <head>
                {/* Preconnect and preload for Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    as="style"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700&display=swap"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
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

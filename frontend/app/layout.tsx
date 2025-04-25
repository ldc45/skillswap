import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import Header from "@/components/header/Header";
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
}>) {  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-screen-xl mx-auto`}
      >
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}

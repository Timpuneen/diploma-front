import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/language-context";

import "./globals.css";

const _inter = Inter({ subsets: ["latin", "cyrillic"] });
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "AI Text Detector",
    template: "%s | AI Text Detector",
  },
  description:
    "Автоматизированная система обнаружения текстов, сгенерированных моделями ИИ, с фокусом на русско- и казахскоязычные корпуса.",
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased min-h-screen">
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}

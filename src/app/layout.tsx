import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import { DesignPlanProvider } from "@/lib/design-plan";
import { Header } from "@/components/layout/header";
import {
  ConditionalFooter,
  ConditionalMain,
  ConditionalMobileBottomNav,
} from "@/components/layout/conditional-chrome";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Habitus: Interior, scam-free",
  description:
    "AI design, verified contractor matching, and live tracking, all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LocaleProvider>
          <DesignPlanProvider>
            <Header />
            <ConditionalMain>{children}</ConditionalMain>
            <ConditionalFooter />
            <ConditionalMobileBottomNav />
          </DesignPlanProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--card)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                boxShadow: "var(--shadow-warm)",
              },
            }}
          />
        </LocaleProvider>
      </body>
    </html>
  );
}

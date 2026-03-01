import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/Nav";
import { AuthProvider } from "./AuthProvider";
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
  title: "ShopWave",
  description: "Modern e-commerce demo built with Next.js, Firebase, Stripe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-300 dark:bg-neutral-800`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <header>
              <Nav />
            </header>

            <main className="min-h-dvh pt-16">{children}</main>

            <footer className="mt-12 border-t border-black/10 dark:border-white/10">
              <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] px-4 py-6 text-sm text-black/60 dark:text-white/60 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <span>ShopWave © {new Date().getFullYear()}</span>
                <span>Next.js • Firebase • Stripe</span>
                <div className="flex gap-4">
                  <a
                    className="hover:underline"
                    href="https://github.com/aysen-tuna"
                    target="_blank"
                  >
                    GitHub
                  </a>
                  <a
                    className="hover:underline"
                    href="https://www.linkedin.com"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

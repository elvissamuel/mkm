"use client";

import { ThemeProvider } from "@/providers/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/navigation";
import { Footer } from "@/components/footer";
import ReactQueryProvider from "./react-query-context";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <title>Making Kings Mentorship</title>
      <meta name="description" content={"Making Kings Mentorship"} />
      </head>
      <body className={inter.className}>
        <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
             {!pathname.includes("admin") && <Navigation />}

              {children}

              {!pathname.includes("admin") && <Footer />}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
} 
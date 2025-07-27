import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast"
import { QueryProvider } from "@/components/query-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/components/cart-provider"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PartySlate - Find Your Perfect Venue",
  description: "Discover unique venues, vendors, and services for your special event",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <QueryProvider>
              <CartProvider>
                <SmoothScrollProvider>
                  {children}
                  <Toaster position="top-right" />
                </SmoothScrollProvider>
              </CartProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

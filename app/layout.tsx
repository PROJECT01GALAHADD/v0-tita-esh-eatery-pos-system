import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tita Esh Eatery POS System - Restaurant Management",
  description: "Complete restaurant management system for Tita Esh Eatery - POS, Orders, Inventory & More",
  generator: "v0.app",
  icons: {
    icon: "/app/tita-esh-logo.png",
    shortcut: "/app/tita-esh-logo.png",
    apple: "/app/tita-esh-logo.png",
  },
  manifest: "/app/manifest.json",
  themeColor: "#b91c1c",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tita Esh Eatery POS",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

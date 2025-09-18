import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/Sidebar"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "WEB-SSIS",
  description: "With Sidebar Layout",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Gradient as global background */}
        <div className="h-screen grid grid-cols-[300px_1fr] overflow-hidden bg-[radial-gradient(circle_at_15%_5%,_#3a3a4a_0%,_#1a1a1a_10%,_#000814_50%,_#000815_100%)]">
          {/* Sidebar glass */}
          <Sidebar />

          {/* Main content (transparent container on top of gradient) */}
          <main className="flex flex-col p-6 overflow-auto bg-transparent">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}



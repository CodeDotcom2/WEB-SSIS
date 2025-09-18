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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Full-page grid: sidebar + main content */}
        <div className="h-screen grid grid-cols-[300px_1fr] overflow-hidden">
          <Sidebar />

          {/* Main content flex column */}
          <main className="flex flex-col p-6 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

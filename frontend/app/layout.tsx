import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
        {/* Full-page grid: header + sidebar/content */}
        <div className="min-h-screen grid grid-rows-[60px_1fr]">
          {/* Header */}
          <header className="bg-blue-600 text-white flex items-center px-4">
            <h1 className="text-xl font-bold">Simple Student Information System</h1>
          </header>

          {/* Sidebar + main content */}
          <div className="grid grid-cols-[auto_1fr]">
            {/* Sidebar */}
            <aside className="bg-gray-100 p-4 flex flex-col gap-3">
              <Button asChild variant="blue">
                <Link href="/">Home</Link>
              </Button>
              <Button asChild variant="blue">
                <Link href="/students">Students</Link>
              </Button>
              <Button asChild variant="blue">
                <Link href="/colleges">Colleges</Link>
              </Button>
              <Button asChild variant="blue">
                <Link href="/programs">Programs</Link>
              </Button>
            </aside>

            {/* Page content */}
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

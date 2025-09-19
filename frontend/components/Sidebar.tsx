"use client"

import { User, University, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="glass p-4 pt-14 flex flex-col gap-6 shadow-lg">
      <h1 className="text-xl font-bold mb-15 text-center text-white">Student Information</h1>
      
      <Button className="p-8" asChild variant={pathname === "/dashboard/students" ? "blue" : "ghost"}>
        <Link href="/dashboard/students"><User className="mr-0 h-4 w-4" />Students</Link>
      </Button>

      <Button className="p-8" asChild variant={pathname === "/dashboard/colleges" ? "blue" : "ghost"}>
        <Link href="/dashboard/colleges"><University className="mr-0 h-4 w-4" />Colleges</Link>
      </Button>

      <Button className="p-8" asChild variant={pathname === "/dashboard/programs" ? "blue" : "ghost"}>
        <Link href="/dashboard/programs"><BookOpen className="mr-0 h-4 w-4" />Programs</Link>
      </Button>
    </aside>
  )
}

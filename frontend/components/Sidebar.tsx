"use client"

import { User, University, BookOpen} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-gray-100 p-4 pt-14 flex flex-col gap-6">
      <h1 className="text-xl font-bold mb-15 text-center">Student Information</h1>
      <Button asChild variant={pathname === "/students" ? "blue" : "outline"}>
        <Link href="/students"><User className="mr-0 h-4 w-4" />Students</Link>
      </Button>
      <Button asChild variant={pathname === "/colleges" ? "blue" : "outline"}>
        <Link href="/colleges"><University className="mr-0 h-4 w-4" />Colleges</Link>
      </Button>
      <Button asChild variant={pathname === "/programs" ? "blue" : "outline"}>
        <Link href="/programs"><BookOpen className="mr-0 h-4 w-4" />Programs</Link>
      </Button>
    </aside>
  )
}

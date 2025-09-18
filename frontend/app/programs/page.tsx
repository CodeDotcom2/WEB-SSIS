"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import AddProgramDialog from "@/components/AddProgram"

export default function ProgramsPage() {
  const [programs, setProgram] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`)
        const data = await res.json()
        setProgram(data.programs)
      } catch (err) {
        console.error("Error fetching programs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])



  return (
    <div className="h-screen flex flex-col bg-white">
      <main className="flex flex-col flex-1 p-6 gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Manage Programs</h1>

          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search program..."
              className="border rounded-lg pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="flex bg-gray-100 rounded-lg gap-3 p-4 items-center">
          <AddProgramDialog />
          <Button variant="blue" size="lg">Delete Student</Button>
          <Button variant="blue" size="lg">Edit Student</Button>
        </div>

        <div className="flex-1 bg-gray-100 rounded-lg overflow-auto p-4">
          <Table className="w-full table-auto">
            <TableCaption>All Program</TableCaption>
            <TableHeader>

              <TableRow>
                <TableHead>Program Code</TableHead>
                <TableHead>Program Name</TableHead>
                <TableHead>College Code</TableHead>
                <TableHead>Number of Students</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              ) : (
                programs.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>{p.code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.college_code}</TableCell>
                    <TableCell>{p.num_students}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

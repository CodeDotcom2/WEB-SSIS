"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  async function fetchPrograms() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/programs`)
      const data = await res.json()
      setPrograms(data.programs)
    } catch (err) {
      console.error("Error fetching programs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  // Simple search filter (program name, code, or college)
  const filteredPrograms = programs.filter(
    (p) =>
      p.program_code.toLowerCase().includes(search.toLowerCase()) ||
      p.program_name.toLowerCase().includes(search.toLowerCase()) ||
      p.college_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-col flex-1 p-6 gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-white text-3xl font-bold">Manage Programs</h1>

          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search programs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!text-slate-50 border rounded-lg pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="flex glass rounded-lg gap-3 p-4 items-center shadow-lg">
          <AddProgramDialog
            onAdd={async () => {
              setLoading(true)
              await fetchPrograms()
            }}
          />
          <Button variant="deleteEffect" size="lg">
            Delete Program
          </Button>
          <Button variant="editEffect" size="lg">
            Edit Program
          </Button>
        </div>

        <div className="flex-1 glass rounded-lg overflow-auto p-4 shadow-lg">
          <Table className="w-full table-auto border-collapse">
            <TableCaption>All Programs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="!text-slate-50">Program Code</TableHead>
                <TableHead className="!text-slate-50">Program Name</TableHead>
                <TableHead className="!text-slate-50">College</TableHead>
                <TableHead className="!text-slate-50">Number of Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-slate-300">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredPrograms.length > 0 ? (
                filteredPrograms.map((p, i) => (
                  <TableRow key={i} className="border-0">
                    <TableCell className="text-slate-200">{p.program_code}</TableCell>
                    <TableCell className="text-slate-200">{p.program_name}</TableCell>
                    <TableCell className="text-slate-200">{p.college_name}</TableCell>
                    <TableCell className="text-slate-200">{p.num_students}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-slate-300">
                    No programs found.
                  </TableCell>
                </TableRow>
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

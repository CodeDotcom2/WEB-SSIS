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
import AddCollegeDialog from "@/components/AddCollege"

export default function CollegesPage() {
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/colleges`)
        const data = await res.json()
        setColleges(data.colleges)
      } catch (err) {
        console.error("Error fetching colleges:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchColleges()
  }, [])

  // Simple search filter (future enhancement: debounce, API search)
  const filteredColleges = colleges.filter(
    (c) =>
      c.college_code.toLowerCase().includes(search.toLowerCase()) ||
      c.college_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-col flex-1 p-6 gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-white text-3xl font-bold">Manage Colleges</h1>

          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!text-slate-50 border rounded-lg pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="flex glass rounded-lg gap-3 p-4 items-center shadow-lg">
          <AddCollegeDialog />
          <Button variant="deleteEffect" size="lg">
            Delete College
          </Button>
          <Button variant="editEffect" size="lg">
            Edit College
          </Button>
        </div>

        <div className="flex-1 glass rounded-lg overflow-auto p-4 shadow-lg">
          <Table className="w-full table-auto border-collapse">
            <TableCaption>All Colleges</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="!text-slate-50">College Code</TableHead>
                <TableHead className="!text-slate-50">College Name</TableHead>
                <TableHead className="!text-slate-50">Number of Programs</TableHead>
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
              ) : filteredColleges.length > 0 ? (
                filteredColleges.map((c, i) => (
                  <TableRow key={i} className="border-0">
                    <TableCell className="text-slate-200">{c.college_code}</TableCell>
                    <TableCell className="text-slate-200">{c.college_name}</TableCell>
                    <TableCell className="text-slate-200">{c.num_programs}</TableCell>
                    <TableCell className="text-slate-200">{c.num_students}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-slate-300">
                    No colleges found.
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

"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import AddStudentDialog from "@/components/AddStudent"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("Sort By")
  const [order, setOrder] = useState("Ascending")
  const [search, setSearch] = useState("")

  async function fetchStudents() {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/students`)
      const data = await res.json()
      setStudents(Array.isArray(data) ? data : data.students || [])
    } catch (err) {
      console.error("Error fetching students:", err)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])


  const displayedStudents = students
    .filter(s =>
      `${s.first_name} ${s.last_name} ${s.id_number} ${s.program}`.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Sort By") return 0
      const fieldA = (a as any)[sortBy.toLowerCase().replace(" ", "_")]
      const fieldB = (b as any)[sortBy.toLowerCase().replace(" ", "_")]
      if (!fieldA || !fieldB) return 0
      if (order === "Ascending") return String(fieldA).localeCompare(String(fieldB))
      return String(fieldB).localeCompare(String(fieldA))
    })

  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-col flex-1 p-6 gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-white text-3xl font-bold">Manage Students</h1>

          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="!text-slate-50 border rounded-lg pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="flex glass rounded-lg gap-3 p-4 items-center shadow-lg">
          <AddStudentDialog onStudentAdded={() => fetchStudents()} />
        
          <Button variant="deleteEffect" size="lg">
            Delete Student
          </Button>
          <Button variant="editEffect" size="lg">
            Edit Student
          </Button>
        </div>

        <div className="flex-1 glass rounded-lg overflow-auto p-4 shadow-lg">
          <div className="flex gap-7 mb-2">
            {/* Sort By */}
            <DropdownMenu>
              <DropdownMenuTrigger className="whitespace-nowrap px-4 py-2 border rounded-md text-sm text-slate-100 border-white/10 bg-transparent">
                {sortBy}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["ID Number", "First Name", "Last Name", "Year Level", "Program"].map(option => (
                  <DropdownMenuItem key={option} onClick={() => setSortBy(option)}>
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Order */}
            <DropdownMenu>
              <DropdownMenuTrigger className="whitespace-nowrap px-4 py-2 border rounded-md text-sm text-slate-100 border-white/10 bg-transparent">
                {order}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Ascending", "Descending"].map(option => (
                  <DropdownMenuItem key={option} onClick={() => setOrder(option)}>
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Table className="w-full table-auto border-collapse">
            <TableCaption>All Students</TableCaption>
            <TableHeader>
              <TableRow>
                {["ID No.", "First Name", "Last Name", "Gender", "Year Level", "Program"].map(header => (
                  <TableHead key={header} className="!text-slate-50">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow className="border-0">
                  <TableCell colSpan={6} className="text-slate-300">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : displayedStudents.length === 0 ? (
                <TableRow className="border-0">
                  <TableCell colSpan={6} className="text-slate-300">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                displayedStudents.map((s, i) => (
                  <TableRow key={i} className="border-0">
                    <TableCell className="text-slate-200">{s.id_number}</TableCell>
                    <TableCell className="text-slate-200">{s.first_name}</TableCell>
                    <TableCell className="text-slate-200">{s.last_name}</TableCell>
                    <TableCell className="text-slate-200">{s.gender}</TableCell>
                    <TableCell className="text-slate-200">{s.year_level}</TableCell>
                    <TableCell className="text-slate-200">{s.program_code}</TableCell>
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

"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Pencil } from "lucide-react"
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
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage, setStudentsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("Sort By")
  const [order, setOrder] = useState("Ascending")
  const [search, setSearch] = useState("")

  // editing dialog
  const [editingStudent, setEditingStudent] = useState<any | null>(null)
  const [open, setOpen] = useState(false)

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

  async function deleteStudent(id_number: string) {
    if (!confirm(`Are you sure you want to delete student ${id_number}?`)) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/students/${id_number}`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchStudents()
      } else {
        const error = await res.json()
        alert(error.error || "Failed to delete student")
      }
    } catch (err) {
      console.error("Error deleting student:", err)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const displayedStudents = students
    .filter((s) =>
      `${s.first_name} ${s.last_name} ${s.id_number} ${s.program_code}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Sort By") return 0
      const fieldKey = sortBy.toLowerCase().replace(" ", "_")
      const fieldA = (a as any)[fieldKey]
      const fieldB = (b as any)[fieldKey]
      if (!fieldA || !fieldB) return 0
      if (order === "Ascending") return String(fieldA).localeCompare(String(fieldB))
      return String(fieldB).localeCompare(String(fieldA))
    })

  const totalPages = Math.ceil(displayedStudents.length / studentsPerPage)
  const paginatedStudents = displayedStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  )



  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-col flex-1 p-6 gap-6">
        {/* Header + Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-white text-3xl font-bold">Manage Students</h1>

          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!text-slate-50 border rounded-lg pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Add Student */}
        <div className="flex glass rounded-lg gap-3 p-4 items-center shadow-lg">
          <AddStudentDialog onStudentAdded={fetchStudents} />
        </div>

        {/* Table */}
        <div className="flex-1 glass rounded-lg overflow-auto p-4 shadow-lg">
          <div className="flex gap-2 mb-2">
            {/* Sort By */}
            <DropdownMenu>
              <DropdownMenuTrigger className="whitespace-nowrap px-4 py-2 border rounded-md text-sm text-slate-100 border-white/10 bg-transparent">
                {sortBy}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["ID Number", "First Name", "Last Name", "Year Level"].map((option) => (
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
                {["Ascending", "Descending"].map((option) => (
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
              <TableRow className="hover:bg-transparent">
                {["ID No.", "First Name", "Last Name", "Gender", "Year Level", "Program", "Actions"].map((header) => (
                  <TableHead key={header} className="!text-slate-50">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedStudents.map((s, i) => (
                <TableRow key={i} className="border-0 group hover:bg-zinc-700/70">
                  <TableCell className="text-slate-200">{s.id_number}</TableCell>
                  <TableCell className="text-slate-200">{s.first_name}</TableCell>
                  <TableCell className="text-slate-200">{s.last_name}</TableCell>
                  <TableCell className="text-slate-200">{s.gender}</TableCell>
                  <TableCell className="text-slate-200">{s.year_level}</TableCell>
                  <TableCell className="text-slate-200">{s.program_code}</TableCell>

                  {/* Actions */}
                  <TableCell className="flex gap-2 hover:bg-transparent">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingStudent(s)
                        setOpen(true)
                      }}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="deleteEffect"
                      size="sm"
                      onClick={() => deleteStudent(s.id_number)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Edit dialog */}
      {editingStudent && (
        <AddStudentDialog
          triggerButton={false}
          open={open}
          onOpenChange={setOpen}
          editingStudent={editingStudent}
          onStudentUpdated={() => {
            fetchStudents()
            setEditingStudent(null)
            setOpen(false)
          }}
        />
      )}

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) setCurrentPage(currentPage - 1)
              }}/>
          </PaginationItem>

      {[...Array(totalPages)].map((_, index) => (
        <PaginationItem key={index}>
          <PaginationLink
            href="#"
            isActive={currentPage === index + 1}
            onClick={(e) => {
              e.preventDefault()
              setCurrentPage(index + 1)
            }}
          >
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) setCurrentPage(currentPage + 1)
            }}
          />
        </PaginationItem>
        </PaginationContent>
    </Pagination>
    </div>
  )
}

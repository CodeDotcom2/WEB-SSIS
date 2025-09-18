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


  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`)
        const data = await res.json()
        setStudents(data.students)
      } catch (err) {
        console.error("Error fetching students:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  return (
    <div className="h-screen flex flex-col bg-white">
      <main className="flex flex-col flex-1 p-6 gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Manage Students</h1>

          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search students..."
              className="border rounded-lg pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="flex bg-gray-100 rounded-lg gap-3 p-4 items-center">
          <AddStudentDialog />
          <Button variant="blue" size="lg">Delete Student</Button>
          <Button variant="blue" size="lg">Edit Student</Button>
        </div>

        <div className="flex-1 bg-gray-100 rounded-lg overflow-auto p-4">
          <Table className="w-full table-auto">
            <TableCaption>All Students</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={6}>
                  <div className="flex gap-7 mb-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="whitespace-nowrap px-4 py-2 border rounded-md text-sm">
                        {sortBy}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSortBy("ID Number")}>
                          ID Number
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("Last Name")}>
                          Last Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("First Name")}>
                          First Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("Year Level")}>
                          Year Level
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("Program")}>
                          Program
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="whitespace-nowrap px-4 py-2 border rounded-md text-sm">
                        {order}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setOrder("Ascending")}>
                          Ascending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOrder("Descending")}>
                          Descending
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
              </TableRow>

              <TableRow>
                <TableHead>ID No.</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Year Level</TableHead>
                <TableHead>Program</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>Loading...</TableCell>
                </TableRow>
              ) : (
                students.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.first_name}</TableCell>
                    <TableCell>{s.last_name}</TableCell>
                    <TableCell>{s.gender}</TableCell>
                    <TableCell>{s.year_level}</TableCell>
                    <TableCell>{s.program}</TableCell>
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

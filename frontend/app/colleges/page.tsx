"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
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
  const [colleges, setCollege] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/colleges`)
        const data = await res.json()
        setCollege(data.colleges)
      } catch (err) {
        console.error("Error fetching colleges:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchColleges()
  }, [])

  return (
    <div className="h-screen flex flex-col bg-white">
      <main className="flex flex-col flex-1 p-6 gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Manage Colleges</h1>

          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search college..."
              className="border rounded-lg pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        <div className="flex bg-gray-100 rounded-lg gap-3 p-4 items-center">
          <AddCollegeDialog />
          <Button variant="blue" size="lg">Delete Student</Button>
          <Button variant="blue" size="lg">Edit Student</Button>
        </div>

        <div className="flex-1 bg-gray-100 rounded-lg overflow-auto p-4">
          <Table className="w-full table-auto">
            <TableCaption>All College</TableCaption>
            <TableHeader>

              <TableRow>
                <TableHead>College Code</TableHead>
                <TableHead>College Name</TableHead>
                <TableHead>Number of Programs</TableHead>
                <TableHead>Number of Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              ) : (
                colleges.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell>{c.code}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.num_program}</TableCell>
                    <TableCell>{c.num_students}</TableCell>
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

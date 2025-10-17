"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Pencil } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [currentPage, setCurrentPage] = useState(1)
  const [collegesPerPage, setCollegesPerPage] = useState(12)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editingCollege, setEditingCollege] = useState<any | null>(null)
  const [open, setOpen] = useState(false)
  const [sortBy, setSortBy] = useState("Sort By")
  const [order, setOrder] = useState("Ascending")

  async function fetchColleges() {
    setLoading(true)
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

  async function deleteCollege(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete college "${name}"?`)) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/colleges/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message)
        await fetchColleges()
      } else {
        alert(data.error || "Failed to delete college")
      }
    } catch (err) {
      console.error("Error deleting college:", err)
    }
  }

  useEffect(() => {
    fetchColleges()
  }, [])
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const filteredColleges = colleges
    .filter((c) => {
      const query = search.toLowerCase().trim()
      if (!query) return true
      return (
        c.college_code.toLowerCase().includes(query) ||
        c.college_name.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      if (sortBy === "Sort By") return 0
      const fieldKey = sortBy.toLowerCase().replace(" ", "_")
      const fieldA = (a as any)[fieldKey]
      const fieldB = (b as any)[fieldKey]
      if (!fieldA || !fieldB) return 0
      if (order === "Ascending") return String(fieldA).localeCompare(String(fieldB))
      return String(fieldB).localeCompare(String(fieldA))
    })
  
  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage)
  const paginatedColleges = filteredColleges.slice(
    (currentPage - 1) * collegesPerPage,
    currentPage * collegesPerPage
  )

  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-col flex-1 p-6 gap-6">
        {/* Header + Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-white text-3xl font-bold">Manage Colleges</h1>
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="!text-slate-50 border rounded-lg pl-10 pr-4 py-2 w-full bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Add Button */}
        <div className="flex glass rounded-lg gap-3 p-4 items-center shadow-lg">
          <AddCollegeDialog
            onCollegeAdded={fetchColleges}
            open={open && !editingCollege}
            onOpenChange={setOpen}
          />
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
                {["College Name", "College Code"].map((option) => (
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
            <TableHeader>
              <TableRow>
                <TableHead className="!text-slate-50">College Code</TableHead>
                <TableHead className="!text-slate-50">College Name</TableHead>
                <TableHead className="!text-slate-50">Number of Programs</TableHead>
                <TableHead className="!text-slate-50">Number of Students</TableHead>
                <TableHead className="!text-slate-50 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-slate-300 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedColleges.length > 0 ? (
                paginatedColleges.map((c, i) => (
                  <TableRow key={i} className="border-0 group hover:bg-zinc-700/70">
                    <TableCell className="text-slate-200">{c.college_code}</TableCell>
                    <TableCell className="text-slate-200">{c.college_name}</TableCell>
                    <TableCell className="text-slate-200">{c.num_programs}</TableCell>
                    <TableCell className="text-slate-200">{c.num_students}</TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      {/* Edit Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-200"
                        onClick={() => {
                          setEditingCollege(c)
                          setOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="deleteEffect"
                        size="sm"
                        onClick={() => deleteCollege(c.id, c.college_name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-slate-300 text-center">
                    No colleges found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

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
              className={`${
                currentPage === index + 1
                  ? "text-black font-semibold" // active page color
                  : "text-gray-300" // inactive pages
              }`}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>))}
          
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

      {/* Reuse AddCollegeDialog for editing */}
      {editingCollege && (
        <AddCollegeDialog
          editingCollege={editingCollege}
          onCollegeUpdated={fetchColleges}
          open={open}
          onOpenChange={(o) => {
            if (!o) setEditingCollege(null)
            setOpen(o)
          }}
          triggerButton={false} 
        />
      )}
    </div>
  )
}

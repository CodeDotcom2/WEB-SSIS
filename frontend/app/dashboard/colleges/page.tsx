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
  const [editingCollege, setEditingCollege] = useState<any | null>(null)
  const [open, setOpen] = useState(false)

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

  const filteredColleges = colleges.filter(
    (c) =>
      c.college_code.toLowerCase().includes(search.toLowerCase()) ||
      c.college_name.toLowerCase().includes(search.toLowerCase())
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
          <Table className="w-full table-auto border-collapse">
            <TableCaption>All Colleges</TableCaption>
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
              ) : filteredColleges.length > 0 ? (
                filteredColleges.map((c, i) => (
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

"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AddProgramDialog from "@/components/AddProgram";

import { useAuth } from "@/app/contexts/AuthContext";
import { useNotification } from "@/app/contexts/NotificationContext";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [programsPerPage, setProgramsPage] = useState(12);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Sort By");
  const [order, setOrder] = useState("Ascending");

  const { token, logoutUser } = useAuth();
  const { notify, confirm } = useNotification();

  // editing dialog
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  async function fetchPrograms() {
    setLoading(true);

    if (!token) {
      setLoading(false);
      console.error("Token missing for protected route.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/programs`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        console.error("Token expired or invalid. Logging out.");
        notify("Session expired. Please log in again.", { type: "error" });
        logoutUser();
        return;
      }

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error("fetchPrograms non-OK response:", res.status, errBody);
        setPrograms([]);
        return;
      }

      const data = await res.json();
      const programsList = Array.isArray(data.programs)
        ? data.programs
        : Array.isArray(data)
        ? data
        : [];
      setPrograms(programsList);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProgram(id: number, name: string) {
    const ok = await confirm(
      `Are you sure you want to delete program "${name}"?`
    );
    if (!ok) return;

    if (!token) {
      notify("Authentication required to delete program.", { type: "error" });
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/programs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        console.error("Token expired or invalid during delete. Logging out.");
        notify("Session expired. Please log in again.", { type: "error" });
        logoutUser();
        return;
      }

      const data = await res.json();
      if (res.ok) {
        notify(data.message || "Program deleted successfully!", {
          type: "success",
        });
        await fetchPrograms();
      } else {
        notify(data.error || "Failed to delete program", { type: "error" });
      }
    } catch (err) {
      console.error("Error deleting program:", err);
      alert("Network error during deletion.");
    }
  }

  useEffect(() => {
    if (token) {
      fetchPrograms();
    }
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredPrograms = programs
    .filter((p) => {
      const query = search.toLowerCase().trim();
      if (!query) return true;
      return (
        p.program_code.toLowerCase().includes(search.toLowerCase()) ||
        p.program_name.toLowerCase().includes(search.toLowerCase()) ||
        (p.college_name &&
          p.college_name.toLowerCase().includes(search.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (sortBy === "Sort By") return 0;
      const fieldKey = sortBy.toLowerCase().replace(" ", "_");
      const fieldA = (a as any)[fieldKey];
      const fieldB = (b as any)[fieldKey];
      if (!fieldA || !fieldB) return 0;
      if (order === "Ascending")
        return String(fieldA).localeCompare(String(fieldB));
      return String(fieldB).localeCompare(String(fieldA));
    });

  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * programsPerPage,
    currentPage * programsPerPage
  );

  return (
    <div className="h-screen flex flex-col">
      <main className="flex flex-col flex-1 p-6 gap-6">
        {/* Header + Search */}
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

        {/* Add Program */}
        <div className="flex glass rounded-lg gap-3 p-4 items-center shadow-lg">
          <AddProgramDialog onProgramAdded={fetchPrograms} />
          <span>Total Programs: {programs.length}</span>
        </div>

        {/* Table */}
        <div className="flex-1 glass rounded-lg overflow-auto p-4 shadow-lg">
          <div className="flex gap-2 mb-2">
            {/* Sort By */}
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer whitespace-nowrap px-4 py-2 border rounded-md text-sm text-slate-100 border-white/10 bg-transparent">
                {sortBy}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Program Name", "Program Code"].map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setSortBy(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Order */}
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer whitespace-nowrap px-4 py-2 border rounded-md text-sm text-slate-100 border-white/10 bg-transparent">
                {order}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Ascending", "Descending"].map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setOrder(option)}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Table className="w-full table-auto border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="!text-slate-50">Program Code</TableHead>
                <TableHead className="!text-slate-50">Program Name</TableHead>
                <TableHead className="!text-slate-50">College</TableHead>
                <TableHead className="!text-slate-50">
                  Number of Students
                </TableHead>
                <TableHead className="!text-slate-50">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-slate-300">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedPrograms.length > 0 ? (
                paginatedPrograms.map((p, i) => (
                  <TableRow
                    key={i}
                    className="cursor-pointer border-0 group hover:bg-zinc-700/70"
                  >
                    <TableCell className="text-slate-200">
                      {p.program_code}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {p.program_name}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {p.college_name}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {p.num_students}
                    </TableCell>
                    <TableCell className="flex gap-2 hover:bg-transparent">
                      {/* Edit button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProgram(p);
                          setOpen(true);
                        }}
                        className="cursor-pointer flex items-center gap-1 text-blue-400 hover:text-blue-200"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete button */}
                      <Button
                        variant="deleteEffect"
                        size="sm"
                        onClick={() => deleteProgram(p.id, p.program_name)}
                        className="cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-slate-300">
                    No programs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Edit dialog */}
      {editingProgram && (
        <AddProgramDialog
          triggerButton={false}
          open={open}
          onOpenChange={setOpen}
          editingProgram={editingProgram}
          onProgramUpdated={() => {
            fetchPrograms();
            setEditingProgram(null);
            setOpen(false);
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
                e.preventDefault();
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
            />
          </PaginationItem>

          {(() => {
            const pageNumbers = [];
            const maxVisible = 4;
            let startPage = Math.max(
              1,
              currentPage - Math.floor(maxVisible / 2)
            );
            let endPage = startPage + maxVisible - 1;

            if (endPage > totalPages) {
              endPage = totalPages;
              startPage = Math.max(1, endPage - maxVisible + 1);
            }

            if (startPage > 1) {
              pageNumbers.push(
                <PaginationItem key={1}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              );

              if (startPage > 2) {
                pageNumbers.push(
                  <PaginationItem key="start-ellipsis">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
            }

            for (let i = startPage; i <= endPage; i++) {
              pageNumbers.push(
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i);
                    }}
                    className={`${
                      currentPage === i
                        ? "text-black font-semibold"
                        : "text-gray-300"
                    }`}
                  >
                    {i}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pageNumbers.push(
                  <PaginationItem key="end-ellipsis">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              pageNumbers.push(
                <PaginationItem key={totalPages}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === totalPages}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            return pageNumbers;
          })()}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

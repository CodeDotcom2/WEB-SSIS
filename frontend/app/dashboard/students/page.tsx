"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Pencil, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AddStudentDialog from "@/components/AddStudent";
import { useAuth } from "@/app/contexts/AuthContext";
import { useNotification } from "@/app/contexts/NotificationContext";
import { supabase } from "@/lib/supabaseClient";

interface FilterState {
  college_id: string;
  program_id: string;
  gender: string;
  year_level: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [yearLevels, setYearLevels] = useState<number[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(11);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Sort By");
  const [order, setOrder] = useState("Ascending");
  const [search, setSearch] = useState("");
  const { token, logoutUser } = useAuth();
  const { notify, confirm } = useNotification();

  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [open, setOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    college_id: "",
    program_id: "",
    gender: "",
    year_level: "",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/students`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        console.error("Token expired or invalid. Logging out.");
        logoutUser();
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const studentData = Array.isArray(data) ? data : data.students || [];
      setAllStudents(studentData);
      setStudents(studentData);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
      setAllStudents([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchColleges() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/colleges`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch colleges");

      const data = await res.json();
      setColleges(data.colleges ?? data ?? []);
    } catch (err) {
      console.error("Error fetching colleges:", err);
      setColleges([]);
    }
  }

  async function fetchPrograms() {
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

      if (!res.ok) throw new Error("Failed to fetch programs");

      const data = await res.json();
      setPrograms(data.programs ?? data ?? []);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setPrograms([]);
    }
  }

  async function fetchYearLevels() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/students/year-levels`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const text = await res.text();

      if (!res.ok) {
        console.error("Year levels API error:", res.status, text);
        throw new Error("Failed to fetch year levels");
      }

      const data = JSON.parse(text);
      setYearLevels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching year levels:", err);
      setYearLevels([]);
    }
  }

  async function fetchGenders() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/students/genders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch genders");

      const data = await res.json();
      setGenders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching genders:", err);
      setGenders([]);
    }
  }

  useEffect(() => {
    if (token) {
      fetchStudents();
      fetchColleges();
      fetchPrograms();
      fetchYearLevels();
      fetchGenders();
    }
  }, [token]);

  useEffect(() => {
    if (filters.college_id && filters.program_id) {
      const selectedProgram = programs.find(
        (p) => p.id?.toString() === filters.program_id.toString()
      );
      if (
        selectedProgram &&
        selectedProgram.college_id?.toString() !== filters.college_id.toString()
      ) {
        setFilters((prev) => ({ ...prev, program_id: "" }));
      }
    }
  }, [filters.college_id, filters.program_id, programs]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allStudents];

    if (filters.college_id) {
      filtered = filtered.filter(
        (s) => s.college_id?.toString() === filters.college_id.toString()
      );
    }
    if (filters.program_id) {
      filtered = filtered.filter(
        (s) => s.program_id?.toString() === filters.program_id.toString()
      );
    }
    if (filters.gender) {
      filtered = filtered.filter(
        (s) => s.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }
    if (filters.year_level) {
      filtered = filtered.filter(
        (s) => s.year_level?.toString() === filters.year_level.toString()
      );
    }

    setStudents(filtered);
    setCurrentPage(1);
  }, [filters, allStudents]);

  // Update active filters list
  useEffect(() => {
    const active: string[] = [];
    if (filters.college_id) {
      const college = colleges.find(
        (c) => c.id?.toString() === filters.college_id.toString()
      );
      active.push(`College: ${college?.college_name || "Unknown"}`);
    }
    if (filters.program_id) {
      const program = programs.find(
        (p) => p.id?.toString() === filters.program_id.toString()
      );
      active.push(`Program: ${program?.program_name || "Unknown"}`);
    }
    if (filters.gender) {
      active.push(`Gender: ${filters.gender}`);
    }
    if (filters.year_level) {
      active.push(`Year Level: ${filters.year_level}`);
    }
    setActiveFilters(active);
  }, [filters, colleges, programs]);

  async function deleteStudent(id_number: string) {
    const ok = await confirm(
      `Are you sure you want to delete student ${id_number}?`
    );
    if (!ok) return;
    if (!token) {
      notify("Authentication required to delete student data.", {
        type: "error",
      });
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/students/${id_number}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401) {
        console.error("Token expired or invalid during delete. Logging out.");
        logoutUser();
        return;
      }

      if (res.ok) {
        try {
          const student = students.find((s) => s.id_number === id_number);
          if (student?.photo_url) {
            const extractFilePath = (url?: string | null) => {
              if (!url) return null;
              try {
                const u = new URL(url);
                const parts = u.pathname.split("/");
                const idx = parts.findIndex((p) => p === "student-avatars");
                if (idx >= 0) return parts.slice(idx + 1).join("/");
                return parts.pop() || null;
              } catch (e) {
                const segs = url.split("/");
                return segs.pop() || null;
              }
            };

            const filePath = extractFilePath(student.photo_url);
            if (filePath) {
              const { error } = await supabase.storage
                .from("student-avatars")
                .remove([filePath]);
              if (error) console.warn("Failed to remove student photo:", error);
            }
          }
        } catch (err) {
          console.warn("Error deleting student photo:", err);
        }

        fetchStudents();
        fetchYearLevels();
        fetchGenders();
      } else {
        const error = await res.json();
        notify(error.error || "Failed to delete student", { type: "error" });
      }
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  }

  const clearAllFilters = () => {
    setFilters({
      college_id: "",
      program_id: "",
      gender: "",
      year_level: "",
    });
  };

  const removeFilter = (filterKey: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [filterKey]: "" }));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, order]);

  const displayedStudents = students
    .filter((s) => {
      const query = search.toLowerCase().trim();
      if (!query) return true;

      const yearLevelMap: Record<string, string> = {
        "1": "1",
        "1st": "1",
        first: "1",
        "1st year": "1",
        "2": "2",
        "2nd": "2",
        second: "2",
        "2nd year": "2",
        "3": "3",
        "3rd": "3",
        third: "3",
        "3rd year": "3",
        "4": "4",
        "4th": "4",
        fourth: "4",
        "4th year": "4",
      };

      const genderMatch =
        ["male", "female", "others"].includes(query) &&
        s.gender.toLowerCase() === query;

      const mappedYear = yearLevelMap[query];
      const yearLevelMatch =
        mappedYear && s.year_level.toString() === mappedYear;

      const generalMatch = `${s.first_name} ${s.last_name} ${s.id_number} ${
        s.program_code
      } ${s.program_name || ""} ${s.college_name || ""}`
        .toLowerCase()
        .includes(query);

      return genderMatch || generalMatch || yearLevelMatch;
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

  const totalPages = Math.ceil(displayedStudents.length / studentsPerPage);
  const paginatedStudents = displayedStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  // Helper function to get year level label
  const getYearLevelLabel = (level: number) => {
    const labels: Record<number, string> = {
      1: "1st Year",
      2: "2nd Year",
      3: "3rd Year",
      4: "4th Year",
    };
    return labels[level] || `${level}th Year`;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex flex-col flex-1 p-6 gap-6 overflow-y-auto">
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
          <AddStudentDialog
            onStudentAdded={() => {
              fetchStudents();
              fetchYearLevels();
              fetchGenders();
            }}
          />
          <span>Total Students: {allStudents.length}</span>
          <span className="text-gray-400">
            | Showing: {displayedStudents.length}
          </span>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="glass rounded-lg p-3 shadow-lg">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold text-slate-200">
                Active Filters:
              </span>
              {activeFilters.map((filter, idx) => {
                const filterKey = Object.keys(filters).find((key) => {
                  const value = filters[key as keyof FilterState];
                  return value && filter.includes(value);
                });
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-blue-600/30 border border-blue-400/50 rounded-full px-3 py-1 text-sm text-slate-100"
                  >
                    <span>{filter}</span>
                    <button
                      onClick={() =>
                        removeFilter(filterKey as keyof FilterState)
                      }
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="glass rounded-lg p-4 shadow-lg">
          <div className="flex gap-2 mb-2 flex-wrap">
            {/* Sort By */}
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer whitespace-nowrap px-4 py-2 border rounded-md text-sm text-slate-100 border-white/10 bg-transparent">
                {sortBy}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["ID Number", "First Name", "Last Name", "Year Level"].map(
                  (option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setSortBy(option)}
                    >
                      {option}
                    </DropdownMenuItem>
                  )
                )}
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

            {/* Multi-Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer whitespace-nowrap px-4 py-2 border rounded-md text-sm text-slate-100 border-white/10 bg-transparent flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter By
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-3 max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {/* College Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      College
                    </label>
                    <select
                      value={filters.college_id}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          college_id: e.target.value,
                        }))
                      }
                      className="cursor-pointer w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="">All Colleges</option>
                      {colleges.map((college) => (
                        <option key={college.id} value={college.id}>
                          {college.college_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Program Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Program
                    </label>
                    <select
                      value={filters.program_id}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          program_id: e.target.value,
                        }))
                      }
                      className="cursor-pointer w-full px-2 py-1 border rounded text-sm"
                      disabled={!programs.length}
                    >
                      <option value="">All Programs</option>
                      {programs
                        .filter((program) => {
                          if (filters.college_id) {
                            return (
                              program.college_id?.toString() ===
                              filters.college_id.toString()
                            );
                          }
                          return true;
                        })
                        .map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.program_name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Gender Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Gender
                    </label>
                    <select
                      value={filters.gender}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className="cursor-pointer w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="">All Genders</option>
                      {genders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Level Filter */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Year Level
                    </label>
                    <select
                      value={filters.year_level}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          year_level: e.target.value,
                        }))
                      }
                      className="cursor-pointer w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="">All Years</option>
                      {yearLevels.map((level) => (
                        <option key={level} value={level}>
                          {getYearLevelLabel(level)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full table-auto border-collapse">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {[
                    "ID No.",
                    "First Name",
                    "Last Name",
                    "Gender",
                    "Year Level",
                    "Program",
                    "Actions",
                  ].map((header) => (
                    <TableHead key={header} className="!text-slate-50">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedStudents.map((s, i) => (
                  <TableRow
                    key={i}
                    className="border-0 group hover:bg-zinc-700/70 cursor-pointer"
                    onClick={() => {
                      setEditingStudent(s);
                      setViewMode(true);
                      setOpen(true);
                    }}
                  >
                    <TableCell className="text-slate-200">
                      {s.id_number}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {s.first_name}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {s.last_name}
                    </TableCell>
                    <TableCell className="text-slate-200">{s.gender}</TableCell>
                    <TableCell className="text-slate-200">
                      {s.year_level}
                    </TableCell>
                    <TableCell className="text-slate-200">
                      {s.program_code}
                    </TableCell>

                    <TableCell
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingStudent(s);
                          setViewMode(false);
                          setOpen(true);
                        }}
                        className="cursor-pointer flex items-center gap-1 text-blue-400 hover:text-blue-200"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="deleteEffect"
                        size="sm"
                        onClick={() => deleteStudent(s.id_number)}
                        className="cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

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
      </main>

      {/* DIALOG */}
      {editingStudent && (
        <AddStudentDialog
          triggerButton={false}
          open={open}
          onOpenChange={setOpen}
          editingStudent={editingStudent}
          viewOnly={viewMode}
          onStudentUpdated={() => {
            fetchStudents();
            fetchYearLevels();
            fetchGenders();
            setEditingStudent(null);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

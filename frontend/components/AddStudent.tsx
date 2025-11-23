"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddStudentDialog({
  onStudentAdded,
  onStudentUpdated,
  editingStudent,
  triggerButton = true,
  open,
  onOpenChange,
}: {
  onStudentAdded?: () => void;
  onStudentUpdated?: () => void;
  editingStudent?: any;
  triggerButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [colleges, setColleges] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    id_number: "",
    gender: "",
    year_level: "",
    college_id: "",
    program_id: "",
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // populate when editing
  useEffect(() => {
    if (editingStudent) {
      setFormData({
        last_name: editingStudent.last_name || "",
        first_name: editingStudent.first_name || "",
        id_number: editingStudent.id_number || "",
        gender: editingStudent.gender || "",
        year_level: editingStudent.year_level || "",
        college_id: editingStudent.college_id || "",
        program_id: editingStudent.program_id || "",
      });
      setIsInitialLoad(true);
    } else {
      setFormData({
        last_name: "",
        first_name: "",
        id_number: "",
        gender: "",
        year_level: "",
        college_id: "",
        program_id: "",
      });
      setIsInitialLoad(true);
    }
  }, [editingStudent]);

  // fetch dropdown data
  useEffect(() => {
    async function fetchData() {
      try {
        const collegeRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/colleges`
        );
        const programRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/programs`
        );
        const collegeData = await collegeRes.json();
        const programData = await programRes.json();

        setColleges(collegeData.colleges || collegeData);
        setPrograms(programData.programs || programData);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    }
    fetchData();
  }, []);

  // filter programs by college
  useEffect(() => {
    if (!programs.length) return;

    const filtered = formData.college_id
      ? programs.filter(
          (p) => String(p.college_id) === String(formData.college_id)
        )
      : [];

    setFilteredPrograms(filtered);

    // Don’t clear program_id during edit load
    if (isInitialLoad) {
      setIsInitialLoad(false);
    } else {
      // Only clear if the user *manually* changes the college
      setFormData((prev) => ({
        ...prev,
        program_id: filtered.find(
          (p) => String(p.id) === String(prev.program_id)
        )
          ? prev.program_id
          : "",
      }));
    }
  }, [formData.college_id, programs]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;
    const idRegex = /^\d{4}-\d{4}$/;

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        alert("All fields are required.");
        return;
      }
    }

    if (
      !nameRegex.test(formData.first_name) ||
      !nameRegex.test(formData.last_name)
    ) {
      alert(
        "Names should only contain letters and spaces (no numbers or symbols)."
      );
      return;
    }

    if (!idRegex.test(formData.id_number)) {
      alert("ID Number must be in the format XXXX-XXXX (e.g. 2025-0001).");
      return;
    }

    try {
      const url = editingStudent
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/students/${editingStudent.id_number}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/students`;

      const method = editingStudent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add student.");
        return;
      }

      alert(data.message || "Student added successfully!");

      // Reset form after adding
      if (!editingStudent) {
        setFormData({
          last_name: "",
          first_name: "",
          id_number: "",
          gender: "",
          year_level: "",
          college_id: "",
          program_id: "",
        });
        onStudentAdded && onStudentAdded();
      } else {
        onStudentUpdated && onStudentUpdated();
      }

      // Close dialog
      onOpenChange?.(false);
    } catch (err) {
      console.error("Error saving student:", err);
      alert("Something went wrong while saving the student.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && (
        <DialogTrigger asChild>
          <Button variant="blue" size="lg">
            <UserRoundPlus className="w-5 h-5" />
            Add Student
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="glass2 sm:max-w-fit">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingStudent ? "Edit Student" : "Add Student"}
          </DialogTitle>
          <DialogDescription>
            {editingStudent
              ? "Update the details below to edit the student."
              : "Fill in the details below to add a new student."}
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              type="text"
              placeholder="Last Name"
              required
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white"
            />
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              required
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white"
            />
          </div>

          <input
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            type="text"
            placeholder="ID Number"
            required
            disabled={!!editingStudent}
            className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-white"
          />

          <div className="flex gap-2">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 min-w-[180px] bg-transparent text-gray-400 invalid:text-gray-400 valid:text-white"
            >
              <option value="" disabled hidden>
                Select Gender
              </option>
              <option className="bg-gray-900 text-white" value="Male">
                Male
              </option>
              <option className="bg-gray-900 text-white" value="Female">
                Female
              </option>
            </select>

            <select
              name="year_level"
              value={formData.year_level}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 min-w-[180px] bg-transparent text-gray-400 invalid:text-gray-400 valid:text-white"
            >
              <option value="" disabled hidden>
                Select Year Level
              </option>
              <option className="bg-gray-900 text-white" value="1">
                1st Year
              </option>
              <option className="bg-gray-900 text-white" value="2">
                2nd Year
              </option>
              <option className="bg-gray-900 text-white" value="3">
                3rd Year
              </option>
              <option className="bg-gray-900 text-white" value="4">
                4th Year
              </option>
            </select>
          </div>

          <div className="flex gap-2">
            <select
              name="college_id"
              value={formData.college_id}
              onChange={(e) => {
                setIsInitialLoad(false);
                setFormData({
                  ...formData,
                  college_id: e.target.value,
                  program_id: "",
                });
              }}
              required
              className="border border-gray-400 rounded-lg px-4 py-2 w-60 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white"
            >
              <option
                className="bg-gray-900 text-white"
                value=""
                disabled
                hidden
              >
                Select College
              </option>
              {colleges.map((c: any) => (
                <option
                  key={c.id}
                  value={c.id}
                  className="bg-gray-900 text-white"
                >
                  {c.college_name}
                </option>
              ))}
            </select>

            <select
              name="program_id"
              value={formData.program_id}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-lg px-4 py-2 w-60 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white"
            >
              <option
                value=""
                disabled
                hidden
                className="bg-gray-900 text-white"
              >
                Select Program
              </option>
              {filteredPrograms.map((p: any) => (
                <option
                  key={p.id}
                  value={p.id}
                  className="bg-gray-900 text-white"
                >
                  {p.program_name}
                </option>
              ))}
            </select>
          </div>

          <Button variant="blue" type="submit" className="self-end">
            {editingStudent ? "Update" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

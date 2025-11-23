"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddProgramDialog({
  onProgramAdded,
  onProgramUpdated,
  editingProgram,
  triggerButton = true,
  open,
  onOpenChange,
}: {
  onProgramAdded?: () => void;
  onProgramUpdated?: () => void;
  editingProgram?: any;
  triggerButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [colleges, setColleges] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    program_name: "",
    program_code: "",
    college_id: "",
  });
  const [loading, setLoading] = useState(false);

  // populate when editing
  useEffect(() => {
    if (editingProgram) {
      setFormData({
        program_name: editingProgram.program_name || "",
        program_code: editingProgram.program_code || "",
        college_id: editingProgram.college_id?.toString() || "",
      });
    }
  }, [editingProgram]);

  // fetch colleges
  useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/colleges`
        );
        const data = await res.json();
        setColleges(data.colleges || []);
      } catch (err) {
        console.error("Error fetching colleges:", err);
      }
    }
    fetchColleges();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !formData.program_name ||
      !formData.program_code ||
      !formData.college_id
    )
      return;
    setLoading(true);

    const method = editingProgram ? "PUT" : "POST";
    const url = editingProgram
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/programs/${editingProgram.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/programs`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          college_id: parseInt(formData.college_id, 10),
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        console.warn("⚠️ Response is not JSON");
      }
      if (!res.ok) {
        alert(data.error || "Failed to add program.");
        return;
      }

      alert(data.message || "Program added successfully!");

      if (editingProgram) {
        onProgramUpdated && onProgramUpdated();
      } else {
        setFormData({ program_name: "", program_code: "", college_id: "" });
        onProgramAdded && onProgramAdded();
      }

      onOpenChange?.(false); // close after success
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert(
        "Something went wrong. Please check your connection or the console for details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && (
        <DialogTrigger asChild>
          <Button variant="blue" size="lg">
            <Plus className="w-5 h-5" /> Add Program
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="glass2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingProgram ? "Edit Program" : "Add Program"}
          </DialogTitle>
          <DialogDescription>
            {editingProgram
              ? "Update the details of the program."
              : "Fill in the details below to add a new program."}
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="program_name"
            value={formData.program_name}
            onChange={handleChange}
            type="text"
            placeholder="Program Name"
            className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-white"
          />
          <input
            name="program_code"
            value={formData.program_code}
            onChange={handleChange}
            type="text"
            placeholder="Program Code"
            className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-white"
          />
          <select
            name="college_id"
            value={formData.college_id}
            onChange={handleChange}
            required
            className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-gray-400 invalid:text-gray-400 valid:text-white"
          >
            <option value="" disabled hidden>
              Select College
            </option>
            {colleges.map((c) => (
              <option
                key={c.id}
                value={c.id}
                className="bg-gray-900 text-white"
              >
                {c.college_name}
              </option>
            ))}
          </select>
          <Button variant="blue" type="submit" disabled={loading}>
            {loading ? "Saving..." : editingProgram ? "Update" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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

export default function AddCollegeDialog({
  onCollegeAdded,
  onCollegeUpdated,
  editingCollege,
  triggerButton = true,
  open,
  onOpenChange,
}: {
  onCollegeAdded?: () => void;
  onCollegeUpdated?: () => void;
  editingCollege?: any;
  triggerButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    college_name: "",
    college_code: "",
  });
  const [loading, setLoading] = useState(false);

  // populate when editing
  useEffect(() => {
    if (editingCollege) {
      setFormData({
        college_name: editingCollege.college_name || "",
        college_code: editingCollege.college_code || "",
      });
    } else {
      setFormData({ college_name: "", college_code: "" });
    }
  }, [editingCollege]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.college_name || !formData.college_code) return;
    setLoading(true);

    const method = editingCollege ? "PUT" : "POST";
    const url = editingCollege
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/colleges/${editingCollege.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/colleges`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college_code: formData.college_code,
          college_name: formData.college_name,
        }),
      });

      console.log("🔍 Response status:", res.status);

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        console.warn("⚠️ Response is not JSON");
      }
      console.log("🔍 Response body:", data);

      if (!res.ok) {
        alert(data.error || "Failed to add college.");
        return;
      }

      alert(data.message || "College added successfully!");

      if (editingCollege) {
        onCollegeUpdated?.();
      } else {
        setFormData({ college_name: "", college_code: "" });
        onCollegeAdded?.();
      }

      onOpenChange?.(false);
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
            <Plus className="w-5 h-5" /> Add College
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="glass2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingCollege ? "Edit College" : "Add College"}
          </DialogTitle>
          <DialogDescription>
            {editingCollege
              ? "Update the details of the college."
              : "Fill in the details below to add a new college."}
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="college_name"
            value={formData.college_name}
            onChange={handleChange}
            type="text"
            placeholder="College Name"
            className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-white"
          />
          <input
            name="college_code"
            value={formData.college_code}
            onChange={handleChange}
            type="text"
            placeholder="College Code"
            className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-white"
          />
          <Button variant="blue" type="submit" disabled={loading}>
            {loading ? "Saving..." : editingCollege ? "Update" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

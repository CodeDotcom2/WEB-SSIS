"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRoundPlus, Camera, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/app/contexts/AuthContext";
import { useNotification } from "@/app/contexts/NotificationContext";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function AddStudentDialog({
  onStudentAdded,
  onStudentUpdated,
  editingStudent,
  triggerButton = true,
  open,
  onOpenChange,
  viewOnly = false,
}: {
  onStudentAdded?: () => void;
  onStudentUpdated?: () => void;
  editingStudent?: any;
  triggerButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  viewOnly?: boolean;
}) {
  const { token } = useAuth();
  const { notify, confirm } = useNotification();

  const [internalOpen, setInternalOpen] = useState(false);
  const dialogOpen = typeof open === "boolean" ? open : internalOpen;
  const handleOpenChange = (v: boolean) => {
    if (typeof onOpenChange === "function") onOpenChange(v);
    else setInternalOpen(v);
  };

  const [colleges, setColleges] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);

  const [isViewMode, setIsViewMode] = useState(viewOnly);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  function extractFilePath(url?: string | null) {
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
  }

  async function handleDeletePhoto() {
    const ok = await confirm("Are you sure you want to delete this photo?");
    if (!ok) return;
    const filePath = extractFilePath(formData.photo_url);
    if (!filePath) {
      notify("Could not determine photo path.", { type: "error" });
      return;
    }
    try {
      const { error } = await supabase.storage
        .from("student-avatars")
        .remove([filePath]);
      if (error) throw error;
      notify("Photo deleted.", { type: "success" });
      setFormData((prev) => ({ ...prev, photo_url: "" }));
      setImagePreview(null);
      setSelectedFile(null);
    } catch (err) {
      console.error("Error deleting photo:", err);
      notify("Failed to delete photo.", { type: "error" });
    }
  }

  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    id_number: "",
    gender: "",
    year_level: "",
    college_id: "",
    program_id: "",
    photo_url: "",
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setIsViewMode(viewOnly);
  }, [viewOnly, open]);

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
        photo_url: editingStudent.photo_url || "",
      });

      if (editingStudent.photo_url) {
        setImagePreview(editingStudent.photo_url);
      } else {
        setImagePreview(null);
      }
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
        photo_url: "",
      });
      setImagePreview(null);
      setSelectedFile(null);
      setIsInitialLoad(true);
    }
  }, [editingStudent, open]);

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        console.error("Cannot fetch dropdown data: No token available.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const collegeRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/colleges`,
          { headers }
        );
        const programRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/programs`,
          { headers }
        );
        const collegeData = await collegeRes.json();
        const programData = await programRes.json();

        const collegesList = Array.isArray(collegeData.colleges)
          ? collegeData.colleges
          : Array.isArray(collegeData)
          ? collegeData
          : [];

        const programsList = Array.isArray(programData.programs)
          ? programData.programs
          : Array.isArray(programData)
          ? programData
          : [];

        setColleges(collegesList);
        setPrograms(programsList);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    }
    if (dialogOpen && token) {
      fetchData();
    }
  }, [token, dialogOpen]);

  useEffect(() => {
    if (!programs.length) return;

    const filtered = formData.college_id
      ? programs.filter(
          (p) => String(p.college_id) === String(formData.college_id)
        )
      : [];

    setFilteredPrograms(filtered);

    if (isInitialLoad) {
      setIsInitialLoad(false);
    } else {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

      if (!validTypes.includes(file.type)) {
        notify("Invalid file type. Please upload a JPG, PNG, or WEBP image.", {
          type: "error",
        });
        e.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        notify("File size too large. Please select an image under 5MB.", {
          type: "error",
        });
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isViewMode) return;

    if (!token) {
      notify("Authentication required to save student data.", {
        type: "error",
      });
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    const idRegex = /^\d{4}-\d{4}$/;

    const requiredFields = [
      "last_name",
      "first_name",
      "id_number",
      "gender",
      "year_level",
      "college_id",
      "program_id",
    ];

    for (const field of requiredFields) {
      if (!(formData as any)[field]) {
        notify("All fields are required.", { type: "error" });
        return;
      }
    }

    if (
      !nameRegex.test(formData.first_name) ||
      !nameRegex.test(formData.last_name)
    ) {
      notify(
        "Names should only contain letters and spaces (no numbers or symbols).",
        { type: "error" }
      );
      return;
    }

    if (!idRegex.test(formData.id_number)) {
      notify("ID Number must be in the format XXXX-XXXX (e.g. 2025-0001).", {
        type: "error",
      });
      return;
    }

    let finalPhotoUrl = formData.photo_url;

    if (selectedFile) {
      setIsUploading(true);
      try {
        const oldPhotoUrl = formData.photo_url;
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${formData.id_number}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: existingFiles } = await supabase.storage
          .from("student-avatars")
          .list("", { search: formData.id_number });

        if (existingFiles && existingFiles.length > 0) {
          const filesToDelete = existingFiles
            .filter((f) => f.name.startsWith(`${formData.id_number}.`))
            .map((f) => f.name);

          if (filesToDelete.length > 0) {
            await supabase.storage
              .from("student-avatars")
              .remove(filesToDelete);
          }
        }

        const { error: uploadError } = await supabase.storage
          .from("student-avatars")
          .upload(filePath, selectedFile, {
            upsert: true,
          });

        if (uploadError) {
          if (uploadError.message.includes("maximum allowed size")) {
            notify("File size too large. Please select an image under 5MB.", {
              type: "error",
            });
            setIsUploading(false);
            return;
          }
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("student-avatars").getPublicUrl(filePath);

        finalPhotoUrl = `${publicUrl}?t=${new Date().getTime()}`;

        try {
          const oldPath = extractFilePath(oldPhotoUrl);
          if (oldPath) {
            await supabase.storage.from("student-avatars").remove([oldPath]);
          }
        } catch (e) {
          console.warn("Failed to delete old photo after replacement:", e);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        notify("Failed to upload image. Please try again.", { type: "error" });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    try {
      const url = editingStudent
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/students/${editingStudent.id_number}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/students`;

      const method = editingStudent ? "PUT" : "POST";

      const payload = {
        ...formData,
        photo_url: finalPhotoUrl,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        notify(data.error || "Failed to add student.", { type: "error" });
        return;
      }

      notify(data.message || "Student added successfully!", {
        type: "success",
      });

      if (!editingStudent) {
        setFormData({
          last_name: "",
          first_name: "",
          id_number: "",
          gender: "",
          year_level: "",
          college_id: "",
          program_id: "",
          photo_url: "",
        });
        setImagePreview(null);
        setSelectedFile(null);
        onStudentAdded && onStudentAdded();
      } else {
        onStudentUpdated && onStudentUpdated();
      }

      // Close dialog
      onOpenChange?.(false);
    } catch (err) {
      console.error("Error saving student:", err);
      notify("Something went wrong while saving the student.", {
        type: "error",
      });
    }
  };

  const getDialogTitle = () => {
    if (isViewMode) return "Student Details";
    if (editingStudent) return "Edit Student";
    return "Add Student";
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {triggerButton && (
        <DialogTrigger asChild>
          <Button variant="blue" size="lg">
            <UserRoundPlus className="w-5 h-5" />
            Add Student
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="glass2 sm:max-w-fit [&>button]:text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {isViewMode
              ? "Viewing student details. Click Edit to make changes."
              : editingStudent
              ? "Update the details below to edit the student."
              : "Fill in the details below to add a new student."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center -mt-2 mb-4">
          <label
            className={`relative group flex flex-col items-center justify-center w-28 h-28 rounded-full border-2 border-dashed 
            ${
              isViewMode
                ? "border-gray-600 cursor-default"
                : "border-gray-400 hover:border-white cursor-pointer hover:bg-white/10"
            } 
            bg-white/5 transition-all overflow-hidden`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-white">
                <Camera className="w-8 h-8" />
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  Photo
                </span>
              </div>
            )}

            {!isViewMode && imagePreview && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isViewMode}
            />
          </label>
        </div>

        {imagePreview && !isViewMode && (
          <div className="flex justify-center mb-4">
            <Button variant="destructive" size="sm" onClick={handleDeletePhoto}>
              Delete Photo
            </Button>
          </div>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            type="text"
            placeholder="ID Number"
            required
            disabled={isViewMode || !!editingStudent}
            className="border border-gray-400 rounded-lg px-4 py-2 bg-transparent text-white disabled:opacity-70 disabled:cursor-not-allowed"
          />
          <div className="flex gap-2">
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              type="text"
              placeholder="Last Name"
              required
              disabled={isViewMode}
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white disabled:opacity-70 disabled:cursor-not-allowed"
            />
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              required
              disabled={isViewMode}
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex gap-2">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              disabled={isViewMode}
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 min-w-[180px] bg-transparent text-gray-400 invalid:text-gray-400 valid:text-white disabled:opacity-70 disabled:cursor-not-allowed"
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
              disabled={isViewMode}
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 min-w-[180px] bg-transparent text-gray-400 invalid:text-gray-400 valid:text-white disabled:opacity-70 disabled:cursor-not-allowed"
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
              disabled={isViewMode}
              className="border border-gray-400 rounded-lg px-4 py-2 w-60 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white disabled:opacity-70 disabled:cursor-not-allowed"
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
              disabled={isViewMode}
              className="border border-gray-400 rounded-lg px-4 py-2 w-60 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white disabled:opacity-70 disabled:cursor-not-allowed"
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

          <div className="self-end">
            {isViewMode ? (
              <Button
                type="button"
                variant="blue"
                onClick={(e) => {
                  e.preventDefault();
                  setIsViewMode(false);
                }}
                className="flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            ) : (
              <Button variant="blue" type="submit" disabled={isUploading}>
                {isUploading
                  ? "Uploading..."
                  : editingStudent
                  ? "Update"
                  : "Save"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

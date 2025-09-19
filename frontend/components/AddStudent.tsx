"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AddStudentDialog({ onStudentAdded }: { onStudentAdded: () => void }) {
  const [colleges, setColleges] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([])
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    id_number: "",
    gender: "",
    year_level: "",
    college_id: "",
    program_id: "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const collegeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/colleges`)
        const programRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/programs`)
        const collegeData = await collegeRes.json()
        const programData = await programRes.json()

        console.log("Colleges:", collegeData)
        console.log("Programs:", programData)

        // ✅ log one sample program
        console.log("Sample program object:", (programData.programs || programData)[0])

        setColleges(collegeData.colleges || collegeData)
        setPrograms(programData.programs || programData)
      } catch (err) {
        console.error("Error fetching dropdowns:", err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.college_id) {
      const filtered = programs.filter((p) => String(p.college_id) === String(formData.college_id))
      console.log("Selected college_id:", formData.college_id)
      console.log("Filtered programs:", filtered)
      setFilteredPrograms(filtered)
      setFormData((prev) => ({ ...prev, program_id: "" }))
    } else {
      setFilteredPrograms([])
    }
  }, [formData.college_id, programs])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to add student")

      setFormData({
        last_name: "",
        first_name: "",
        id_number: "",
        gender: "",
        year_level: "",
        college_id: "",
        program_id: "",
      })

      onStudentAdded()
    } catch (err) {
      console.error("Error adding student:", err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue" size="lg">Add Student</Button>
      </DialogTrigger>

      <DialogContent className="glass2 sm:max-w-fit">
        <DialogHeader>
          <DialogTitle className="text-white">Add Student</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new student.
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
              <option value="" disabled hidden>Select Gender</option>
              <option className="bg-gray-900 text-white" value="Male">Male</option>
              <option className="bg-gray-900 text-white" value="Female">Female</option>
            </select>

            <select
              name="year_level"
              value={formData.year_level}
              onChange={handleChange}
              required
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 min-w-[180px] bg-transparent text-gray-400 invalid:text-gray-400 valid:text-white"
            >
              <option value="" disabled hidden>Select Year Level</option>
              <option className="bg-gray-900 text-white" value="1">1st Year</option>
              <option className="bg-gray-900 text-white" value="2">2nd Year</option>
              <option className="bg-gray-900 text-white" value="3">3rd Year</option>
              <option className="bg-gray-900 text-white" value="4">4th Year</option>
            </select>
          </div>

          <div className="flex gap-2">
            <select
              name="college_id"
              value={formData.college_id}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  college_id: e.target.value,
                  program_id: "",
                })
              }}
              required
              className="border border-gray-400 rounded-lg px-4 py-2 w-60 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white"
            >
              <option className="bg-gray-900 text-white" value="" disabled hidden>
                Select College
              </option>
              {colleges.map((c: any) => (
                <option key={c.id} value={c.id} className="bg-gray-900 text-white">
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
              <option value="" disabled hidden className="bg-gray-900 text-white">
                Select Program
              </option>
              {filteredPrograms.map((p: any) => (
                <option key={p.id} value={p.id} className="bg-gray-900 text-white">
                  {p.program_name}
                </option>
              ))}
            </select>
          </div>

          <Button variant="blue" type="submit" className="self-end">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
